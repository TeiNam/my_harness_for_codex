# my_harness_for_codex

![JavaScript](https://img.shields.io/badge/JavaScript-ES2020-yellow.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/teinam)

Codex 전용 개인 프로그래밍 하네스.

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

Codex는 `.agents/skills/*/SKILL.md`의 `name`과 `description`을 먼저 보고, 필요할 때 전체 스킬을 읽는다. 그래서 스킬은 작게 유지한다.

## 검증

```bash
node scripts/check.js
```

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
