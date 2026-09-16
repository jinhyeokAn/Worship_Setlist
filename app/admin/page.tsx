"use client";

import { useState } from "react";
import { submitSetlist } from "./actions";
import type { Setlist } from "@/data/setlists";

type SongDraft = { title: string; url: string };

function emptySong(): SongDraft {
  return { title: "", url: "" };
}

/** 고른 날짜가 속한 주(일~토)의 일요일 날짜를 YYYY-MM-DD로 반환합니다. */
function toSunday(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() - date.getDay());
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function AdminPage() {
  const [adminId, setAdminId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [verseReference, setVerseReference] = useState("");
  const [verseText, setVerseText] = useState("");
  const [verseLink, setVerseLink] = useState("");
  const [songs, setSongs] = useState<SongDraft[]>([emptySong()]);
  const [status, setStatus] = useState<
    { type: "idle" } | { type: "submitting" } | { type: "error"; message: string } | { type: "success" }
  >({ type: "idle" });

  function updateSong(i: number, patch: Partial<SongDraft>) {
    setSongs((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }

  function addSong() {
    setSongs((prev) => [...prev, emptySong()]);
  }

  function removeSong(i: number) {
    setSongs((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));
  }

  function resetForm() {
    setTitle("");
    setDate("");
    setVerseReference("");
    setVerseText("");
    setVerseLink("");
    setSongs([emptySong()]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ type: "submitting" });

    const setlist: Setlist = {
      id: date,
      title,
      date,
      songs: songs.map((s) => ({ title: s.title.trim(), url: s.url.trim() })),
      ...(verseReference.trim() || verseText.trim()
        ? {
            verse: {
              reference: verseReference.trim(),
              text: verseText.trim(),
              ...(verseLink.trim() ? { link: verseLink.trim() } : {}),
            },
          }
        : {}),
    };

    const result = await submitSetlist({ adminId, adminPassword, setlist });
    if (result.ok) {
      setStatus({ type: "success" });
      resetForm();
    } else {
      setStatus({ type: "error", message: result.error });
    }
  }

  const inputClass =
    "w-full border-b border-[var(--rule)] bg-transparent py-2 text-sm outline-none placeholder:text-[var(--parchment-faint)] focus:border-[var(--accent)]";

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <h1 className="font-display text-2xl font-bold tracking-tight">관리자 · 콘티 등록</h1>
      <p className="mt-1 text-sm text-[var(--parchment-dim)]">
        등록하면 GitHub에 바로 커밋되고, 잠시 후 사이트에 반영됩니다.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">
            관리자 확인
          </h2>
          <input
            className={inputClass}
            placeholder="아이디"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            required
          />
          <input
            className={inputClass}
            placeholder="비밀번호"
            type="password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            required
          />
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--parchment-dim)]">
            콘티 정보
          </h2>
          <input
            className={inputClass}
            placeholder="콘티 제목 (예: 9월 셋째주 예배)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div>
            <input
              className={inputClass}
              type="date"
              value={date}
              onChange={(e) => {
                if (e.target.value) setDate(toSunday(e.target.value));
              }}
              required
            />
            <p className="mt-1 text-xs text-[var(--parchment-faint)]">
              어떤 날짜를 골라도 그 주 일요일로 자동 보정됩니다.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--parchment-dim)]">
            말씀 (선택)
          </h2>
          <input
            className={inputClass}
            placeholder="본문 위치 (예: 시편 51:10)"
            value={verseReference}
            onChange={(e) => setVerseReference(e.target.value)}
          />
          <textarea
            className={`${inputClass} resize-none`}
            placeholder="본문 내용"
            rows={3}
            value={verseText}
            onChange={(e) => setVerseText(e.target.value)}
          />
          <input
            className={inputClass}
            placeholder="전체 본문 링크 (선택)"
            value={verseLink}
            onChange={(e) => setVerseLink(e.target.value)}
          />
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--parchment-dim)]">
            곡 목록
          </h2>
          {songs.map((song, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className={inputClass}
                placeholder={`${i + 1}번째 곡 제목`}
                value={song.title}
                onChange={(e) => updateSong(i, { title: e.target.value })}
                required
              />
              <input
                className={inputClass}
                placeholder="유튜브 링크"
                value={song.url}
                onChange={(e) => updateSong(i, { url: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => removeSong(i)}
                aria-label="곡 삭제"
                className="shrink-0 px-2 text-[var(--parchment-faint)] hover:text-[var(--foreground)]"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSong}
            className="self-start border border-[var(--accent-soft)] px-3 py-1 text-xs text-[var(--accent)] transition hover:bg-[var(--accent)]/10"
          >
            + 곡 추가
          </button>
        </section>

        <button
          type="submit"
          disabled={status.type === "submitting"}
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:brightness-110 disabled:opacity-50"
        >
          {status.type === "submitting" ? "등록 중..." : "콘티 등록"}
        </button>

        {status.type === "error" && (
          <p className="border border-dashed border-[var(--rule)] p-3 text-sm text-[var(--accent)]">
            {status.message}
          </p>
        )}
        {status.type === "success" && (
          <p className="border border-dashed border-[var(--rule)] p-3 text-sm text-[var(--parchment-dim)]">
            등록됐습니다. 배포가 끝나면 사이트에 반영됩니다.
          </p>
        )}
      </form>
    </div>
  );
}
