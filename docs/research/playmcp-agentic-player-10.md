# PlayMCP · AGENTIC PLAYER 10 조사 기록

확인일: 2026-07-14 (Asia/Seoul)

이 문서는 MendLens의 구현·배포·출품 과정에서 사용하는 외부 계약의 스냅샷이다. 제출 시점의 공식 화면과 문서가 다르면 최신 공식 정보를 우선한다.

## 공모전

- 예선 접수 기간은 2026년 6월 15일부터 7월 14일까지다.
- 예선은 창의성, 편의성, 안정성을 종합 평가한다.
- 최종 제출용 MCP는 `등록 및 심사 요청`으로 심사를 받아야 한다.
- 심사 승인 후 공개 상태를 `전체 공개`로 바꿔야 참가 대상이 된다.
- 임시 등록은 최종 제출 전 PlayMCP 테스트에 사용한다.
- 서버 심사는 영업일 기준 최대 7일이 걸릴 수 있다.
- 출처: [AGENTIC PLAYER 10 공식 안내](https://b.kakao.com/views/PlayMCP/AGENTIC_PlAYER_10)

## PlayMCP in KC Git 소스 빌드

사용자가 제공한 PlayMCP in KC 가이드 원문을 2026-07-14에 확인했다.

- 접속 주소: <https://playmcp.kakaocloud.io>
- PlayMCP 회원의 카카오 계정으로 로그인해야 한다.
- 계정당 MCP 서버를 최대 2대 등록할 수 있다.
- `+ 새 MCP 서버 등록`에서 `Git 소스 빌드`를 선택한다.
- 입력 항목은 MCP 서버 이름, 설명, Git URL, 브랜치/ref, Dockerfile 경로, 선택적 PAT다.
- 저장소 루트 또는 지정 경로에 `Dockerfile`이 있어야 한다.
- public 저장소는 PAT를 입력하지 않는다.
- 등록 후 상태가 `Starting`에서 `Active`로 바뀌면 상세 화면의 Endpoint URL을 사용한다.
- 공모전 참가 후 코드를 갱신할 때는 KC 서버를 삭제하고 같은 이름으로 재생성한 다음 PlayMCP에서 정보를 다시 불러와 재심사를 요청한다.
- 가이드: [PlayMCP in KC](https://pineapple-cub-4dd.notion.site/3749b97b488880a58d90ff614ea361d4)

## MCP 서버 계약

- Remote MCP에는 Streamable HTTP가 권장된다.
- 단순 API형 서버는 세션을 저장하지 않는 stateless 구성이 적합하다.
- 구현은 안정 버전인 `@modelcontextprotocol/sdk` 1.29.0과 Zod를 사용한다.
- 출처: [MCP TypeScript SDK 서버 가이드](https://ts.sdk.modelcontextprotocol.io/server), [MCP TypeScript SDK npm](https://www.npmjs.com/package/@modelcontextprotocol/sdk)

## 제품 근거 데이터

초기 Endpoint는 외부 키 없이 검증할 수 있도록 공식 LG전자 자료의 제한된 오류 사례를 내장한다.

- LG 통돌이 세탁기 UE: 세탁물 불균형 또는 수평 문제. [LG전자 공식 안내](https://www.lge.co.kr/support/solutions-1779808?cstFlag=Y&mktModelCd=T1204T&svcqr=)
- LG 드럼세탁기 UE: 세탁물 쏠림과 수평 문제. [LG전자 공식 안내](https://www.lge.co.kr/support/solutions-1779965?cstFlag=Y&mktModelCd=F8Q6CNVKQ&svcqr=)
- LG 에어컨 CH05: 실내기와 실외기 통신 이상. [LG전자 공식 안내](https://www.lge.co.kr/support/solutions-20150310809781?category=CT50019183&cstFlag=Y&mktModelCd=FQ19V9KWAN&page=0&seq=60&sort=update&subCategory=CT50019199)
- LG 에어컨의 지속적인 고무 타는 냄새: 차단기를 내리고 전문 점검을 받도록 안내. [LG전자 공식 안내](https://www.lge.co.kr/support/solutions-20150145438200?category=CT50019183&cstFlag=Y&mktModelCd=FQ17S9DWAN&page=0&seq=67&sort=update&subCategory=CT50019199)
- 제품안전정보센터는 KC 인증, 국내 리콜, 국외 리콜 정보를 Open API로 제공한다. 별도 신청과 이용 조건 확인 전에는 서버가 조회한다고 표시하지 않는다. [제품안전정보센터 Open API](https://www.safetykorea.kr/release/openapi)

## 미확인 사항

- PlayMCP in KC 컨테이너가 주입하는 정확한 포트 환경 변수 이름은 공개 가이드 본문에서 확인되지 않았다. 서버는 일반적인 `PORT`를 우선 사용하고 기본값 `3000`을 둔다.
- PlayMCP가 보내는 `Origin` 헤더의 정확한 값은 확인되지 않았다. Origin이 있으면 환경 변수 allowlist로 검증하고, 서버 간 호출처럼 Origin이 없으면 허용한다.
- Safety Korea Open API의 실제 호출은 사용 신청과 키 보관 방식을 확정한 뒤 별도 범위로 구현한다.
