import request from "supertest";
import { describe, expect, it } from "vitest";

import { createApp } from "../src/server.js";

const MCP_HEADERS = {
  Accept: "application/json, text/event-stream",
  "Content-Type": "application/json",
  "MCP-Protocol-Version": "2025-11-25",
};

function postMcp(body: Record<string, unknown>) {
  return request(createApp()).post("/mcp").set(MCP_HEADERS).send(body);
}

describe("HTTP surface", () => {
  it("reports health without exposing request data", async () => {
    const response = await request(createApp()).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "ok",
      service: "mendlens-mcp",
      version: "0.1.0",
    });
  });

  it("rejects an untrusted Origin", async () => {
    const response = await request(createApp())
      .post("/mcp")
      .set(MCP_HEADERS)
      .set("Origin", "https://attacker.example")
      .send({
        jsonrpc: "2.0",
        id: 1,
        method: "ping",
      });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ error: "Origin is not allowed" });
  });

  it("rejects an unsupported negotiated protocol version", async () => {
    const response = await request(createApp())
      .post("/mcp")
      .set(MCP_HEADERS)
      .set("MCP-Protocol-Version", "1999-01-01")
      .send({ jsonrpc: "2.0", id: 1, method: "tools/list", params: {} });

    expect(response.status).toBe(400);
    expect(response.body.error.message).toContain("Unsupported protocol version");
  });

  it("handles GET on the MCP path with a protocol error", async () => {
    const response = await request(createApp()).get("/mcp");

    expect(response.status).toBe(405);
    expect(response.body).toMatchObject({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Method not allowed." },
      id: null,
    });
  });
});

describe("MCP contract", () => {
  it("negotiates MCP protocol 2025-11-25", async () => {
    const response = await postMcp({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-11-25",
        capabilities: {},
        clientInfo: { name: "mendlens-test", version: "1.0.0" },
      },
    });

    expect(response.status).toBe(200);
    expect(response.body.result).toMatchObject({
      protocolVersion: "2025-11-25",
      serverInfo: { name: "mendlens-mcp", version: "0.1.0" },
      capabilities: { tools: {} },
    });
  });

  it("retains negotiation compatibility with MCP protocol 2025-03-26", async () => {
    const response = await request(createApp())
      .post("/mcp")
      .set({
        Accept: "application/json, text/event-stream",
        "Content-Type": "application/json",
        "MCP-Protocol-Version": "2025-03-26",
      })
      .send({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2025-03-26",
          capabilities: {},
          clientInfo: { name: "mendlens-legacy-test", version: "1.0.0" },
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.result.protocolVersion).toBe("2025-03-26");
  });

  it("lists exactly three fully annotated tools", async () => {
    const response = await postMcp({
      jsonrpc: "2.0",
      id: 2,
      method: "tools/list",
      params: {},
    });

    expect(response.status).toBe(200);
    const tools = response.body.result.tools;
    expect(tools.map((tool: { name: string }) => tool.name)).toEqual([
      "prepare_diagnosis",
      "diagnose_error_code",
      "assess_immediate_risk",
    ]);
    for (const tool of tools) {
      expect(tool.name.toLocaleLowerCase()).not.toContain("kakao");
      expect(tool.description).toContain("MendLens(찍고쳐)");
      expect(tool.inputSchema).toMatchObject({ type: "object" });
      expect(tool.annotations).toEqual({
        title: expect.any(String),
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      });
    }
  });

  it("calls prepare_diagnosis and identifies missing fields", async () => {
    const response = await postMcp({
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: {
        name: "prepare_diagnosis",
        arguments: {
          manufacturer: "LG",
          applianceType: "washing_machine",
        },
      },
    });

    expect(response.status).toBe(200);
    expect(response.body.result.isError).not.toBe(true);
    expect(response.body.result.content[0].text).toContain("model");
    expect(response.body.result.content[0].text).toContain("errorCode");
  });

  it("calls diagnose_error_code with official evidence", async () => {
    const response = await postMcp({
      jsonrpc: "2.0",
      id: 4,
      method: "tools/call",
      params: {
        name: "diagnose_error_code",
        arguments: {
          manufacturer: "LG",
          applianceType: "washing_machine",
          model: "T1204T",
          errorCode: "UE",
        },
      },
    });

    expect(response.status).toBe(200);
    expect(response.body.result.isError).not.toBe(true);
    const text = response.body.result.content[0].text;
    expect(text).toContain("직접 해결 가능");
    expect(text).toContain("2026-07-14");
    expect(text).toContain("https://www.lge.co.kr/");
  });

  it("returns isError for an unsupported diagnosis", async () => {
    const response = await postMcp({
      jsonrpc: "2.0",
      id: 5,
      method: "tools/call",
      params: {
        name: "diagnose_error_code",
        arguments: {
          manufacturer: "LG",
          applianceType: "washing_machine",
          model: "UNKNOWN",
          errorCode: "UE",
        },
      },
    });

    expect(response.status).toBe(200);
    expect(response.body.result.isError).toBe(true);
    expect(response.body.result.content[0].text).toContain(
      "공식 근거가 확인된 지원 사례가 아닙니다",
    );
  });

  it("returns isError for invalid tool input", async () => {
    const response = await postMcp({
      jsonrpc: "2.0",
      id: 7,
      method: "tools/call",
      params: {
        name: "diagnose_error_code",
        arguments: {
          manufacturer: "LG",
          applianceType: "television",
          model: "MODEL",
          errorCode: "E1",
        },
      },
    });

    expect(response.status).toBe(200);
    expect(response.body.result.isError).toBe(true);
    expect(response.body.result.content[0].text).toContain("Invalid arguments");
  });

  it("calls assess_immediate_risk for a dangerous signal", async () => {
    const response = await postMcp({
      jsonrpc: "2.0",
      id: 6,
      method: "tools/call",
      params: {
        name: "assess_immediate_risk",
        arguments: {
          manufacturer: "LG",
          applianceType: "air_conditioner",
          model: "FQ17S9DWAN",
          signals: ["persistent_burning_smell"],
        },
      },
    });

    expect(response.status).toBe(200);
    expect(response.body.result.isError).not.toBe(true);
    expect(response.body.result.content[0].text).toContain("즉시 사용 중단");
  });
});
