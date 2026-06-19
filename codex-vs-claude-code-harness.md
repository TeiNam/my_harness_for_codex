# Claude Code vs Codex: 같은 코딩 에이전트, 다른 작업 모델

Claude Code와 Codex를 처음 나란히 놓고 보면 거의 같은 물건처럼 보인다. 둘 다 터미널에 들어와 파일을 읽고, 코드를 고치고, 테스트를 돌리고, 셸 명령을 실행한다. 자동완성 수준을 넘어 "작업을 통째로 맡기는" 에이전트라는 점도 똑같다.

그런데 하네스(harness)를 직접 짜 보거나 팀 워크플로에 붙여 보면 이야기가 달라진다. Claude Code에 맞춰 공들여 만든 프롬프트, 커맨드, 에이전트, hook, MCP 구성을 Codex에 그대로 복사해 넣으면 기대만큼 안 돌아간다. 반대도 마찬가지다.

이유는 한 줄로 줄여진다.

> Claude Code는 터미널에 붙어서 같이 움직이는 페어 프로그래머처럼 쓸 때 편하고, Codex는 작업 단위·권한 경계·완료 조건·재사용 지침을 명확히 줬을 때 진가가 나온다.

이 글은 두 도구의 차이를 사용감, 실행 모델, 컨텍스트 관리, 권한 모델, 확장 방식, 하네스 설계 관점에서 짚는다. 내용은 두 제품의 공식 문서(2026년 6월 기준)에 맞춰 확인했고, 버전에 따라 세부는 바뀌니 글 끝의 참고 링크를 함께 보길 권한다.

## 한눈에 보는 차이

| 관점 | Claude Code | Codex |
|---|---|---|
| 기본 사용 감각 | 터미널 안의 대화형 페어 프로그래머 | 작업 단위로 실행되는 에이전트 런타임 |
| 잘 맞는 사용 방식 | 긴 대화, 점진적 수정, todo 기반 진행 | 명확한 목표·범위·제약·완료 조건 |
| 대표 지침 파일 | `CLAUDE.md` | `AGENTS.md` (+ `AGENTS.override.md`) |
| 설정 위치 | `~/.claude/settings.json`, `.claude/` | `~/.codex/config.toml`, `.codex/config.toml` |
| 권한 모델 | 권한 규칙(allow/ask/deny) + OS 샌드박스 | OS 샌드박스 + 승인 정책(approval policy) |
| 네트워크 기본값 | 샌드박스/권한 설정에 따름 | `workspace-write`에서 네트워크 기본 차단 |
| 반복 워크플로 | command·skill·agent·plugin | skill·plugin·custom prompt·hook·MCP |
| 병렬 작업 | subagent 자동 위임이 자연스러움 | subagent는 명시적으로 요청하는 방식이 적합 |
| 장기 작업 | session resume, auto-compact | thread, resume, goal, compaction |
| 검증 | 대화 중 테스트/수정 루프 | 완료 조건에 test/lint/review 명시 권장 |

표만 보면 "둘이 비슷하면서 미묘하게 다르네" 정도로 읽힌다. 그런데 막상 일하다 보면 이 미묘한 차이가 워크플로 전체를 가른다. 하나씩 풀어 보자.

## 일단, 무엇이 같은가

차이를 따지기 전에 공통분모부터 짚는 게 공정하다.

Claude Code와 Codex는 단순 챗봇이 아니라 코드베이스 위에서 일하는 에이전트다. 저장소 구조를 탐색하고, 파일을 읽어 맥락을 이해하고, 코드를 수정하고, 셸 명령을 실행한다. 테스트·lint·typecheck를 돌리고 실패 로그를 뜯어본다. 리팩터링하고, 코드 리뷰를 하고, 반복 작업을 자동화한다. MCP로 외부 도구도 붙인다.

요약하면 둘 다 "질문에 답하는 AI"보다 "일을 맡기는 개발 도구"에 가깝다. 진짜 차이는 그 일을 **어떻게 표현하고, 어떻게 제한하고, 어떻게 재사용하느냐**에 있다.

## 가장 큰 차이: 대화형 페어링 vs 작업 단위 실행

Claude Code는 감각상 터미널에 붙어 있는 페어 프로그래머에 가깝다. 사용자가 말로 방향을 잡으면 Claude가 파일을 읽고 고치고, 사용자가 다시 피드백을 주고, 그 위에서 다음 수정으로 이어진다. 이 흐름이 자연스럽다.

이런 요청도 무리 없이 소화한다.

```text
이 프로젝트 구조부터 파악하고, 인증 모듈 쪽 문제를 찾아서 고쳐줘.
진행하면서 필요한 테스트도 같이 돌려줘.
```

Claude Code는 이런 두루뭉술한 요청을 받아도 프로젝트를 탐색하고, 중간중간 todo를 세우고, 추가 지시를 받아가며 계속 굴러간다. 대화가 곧 작업 단위인 셈이다.

Codex도 같은 일을 한다. 다만 Codex는 thread, goal, plan, sandbox, approval, skill, plugin 같은 **구조적 표면**을 훨씬 더 많이, 그리고 노골적으로 내놓는다. "대화하다 보면 알아서 맞춰가는 도구"라기보다 "작업 단위를 정의하면 그 안에서 에이전트가 실행되는 런타임"으로 보는 편이 실제 동작에 가깝다.

그래서 같은 일을 Codex에 맡길 때는 이렇게 주는 게 안정적이다.

```text
Goal: 인증 모듈의 로그인 실패 원인을 찾아 수정한다.
Context: src/auth, tests/auth. 최근 실패 로그는 아래에 붙인다.
Constraints: public API는 바꾸지 않는다. DB 스키마 변경은 하지 않는다.
Done when: 관련 단위 테스트가 통과하고, 실패 로그의 재현 케이스가 해결된다.
```

사소해 보여도 하네스 설계에서는 갈림길이다. Claude Code용 하네스는 "대화형 조율을 잘 돕는" 방향으로 커지는 경향이 있고, Codex용 하네스는 "작업 명세·권한·검증·재사용 지침을 깔끔히 나누는" 쪽이 잘 맞는다.

## 프롬프트를 주는 방식

Claude Code에서는 큰 덩어리를 던지고 대화로 좁혀가도 된다.

```text
이 기능을 더 안정적으로 만들어줘.
```

이후 Claude가 코드를 읽고 제안하면, 사용자가 "그건 하지 말고 이쪽으로"라며 키를 잡아간다.

Codex에서는 처음부터 네 가지를 넣어 주면 결과가 눈에 띄게 안정된다.

- **Goal** — 무엇을 바꿀 것인가
- **Context** — 어떤 파일·로그·문서·제약이 중요한가
- **Constraints** — 무엇을 하지 말아야 하는가
- **Done when** — 언제 끝났다고 볼 것인가

실제로 쓰면 이런 모양이다.

```text
Goal: 결제 실패 재시도 로직에서 중복 청구 가능성을 제거한다.

Context:
- services/payments/retry.ts
- services/payments/idempotency.ts
- tests/payments/retry.test.ts
- 운영 로그에서 같은 payment_id가 두 번 capture되는 케이스가 있었다.

Constraints:
- 외부 PG API wrapper의 public interface는 바꾸지 않는다.
- migration은 추가하지 않는다.
- retry 횟수 정책은 유지한다.

Done when:
- 중복 capture를 막는 테스트가 추가된다.
- 기존 payment 테스트가 통과한다.
- 변경 diff를 자체 리뷰해 race condition 가능성을 설명한다.
```

Codex는 검증 가능한 완료 조건이 있을 때 강하다. "알아서 잘해줘"보다 "이 상태가 되면 끝"을 알려 주는 쪽이 거의 항상 낫다.

## 지침 파일: `CLAUDE.md`와 `AGENTS.md`

두 도구 모두 "프로젝트 지침 파일"을 읽지만 이름도, 병합 규칙도 다르다.

### Claude Code의 `CLAUDE.md`

Claude Code는 여러 위치의 메모리 파일을 **넓은 범위에서 좁은 범위 순으로 읽어 하나로 이어 붙인다**. 대략 이 순서다.

```text
관리형 정책(managed policy) — 조직 배포용
~/.claude/CLAUDE.md          — 사용자 전역
./CLAUDE.md 또는 ./.claude/CLAUDE.md — 프로젝트
./CLAUDE.local.md            — 로컬(gitignore)
```

cwd에서 위로 올라가며 발견되는 `CLAUDE.md`를 모두 모으고, 하위 디렉터리의 `CLAUDE.md`는 그 안의 파일을 읽을 때 필요에 따라 끌어온다. `@경로` 문법으로 다른 파일을 import하기도 한다(최대 4단계).

여기서 자주 헷갈리는 지점이 하나 있다. `CLAUDE.md`는 **강제되는 설정이 아니라 컨텍스트로 주입되는 안내문**이다. 시스템 프롬프트 뒤에 사용자 메시지처럼 붙는다고 보면 된다. 그래서 "반드시 막아야 하는 동작"은 CLAUDE.md가 아니라 권한 규칙이나 hook으로 막아야 한다. 한 가지 더 — Claude Code는 `AGENTS.md`가 아니라 `CLAUDE.md`를 읽는다. AGENTS.md를 쓰려면 CLAUDE.md에서 import하는 식이 된다.

### Codex의 `AGENTS.md`

Codex는 같은 역할을 `AGENTS.md`가 맡는다. 작업을 시작할 때 전역과 프로젝트의 `AGENTS.md` 계층을 읽어 "지침 체인"을 한 번 만든다.

```text
~/.codex/AGENTS.md  (같은 위치에 AGENTS.override.md가 있으면 그쪽 우선)
repo/AGENTS.md
repo/subdir/AGENTS.md
repo/subdir/AGENTS.override.md
```

동작을 정확히 적으면 이렇다. Codex는 전역 스코프를 먼저 보고, 그다음 프로젝트 루트(보통 Git 루트)에서 현재 작업 디렉터리까지 **내려오면서** 각 디렉터리당 파일 하나씩을 모은다. 같은 디렉터리에 `AGENTS.override.md`가 있으면 `AGENTS.md` 대신 그것을 쓴다. 모은 파일은 루트부터 차례로 **빈 줄로 이어 붙이고**, cwd에 가까운 파일이 뒤에 와서 더 강하게 작용한다. 기본 크기 상한은 32KiB(`project_doc_max_bytes`)다.

`AGENTS.override.md`는 실제로 있는 기능이다. 베이스 파일을 지우지 않고 잠깐 덮어쓰고 싶을 때 쓴다.

### 하네스 관점의 차이

핵심은 이렇다. Claude Code에서는 `CLAUDE.md` + command + agent + hook이 한 덩어리의 운영 체계처럼 엮이기 쉽다. Codex에서는 역할을 더 또렷이 나누는 게 자연스럽다 — 지침은 `AGENTS.md`, 실행 설정은 `.codex/config.toml`, 반복 절차는 skill, 배포 단위는 plugin, 자동 검사는 hook.

## 권한과 샌드박스

여기가 두 도구를 가장 많이 헷갈리게 하는 지점이다. **둘 다 OS 수준 샌드박스를 갖고 있다.** 예전엔 "Codex만 샌드박스가 있다"는 인식이 있었지만 지금은 아니다.

### Codex: 샌드박스가 제품의 중심 개념

Codex의 권한은 따로 놀면서 협력하는 **두 층**으로 봐야 한다.

- **sandbox mode** — 기술적으로 어디까지 접근 가능한가
- **approval policy** — 경계를 넘으려 할 때 언제 사용자에게 물을 것인가

샌드박스 모드는 정확히 세 가지다.

| 모드 | 의미 |
|---|---|
| `read-only` | 파일을 읽고 답만 한다. 수정·명령 실행·네트워크는 승인이 필요하다. |
| `workspace-write` | 현재 작업공간 안에서 읽기·쓰기·명령 실행이 자동 허용된다. |
| `danger-full-access` | 샌드박스를 사실상 해제한다. 신뢰된 환경에서만 쓴다. |

놓치기 쉬운 대목이 있다. `workspace-write`에서 **네트워크 접근은 기본으로 꺼져 있다**. 켜려면 `sandbox_workspace_write.network_access = true`를 명시해야 한다. `npm install`이나 외부 호출이 "왜 안 되지?" 싶을 때 십중팔구 이게 원인이다.

승인 정책은 `untrusted` / `on-request` / `never` 세 가지다(예전의 `on-failure`는 deprecated). 흔히 쓰는 `Auto` 프리셋이 `workspace-write + on-request` 조합이다. 승인을 꺼도(`never`) 샌드박스 경계 자체는 그대로 유지된다는 점이 핵심이다.

### Claude Code: 권한 규칙 + 선택적 OS 샌드박스

Claude Code는 `allow` / `ask` / `deny` 규칙으로 도구 실행을 제어한다. 평가 순서는 **deny → ask → allow**이고 첫 매치가 이긴다. 규칙은 `Bash(npm run test:*)`, `Read(./.env)`, `WebFetch(domain:example.com)`처럼 도구별로 좁혀 쓸 수 있다.

권한 모드는 이제 여섯 개다 — `default`, `acceptEdits`, `plan`, `auto`, `dontAsk`, `bypassPermissions`. (과거 글에서 흔히 보이는 "네 가지" 설명은 오래된 것이다.)

여기에 더해 Claude Code도 OS 샌드박스를 제공한다. macOS는 Seatbelt, Linux/WSL2는 bubblewrap으로 Bash 도구와 그 자식 프로세스의 파일시스템·네트워크를 격리한다(`sandbox.enabled`). 즉 **권한 규칙과 OS 샌드박스는 별개의 보완 레이어**다.

### 그래서 무엇이 다른가

둘 다 샌드박스가 있다는 점은 같다. 대신 **무게중심이 다르다.** Codex는 샌드박스 모드와 승인 정책이 일상 사용 흐름의 첫 화면에 늘 떠 있는 중심 개념이다. Claude Code는 권한 규칙(allow/ask/deny)이 더 익숙한 표면이고, OS 샌드박스는 켜서 쓰는 옵션에 가깝다.

그래서 Claude Code용 하네스를 Codex로 옮기면 권한 쪽에서 자주 막힌다. 기존 하네스가 `npm install`, `npx`, 브라우저 자동화, 여러 저장소 동시 수정, 홈 디렉터리 설정 변경을 당연하게 기대한다면, Codex에서는 `.codex/config.toml`의 `sandbox_mode`, `writable_roots`, `network_access`, `approval_policy`를 따로 설계해 줘야 한다.

## 실행 모델: 긴 세션과 thread

Claude Code는 한 세션 안에서 계속 같이 가는 감각이 강하다. 긴 대화, todo, 중간 피드백이 작업의 뼈대다. 세션은 `--continue`로 가장 최근 대화를 잇거나 `--resume`으로 골라서 복구한다. 컨텍스트가 한계에 가까워지면 자동으로 압축(auto-compact)되고, `/rewind`로 체크포인트로 되돌리기도 한다.

Codex는 **thread**라는 단위가 더 또렷하다. 하나의 thread에 사용자 프롬프트, 모델 출력, tool call, 파일 편집, 명령 결과가 쌓인다. 같은 thread를 이어가다 길어지면 `/compact`로 압축하거나 자동 압축으로 계속 끌고 간다. 거기에 `/goal`로 "이 작업 동안 유지할 목표"를 명시적으로 걸어 둔다는 점이 Codex답다.

이 구조 탓에 Codex에서는 "이 작업을 어떤 thread로 관리할까"가 실질적인 질문이 된다. 좋은 작업 단위는 대개 이렇다.

- 버그 하나의 재현·수정·검증
- 기능 하나의 설계·구현·테스트
- PR 하나의 리뷰
- 마이그레이션 한 단계
- 실패한 CI job 하나의 원인 분석과 수정

반대로 이런 요청은 효율이 뚝 떨어진다.

```text
이 레포 전체 봐서 아키텍처 개선하고 테스트도 다 고치고 문서도 정리해줘.
```

Codex에는 이렇게 쪼개 주는 편이 맞는다.

```text
1단계: 현재 아키텍처와 테스트 실패를 분석하고 수정 계획만 작성한다.
2단계: 인증 모듈의 테스트 실패만 고친다.
3단계: 결제 모듈의 race condition 가능성만 리뷰한다.
4단계: 문서를 실제 변경사항에 맞춰 갱신한다.
```

## 재사용 워크플로: command 중심 vs skill/plugin 중심

Claude Code 하네스에서는 `.claude/commands/`에 마크다운을 두고 slash command로 부르는 패턴이 흔했다.

```text
/plan-feature
/fix-ci
/review-pr
/security-audit
/write-tests
```

짚어 둘 변화가 하나 있다. Claude Code에서 **커스텀 command는 이제 Skill로 통합됐다.** `.claude/commands/deploy.md`도, `.claude/skills/deploy/SKILL.md`도 똑같이 `/deploy`를 만든다. 기존 command 파일은 여전히 동작하지만 공식 문서는 이제 skill을 권장하고, 이름이 겹치면 skill이 이긴다.

Codex에도 slash command가 있다. 다만 반복 워크플로를 전부 command로 욱여넣는 건 Codex에서 최선이 아니다. 표면을 목적별로 나누는 편이 훨씬 안정적이다.

| 목적 | Codex에서 적합한 표면 |
|---|---|
| 항상 적용되는 개발 규칙 | `AGENTS.md` |
| 특정 작업 절차 | skill |
| 여러 skill·MCP·연동을 묶어 배포 | plugin |
| 모델/권한/MCP 기본값 | `.codex/config.toml` |
| 도구 호출 전후 자동 검사 | hook |
| 외부 시스템 연결 | MCP |
| 일회성 작업 지시 | prompt 또는 thread context |

예를 들어 Claude Code의 `/fix-ci` 하나는 Codex에서 이렇게 분해된다.

```text
AGENTS.md
- CI 실패를 고칠 때는 먼저 실패 로그를 요약하고 재현 가능한 최소 명령을 찾는다.
- 수정 후 관련 테스트만 먼저 돌리고, 마지막에 전체 검증 명령을 제안한다.

.agents/skills/fix-ci/SKILL.md
- CI 로그 읽는 절차
- flaky test 구분 기준
- dependency/cache 문제와 코드 문제를 가르는 절차
- 결과 보고 템플릿

.codex/config.toml
- 필요한 MCP 서버
- sandbox / approval 기본값
```

## Skill: 둘 다 있고, 둘 다 description이 생명이다

Skill은 두 도구 모두 핵심 기능으로 갖췄다. 둘 다 **progressive disclosure** 방식을 쓴다 — 처음부터 모든 skill의 본문을 컨텍스트에 욱여넣지 않고, 이름·설명·경로만 들고 있다가 필요하다 싶으면 그제야 `SKILL.md`를 읽는다.

위치는 다르다.

- **Claude Code**: `.claude/skills/<name>/SKILL.md` (프로젝트) 또는 `~/.claude/skills/` (개인). 열린 Agent Skills 표준을 따른다.
- **Codex**: `.agents/skills/<name>/SKILL.md`. (`.codex/skills`가 아니다 — `config.toml`은 skill을 켜고 끄는 토글만 한다.) `SKILL.md`에는 `name`과 `description`이 필수다.

두 도구 모두 모델이 description을 보고 skill을 **암시적으로 고른다**. 그래서 description이 부실하면 skill이 있어도 안 불린다.

나쁜 예:

```yaml
description: Review helper
```

좋은 예:

```yaml
description: Use when reviewing code changes for security, race conditions,
  data loss, missing tests, and production regressions in backend services.
```

트리거가 되는 단어를 앞에 두고, 언제 써야 하는지와 **언제 쓰면 안 되는지**까지 적어 주는 게 요령이다. Codex든 Claude Code든 똑같이 통한다.

## Subagent와 병렬 작업

Claude Code 하네스에서는 역할별 에이전트 파일을 많이 만든다.

```text
.claude/agents/security-reviewer.md
.claude/agents/test-writer.md
.claude/agents/backend-architect.md
```

프런트매터에 `name`, `description`, `tools`, `model`을 적어 두면 Claude가 description을 보고 **알아서** 알맞은 subagent에 일을 넘긴다. 각 subagent는 자기만의 독립 컨텍스트에서 돈다. (참고로 이 위임을 맡던 `Task` 툴은 v2.1.63부터 `Agent`로 이름이 바뀌었다. `Task`도 별칭으로 남아 있다.)

Codex도 subagent를 공식 지원한다. 최근 릴리스는 기본으로 켜져 있고, 내장 에이전트로 `default` / `worker` / `explorer`가 있다. 단 중요한 차이가 하나 있다. **Codex는 사용자가 대놓고 요청할 때만 subagent를 띄운다.** 자동 라우터처럼 알아서 흩뿌리지 않는다.

그래서 Codex에는 이렇게 분명히 요청하는 게 맞는다.

```text
이 PR을 parallel subagents로 리뷰해줘.
하나는 security risk, 하나는 test gap, 하나는 maintainability를 본다.
셋 다 끝나면 findings를 severity 순으로 합쳐줘.
```

커스텀 에이전트는 `~/.codex/agents/`나 `.codex/agents/`에 TOML 한 파일당 하나로 둔다(`name`, `description`, `developer_instructions` 필수). 동시 실행 수는 `[agents]`의 `max_threads`(기본 6), 깊이는 `max_depth`(기본 1)로 잡는다.

두 도구에 두루 통하는 원칙이 하나 있다. **읽기·분석은 병렬로 돌려도 좋지만, 같은 파일을 여러 에이전트가 동시에 건드리는 write-heavy 작업은 충돌나기 쉽다.** "분석은 병렬, 최종 수정은 메인 에이전트가 통합"이 안전하다.

## Hook과 자동 검증

Claude Code 하네스는 hook으로 도구 실행 전후 검증, 명령 차단, 로그 기록, 세션 시작/종료 처리를 많이 붙인다. 이벤트도 꽤 많다. `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `Stop`, `SubagentStop`, `SessionStart`, `SessionEnd`, `PreCompact` 같은 익숙한 것 외에 `PostToolUseFailure`, `PermissionRequest`, `PostCompact`, `FileChanged` 등으로 계속 늘었다. `settings.json`에 설정하고, exit code 2면 차단 신호로 받아들인다.

Codex도 hook을 기본으로 켜서 제공한다. 이벤트는 `PreToolUse`, `PermissionRequest`, `PostToolUse`, `PreCompact`, `PostCompact`, `UserPromptSubmit`, `SessionStart`, `SubagentStart`, `SubagentStop`, `Stop` 등으로 Claude Code와 거의 같은 스키마다. `~/.codex/hooks.json`이나 `config.toml`의 `[hooks]`에 정의하고, 지금은 `command` 타입 핸들러만 실제로 돈다.

다만 Codex에서는 샌드박스와 승인 정책이 이미 강한 경계 노릇을 하니, hook은 "그 위에 얹는 추가 정책·자동 검증"으로 보는 게 맞다. hook에 너무 많은 지능을 욱여넣으면 하네스가 금세 복잡해진다. 기준은 이렇게 잡는 게 좋다.

| 내용 | 위치 |
|---|---|
| 사람이 읽고 따라야 할 규칙 | `AGENTS.md` |
| 반복 절차 | skill |
| 기계적으로 막아야 할 동작 | hook |
| 외부 도구 연결 | MCP |
| 기본 권한·모델 설정 | `.codex/config.toml` |

## MCP 연결 방식

MCP로 외부 도구(GitHub, Linear, Notion, Figma, DB, 내부 문서 등)를 붙이는 건 둘 다 된다. 차이는 설정 방식이다.

Claude Code는 `claude mcp add`로 추가하고, 프로젝트 공유 서버는 `.mcp.json`에, 로컬/사용자 서버는 `~/.claude.json`에 저장한다. 전송 방식은 stdio·http·sse(deprecated)·ws를 받는다.

```bash
# stdio
claude mcp add context7 -- npx -y @upstash/context7-mcp
# http
claude mcp add --transport http figma https://mcp.figma.com/mcp
```

Codex는 `codex mcp add`로 추가하거나 `config.toml`의 `[mcp_servers.*]`에 직접 적는다.

```toml
[mcp_servers.context7]
command = "npx"
args = ["-y", "@upstash/context7-mcp"]

[mcp_servers.figma]
url = "https://mcp.figma.com/mcp"
bearer_token_env_var = "FIGMA_OAUTH_TOKEN"
```

어느 쪽이든 MCP는 권한·신뢰 모델 안에서 봐야 한다. 외부 데이터 접근, side effect가 있는 호출, destructive action은 승인과 정책 설계의 대상이다.

## 플러그인: 묶음 배포

둘 다 여러 확장 요소를 하나로 묶어 배포하는 plugin 시스템을 갖췄다. 다만 **묶는 범위가 다르다.**

- **Claude Code**: skill·agent·hook·MCP 서버·LSP 서버·기본 settings까지 폭넓게 묶는다. 마켓플레이스(`claude plugin marketplace add`)와 공식/커뮤니티 마켓플레이스가 있다.
- **Codex**: skill·app(GitHub·Slack 같은 커넥터)·MCP 서버를 묶는다. 공식 문서 기준으로 hook이나 subagent를 plugin으로 배포한다고 보긴 어렵다.

그래서 "Claude Code 플러그인 = Codex 플러그인"이라며 1:1로 옮기려 들면 어긋난다. Codex에서는 hook·subagent를 plugin 밖에서 따로 챙겨야 한다.

## 코드 리뷰 관점의 차이

Claude Code에서 리뷰는 대화로 흘러가기 쉽다.

```text
이 diff 리뷰해줘. 심각한 버그 위주로.
```

이후 "그럼 고쳐줘", "테스트도 추가해줘"로 자연스럽게 이어진다.

Codex에는 `/review`라는 리뷰 전용 명령이 있고(설정으로 `review_model`을 따로 지정하기도 한다), 결과를 파일·라인 기준으로 정리하는 방식과 궁합이 좋다. 맡길 때 기준을 못 박아 주면 품질이 올라간다.

```text
Review this branch against main.
Focus on P0/P1 only:
- data loss
- auth bypass
- race conditions
- missing migration safety
- test gaps that hide real regressions
Do not comment on style unless it changes behavior.
```

Codex는 "심각도·파일 위치·재현 가능성·수정 방향"을 요구할 때 리뷰가 날카로워진다. 이런 포맷은 `AGENTS.md`나 review skill에 박아 두면 된다.

## 테스트와 완료 조건

Codex에서 거듭 강조할 대목이 완료 조건이다. Claude Code에서도 테스트는 중요하지만, Codex는 요청에 검증 기준을 박았을 때 확연히 더 안정적으로 움직인다.

좋은 완료 조건:

```text
Done when:
- 새로운 실패 재현 테스트가 추가된다.
- 수정 후 그 테스트가 통과한다.
- 기존 auth 테스트 스위트가 통과한다.
- public API 변경이 없음을 diff로 확인한다.
```

나쁜 완료 조건:

```text
잘 고쳐줘.
```

하네스가 Codex용이라면 사용자의 자연어 요청을 내부에서 이 틀로 바꿔 주는 것만으로도 결과가 꽤 달라진다.

```text
Goal:
Context:
Constraints:
Verification:
Output format:
```

## Claude Code 하네스를 Codex로 옮기는 대응표

이미 Claude Code용 하네스가 있다면 대략 이렇게 옮긴다.

| Claude Code 구성 | Codex에서의 대응 |
|---|---|
| `CLAUDE.md` | `AGENTS.md` / `AGENTS.override.md` |
| `.claude/commands/*.md` | skill, custom prompt, 내장 slash command |
| `.claude/agents/*.md` | `.codex/agents/*.toml`, skill, `AGENTS.md` 규칙으로 분해 |
| `.claude/skills/*/SKILL.md` | `.agents/skills/*/SKILL.md` |
| hook (settings.json) | Codex hook (`hooks.json` / `[hooks]`) |
| MCP (`.mcp.json`) | `.codex/config.toml`의 `[mcp_servers.*]` |
| 권한 규칙(allow/deny) | `sandbox_mode` + `approval_policy` + `writable_roots` |
| 세션 resume/compact | thread, `/resume`, `/goal`, `/compact` |
| 리뷰 명령 | `/review` + review skill |

여기서 핵심은 1:1 복사가 아니라 **재분류**다. Claude Code의 command 하나가 Codex에서는 네 갈래로 갈라지곤 한다.

```text
항상 지켜야 할 원칙   → AGENTS.md
반복 절차            → skill
자동 차단/검사        → hook
도구·권한 설정        → config.toml / MCP
```

## 그래서 뭐가 더 좋은가

한쪽이 늘 낫다고 말하긴 어렵다. 작업 스타일 자체가 다른 도구다.

**Claude Code가 잘 맞는 경우**

- 터미널에서 계속 대화하며 일하고 싶다.
- 큰 문제를 던지고 진행 중에 방향을 계속 틀고 싶다.
- command·skill·역할별 agent 중심으로 하네스를 짜고 싶다.
- 한 세션을 페어 프로그래밍처럼 끌고 가는 감각이 중요하다.

**Codex가 잘 맞는 경우**

- 작업 단위와 완료 조건을 또렷이 관리하고 싶다.
- 샌드박스와 승인 경계를 중요하게 본다.
- 레포별 `AGENTS.md`와 config로 팀 규칙을 고정하고 싶다.
- skill·plugin으로 반복 워크플로를 재사용하고 싶다.
- review·goal·thread resume 같은 구조적 기능을 적극 쓰고 싶다.
- 여러 환경에서 같은 설정을 그대로 재현하고 싶다.

## Codex를 Claude Code처럼 쓰면 생기는 일

Claude Code에 익숙한 사람이 Codex를 처음 만질 때 자주 밟는 지뢰들이다.

**첫째, 요청이 너무 넓다.** "전체적으로 봐서 개선해줘" 같은 요청은 Codex도 분석은 하지만 탐색 로그와 중간 판단만 잔뜩 쌓이고 완료 기준이 흐려진다.

**둘째, 권한 경계를 잊는다.** "필요한 거 설치하고 브라우저 띄워서 확인해줘" — Codex에서는 네트워크·패키지 설치·GUI·작업공간 밖 쓰기가 샌드박스나 승인에 걸린다. 하네스가 이걸 미리 풀어 줘야 한다.

**셋째, command를 너무 많이 만든다.** slash command 습관을 그대로 들고 오면 skill·hook·config로 나눠 얻는 이점을 놓친다.

**넷째, subagent를 자동 라우터로 기대한다.** Codex에서는 병렬 작업을 명시하고 각 에이전트의 범위와 반환 형식을 정해 줘야 한다.

## Codex용 하네스 설계 원칙

Claude Code 하네스를 Codex용으로 다시 짠다면 이 정도 원칙이 두루 통한다.

1. 자연어 요청을 `Goal / Context / Constraints / Done when`으로 구조화한다.
2. 모든 저장소에 짧고 정확한 `AGENTS.md`를 둔다 — 레포 구조, build/test/lint 명령, 코딩 컨벤션, 리뷰 기대치, do-not 규칙, 검증 기준.
3. 반복 절차는 `.agents/skills/*/SKILL.md`로 만든다.
4. 권한·도구 설정은 `.codex/config.toml`에 모은다 — 모델, reasoning effort, `sandbox_mode`, `approval_policy`, MCP 서버, writable roots.
5. 자동 검사는 hook이나 rule로 제한한다.
6. 큰 분석은 subagent로 쪼개되 최종 수정은 한 에이전트가 통합한다.
7. 완료 조건에 테스트와 리뷰를 반드시 포함한다.

## 예시: 같은 요청, 다른 두 입력

원래 요청은 한 줄이다.

```text
CI 깨지는 거 고쳐줘.
```

Claude Code에 자연스러운 버전:

```text
CI 실패 로그 보고 원인 찾아서 고쳐줘.
필요하면 관련 테스트를 로컬에서 돌리고, 수정 후 뭐가 문제였는지 요약해줘.
```

Codex에 더 맞는 버전:

```text
Goal: 현재 CI 실패를 재현하고 원인을 수정한다.

Context:
- 실패 job 로그는 아래에 붙인다.
- package manager는 pnpm이다.
- 관련 코드는 packages/api와 packages/shared에 있을 가능성이 높다.

Constraints:
- lockfile은 dependency 변경이 필요할 때만 수정한다.
- 무관한 formatting 변경은 하지 않는다.
- 실패 원인이 flaky test라면, 제품 코드 수정과 test 안정화 중 어느 쪽인지 먼저 설명한다.

Done when:
- 실패 테스트를 로컬에서 재현하거나, 재현 불가 사유를 명확히 설명한다.
- 최소 변경으로 수정한다.
- 관련 테스트가 통과한다.
- diff를 리뷰해 부작용 가능성을 요약한다.
```

같은 일이지만 Codex는 뒤쪽 입력을 받았을 때 탐색·수정·검증을 훨씬 안정적으로 끌고 간다.

## 정리

Claude Code와 Codex는 둘 다 강력한 코딩 에이전트지만, **잘 쓰는 법이 다르다.**

Claude Code는 대화형 페어링에 강하다. 큰 문제를 던지고 터미널 세션 안에서 계속 조율하며, command·skill·agent로 흐름을 짜는 방식이 잘 맞는다.

Codex는 구조화된 작업 실행에 강하다. goal·context·constraints·done when을 또렷이 주고, `AGENTS.md`·`.codex/config.toml`·skill·plugin·hook·MCP·subagent를 역할별로 배치할 때 효율이 산다.

그래서 Claude Code 하네스를 Codex로 옮길 때 던질 질문은 "어떤 파일을 어디로 복사하지?"가 아니다. 진짜 질문은 따로 있다.

```text
이건 지침인가?
반복 절차인가?
권한·도구 설정인가?
자동 검증인가?
병렬 분석 역할인가?
완료 조건인가?
```

이 질문에 따라 각각 `AGENTS.md` / skill / `config.toml` / hook / subagent / done criteria로 나누면 Codex에 맞는 하네스가 된다. Codex는 Claude Code의 복제품으로 쓰기보다, **작업 명세와 실행 경계를 분명히 하는 별도의 런타임**으로 다룰 때 제 실력을 낸다.

---

## 참고 자료

두 제품 모두 빠르게 바뀌므로, 세부 동작은 항상 공식 문서를 함께 확인하는 것을 권한다.

**OpenAI Codex**
- AGENTS.md 가이드 — https://developers.openai.com/codex/guides/agents-md
- Config 레퍼런스 — https://developers.openai.com/codex/config-reference
- Sandbox & approvals — https://developers.openai.com/codex/sandbox
- 핵심 개념(thread·goal·compaction) — https://developers.openai.com/codex/concepts
- Skills — https://developers.openai.com/codex/skills
- Subagents — https://developers.openai.com/codex/subagents
- Hooks — https://developers.openai.com/codex/hooks
- MCP — https://developers.openai.com/codex/mcp
- Plugins — https://developers.openai.com/codex/plugins

**Anthropic Claude Code** (`docs.claude.com`은 `code.claude.com`으로 리다이렉트된다)
- Memory(CLAUDE.md) — https://code.claude.com/docs/en/memory
- Settings — https://code.claude.com/docs/en/settings
- Permissions / permission modes — https://code.claude.com/docs/en/permissions
- Sandboxing — https://code.claude.com/docs/en/sandboxing
- Skills — https://code.claude.com/docs/en/skills
- Subagents — https://code.claude.com/docs/en/sub-agents
- Hooks — https://code.claude.com/docs/en/hooks
- MCP — https://code.claude.com/docs/en/mcp
- Plugins — https://code.claude.com/docs/en/plugins
