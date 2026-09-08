# 프로젝트: 청년부 콘티 모음

찬양 콘티(예배 순서)에 쓰이는 유튜브 링크를 곡 제목 + 순서와 함께 모아보고,
이어서 자동 재생할 수 있게 하는 사이트. 한 명(담당자)이 콘티를 등록하고,
나머지는 조회/재생만 하는 구조 — 로그인, 멀티유저 편집, 백엔드/DB는 없다.

같은 개념으로 먼저 만든 중등부용 자매 프로젝트가 있다:
`jinhyeokAn/Worship_Setlist_M` (요셉피아 중등부). 이 저장소는 그 코드를
그대로 복사해서 시작한 것 — 컴포넌트 구조와 재생 로직은 동일하고, 브랜딩과
데이터만 청년부용으로 비워둔 상태다. 중등부 쪽에서 발견된 버그 수정(예:
전체화면 종료 감지 폴링)은 여기에도 수동으로 반영해야 한다 — 두 저장소는
코드를 공유하지 않는다.

## 스택

Next.js 16 (App Router) + TypeScript + Tailwind CSS v4. 데이터는 DB 없이
`data/setlists.ts` 안의 배열로 관리한다 (콘티 추가 = 이 파일 수정 + git push).

## 콘티(곡 목록) 추가하는 법

`data/setlists.ts`의 `setlists` 배열에 객체를 하나 추가한다. 형식과 예시는
`README.md` 참고. 추가 후 `npm run build && npm run lint`로 확인하고
커밋/푸시하면 끝.

## 배포

- GitHub: `jinhyeokAn/Worship_Setlist`. 기본 브랜치는 `main` (중등부 저장소와
  달리 처음부터 `main`에 바로 작업한다 — 이전 프로젝트에서 default/production
  브랜치가 어긋나서 고생한 적 있어서, 이번엔 그 문제 자체를 피한 구조).
- Vercel: 아직 연결 안 됨. 연결할 땐 vercel.com → New Project → 이 저장소
  import. Settings → Environments → Production의 Branch Tracking이 `main`인지
  확인할 것 (기본값이 맞겠지만, 예전에 한 번 어긋난 전례가 있으니 한 번은
  꼭 확인).
- 이 세션에 연결된 Vercel MCP 통합은 권한이 불안정해서(배포/프로젝트 조회
  간헐적으로 403/404) 신뢰하지 말 것. git push → Vercel GitHub 연동 자동
  배포 방식에 의존한다.

## 디자인

다크 테마 고정(라이트모드 없음). 포인트 컬러는 `app/globals.css`의
`--accent` — 중등부(라임그린)와 구분하려고 보라색(`#a855f7`)으로 임시
지정해둔 상태, 실제 로고/브랜딩 받으면 그에 맞게 바꿀 것. 헤더
(`components/SiteHeader.tsx`)는 지금 이모지+그라데이션 원 placeholder이고
실제 로고 이미지 받으면 `public/`에 넣고 교체하면 됨 (중등부 저장소의
`SiteHeader.tsx` 히스토리 참고).

멜론/스포티파이 같은 음원차트 앱 톤 — `components/SetlistPlayer.tsx`(재생
컨트롤: 셔플/이전/재생/다음/반복/볼륨, 전부 유튜브 IFrame API에 실제
연결됨), 홈 화면은 최근 콘티 캐러셀 + 차트 스타일 리스트(`app/page.tsx`).
검색창(홈)은 콘티 제목과 곡 제목 둘 다 매칭한다.

## 로컬 실행 / 검증

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # 커밋 전 항상 확인
npm run lint
```
