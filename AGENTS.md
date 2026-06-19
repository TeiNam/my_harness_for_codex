# Codex Harness Guidance

이 저장소는 Claude Code 하네스를 Codex식 표면으로 재구성하는 개인 하네스다. Codex가 실제로 읽는 작은 표면을 우선한다: `AGENTS.md`, `.agents/skills`, `.codex/config.toml`.

## Default Mode

- Ponytail을 기본값으로 둔다: 가장 단순하게 동작하는 해법, 표준 도구 우선, 새 추상화와 새 의존성은 증거가 있을 때만.
- 사용자가 명시적으로 더 큰 설계, 장문 설명, 별도 계획을 요구하면 그 요구를 따른다.
- 불필요한 하네스 기능은 만들지 않는다. Codex에서 직접 먹히지 않는 Claude용 `agents/`, `commands/`, 대형 hook 스택은 변환 근거가 생길 때만 추가한다.

## Work Loop

1. 먼저 저장소를 읽고 기존 패턴을 확인한다.
2. 작업을 `Goal`, `Context`, `Constraints`, `Done when`으로 좁혀 생각한다.
3. 실행 가능한 변경을 바로 한다. 긴 설계 제안만 남기고 멈추지 않는다.
4. 변경 뒤에는 가장 작은 검증 명령을 먼저 실행한다.
5. 마지막 답변은 변경 파일, 검증 결과, 남은 한계를 짧게 말한다.

## Programming Defaults

- public API, 데이터 스키마, 보안 경계, 사용자 데이터 손실 가능성은 보수적으로 다룬다.
- 테스트가 없으면 바뀐 동작을 깨뜨릴 최소 확인을 남긴다.
- 새 패키지는 마지막 선택지다. stdlib, 프로젝트 기존 도구, 셸 기본 명령을 먼저 쓴다.
- 생성 파일은 필요한 만큼만 만든다. 템플릿, 레지스트리, 설치기, CI는 실제로 사용할 때 추가한다.
- 사용자가 만든 변경은 되돌리지 않는다. 충돌하면 읽고 맞춰 간다.

## Review Guidelines

- 리뷰는 심각한 버그, 회귀, 보안/데이터 손실 위험, 빠진 검증을 먼저 지적한다.
- "취향"이나 대규모 리팩터링 제안은 실제 위험을 줄일 때만 말한다.
- over-engineering은 별도 요청이 없어도 짧게 줄인다: 지울 수 있는 코드, 표준 기능으로 대체 가능한 코드, 한 구현뿐인 추상화를 우선 찾는다.

## Harness Layout

- `.agents/skills/` - Codex가 발견하는 재사용 워크플로.
- `.codex/config.toml` - 프로젝트에서 참고할 Codex 설정 예시.
- `scripts/check.js` - 하네스 파일의 최소 구조 검증.
- `codex-vs-claude-code-harness.md` - Claude Code와 Codex 차이 배경 문서.
