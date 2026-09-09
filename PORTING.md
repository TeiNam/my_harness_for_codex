# Claude Code → Codex 이식 기록

2026-09-09 기준 `my_harness_for_claude_code`의 스킬 115개와 기존 Codex 스킬 9개를 비교했다. 원본 기준 커밋은 `0ce975961eb378419dccf723fb72872dd8b0d2a4`다. 원본은 변경하지 않고, 이 저장소에 필요한 절차만 재작성했다.

## 선택 기준

- 기존 Codex 스킬이나 이 환경에 설치된 플러그인과 겹치면 새 스킬을 만들지 않는다.
- 별도로 호출할 이유가 있는 개발·기술문서·데이터 분석 작업은 독립 스킬로 둔다.
- 언어·프레임워크 세부 지침은 기존 스킬의 참조 파일이나 짧은 지침으로 합친다.
- 모델 별칭, 강제 에이전트 파이프라인, 설치 경로, 고정 MCP 호출을 제거한다.
- 예제 코드와 버전별 기본값을 통째로 복사하지 않는다. 실제 프로젝트의 버전과 도구를 확인하도록 바꾼다.

## 새 스킬 6개

원본 경로는 `my_harness_for_claude_code` 루트 기준이고, 대상은 `.agents/skills/` 기준이다.

| 원본 | Codex 대상 | 남긴 내용 |
|---|---|---|
| `skills/codebase-onboarding/` | `codebase-onboarding-codex` | 실제 진입점·요청 흐름·실행 명령 파악. AGENTS.md 작성은 요청 범위일 때만 |
| `skills/security-review/` | `security-review-codex` | 입력부터 민감 연산까지 추적, 사용자·테넌트 경계, 부정 테스트 |
| `skills/docker-patterns/`, `skills/deployment-patterns/` | `deployment-codex` | 환경·볼륨·시크릿·헬스 체크·배포와 데이터 복구 구분 |
| `skills/benchmark/` | `benchmark-codex` | 동일 조건의 기준선·변경 후 측정, 표본·오류·변동 보고 |
| `skills/tech-writer/` | `technical-writing-codex` | 사실·코드·서법 보존, 실행 가능한 예제, 한/영 기술문서 편집 |
| `skills/python-data-analysis/`, `skills/analysis-methodology/` | `data-analysis-codex` | 질문·분모 정의, 데이터 검증, 재현성, 인과·상관 구분 |

## 기존 스킬에 합친 내용

| 원본 | 대상 |
|---|---|
| `skills/fastapi-patterns/` | `python-codex/references/fastapi.md` |
| `skills/python-testing/{mocking,side-effects,async-testing}.md` | `python-codex/references/testing.md` |
| `skills/click-path-audit/`, `skills/browser-qa/` | `frontend-qa-codex`와 `references/state-transitions.md`, `codex-debug-fix`의 최종 상태·호출자 추적 |
| `skills/vite-patterns/security.md` | `typescript-react-codex/references/vite.md` |
| `skills/obsidian-plugin-develop/` | `typescript-react-codex/references/obsidian.md` |
| `skills/rust-patterns/concurrency.md` | `rust-codex`의 잠금·큐·태스크 종료 지침 |

## 이번에 제외한 내용

| 범위 | 이유 |
|---|---|
| Claude `agents/`, `commands/`, hooks, 설치기, 세션·비용 DB, 모델 라우팅 | Claude 런타임과 결합됨. 필요한 절차만 스킬로 옮김 |
| `search-first`, `coding-standards`, `terminal-ops`, 일반 언어 패턴 목록 | 기존 AGENTS.md·구현·디버깅·언어 스킬과 중복 |
| `docx`, `xlsx`, `pdf`, 프레젠테이션·시각화 스킬 | 이 작업 환경의 문서·스프레드시트·PDF·슬라이드·시각화 플러그인과 중복 |
| DB 엔진별 대형 가이드 | 기존 `database-codex`와 설치된 `easy-rdbms` 활용. 별도 NoSQL 심화 가이드는 실제 필요 시 이식 |
| 일반 글쓰기·소셜 콘텐츠·영상·브랜드 보이스·대규모 리서치 | 이번 개발·기술문서·분석 범위 밖 |
| AWS·FinOps·ML·모바일·기타 전문 워크플로 | 실제 사용할 작업이 정해질 때 별도로 선정 |
| `humanize-korean`, `archify`의 실행기·에이전트 묶음 | 큰 독립 도구. 이름이나 경로만 바꾸면 동등한 기능을 보장할 수 없음 |

일부 예제는 그대로 옮기면 잘못된 동작을 유도한다. 예를 들어 마이그레이션 메타데이터 변경은 데이터 복구가 아니며, 숨긴 source map도 배포 파일에 남으면 접근할 수 있다. 이식본에는 필요한 판단만 남겼다.

## Codex 표면과 배포

- 재사용 절차: `.agents/skills/<name>/SKILL.md`, 필요한 경우 상대 링크로 `references/` 로드.
- 지속 지침: 기존 `AGENTS.md`. 원본의 대형 지침은 상시 로드하지 않는다.
- 배포: 기존 `plugins/codex-programming-harness/skills/`에 스킬 디렉터리 전체를 복사한다.
- 라이선스: 원본 MIT 고지를 루트 `LICENSE`에 보존하고, 플러그인 루트에도 같은 파일을 포함한다.
- 검증: `node scripts/check.js`; 검증기 회귀 확인은 `node scripts/check.test.js`.

전역 스킬 설치나 플러그인 재설치는 이번 변경에 포함하지 않는다. 다른 저장소에서 쓰려면 기존 배포 절차로 플러그인을 설치한다. 환경에 이미 설치된 플러그인은 이 패키지의 필수 의존성이 아니다.

공식 형식 확인에 사용한 문서:

- [Build skills](https://learn.chatgpt.com/docs/build-skills)
- [Customization: skills](https://learn.chatgpt.com/docs/customization/overview#skills)
- [Package your plugin](https://developers.openai.com/plugins/build/plugins)
