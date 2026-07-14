import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express, { type NextFunction, type Request, type Response } from "express";
import { z } from "zod/v4";

import {
  assessImmediateRisk,
  diagnoseErrorCode,
  prepareDiagnosis,
  type ApplianceType,
  type SafetySignal,
} from "./diagnosis.js";

const applianceTypeSchema = z.enum([
  "washing_machine",
  "air_conditioner",
  "refrigerator",
  "dishwasher",
  "robot_vacuum",
]);

const safetySignalSchema = z.enum([
  "smoke",
  "flame",
  "sparks",
  "charred_power_connection",
  "persistent_burning_smell",
  "water_on_electrical_parts",
  "none_observed",
]);

const TOOL_ANNOTATIONS = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
} as const;

const DEFAULT_ALLOWED_ORIGINS = new Set([
  "http://127.0.0.1:3000",
  "http://localhost:3000",
  "https://playmcp.kakao.com",
  "https://playmcp.kakaocloud.io",
]);

function allowedOrigins(): Set<string> {
  const configured = process.env.ALLOWED_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  return configured?.length ? new Set(configured) : DEFAULT_ALLOWED_ORIGINS;
}

function originGuard(req: Request, res: Response, next: NextFunction): void {
  const origin = req.header("Origin");
  if (origin && !allowedOrigins().has(origin)) {
    res.status(403).json({ error: "Origin is not allowed" });
    return;
  }
  next();
}

function createMcpServer(): McpServer {
  const server = new McpServer(
    { name: "mendlens-mcp", version: "0.1.0" },
    { capabilities: { tools: {} } },
  );

  server.registerTool(
    "prepare_diagnosis",
    {
      title: "Prepare appliance diagnosis",
      description:
        "MendLens(찍고쳐) checks whether the exact manufacturer, appliance type, model, and error code required for evidence-based diagnosis are present.",
      inputSchema: {
        manufacturer: z.string().max(100).optional(),
        applianceType: applianceTypeSchema.optional(),
        model: z.string().max(100).optional(),
        errorCode: z.string().max(50).optional(),
        symptoms: z.array(z.string().min(1).max(300)).max(10).optional(),
      },
      annotations: {
        title: "Prepare appliance diagnosis",
        ...TOOL_ANNOTATIONS,
      },
    },
    async (input) => {
      const result = prepareDiagnosis(input);
      const text =
        result.status === "ready"
          ? "# 진단 준비 상태\n\n- 상태: ready\n- 필요한 제품 정보가 모두 입력되었습니다."
          : [
              "# 추가 정보 필요",
              "",
              "- 상태: needs_information",
              `- 필요한 필드: ${result.missingFields.join(", ")}`,
              "- 제품 라벨과 표시창을 확인해 정확한 값을 입력해 주세요.",
            ].join("\n");
      return { content: [{ type: "text", text }] };
    },
  );

  server.registerTool(
    "diagnose_error_code",
    {
      title: "Diagnose an appliance error code",
      description:
        "MendLens(찍고쳐) returns a diagnosis only when the manufacturer, appliance type, model, and error code exactly match a checked official source.",
      inputSchema: {
        manufacturer: z.string().trim().min(1).max(100),
        applianceType: applianceTypeSchema,
        model: z.string().trim().min(1).max(100),
        errorCode: z.string().trim().min(1).max(50),
      },
      annotations: {
        title: "Diagnose an appliance error code",
        ...TOOL_ANNOTATIONS,
      },
    },
    async (input) => {
      const result = diagnoseErrorCode({
        manufacturer: input.manufacturer,
        applianceType: input.applianceType as ApplianceType,
        model: input.model,
        errorCode: input.errorCode,
      });

      if (!result.ok) {
        return {
          content: [{ type: "text", text: result.message }],
          isError: true,
        };
      }

      const steps = result.steps
        .map((step, index) => `${index + 1}. ${step}`)
        .join("\n");
      const safetyNotes = result.safetyNotes.map((note) => `- ${note}`).join("\n");
      const text = [
        "# MendLens 진단",
        "",
        `- 제품: ${result.appliance.manufacturer} ${result.appliance.model}`,
        `- 오류 코드: ${result.appliance.errorCode}`,
        `- 최종 행동: **${result.action}**`,
        `- 원인: ${result.reason}`,
        "",
        "## 조치 순서",
        "",
        steps,
        "",
        "## 안전 주의",
        "",
        safetyNotes,
        "",
        `- 확인 시점: ${result.source.checkedAt}`,
        `- 공식 근거: [${result.source.title}](${result.source.url})`,
      ].join("\n");
      return { content: [{ type: "text", text }] };
    },
  );

  server.registerTool(
    "assess_immediate_risk",
    {
      title: "Assess immediate appliance risk",
      description:
        "MendLens(찍고쳐) classifies explicit appliance safety signals before any self-repair guidance. It never treats missing danger signals as proof of safety.",
      inputSchema: {
        manufacturer: z.string().trim().min(1).max(100),
        applianceType: applianceTypeSchema,
        model: z.string().trim().min(1).max(100),
        signals: z.array(safetySignalSchema).min(1).max(7),
      },
      annotations: {
        title: "Assess immediate appliance risk",
        ...TOOL_ANNOTATIONS,
      },
    },
    async (input) => {
      const result = assessImmediateRisk({
        manufacturer: input.manufacturer,
        applianceType: input.applianceType as ApplianceType,
        model: input.model,
        signals: input.signals as SafetySignal[],
      });
      const source = result.source
        ? `\n- 확인 시점: ${result.source.checkedAt}\n- 공식 근거: [${result.source.title}](${result.source.url})`
        : "";
      const text = [
        "# 안전 위험 분류",
        "",
        `- 최종 행동: **${result.action}**`,
        `- 감지된 위험 신호: ${result.matchedSignals.join(", ") || "없음"}`,
        `- 안내: ${result.message}${source}`,
      ].join("\n");
      return { content: [{ type: "text", text }] };
    },
  );

  return server;
}

function methodNotAllowed(res: Response): void {
  res.status(405).json({
    jsonrpc: "2.0",
    error: { code: -32000, message: "Method not allowed." },
    id: null,
  });
}

export function createApp(): express.Express {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "100kb" }));
  app.use(originGuard);

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "mendlens-mcp", version: "0.1.0" });
  });

  app.post("/mcp", async (req, res) => {
    const server = createMcpServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      console.error(
        "MCP request failed:",
        error instanceof Error ? error.message : "unknown error",
      );
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: "2.0",
          error: { code: -32603, message: "Internal server error" },
          id: null,
        });
      }
    } finally {
      await transport.close();
      await server.close();
    }
  });

  app.get("/mcp", (_req, res) => methodNotAllowed(res));
  app.delete("/mcp", (_req, res) => methodNotAllowed(res));

  return app;
}
