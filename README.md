# my_harness_for_codex

![JavaScript](https://img.shields.io/badge/JavaScript-ES2020-yellow.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/teinam)

Codex 전용 개인 개발·기술문서·데이터 분석 하네스.

Claude Code 하네스의 `agents/`, `commands/`, hooks를 그대로 옮기지 않고 Codex가 실제로 읽는 표면으로 줄였다.

## 구성

| 경로 | 역할 |
|---|---|
| `AGENTS.md` | 저장소 기본 지침. Ponytail 기본 동작과 프로그래밍 루프를 정의한다. |
| `.agents/skills/` | Codex가 자동 발견하는 재사용 스킬. |
| `.agents/plugins/marketplace.json` | repo-local plugin marketplace. |
| `plugins/codex-programming-harness/` | 배포용 Codex plugin 패키지. |
| `.codex/config.toml` | 프로젝트 Codex 설정 예시. |
| `scripts/check.js` | 하네스 구조 검증. |
| `PORTING.md` | Claude 원본에서 가져온 내용, 합친 내용, 제외한 내용과 출처. |
| `codex-vs-claude-code-harness.md` | Claude Code와 Codex 하네스 차이 정리. |

## 스킬

- `codex-implementation-loop` - 기능 구현/리팩터링의 기본 작업 루프
- `codex-debug-fix` - 실패 로그 기반 디버깅과 수정
- `codex-review` - 코드 리뷰
- `codex-harness-maintenance` - 이 하네스 자체를 작게 유지하며 개선
- `python-codex` - Python, FastAPI, 데이터 스크립트
- `typescript-react-codex` - TypeScript, React, Vite, Obsidian UI
- `rust-codex` - Rust, Cargo, ownership/trait/안전성
- `database-codex` - SQL/NoSQL 스키마, migration, index
- `frontend-qa-codex` - 브라우저/반응형/시각 검증
- `codebase-onboarding-codex` - 코드베이스 구조·요청 흐름 파악, 요청 시 AGENTS.md 작성
- `security-review-codex` - 인증·인가·입력·민감정보 경계 검토
- `deployment-codex` - Docker/Compose·CI/CD·배포·롤백
- `benchmark-codex` - 재현 가능한 성능 비교
- `technical-writing-codex` - 한/영 기술문서 작성·윤문
- `data-analysis-codex` - 데이터 검증·지표 분석·실험 해석

Codex는 `.agents/skills/*/SKILL.md`의 `name`과 `description`을 먼저 보고, 필요할 때 전체 스킬을 읽는다. 그래서 스킬은 작게 유지한다. FastAPI·테스트 격리·UI 상태 전이·Vite·Obsidian의 세부 지침은 해당 스킬이 연결하는 `references/`에서 필요할 때만 읽는다.

예를 들어 다음처럼 요청한다:

```text
$codebase-onboarding-codex 이 저장소의 요청 흐름과 수정 지점을 설명해줘.
$security-review-codex 이번 인증 변경에서 다른 사용자의 데이터에 접근할 수 있는지 검토해줘.
$technical-writing-codex 이 README의 기술적 의미를 유지하면서 한국어를 다듬어줘.
$data-analysis-codex 지난달 전환율 하락을 세그먼트별로 분석해줘.
```

Claude 원본의 스킬 115개 중 독립 워크플로 6개를 새 스킬로 정리하고, 겹치는 지침은 기존 스킬에 합쳤다. 선택 기준과 원본 대응표는 [PORTING.md](PORTING.md)에 있다.

## 검증

```bash
node scripts/check.js
```

검증 스크립트를 수정했을 때:

```bash
node scripts/check.test.js
```

구조 검증은 스킬 본문과 참조 파일의 배포본 일치, 참조 파일 존재, 라이선스 일치를 확인한다. 실제 작업에서의 스킬 선택과 결과 품질까지 보장하지는 않는다.

## 배포

이 저장소는 GitHub에 그대로 올려서 Codex marketplace source로 추가할 수 있다. GitHub에 push한 뒤:

```bash
codex plugin marketplace add TeiNam/my_harness_for_codex --ref main
```

또는 HTTPS Git URL을 쓴다:

```bash
codex plugin marketplace add https://github.com/TeiNam/my_harness_for_codex.git --ref main
```

로컬에서 먼저 테스트할 때는 repo root에서:

```bash
codex plugin marketplace add .
```

그 다음 Codex plugin UI에서 `codex-programming-harness`를 설치한다.

plugin 본체는 `plugins/codex-programming-harness/`이고, marketplace entry는 `.agents/plugins/marketplace.json`에 있다. plugin 내부의 `skills/`는 `.agents/skills/`와 같은 내용을 담아 self-contained로 배포된다.

## Codex에 맞춘 차이

- 지속 지침은 `CLAUDE.md`가 아니라 `AGENTS.md`에 둔다.
- 반복 절차는 slash command 더미가 아니라 skill로 둔다.
- hooks는 기본으로 만들지 않는다. 실제로 기계적 차단이 필요한 규칙만 나중에 추가한다.
- plugin은 배포가 필요할 때 만든다. 개인 로컬 작성 단계에서는 `.agents/skills`가 더 싸다.
