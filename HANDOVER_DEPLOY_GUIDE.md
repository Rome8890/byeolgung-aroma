# 🌸 별궁시아 아로마타로 — GitHub & Vercel 원클릭 배포 가이드

> **이 문서는 누구나 3분 만에 전 세계에 별궁시아 서비스를 라이브로 띄우고 운영할 수 있도록 정리한 가이드입니다.**

---

## 🧭 1. 초보자도 1분 만에 이해하는 웹 서비스 3총사

| 구분 | 비유 | 이 프로젝트에서의 역할 | 어떻게 관리하나요? |
| :--- | :--- | :--- | :--- |
| **프론트엔드** | **가게 인테리어 & 손님용 메뉴판** | `index.html`, `success.html`, 카드 일러스트 | 화면의 글자나 디자인을 바꾸고 싶을 때 수정. GitHub에 올리면 10초 만에 전 세계 자동 반영 |
| **백엔드** | **카운터 금고 & 뒤에서 일하는 지배인** | `api/confirm.js` (서버리스 함수) | 손님이 결제 버튼을 누르면 토스 카드사에 진짜 9,900원 결제인지 확인하고 승인 도장 쾅 찍어줌 (서버 비용 0원) |
| **사이트 도메인** | **가게 간판 & 네비게이션 주소** | `https://별궁시아.vercel.app` | Vercel이 평생 무료 주소를 즉시 발급해 줌. 나중에 개인 도메인(`byeolgung.com`) 연결도 클릭 한 번으로 가능 |

---

## 🚀 2. GitHub에 코드 올리기 (딱 1회만 실행)

1. [GitHub 웹사이트](https://github.com)에 로그인합니다.
2. 우측 상단 **[+]** 버튼 ➡️ **[New repository]** 클릭
3. 저장소 이름 입력: `byeolgung-aroma` (Private 또는 Public 선택) ➡️ **[Create repository]** 클릭
4. 터미널(VS Code 또는 콘솔)에서 아래 3줄만 복사해서 실행하면 끝!
   ```bash
   git remote add origin https://github.com/내아이디/byeolgung-aroma.git
   git branch -M main
   git push -u origin main
   ```

---

## ⚡ 3. Vercel 무료 클라우드에 연결 (1분 컷)

1. [Vercel](https://vercel.com)에 접속 후 **[Sign in with GitHub]**로 로그인합니다.
2. 대시보드에서 **[Add New...]** ➡️ **[Project]** 클릭
3. 방금 올린 `byeolgung-aroma` 리포지토리 옆의 **[Import]** 버튼 클릭
4. **[Environment Variables]**(환경변수) 펼치기 ➡️ 아래 값 등록 (선택/추후 가능):
   - `TOSS_SECRET_KEY`: `test_sk_zXLkKEypNArWmo50nX3VQmNoyrQm` (기본 탑재되어 있어 비워두셔도 작동합니다)
5. **[Deploy]** 파란색 버튼 클릭!
6. 🎉 **30초 뒤 즉시 라이브 URL 생성 완료!** (예: `https://byeolgung-aroma.vercel.app`)

---

## 💳 4. 토스페이먼츠 실제 결제 오픈 방법 (PG 심사)

1. **현재 상태**: 누구나 카드/간편결제를 눌러 테스트 결제를 해볼 수 있는 **100% 작동 상태**입니다.
2. **실제 돈을 정산받으려면**:
   - [토스페이먼츠 비즈니스](https://www.tosspayments.com)에 가입 후 사업자 등록증으로 비대면 가맹점 신청
   - 웹사이트 URL에 Vercel에서 발급받은 라이브 URL 제출 (하단 푸터에 필수 사업자 정보가 이미 갖춰져 있어 100% 원패스 승인!)
   - 3~5일 후 승인되면 발급받은 **Live Secret Key**를 Vercel 환경변수(`TOSS_SECRET_KEY`)에 넣고, `index.html`의 `TOSS_CLIENT_KEY`를 라이브 키로 바꾸면 즉시 실제 카드 결제가 동작합니다.
