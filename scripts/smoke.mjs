import assert from "node:assert/strict";

const target = new URL(process.argv[2] ?? "http://127.0.0.1:3000");
const mcpUrl = new URL(target.pathname.endsWith("/mcp") ? target.href : "/mcp", target);
const healthUrl = new URL("/health", target);

async function callMcp(id, method, params = {}) {
  const response = await fetch(mcpUrl, {
    method: "POST",
    headers: {
      Accept: "application/json, text/event-stream",
      "Content-Type": "application/json",
      "MCP-Protocol-Version": "2025-11-25",
    },
    body: JSON.stringify({ jsonrpc: "2.0", id, method, params }),
  });
  assert.equal(response.status, 200, `${method} returned HTTP ${response.status}`);
  const payload = await response.json();
  assert.equal(payload.error, undefined, `${method} returned ${JSON.stringify(payload.error)}`);
  return payload.result;
}

const healthResponse = await fetch(healthUrl);
assert.equal(healthResponse.status, 200);
assert.deepEqual(await healthResponse.json(), {
  status: "ok",
  service: "mendlens-mcp",
  version: "0.1.0",
});

const initialized = await callMcp(1, "initialize", {
  protocolVersion: "2025-11-25",
  capabilities: {},
  clientInfo: { name: "mendlens-smoke", version: "1.0.0" },
});
assert.equal(initialized.protocolVersion, "2025-11-25");

const listed = await callMcp(2, "tools/list");
assert.deepEqual(
  listed.tools.map((tool) => tool.name),
  ["prepare_diagnosis", "diagnose_error_code", "assess_immediate_risk"],
);

const prepared = await callMcp(3, "tools/call", {
  name: "prepare_diagnosis",
  arguments: { manufacturer: "LG", applianceType: "washing_machine" },
});
assert.match(prepared.content[0].text, /model/);

const diagnosed = await callMcp(4, "tools/call", {
  name: "diagnose_error_code",
  arguments: {
    manufacturer: "LG",
    applianceType: "washing_machine",
    model: "T1204T",
    errorCode: "UE",
  },
});
assert.notEqual(diagnosed.isError, true);
assert.match(diagnosed.content[0].text, /직접 해결 가능/);
assert.ok(Buffer.byteLength(diagnosed.content[0].text, "utf8") < 10_000);

const assessed = await callMcp(5, "tools/call", {
  name: "assess_immediate_risk",
  arguments: {
    manufacturer: "LG",
    applianceType: "air_conditioner",
    model: "FQ17S9DWAN",
    signals: ["persistent_burning_smell"],
  },
});
assert.match(assessed.content[0].text, /즉시 사용 중단/);

const unsupported = await callMcp(6, "tools/call", {
  name: "diagnose_error_code",
  arguments: {
    manufacturer: "LG",
    applianceType: "washing_machine",
    model: "UNKNOWN",
    errorCode: "UE",
  },
});
assert.equal(unsupported.isError, true);

console.log(`Smoke test passed for ${mcpUrl.origin}`);
