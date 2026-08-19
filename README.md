# Dearlog v101

## 이번 업데이트
- 저장 실패 원인인 `Attempting to parse an unsupported color function "color"` 오류 수정
- 원인은 `html2canvas`가 CSS `color-mix()`의 브라우저 계산 결과인 `color(...)` 문법을 해석하지 못한 것이었음
- Dearlog CSS에 남아 있던 모든 `color-mix()` 사용 제거
- 카카오톡 배경 / 인용 트윗 카드 / X 메뉴 테두리 등의 색상을 호환 가능한 일반 CSS 색상으로 변경
- 저장 직전 복제 화면에서 `color()`, `oklch()`, `lab()`, `color-mix()` 등 지원하지 않는 색상 함수가 남아 있으면 안전한 색으로 치환하는 보호 로직 추가
- 저장 오류 메시지도 가능한 경우 한국어로 표시
