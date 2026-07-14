import { createApp } from "./server.js";

const port = Number.parseInt(process.env.PORT ?? "3000", 10);
if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error("PORT must be an integer between 1 and 65535");
}

const httpServer = createApp().listen(port, "0.0.0.0", () => {
  console.log(`MendLens MCP server listening on port ${port}`);
});

httpServer.on("error", (error) => {
  console.error("MendLens MCP server failed:", error.message);
  process.exitCode = 1;
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    httpServer.close(() => process.exit(0));
  });
}
