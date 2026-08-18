# Dearlog

캐릭터나 창작용 SNS 화면을 만들 수 있는 정적 웹사이트입니다.

## 기능
- 이름 / 아이디 / 소개글 / 게시물 직접 수정
- 프로필 이미지 교체
- 게시물 이미지 업로드
- 게시물 추가 / 삭제
- 배경색 / 카드색 / 강조색 변경
- 다크 모드
- 완성 화면 PNG 저장
- 모바일 대응

## GitHub Pages 배포
1. GitHub에서 새 저장소를 만듭니다. 예: `dearlog`
2. 이 폴더 안의 `index.html`, `style.css`, `script.js`를 저장소 최상단에 업로드합니다.
3. 저장소의 **Settings → Pages**로 이동합니다.
4. **Build and deployment → Source**를 `Deploy from a branch`로 설정합니다.
5. Branch를 `main`, 폴더를 `/(root)`로 선택한 뒤 Save 합니다.
6. 잠시 후 `https://아이디.github.io/dearlog/` 형태의 주소로 접속할 수 있습니다.

## 참고
PNG 저장에는 CDN의 html2canvas를 사용합니다.
