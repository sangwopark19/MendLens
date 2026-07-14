# MendLens MCP 서버 설계

## 목표

MendLens의 핵심 흐름을 실제로 호출할 수 있는 Remote MCP 서버를 만들고, public Git 저장소의 Dockerfile을 PlayMCP in KC에서 빌드해 Endpoint URL을 발급받는다.

## 범위

이번 배포는 Endpoint 확보와 PlayMCP 검증에 필요한 최소 제품 범위다. 외부 API 키, 이미지 인식, 제조사 전체 모델, 리콜 실시간 조회는 포함하지 않는다. 서버가 지원하지 않는 제조사·모델·오류 코드를 추측하지 않는 것이 기능 수보다 우선한다.

## 구조

- Node.js 22 이상과 TypeScript를 사용한다.
- Express 애플리케이션이 `GET /health`와 `POST|GET|DELETE /mcp`를 제공한다.
- 공식 MCP TypeScript SDK의 stateless Streamable HTTP transport를 사용한다.
- 컨테이너는 `PORT` 환경 변수를 사용하고 없으면 `3000`에서 수신한다.
- Dockerfile은 multi-stage build와 non-root runtime user를 사용한다.

## 도구

### `prepare_diagnosis`

제조사, 제품군, 모델명, 오류 코드, 증상 중 진단에 필요한 정보가 갖춰졌는지 확인한다. 누락된 정보가 있으면 `needs_information`과 필요한 다음 입력을 반환한다.

### `diagnose_error_code`

정확한 제조사·모델·제품군·오류 코드가 내장 공식 근거와 일치할 때만 원인, 최종 행동, 안전한 조치, 확인 시점, 출처를 반환한다. 일치하지 않으면 `isError: true`로 지원하지 않는 사례임을 알리고 모델 라벨과 공식 설명서 확인을 요청한다.

### `assess_immediate_risk`

연기, 불꽃, 스파크, 탄화 흔적, 지속되는 고무 타는 냄새 같은 안전 신호를 입력받아 `즉시 사용 중단`, `공식 AS 필요`, `직접 해결 가능` 중 하나로 분류한다. 위험 신호가 없다고 해서 제품이 안전하다고 단정하지 않는다.

모든 도구는 read-only, non-destructive, idempotent이며 로컬 근거만 사용하므로 `openWorldHint`는 `false`다.

## 요청 흐름

1. PlayMCP가 `/mcp`로 초기화 요청을 보낸다.
2. SDK가 지원 프로토콜을 협상하고 도구 목록을 반환한다.
3. 도구 호출 입력은 Zod와 도메인 함수 양쪽에서 검증한다.
4. 도메인 함수가 제한된 공식 근거 카탈로그 또는 안전 규칙을 조회한다.
5. 서버는 모델이 바로 사용할 수 있는 짧은 Markdown과 구조화된 사실만 반환한다.

## 오류 처리

- 지원하지 않는 모델·오류 코드는 성공 진단으로 포장하지 않는다.
- 입력 누락은 어떤 값을 추가해야 하는지 명시한다.
- 지원하지 않는 Origin은 `403`으로 거부한다.
- 잘못된 MCP 요청은 SDK의 JSON-RPC 오류로 처리한다.
- 로그에는 요청 본문, 인증 헤더, 사용자 사진을 기록하지 않는다.

## 검증

- 도메인 단위 테스트: 준비 정보, 정확 일치, 불일치, 위험 신호 분류.
- HTTP 테스트: health, Origin 허용·거부, 잘못된 메서드.
- MCP 통합 테스트: initialize, `tools/list`, 도구 3개의 성공·오류 호출.
- Docker: `linux/amd64` 이미지 빌드, non-root 실행, health와 MCP 호출.
- 성능: 로컬 대표 호출 반복으로 평균 100ms 이내와 p99 3,000ms 이내를 측정한다.
- 배포: KC `Active`, 발급 Endpoint health, MCP initialize와 도구 호출을 다시 확인한다.

## 배포

저장소는 public GitHub 저장소로 생성하고 PAT 없이 PlayMCP in KC에 등록한다. 브랜치는 `ps/feat/mendlens-mcp-server`, Dockerfile 경로는 `Dockerfile`을 사용한다. Endpoint가 발급되면 PlayMCP에서 임시 등록하여 실제 AI 채팅을 검증한 뒤 심사를 요청한다.
