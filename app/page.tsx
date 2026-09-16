"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { setlists } from "@/data/setlists";
import { getYoutubeThumbnail, getYoutubeVideoId } from "@/lib/youtube";

const DECKLE_EDGE =
  "polygon(0% 2%,4% 0%,10% 2.5%,16% 0%,22% 2%,28% 0%,34% 2.5%,40% 0%,46% 2%,52% 0%,58% 2.5%,64% 0%,70% 2%,76% 0%,82% 2.5%,88% 0%,94% 2%,100% 0%,100% 98%,96% 100%,90% 97.5%,84% 100%,78% 98%,72% 100%,66% 97.5%,60% 100%,54% 98%,48% 100%,42% 97.5%,36% 100%,30% 98%,24% 100%,18% 97.5%,12% 100%,6% 98%,0% 100%)";

const ALL_MONTHS = "all";

function coverFor(songs: { url: string }[]): string | null {
  for (const song of songs) {
    const id = getYoutubeVideoId(song.url);
    if (id) return getYoutubeThumbnail(id);
  }
  return null;
}

function monthKey(dateStr: string): string {
  return dateStr.slice(0, 7); // "YYYY-MM"
}

function monthLabel(dateStr: string): string {
  const [y, m] = dateStr.split("-");
  return `${y}년 ${Number(m)}월`;
}

export default function Home() {
  const [query, setQuery] = useState("");

  const sorted = useMemo(
    () => [...setlists].sort((a, b) => b.date.localeCompare(a.date)),
    [],
  );
  const recent = sorted.slice(0, 3);

  // 날짜 내림차순으로 이미 정렬돼 있으므로, 등장 순서 그대로 중복만 제거하면 최신순 월 목록이 됨.
  const monthOptions = useMemo(() => {
    const seen = new Set<string>();
    const keys: string[] = [];
    for (const s of sorted) {
      const key = monthKey(s.date);
      if (!seen.has(key)) {
        seen.add(key);
        keys.push(key);
      }
    }
    return keys;
  }, [sorted]);

  const [selectedMonth, setSelectedMonth] = useState(() => monthOptions[0] ?? ALL_MONTHS);

  const q = query.trim().toLowerCase();
  const filtered = sorted.filter(
    (s) =>
      !q ||
      s.title.toLowerCase().includes(q) ||
      s.songs.some((song) => song.title.toLowerCase().includes(q)),
  );
  // 검색 중일 땐 월 상관없이 전체에서 찾고, 검색이 없을 땐 고른 달만 보여줌.
  const displayed = q
    ? filtered
    : filtered.filter((s) => selectedMonth === ALL_MONTHS || monthKey(s.date) === selectedMonth);

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <header className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          찬양 콘티 라이브러리
        </h1>
        <p className="mt-1 text-sm text-[var(--parchment-dim)]">
          이번 주 예배를 위해 준비된 곡들을 확인하세요.
        </p>
        <div className="relative mt-4">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="콘티 검색"
            className="w-full border-b border-[var(--rule)] bg-transparent py-2 pr-7 text-sm outline-none placeholder:text-[var(--parchment-faint)] focus:border-[var(--accent)]"
          />
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[var(--parchment-faint)]"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
          </svg>
        </div>
      </header>

      {sorted.length === 0 ? (
        <p className="rounded-none border border-dashed border-[var(--rule)] p-8 text-center text-sm text-[var(--parchment-dim)]">
          아직 등록된 콘티가 없습니다.
          <br />
          <code className="text-xs text-[var(--accent)]">data/setlists.ts</code>에
          콘티를 추가해보세요.
        </p>
      ) : (
        <>
          {!query && recent.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    d="M4 20l7-14 7 14M7 14h8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                최근 콘티
              </h2>
              <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
                {recent.map((s, i) => {
                  const cover = coverFor(s.songs);
                  return (
                    <Link
                      key={s.id}
                      href={`/setlist/${s.id}`}
                      style={{ clipPath: DECKLE_EDGE, animationDelay: `${i * 90}ms` }}
                      className="group relative aspect-square w-40 shrink-0 overflow-hidden bg-[var(--ink-soft)] opacity-0 [animation:ink-in_0.55s_ease_forwards] [background-image:repeating-linear-gradient(to_bottom,rgba(236,226,206,0.05)_0_1px,transparent_1px_17px)]"
                    >
                      {cover && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cover}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover opacity-70 [filter:sepia(0.35)_contrast(1.05)_brightness(0.85)] transition group-hover:opacity-50"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/30 to-transparent" />
                      <span
                        className={`font-accent absolute left-2 top-2 rounded-full border px-2 py-0.5 text-[10px] italic ${
                          i === 0
                            ? "border-[var(--accent-soft)] bg-[var(--accent)]/10 text-[var(--accent)]"
                            : "border-[var(--parchment-faint)] text-[var(--parchment-dim)]"
                        }`}
                      >
                        {i === 0 ? "NEW RELEASE" : "PAST SERVICE"}
                      </span>
                      <div className="absolute inset-x-0 bottom-0 p-2.5">
                        <p className="font-display truncate text-sm font-bold">
                          {s.title}
                        </p>
                        <p className="text-[11px] text-[var(--parchment-dim)]">
                          {s.songs.length}곡
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--parchment-dim)]">
                전체 콘티 리스트
              </h2>
              {!q && (
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="border-b border-[var(--rule)] bg-transparent py-1 text-xs text-[var(--parchment-dim)] outline-none focus:border-[var(--accent)]"
                >
                  {monthOptions.map((key) => (
                    <option key={key} value={key}>
                      {monthLabel(`${key}-01`)}
                    </option>
                  ))}
                  <option value={ALL_MONTHS}>전체 보기</option>
                </select>
              )}
            </div>
            {displayed.length === 0 ? (
              <p className="border border-dashed border-[var(--rule)] p-6 text-center text-sm text-[var(--parchment-dim)]">
                {q ? "검색 결과가 없습니다." : "이 달엔 등록된 콘티가 없습니다."}
              </p>
            ) : (
              <ol className="flex flex-col gap-1">
                {displayed.map((s, i) => {
                  const cover = coverFor(s.songs);
                  const matchedSong = q
                    ? s.songs.find((song) => song.title.toLowerCase().includes(q))
                    : undefined;
                  const subtitleSong = matchedSong ?? s.songs[0];
                  return (
                    <li key={s.id}>
                      <Link
                        href={`/setlist/${s.id}`}
                        style={{ animationDelay: `${i * 55}ms` }}
                        className="flex items-center gap-3 border-b border-[var(--rule)] p-2 opacity-0 transition [animation:ink-in_0.5s_ease_forwards] hover:bg-[var(--accent)]/5"
                      >
                        <span className="font-accent w-7 shrink-0 text-center text-lg italic text-[var(--parchment-faint)]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {cover ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={cover}
                            alt=""
                            className="h-10 w-10 shrink-0 object-cover [filter:sepia(0.35)_contrast(1.05)_brightness(0.85)]"
                          />
                        ) : (
                          <span className="h-10 w-10 shrink-0 border border-[var(--rule)]" />
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="font-display block truncate text-sm font-bold">
                            {s.title}
                          </span>
                          <span className="block truncate text-xs text-[var(--parchment-dim)]">
                            {matchedSong && "♪ "}
                            {subtitleSong?.title}
                            {s.songs.length > 1 &&
                              ` 외 ${s.songs.length - 1}곡`}
                          </span>
                        </span>
                        <span className="shrink-0 text-xs text-[var(--parchment-faint)]">
                          {s.date}
                        </span>
                        <span className="shrink-0 border border-[var(--rule)] px-2 py-0.5 text-[11px] text-[var(--parchment-dim)]">
                          {s.songs.length} Songs
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>
        </>
      )}
    </div>
  );
}
