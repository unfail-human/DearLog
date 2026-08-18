# Dearlog v14 — 복구 버전

이번 버전은 v12/v13에서 발생한 전체 초기화 오류를 복구한 버전입니다.

## 복구 내용
- 깨졌던 `index.html` 사이드바/프로필 HTML 구조를 통째로 재작성
- X 초기 게시물 데이터에서 `state`를 초기화 전에 참조하던 치명적 런타임 오류 제거
- X / Instagram / DM / 카카오톡 템플릿 전환 복구
- 프로필 입력 / 이미지 업로드 / 배경 설정 / 콘텐츠 추가 / 미리보기 / PNG 저장 버튼 연결 복구
- Dearlog 로고 기호 선택 유지
- 자동 공지 유지
- v13의 베이지 OG 공유 이미지 유지
- 향후 오류 발생 시 완전 빈 화면 대신 간단한 오류 안내 표시

## 업로드
`index.html`, `style.css`, `script.js`, `notice.js`, `og-image.png`, `favicon.png`를 모두 교체하세요.
