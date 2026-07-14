# MendLens MCP Server Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build, verify, publish, and deploy a minimal MendLens Remote MCP server to obtain a PlayMCP in KC Endpoint URL.

**Architecture:** A small TypeScript domain module owns validated appliance evidence and safety classification. An Express adapter creates a fresh stateless Streamable HTTP MCP server per request, exposes three tools, and is packaged by a multi-stage Dockerfile.

**Tech Stack:** Node.js 22+, TypeScript, Express, `@modelcontextprotocol/sdk` 1.29.0, Zod, Vitest, Supertest, Docker

## Global Constraints

- Use MCP protocol `2025-11-25` with SDK negotiation compatibility for `2025-03-26`.
- Expose Streamable HTTP only and keep the server stateless.
- Register exactly three read-only, non-destructive, idempotent, closed-world tools.
- Never infer unsupported appliance facts or expose credentials and request bodies in logs.
- Listen on `process.env.PORT ?? 3000` and provide `GET /health`.
- Build and run on `linux/amd64` as a non-root container user.

---

### Task 1: Domain behavior

**Files:**
- Create: `src/diagnosis.ts`
- Test: `test/diagnosis.test.ts`

**Interfaces:**
- Produces: `prepareDiagnosis(input)`, `diagnoseErrorCode(input)`, `assessImmediateRisk(input)` and their input/result types.

- [ ] **Step 1: Write failing tests** for complete and incomplete intake, exact catalog lookup, unsupported model/code, and immediate-risk keywords.
- [ ] **Step 2: Run `npm test -- test/diagnosis.test.ts`** and confirm failure because `src/diagnosis.ts` does not exist.
- [ ] **Step 3: Implement the minimal catalog and functions** so exact matches return source URL, checked date, action, reason, and steps while misses return an explicit unsupported result.
- [ ] **Step 4: Run `npm test -- test/diagnosis.test.ts`** and confirm all domain tests pass.

### Task 2: MCP and HTTP adapter

**Files:**
- Create: `src/server.ts`
- Create: `src/index.ts`
- Test: `test/server.test.ts`

**Interfaces:**
- Consumes: the three domain functions from Task 1.
- Produces: `createApp()` and the `/health` plus `/mcp` routes.

- [ ] **Step 1: Write failing integration tests** for health, rejected Origin, initialize, tools/list, exact tool annotations, successful diagnosis, and unsupported diagnosis with `isError: true`.
- [ ] **Step 2: Run `npm test -- test/server.test.ts`** and confirm failure because `createApp()` is missing.
- [ ] **Step 3: Register the three tools** with Zod input schemas and complete annotations, then mount a fresh stateless `StreamableHTTPServerTransport` for each `/mcp` request.
- [ ] **Step 4: Add the process entrypoint** that binds `0.0.0.0` on `process.env.PORT ?? 3000` and handles graceful shutdown.
- [ ] **Step 5: Run `npm test -- test/server.test.ts`** and confirm all integration tests pass.

### Task 3: Build and container contract

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `tsconfig.json`
- Create: `Dockerfile`
- Create: `.dockerignore`
- Create: `.gitignore`

**Interfaces:**
- Produces: `npm run build`, `npm test`, `npm start`, and a non-root `linux/amd64` image.

- [ ] **Step 1: Pin runtime and development dependencies** and configure ESM TypeScript output to `dist/`.
- [ ] **Step 2: Run `npm test && npm run build`** and require zero failures and zero type errors.
- [ ] **Step 3: Build with `docker build --platform linux/amd64 -t mendlens-mcp:local .`** and inspect the image user.
- [ ] **Step 4: Run the container**, confirm `/health`, initialize, tools/list, and all tool calls from outside the container.

### Task 4: Documentation and performance

**Files:**
- Modify: `README.md`
- Modify: `docs/research/playmcp-agentic-player-10.md`
- Create: `scripts/benchmark.mjs`

**Interfaces:**
- Consumes: the running local HTTP Endpoint.
- Produces: reproducible local, Docker, MCP Inspector, benchmark, and PlayMCP in KC instructions.

- [ ] **Step 1: Add exact development and deployment commands** plus the current supported evidence cases to README.
- [ ] **Step 2: Run the benchmark** and record measured average and p99 without claiming unmeasured production performance.
- [ ] **Step 3: Run MCP Inspector CLI** for initialize, tools/list, the three tool calls, and one unsupported-code error.

### Task 5: Git publishing

**Files:** all intentional project files only.

- [ ] **Step 1: Review `git status --short` and `git diff --check`** and ensure no credentials or unrelated files exist.
- [ ] **Step 2: Commit logical documentation and implementation units** with Korean Conventional Commit summaries.
- [ ] **Step 3: Create a public GitHub repository named `MendLens`**, add it as `origin`, and push `ps/feat/mendlens-mcp-server`.
- [ ] **Step 4: Verify the public repository, branch, and root Dockerfile** through GitHub's remote state.

### Task 6: PlayMCP in KC deployment

**External state:** <https://playmcp.kakaocloud.io>

- [ ] **Step 1: Log in with the PlayMCP-linked Kakao account** and choose `+ 새 MCP 서버 등록` → `Git 소스 빌드`.
- [ ] **Step 2: Enter server name `MendLens`, the public Git URL, ref `ps/feat/mendlens-mcp-server`, Dockerfile path `Dockerfile`, and leave PAT empty.**
- [ ] **Step 3: Submit and monitor `Starting` until `Active`**, inspecting build logs if it fails.
- [ ] **Step 4: Copy the issued Endpoint URL without exposing credentials** and verify health, initialize, tools/list, and representative tool calls against it.

### Task 7: PlayMCP registration

**External state:** PlayMCP developer console

- [ ] **Step 1: Register the Active Endpoint temporarily** with identifier `mendLens`, accurate description, three representative prompts, and no user authentication.
- [ ] **Step 2: Use `정보 불러오기` and verify all three tools and annotations.**
- [ ] **Step 3: Add the MCP to the toolbox and run representative success and unsupported scenarios in PlayMCP AI chat.**
- [ ] **Step 4: Request review only after all checks pass**, then record any approval/publication work still requiring external processing.
