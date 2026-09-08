export type Song = {
  /** 곡 제목 */
  title: string;
  /** 유튜브 링크 (watch, youtu.be, shorts 링크 모두 지원) */
  url: string;
};

export type Verse = {
  /** 성경 본문 위치, 예: "요한복음 3:16" */
  reference: string;
  /** 본문 내용 */
  text: string;
  /** 전체 본문을 볼 수 있는 외부 링크 (선택, 예: 대한성서공회 본문보기) */
  link?: string;
};

export type Setlist = {
  /** URL에 쓰이는 고유 id (영문/숫자/하이픈 권장) */
  id: string;
  /** 콘티 제목, 예: "9월 첫째주 예배" */
  title: string;
  /** 날짜, YYYY-MM-DD */
  date: string;
  /** 이번 예배 말씀 본문 (선택) */
  verse?: Verse;
  /** 순서대로 정리한 곡 목록 */
  songs: Song[];
};

// 새 콘티를 추가하려면 이 배열에 객체를 하나 더 넣고 git push 하면 됩니다.
// 자세한 방법은 README.md 참고.
export const setlists: Setlist[] = [
  {
    id: "2026-09-13",
    title: "9월 13일 예배",
    date: "2026-09-13",
    verse: {
      reference: "시편 51:10",
      text: "하나님이여 내 속에 정한 마음을 창조하시고\n내 안에 정직한 영을 새롭게 하소서",
      link: "https://www.bskorea.or.kr/bible/korbibReadpage.php?version=GAE&txtReadInfo=%EC%8B%9C%2051:1&rdoReadType=2&cVersion=&fontSize=15px",
    },
    songs: [
      {
        title: "말씀이 내 능력되어",
        url: "https://www.youtube.com/watch?v=MkDMVdFlTCQ&list=RDMkDMVdFlTCQ&start_radio=1",
      },
      {
        title: "성령이여 내 영혼을 / 불을 내려주소서",
        url: "https://youtu.be/oLZ_c4PHS6w?si=4cvjD2p1MZoND00b",
      },
      {
        title: "영광에서 영광으로",
        url: "https://youtu.be/q_h5fZP_JzU?si=5yk10UlYmasz6q1G",
      },
    ],
  },
];
