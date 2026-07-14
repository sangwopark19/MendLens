import assert from "node:assert/strict";
import { performance } from "node:perf_hooks";

const target = new URL(process.argv[2] ?? "http://127.0.0.1:3000");
const mcpUrl = new URL(target.pathname.endsWith("/mcp") ? target.href : "/mcp", target);
const iterations = Number.parseInt(process.argv[3] ?? "100", 10);
assert.ok(Number.isInteger(iterations) && iterations > 0 && iterations <= 10_000);

const requestBody = JSON.stringify({
  jsonrpc: "2.0",
  id: 1,
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

async function measure() {
  const startedAt = performance.now();
  const response = await fetch(mcpUrl, {
    method: "POST",
    headers: {
      Accept: "application/json, text/event-stream",
      "Content-Type": "application/json",
      "MCP-Protocol-Version": "2025-11-25",
    },
    body: requestBody,
  });
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.notEqual(payload.result?.isError, true);
  return performance.now() - startedAt;
}

for (let index = 0; index < 10; index += 1) await measure();

const samples = [];
for (let index = 0; index < iterations; index += 1) samples.push(await measure());
samples.sort((left, right) => left - right);

const averageMs = samples.reduce((sum, value) => sum + value, 0) / samples.length;
const p99Index = Math.max(0, Math.ceil(samples.length * 0.99) - 1);

console.log(
  JSON.stringify(
    {
      endpoint: mcpUrl.origin,
      iterations,
      averageMs: Number(averageMs.toFixed(2)),
      p99Ms: Number(samples[p99Index].toFixed(2)),
    },
    null,
    2,
  ),
);
