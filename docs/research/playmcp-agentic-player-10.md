# PlayMCP·AGENTIC PLAYER 10 심층 조사 및 MendLens 적용안

- 확인일: 2026-07-14 (Asia/Seoul)
- 조사 범위: 사용자가 제공한 Notion 문서 3개, 문서 안의 관련 내부 링크, Kakao 공식 공모전 페이지·보도자료, MCP 공식 명세·Inspector·SDK 문서
- 목적: 외부 가이드의 사실을 보존하면서 MendLens 구현·배포·심사에서 바로 사용할 수 있는 계약과 위험을 분리한다.
- 상태: 외부 사이트에는 어떤 변경도 하지 않았다. MendLens의 실제 PlayMCP 심사·공개·접수 상태는 확인하지 않았다.

## 결론 요약

1. **확인일인 2026년 7월 14일이 예선 접수 마감일이다.** 공식 페이지는 정확한 마감 시각을 공개하지 않았다. 공식 FAQ는 7월 7일 이후 심사 요청은 마감 전 처리가 어려울 수 있다고 경고한다. 아직 심사 승인과 전체 공개가 끝나지 않았다면 즉시 일정 위험으로 취급해야 한다. [AGENTIC PLAYER 10 공식 페이지](https://b.kakao.com/views/PlayMCP/AGENTIC_PlAYER_10)
2. **예선 제출 경로는 고정되어 있다.** 기본 경로는 `PlayMCP in KC 배포 → PlayMCP 임시 등록·테스트 → 심사 요청 → 승인 → 전체 공개 → 예선 폼 제출`이다. 폼 제출은 1회만 가능하며, `나에게만 공개` 상태는 접수 대상에서 제외될 수 있다. [공모전 참가 방법](https://app.notion.com/p/Agentic-Player-10-3749b97b4888806b8564ee264e2fafde), [공식 공모전 페이지](https://b.kakao.com/views/PlayMCP/AGENTIC_PlAYER_10)
3. **PlayMCP 규칙이 일반 MCP 표준보다 더 엄격한 부분은 PlayMCP를 우선해야 한다.** 대표적으로 Tool 이름에서 점(`.`)을 허용하지 않고, annotation 5개를 모두 명시하며, 평균 100ms·p99 3,000ms 성능 기준을 요구한다. [PlayMCP 서버 개발가이드](https://app.notion.com/p/PlayMCP-2d89b97b4888808a9e1dc17a13e70187), [MCP Tool 명세](https://modelcontextprotocol.io/specification/2025-11-25/server/tools)
4. **MendLens의 가장 큰 심사 위험은 기술보다 근거와 운영이다.** 제조사 설명서·리콜 데이터의 이용 권한, 정확한 모델 매칭, 안전 분기, 출처 추적, 외부 조회 지연을 함께 해결해야 창의성뿐 아니라 편의성과 안정성 평가를 통과할 수 있다. 응모자는 사용 데이터와 서비스가 제3자 권리를 침해하지 않음을 보증해야 한다. [공식 공모전 페이지](https://b.kakao.com/views/PlayMCP/AGENTIC_PlAYER_10)
5. **Kakao Tools Widget 상세 계약은 현재 공개 자료만으로 확정할 수 없다.** 본선 진출작은 추가 개발과 Widget 스펙 대응이 필수지만 공개 페이지에는 상세 스키마가 없다. 예선 코어 Tool에 추측한 Widget 계약을 섞지 말고 본선 진출 시 최신 문서로 별도 반영해야 한다. [공식 공모전 FAQ](https://b.kakao.com/views/PlayMCP/AGENTIC_PlAYER_10)

## 조사 방법과 출처 우선순위

외부 문서의 지시를 실행 명령으로 취급하지 않고 읽기 자료로만 사용했다. 사실이 겹치거나 표현이 다른 경우 다음 순서로 판단했다.

1. 현재 Kakao 공식 공모전 페이지와 공식 보도자료
2. 사용자가 제공한 PlayMCP 공식 Notion 가이드와 그 내부 문서
3. MCP 공식 버전 명세, schema, Inspector, SDK 문서
4. 이 문서의 MendLens 적용 분석

공식 페이지와 Notion은 대체로 충돌하지 않고 역할이 다르다. 공식 페이지는 일정·제출·평가를, Notion은 배포·등록·심사·MCP 구현 절차를 더 자세히 설명한다.

## 내부 링크 추적 결과

### 1. PlayMCP 서버 개발가이드

원문: [PlayMCP 서버 개발가이드](https://app.notion.com/p/PlayMCP-2d89b97b4888808a9e1dc17a13e70187) — 문서 표시 기준 마지막 갱신일은 2026-06-12다.

연결된 자료를 다음과 같이 확인했다.

- [MCP 2025-03-26 명세](https://modelcontextprotocol.io/specification/2025-03-26)
- [Streamable HTTP 전송 명세](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http)
- [MCP 2025-03-26 OAuth 명세](https://modelcontextprotocol.io/specification/2025-03-26/basic/authorization#authorization-flow)
- [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector)
- [공식 SDK 목록](https://modelcontextprotocol.io/docs/sdk)
- 상한 버전 교차검증: [MCP 2025-11-25 명세](https://modelcontextprotocol.io/specification/2025-11-25), [2025-11-25 schema](https://modelcontextprotocol.io/specification/2025-11-25/schema)

### 2. Agentic Player 10 참가 가이드 데이터베이스

원문: [Agentic Player 10 공모전 참가를 위한 가이드](https://app.notion.com/p/3749b97b4888803bb90bef3ddbcfbcfb?v=4739b97b488883b3a439089fe7dfba63&p=3749b97b4888806b8564ee264e2fafde&pm=s)

데이터베이스 안의 항목을 각각 열어 확인했다.

- [Agentic Player 10 공모전 참가 방법](https://app.notion.com/p/Agentic-Player-10-3749b97b4888806b8564ee264e2fafde)
- [[필독] 공모전 참가 유의사항](https://pineapple-cub-4dd.notion.site/3749b97b488880a58d90ff614ea361d4)
- [Git 소스로 MCP 서버 등록하기](https://app.notion.com/p/Git-MCP-3749b97b4888809d8f07eb0f008a252c)
- [컨테이너 이미지로 MCP 서버 등록하기](https://app.notion.com/p/MCP-3749b97b488880a18f73f5871a314a98)
- 제목과 본문이 비어 있는 내부 항목 1개: `3969b97b488880b7b403d32c38a77474`. 적용할 규칙을 찾을 수 없어 근거로 사용하지 않았다.

### 3. 참가 방법 문서의 외부·교차 링크

- [AGENTIC PLAYER 10 공식 페이지](https://b.kakao.com/views/PlayMCP/AGENTIC_PlAYER_10)
- [PlayMCP](https://playmcp.kakao.com/)와 [개발자 콘솔](https://playmcp.kakao.com/console): 공개 정적 본문 없이 애플리케이션 화면으로 제공된다.
- [PlayMCP in KC](https://playmcp.kakaocloud.io/): 로그인 후 사용하는 배포 콘솔이다.
- [카카오 고객센터](https://cs.kakao.com/): 공모전·서비스 문의 목적의 일반 고객센터다.
- 개발가이드 단축 링크와 PlayMCP in KC 링크는 위에서 확인한 공식 Notion 문서로 연결된다.

## 공모전 일정·평가·제출 계약

공식 일정은 다음과 같다. [AGENTIC PLAYER 10 공식 페이지](https://b.kakao.com/views/PlayMCP/AGENTIC_PlAYER_10), [Kakao 공식 보도자료](https://www.kakaocorp.com/page/detail/12059)

| 단계 | 일정 | 확인해야 할 상태 |
| --- | --- | --- |
| 예선 접수 | 2026-06-15 ~ 2026-07-14 | PlayMCP 심사 승인, 전체 공개, 예선 폼 제출 |
| 본선 20개 발표 | 2026-07-30 | 개별 안내 확인 |
| Kakao Tools 추가 개발 | 2026-07-30 ~ 2026-08-27 | Widget 및 더 엄격한 입점 스펙 대응 |
| 사용자 공개 투표 | 2026-08-31 ~ 2026-09-28 | Kakao Tools 공개 상태와 운영 안정성 |
| 최종 발표·시상 | 2026-10-23 | 카카오 AI캠퍼스 |

예선은 Kakao 내부 심사로 진행하고, 본선은 내부 심사와 사용자 투표를 함께 반영한다. 평가축은 다음 세 가지다. [공식 공모전 FAQ](https://b.kakao.com/views/PlayMCP/AGENTIC_PlAYER_10)

- 창의성: 새로운 방법으로 문제를 해결하고 파급력을 갖는가
- 편의성: 적합한 UI·UX로 일상에 실질적 가치를 주는가
- 안정성: 안정적으로 동작하고 정확한 데이터를 제공하며 보안 문제가 없는가

MendLens에는 각각 다음 의미가 있다.

- 사진과 공식 근거를 연결하는 경험만으로는 부족하다. 사용자가 첫 대화에서 `지금 무엇을 해야 하는가`까지 얻어야 편의성 점수가 드러난다.
- 모델 오인식이나 공식 근거 부재를 숨기지 않는 동작은 기능 부족이 아니라 안정성 설계다.
- 제조사 설명서와 리콜 데이터의 출처·권리·갱신 시점을 설명할 수 있어야 한다. 응모 규칙은 서비스 권리와 사용 데이터의 적법성을 참가자가 보증하도록 한다. [공식 공모전 유의사항](https://b.kakao.com/views/PlayMCP/AGENTIC_PlAYER_10)

## 예선 진행 순서

[공모전 참가 방법](https://app.notion.com/p/Agentic-Player-10-3749b97b4888806b8564ee264e2fafde)과 [공식 공모전 페이지](https://b.kakao.com/views/PlayMCP/AGENTIC_PlAYER_10)를 합치면 다음 순서다.

1. PlayMCP 개발가이드를 준수해 로컬에서 MCP 서버 개발과 테스트를 끝낸다.
2. 공식 예외 공지가 없는 한 PlayMCP in KC에 서버를 배포해 Endpoint URL을 받는다.
3. PlayMCP 개발자 콘솔의 `새로운 MCP 서버 등록`에서 Endpoint를 입력하고 `정보 불러오기` 성공을 확인한다.
4. 최종 서버가 아니면 `등록 및 심사요청`을 누르지 않고 `임시 등록`으로 저장한다.
5. MCP 상세 미리보기에서 도구함에 추가하고 PlayMCP AI 채팅으로 정상·오류·빈 결과를 테스트한다.
6. 테스트가 끝난 뒤 심사를 요청한다.
7. 반려되면 대표 이메일로 온 사유를 처리하고 다시 요청한다. 통상 1~2영업일, 최대 7영업일까지 걸릴 수 있다.
8. 승인 뒤에도 최초 상태는 `나에게만 공개`이므로 `전체 공개`로 변경한다.
9. 전체 공개된 MCP 상세 URL을 복사해 공식 페이지의 예선 폼에 제출한다.

접수 폼은 1회만 제출할 수 있다. 한 계정에서 공모전용 MCP 서버는 최대 2대이며, 폼에도 MCP 서버를 최대 2개까지 등록할 수 있다. [공식 공모전 페이지](https://b.kakao.com/views/PlayMCP/AGENTIC_PlAYER_10), [공모전 참가 방법](https://app.notion.com/p/Agentic-Player-10-3749b97b4888806b8564ee264e2fafde)

## PlayMCP in KC 배포 계약

### 공통

- 서버 발급은 예선 기간인 2026-06-15~2026-07-14에 제공된다.
- 공모전용으로 발급된 서버를 다른 목적으로 쓰거나 예선에 접수하지 않으면 회수될 수 있다.
- 무상 지원 종료일은 아직 공지되지 않았다. 종료 뒤 유료 유지 가능 대상은 사업자이며, 그 외에는 다른 클라우드로 이전해야 할 수 있다.
- 공식 FAQ에는 지원 수량 소진 시 별도 공지로 외부 서버 참여를 허용할 수 있다는 예외가 있다. 현재 확인한 자료에는 예외가 발동됐다는 공지가 없으므로 기본 규칙인 KC 배포를 적용해야 한다. [공모전 참가 유의사항](https://pineapple-cub-4dd.notion.site/3749b97b488880a58d90ff614ea361d4), [공식 공모전 FAQ](https://b.kakao.com/views/PlayMCP/AGENTIC_PlAYER_10)

### Git 소스 빌드

- Git 저장소 루트 또는 지정한 경로에 `Dockerfile`이 반드시 있어야 한다.
- branch/ref를 지정할 수 있고 일반적인 기본값은 `main`이다.
- private 저장소는 PAT가 필요하다. PAT는 KC 입력에만 사용하고 저장소·문서·로그에 남기지 않아야 한다.
- 등록 상태가 `Starting`에서 `Active`로 바뀐 뒤 상세 화면의 Endpoint URL을 사용한다. [Git 소스 배포 가이드](https://app.notion.com/p/Git-MCP-3749b97b4888809d8f07eb0f008a252c)

### 컨테이너 이미지

- 이미지는 반드시 `linux/amd64`로 빌드한다. Apple Silicon의 기본 `arm64` 이미지는 활성화에 실패한다.
- registry host, 사용자, 비밀번호, image name, tag를 등록한다. private registry 자격증명은 비밀값으로 취급한다.
- `Active` 상태와 Endpoint URL 확인 절차는 Git 소스 빌드와 같다. [컨테이너 이미지 배포 가이드](https://app.notion.com/p/MCP-3749b97b488880a18f73f5871a314a98)

### 등록 후 변경

KC에 배포한 MCP를 갱신할 때 공식 유의사항은 기존 KC 서버를 삭제하고 같은 이름으로 다시 만든 뒤, PlayMCP에서 정보를 다시 불러와 재심사를 요청하도록 안내한다. Endpoint와 심사 상태가 바뀔 수 있는 파괴적 절차이므로 제출 직전이나 제출 뒤에는 임의로 실행하면 안 된다. [공모전 참가 유의사항](https://pineapple-cub-4dd.notion.site/3749b97b488880a58d90ff614ea361d4)

## MCP·PlayMCP 구현 계약

### 버전과 전송

- PlayMCP 지원 범위는 최소 `2025-03-26`, 최대 `2025-11-25`다.
- 공개 URL로 접근 가능한 Remote MCP만 지원한다.
- 전송 방식은 Streamable HTTP만 지원하며 stateless/no-session 서버를 권장한다. [PlayMCP 서버 개발가이드](https://app.notion.com/p/PlayMCP-2d89b97b4888808a9e1dc17a13e70187)
- Streamable HTTP 서버는 하나의 MCP endpoint에서 `POST`와 `GET`을 제공하고 모든 연결의 `Origin`을 검증해야 한다. 유효하지 않은 Origin은 `403`으로 거부한다. [MCP 2025-11-25 전송 명세](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports)
- 초기화 단계에서 버전을 협상하고, HTTP의 후속 요청은 협상한 `MCP-Protocol-Version`을 사용한다. 서버는 지원하지 않는 버전을 `400`으로 거부해야 한다. [MCP lifecycle](https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle), [Protocol Version Header](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports)

구현 기준은 최신 상한인 `2025-11-25`로 두되 `2025-03-26` 클라이언트와의 협상도 실제로 시험하는 편이 안전하다. 공식 SDK 목록에서 현재 Tier 1은 TypeScript, Python, C#, Go다. 언어 선택 전 현재 유지보수 상태를 다시 확인해야 한다. [공식 SDK 목록](https://modelcontextprotocol.io/docs/sdk)

### 서버와 Tool 이름

- 서버 이름과 Tool 이름 어디에도 대소문자와 위치를 불문하고 `kakao`를 포함하면 안 된다.
- Tool 이름은 1~128자, 영문 대소문자·숫자·underscore·hyphen만 허용한다.
- 이름은 case-sensitive이며 서버 안에서 중복되면 안 된다.
- MCP 2025-11-25 일반 명세는 점(`.`)도 허용하지만 PlayMCP는 허용하지 않는다. PlayMCP 등록 대상에서는 더 엄격한 정규식 `^[A-Za-z0-9_-]{1,128}$`를 적용해야 한다. [PlayMCP 서버 개발가이드](https://app.notion.com/p/PlayMCP-2d89b97b4888808a9e1dc17a13e70187), [MCP Tool 이름 규칙](https://modelcontextprotocol.io/specification/2025-11-25/server/tools)

### Tool 수와 필수 필드

- 한 서버의 Tool은 20개를 초과할 수 없고 3~10개를 권장한다. Tool이 지나치게 많으면 모델의 올바른 Tool 선택 가능성이 낮아진다.
- 모든 Tool은 `name`, `description`, `inputSchema`, `annotations`를 제공한다.
- `annotations`에는 `title`, `readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`를 모두 명시한다.
- `description`은 1,024자 이내의 영문을 권장하고 서비스 이름을 `MendLens(찍고쳐)`처럼 영문·국문으로 병기한다.
- 플랫폼이 MCP 식별자 prefix를 Tool 이름에 붙이므로 Tool 이름에는 서비스명을 반복하지 않는다. [PlayMCP 서버 개발가이드](https://app.notion.com/p/PlayMCP-2d89b97b4888808a9e1dc17a13e70187)

MCP schema에서 annotation은 강제 권한 규칙이 아니라 hint다. 그래도 생략 시 보수적인 기본값이 적용된다. `readOnlyHint=false`, `destructiveHint=true`, `idempotentHint=false`, `openWorldHint=true`가 기본이므로 실제 동작을 기준으로 모두 명시해야 한다. [MCP 2025-11-25 ToolAnnotations](https://modelcontextprotocol.io/specification/2025-11-25/schema)

### 결과와 오류

- 결과는 필요한 최소 데이터만 반환하고 업스트림 API 응답을 그대로 노출하지 않는다.
- 오류 또는 widget이 아닌 결과는 모델이 바로 사용할 수 있도록 정제된 텍스트나 Markdown으로 제공한다.
- 입력 검증·외부 API 실패·업무 규칙 오류는 Tool 실행 결과의 `isError: true`로 설명한다.
- 알 수 없는 Tool이나 MCP 요청 구조 오류는 JSON-RPC protocol error로 구분한다.
- 공식 MCP 명세는 structured result를 쓸 때 호환성을 위해 직렬화한 text content도 함께 제공하도록 권장한다. [PlayMCP 서버 개발가이드](https://app.notion.com/p/PlayMCP-2d89b97b4888808a9e1dc17a13e70187), [MCP Tool 결과·오류 명세](https://modelcontextprotocol.io/specification/2025-11-25/server/tools)

### 성능과 운영

- PlayMCP는 평균 Tool 응답시간 100ms 이내와 p99 3,000ms 이내를 요구한다.
- 광고 노출이나 클릭을 유도하는 Tool 답변은 허용하지 않는다. [PlayMCP 서버 개발가이드](https://app.notion.com/p/PlayMCP-2d89b97b4888808a9e1dc17a13e70187)
- MCP 공식 명세는 서버가 입력 검증, 접근 제어, rate limit, 출력 정제를 수행하도록 요구한다. [MCP Tool 보안 고려사항](https://modelcontextprotocol.io/specification/2025-11-25/server/tools)

MendLens의 이미지 분석과 외부 설명서·리콜 조회는 평균 100ms와 구조적으로 충돌할 수 있다. 이를 측정 없이 낙관해서는 안 된다. 사전 색인, 검증 가능한 cache, Tool 범위 축소를 비교하고 실제 부하 시험으로 기준 충족 여부를 확인해야 한다. 최신 리콜 상태를 cache할 경우 `checkedAt`과 갱신 정책도 함께 제공해야 한다.

### 인증

MVP가 공개 설명서와 리콜 조회만 제공한다면 사용자별 OAuth를 추가하지 않는 편이 단순하다. 인증이 실제로 필요해질 때만 다음 계약을 적용한다.

- PlayMCP가 허용하는 인증 방식은 OAuth 또는 custom header다.
- PlayMCP 등록 뒤 OAuth client의 redirect URI를 `https://playmcp.kakao.com/api/v1/applied-mcps/{mcpId}/authorize/oauth:callback` 형식으로 설정한다.
- 개인정보를 Kakao로 전달한다면 제3자 제공 동의, 제공 목적·항목·보유기간을 검토한다. [PlayMCP 서버 개발가이드](https://app.notion.com/p/PlayMCP-2d89b97b4888808a9e1dc17a13e70187)
- OAuth를 구현하면 MCP 2025-11-25의 OAuth 2.1, protected resource metadata, authorization server discovery, HTTPS·redirect URI 검증을 따른다. [MCP 2025-11-25 Authorization](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization)

## MendLens 적용 결정과 권고

### 1. Tool은 데이터 능력 단위로 3~5개에서 시작한다

PlayMCP의 권장 범위와 모델 선택 정확도를 고려하면 화면 단계나 내부 함수마다 Tool을 만들면 안 된다. 초기 Tool 집합은 다음 능력을 분리하는 방향이 적절하다.

- 제품·모델 식별에 필요한 입력 정규화
- 모델별 공식 설명서·오류 코드 근거 조회
- 국내외 리콜 상태 조회
- 공식 AS 또는 안전 행동 정보 조회

정확한 Tool 이름과 이미지 전달 형식은 PlayMCP가 실제로 어떤 이미지 context를 Tool 입력에 전달하는지 확인한 뒤 확정해야 한다. 확인 전에는 base64, URL, host-provided attachment 중 하나를 임의 계약으로 고정하지 않는다.

### 2. 답변 contract에 근거와 안전 분기를 고정한다

각 Tool 또는 최종 조합 결과에서 다음 정보를 잃지 않아야 한다.

- 제조사, 제품군, 모델명과 식별 confidence
- 공식 source URL과 source type
- 오류 코드 또는 증상의 공식 설명
- 확인 시점(`checkedAt`)
- 리콜 확인 결과와 조회 범위
- 사용자가 할 수 있는 단계와 중단 조건
- `즉시 사용 중단`, `직접 해결 가능`, `공식 AS 필요` 중 하나의 next action

모델 식별이 불확실하거나 정확히 일치하는 공식 근거가 없으면 진단을 생성하지 않고 추가 사진·모델명·오류 코드를 요청한다.

### 3. 출처와 사용 권한을 기능의 일부로 관리한다

공식 출처라는 사실이 자동으로 대량 수집·재배포 권한을 의미하지 않는다. 제조사별 설명서 제공 조건, 자동 조회 가능 여부, cache·색인 범위, 인용·링크 정책을 데이터 소스별로 기록해야 한다. 심사 시 바로 제시할 수 있도록 출처, 이용 조건, 갱신 방식과 사용 범위를 함께 남긴다.

### 4. 제출 직전에는 Tool metadata를 동결한다

Tool 이름, schema, description 또는 annotation을 바꾸면 PlayMCP 표시 정보와 실제 서버가 달라질 수 있고 재심사가 필요할 수 있다. 제출 후보를 정한 뒤에는 metadata를 동결하고 수정이 불가피하면 Endpoint·정보 불러오기·AI 채팅·재심사 영향부터 판단한다.

### 5. Git 소스 배포를 기본 후보로 둔다

현재 프로젝트가 Git 저장소에서 개발되고 재현 가능한 Dockerfile이 필요하므로 Git 소스 빌드가 가장 단순한 기본 후보이다. 다만 이는 배포 운영을 단순화하기 위한 권고이며 확정된 제품 요구사항은 아니다. 컨테이너 registry 운영 이유가 생기면 `linux/amd64` 이미지를 명시적으로 빌드하는 방식으로 전환할 수 있다.

## 현재 구현 스냅샷과 초기 공식 근거 데이터

이 절은 외부 플랫폼 계약이 아니라 2026-07-14 작업 트리의 구현 선택과 초기 검증 데이터를 기록한다. 구현이 바뀌면 현재 코드와 `package.json`을 우선하고 이 절도 함께 갱신한다.

### 구현 스택

- 현재 `package.json`은 `@modelcontextprotocol/sdk` 1.29.0과 Zod 4.4.3을 고정한다.
- 공식 TypeScript SDK 가이드는 Remote MCP에 Streamable HTTP를 권장하고, 단순 API 서버에는 stateless 구성을 적합한 형태로 안내한다. [MCP TypeScript SDK 서버 가이드](https://ts.sdk.modelcontextprotocol.io/server), [MCP TypeScript SDK npm](https://www.npmjs.com/package/@modelcontextprotocol/sdk)
- SDK 버전 고정은 재현성을 위한 현재 구현 선택이다. PlayMCP가 특정 패키지 버전을 요구한다는 뜻은 아니다.

### 초기 검증용 공식 데이터

외부 키 없이 근거 추적과 안전 분기를 시험하기 위한 제한된 사례다. 모델명·제품군을 정확히 일치시킨 경우에만 사용하고, 일반적인 고장 진단으로 확대 해석하지 않는다.

- LG 통돌이 세탁기 `UE`: 세탁물 불균형 또는 수평 상태를 확인하도록 안내한다. [LG전자 공식 안내](https://www.lge.co.kr/support/solutions-1779808?cstFlag=Y&mktModelCd=T1204T&svcqr=)
- LG 드럼세탁기 `UE`: 세탁물 쏠림과 수평 상태를 확인하도록 안내한다. [LG전자 공식 안내](https://www.lge.co.kr/support/solutions-1779965?cstFlag=Y&mktModelCd=F8Q6CNVKQ&svcqr=)
- LG 에어컨 `CH05`: 실내기와 실외기 사이의 통신 이상으로 설명한다. [LG전자 공식 안내](https://www.lge.co.kr/support/solutions-20150310809781?category=CT50019183&cstFlag=Y&mktModelCd=FQ19V9KWAN&page=0&seq=60&sort=update&subCategory=CT50019199)
- LG 에어컨에서 지속적인 고무 타는 냄새가 나면 차단기를 내리고 전문 점검을 받도록 안내한다. 2026-07-14에 공식 페이지 본문을 다시 확인했다. [LG전자 공식 안내](https://www.lge.co.kr/support/solutions-20150145438200?category=CT50019183&cstFlag=Y&mktModelCd=FQ17S9DWAN&page=0&seq=67&sort=update&subCategory=CT50019199)
- 제품안전정보센터 Open API는 KC 인증, 국내 리콜, 국외 리콜 정보를 제공한다. 사용 신청, 인터페이스 명세와 이용 조건을 확인하기 전에는 MendLens가 이를 실시간 조회한다고 표시하지 않는다. [제품안전정보센터 Open API](https://www.safetykorea.kr/release/openapi)

### 런타임 미확정 사항

- 공개 KC 가이드에서 컨테이너에 주입되는 정확한 port 환경 변수 이름을 찾지 못했다. 현재 구현의 `PORT` 우선·기본값 `3000`은 배포 가정이며, KC 실제 runtime에서 검증하기 전에는 플랫폼 계약으로 보지 않는다.
- PlayMCP가 보내는 정확한 `Origin` 값은 확인하지 못했다. MCP 명세에 따라 전달된 Origin은 allowlist로 검증하고 유효하지 않으면 거부해야 한다. Origin이 없는 서버 간 요청을 허용하는 현재 구현 선택도 실제 PlayMCP 요청으로 시험해야 하며 공식 보장으로 보지 않는다.
- Safety Korea 실제 호출은 Open API 사용 신청과 secret 보관 방식을 확정한 뒤 별도 범위로 구현한다.

## 실행 체크리스트

### 구현 전

- [ ] 지원 SDK와 protocol version 범위를 확정한다.
- [ ] 제조사 설명서와 리콜 데이터의 이용 조건을 소스별로 확인한다.
- [ ] PlayMCP의 이미지 입력 전달 형식을 실제 환경에서 검증한다.
- [ ] 3~5개 Tool의 책임, input schema, output contract를 문서화한다.
- [ ] 각 Tool의 annotation 5개를 실제 부작용 기준으로 결정한다.
- [ ] 공개 데이터만으로 MVP를 만들 수 있는지 확인하고 불필요한 OAuth를 제외한다.

### 로컬 완료 전

- [ ] MCP Inspector에서 `2025-03-26`과 `2025-11-25` 초기화·협상을 확인한다.
- [ ] Streamable HTTP `POST`·`GET`, Origin 검증, 잘못된 version header를 시험한다.
- [ ] `tools/list`의 이름·필드·schema·annotation 완전성을 검사한다.
- [ ] 각 Tool의 정상·빈 결과·잘못된 입력·외부 실패·timeout을 시험한다.
- [ ] 원본 API payload, 사용자 이미지, token 또는 secret이 결과·로그에 없는지 확인한다.
- [ ] 평균과 p99 지연을 실제 부하로 측정한다.

### PlayMCP 심사 전

- [ ] KC 서버가 `Active`인지 확인한다.
- [ ] Endpoint의 `정보 불러오기`가 성공하는지 확인한다.
- [ ] 임시 등록 상태에서 상세 미리보기와 도구함 추가를 확인한다.
- [ ] PlayMCP AI 채팅으로 대표 사용자 흐름과 실패 흐름을 시험한다.
- [ ] 심사 요청 전에 Tool metadata를 동결한다.

### 예선 제출 전

- [ ] 심사 승인 상태를 확인한다.
- [ ] 공개 상태가 `전체 공개`인지 확인한다.
- [ ] MCP 상세 URL, 출품 정보, 제출할 서버 수를 최종 확인한다.
- [ ] 1회 제출 제약을 인지하고 예선 폼을 제출한다.

### 본선 진출 후

- [ ] 당시의 Kakao Tools·Widget 공식 스펙을 새로 조사한다.
- [ ] 코어 Tool과 Widget adapter의 경계를 정한다.
- [ ] 사용자 공개 환경의 개인정보, 안전, 부하, 운영 모니터링을 재검토한다.

## 교차검증에서 발견한 주의점

- **KC 필수와 예외:** Notion은 KC 배포를 필수로 표현한다. 공식 FAQ는 서버 수량 소진 시 별도 공지에 한해 외부 서버를 허용할 수 있다고 보완한다. 예외 공지 자체를 확인하지 못했으므로 현재 규칙은 KC 필수다.
- **심사 기간:** 참가 가이드는 통상 1~2영업일, 최대 7영업일이라고 설명한다. 공식 페이지는 최대 7영업일과 7월 7일 이후 요청의 마감 위험을 강조한다. 서로 충돌하지 않는다.
- **MCP 이름 문자:** MCP 2025-11-25는 점을 허용하지만 PlayMCP는 허용 문자에서 점을 제외한다. 등록 대상 플랫폼의 더 엄격한 규칙을 적용한다.
- **Kakao Tools:** 본선 추가 개발이 필수라는 사실은 확인됐지만 Widget schema는 공개 자료에서 확인하지 못했다. 공개되지 않은 필드를 규칙으로 만들지 않는다.
- **등록 후 업데이트:** 공식 유의사항은 KC 서버 삭제·재생성과 재심사를 요구한다. 일반적인 자동 배포처럼 취급하면 제출 상태를 잃을 수 있다.

## 불확실하거나 추가 확인이 필요한 항목

- 2026-07-14 예선 접수의 정확한 마감 시각
- 현재 MendLens의 KC 서버 발급, PlayMCP 심사, 전체 공개, 예선 접수 상태
- PlayMCP in KC 지원 수량 소진 여부와 외부 서버 예외 공지 여부
- PlayMCP in KC 무상 지원 종료일
- Kakao Tools Widget 상세 schema와 본선 입점 심사 계약
- PlayMCP가 사용자 이미지·attachment를 MCP Tool에 전달하는 정확한 형식
- 제조사별 설명서 수집·색인·재사용 조건
- 평균 100ms 요구가 외부 호출을 포함한 Tool 전체 지연인지에 관한 별도 측정·운영 해석

## 주요 참고 자료

- [PlayMCP 서버 개발가이드](https://app.notion.com/p/PlayMCP-2d89b97b4888808a9e1dc17a13e70187)
- [Agentic Player 10 공모전 참가 가이드](https://app.notion.com/p/3749b97b4888803bb90bef3ddbcfbcfb?v=4739b97b488883b3a439089fe7dfba63&p=3749b97b4888806b8564ee264e2fafde&pm=s)
- [[필독] 공모전 참가 유의사항](https://pineapple-cub-4dd.notion.site/3749b97b488880a58d90ff614ea361d4)
- [AGENTIC PLAYER 10 공식 페이지](https://b.kakao.com/views/PlayMCP/AGENTIC_PlAYER_10)
- [Kakao 공식 공모전 보도자료](https://www.kakaocorp.com/page/detail/12059)
- [Kakao Tools 공식 소개](https://www.kakaocorp.com/page/detail/11971)
- [MCP 2025-03-26 명세](https://modelcontextprotocol.io/specification/2025-03-26)
- [MCP 2025-11-25 명세](https://modelcontextprotocol.io/specification/2025-11-25)
- [MCP 2025-11-25 전송 명세](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports)
- [MCP 2025-11-25 lifecycle](https://modelcontextprotocol.io/specification/2025-11-25/basic/lifecycle)
- [MCP 2025-11-25 Authorization](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization)
- [MCP 2025-11-25 Tool 명세](https://modelcontextprotocol.io/specification/2025-11-25/server/tools)
- [MCP 2025-11-25 schema](https://modelcontextprotocol.io/specification/2025-11-25/schema)
- [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector)
- [MCP 공식 SDK 목록](https://modelcontextprotocol.io/docs/sdk)
- [MCP TypeScript SDK 서버 가이드](https://ts.sdk.modelcontextprotocol.io/server)
- [MCP TypeScript SDK npm](https://www.npmjs.com/package/@modelcontextprotocol/sdk)
- [LG 통돌이 세탁기 UE 안내](https://www.lge.co.kr/support/solutions-1779808?cstFlag=Y&mktModelCd=T1204T&svcqr=)
- [LG 드럼세탁기 UE 안내](https://www.lge.co.kr/support/solutions-1779965?cstFlag=Y&mktModelCd=F8Q6CNVKQ&svcqr=)
- [LG 에어컨 CH05 안내](https://www.lge.co.kr/support/solutions-20150310809781?category=CT50019183&cstFlag=Y&mktModelCd=FQ19V9KWAN&page=0&seq=60&sort=update&subCategory=CT50019199)
- [LG 에어컨 냄새 안내 재검증 대상](https://www.lge.co.kr/support/solutions-20150145438200?category=CT50019183&cstFlag=Y&mktModelCd=FQ17S9DWAN&page=0&seq=67&sort=update&subCategory=CT50019199)
- [제품안전정보센터 Open API](https://www.safetykorea.kr/release/openapi)
