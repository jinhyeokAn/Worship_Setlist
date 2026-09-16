"use client";

import { useState } from "react";
import { submitSetlist, verifyAdmin } from "./actions";
import type { Setlist } from "@/data/setlists";

type SongDraft = { title: string; url: string };

function emptySong(): SongDraft {
  return { title: "", url: "" };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** 주어진 연/월(月은 1~12)에서 일요일에 해당하는 날짜만 반환합니다. */
function sundaysInMonth(year: number, month: number): number[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const result: number[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    if (new Date(year, month - 1, day).getDay() === 0) result.push(day);
  }
  return result;
}

/** 다가오는(오늘이 일요일이면 오늘) 예배 날짜를 연/월/일로 반환합니다. */
function defaultServiceDate(): { year: number; month: number; day: number } {
  const today = new Date();
  today.setDate(today.getDate() + ((7 - today.getDay()) % 7));
  return { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
}

/** "9월 13일 예배" */
function titleFromParts(month: number, day: number): string {
  return `${month}월 ${day}일 예배`;
}

export default function AdminPage() {
  const [adminId, setAdminId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [loginStatus, setLoginStatus] = useState<
    { type: "idle" } | { type: "checking" } | { type: "error"; message: string }
  >({ type: "idle" });
  const [{ year, month, day }, setServiceDate] = useState(defaultServiceDate);
  const [verseReference, setVerseReference] = useState("");
  const [verseText, setVerseText] = useState("");
  const [verseLink, setVerseLink] = useState("");
  const [songs, setSongs] = useState<SongDraft[]>([emptySong()]);
  const [status, setStatus] = useState<
    { type: "idle" } | { type: "submitting" } | { type: "error"; message: string } | { type: "success" }
  >({ type: "idle" });

  const date = `${year}-${pad(month)}-${pad(day)}`;
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 1 + i);
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const dayOptions = sundaysInMonth(year, month);

  function changeYear(newYear: number) {
    const days = sundaysInMonth(newYear, month);
    setServiceDate({ year: newYear, month, day: days.includes(day) ? day : days[0] });
  }

  function changeMonth(newMonth: number) {
    const days = sundaysInMonth(year, newMonth);
    setServiceDate({ year, month: newMonth, day: days.includes(day) ? day : days[0] });
  }

  function changeDay(newDay: number) {
    setServiceDate({ year, month, day: newDay });
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginStatus({ type: "checking" });
    const result = await verifyAdmin(adminId, adminPassword);
    if (result.ok) {
      setIsAuthed(true);
      setLoginStatus({ type: "idle" });
    } else {
      setLoginStatus({ type: "error", message: result.error });
    }
  }

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
    setServiceDate(defaultServiceDate());
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
      title: titleFromParts(month, day),
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

  if (!isAuthed) {
    return (
      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
        <h1 className="font-display text-2xl font-bold tracking-tight">관리자 로그인</h1>
        <p className="mt-1 text-sm text-[var(--parchment-dim)]">
          콘티를 등록하려면 먼저 로그인하세요.
        </p>

        <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-4">
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
          <button
            type="submit"
            disabled={loginStatus.type === "checking"}
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:brightness-110 disabled:opacity-50"
          >
            {loginStatus.type === "checking" ? "확인 중..." : "로그인"}
          </button>
          {loginStatus.type === "error" && (
            <p className="border border-dashed border-[var(--rule)] p-3 text-sm text-[var(--accent)]">
              {loginStatus.message}
            </p>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <h1 className="font-display text-2xl font-bold tracking-tight">관리자 · 콘티 등록</h1>
      <p className="mt-1 text-sm text-[var(--parchment-dim)]">
        등록하면 GitHub에 바로 커밋되고, 잠시 후 사이트에 반영됩니다.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--parchment-dim)]">
            콘티 정보
          </h2>
          <div className="flex flex-col gap-1">
            <span className="text-sm text-[var(--parchment-dim)]">예배 날짜</span>
            <div className="flex gap-2">
              <select
                className={inputClass}
                value={year}
                onChange={(e) => changeYear(Number(e.target.value))}
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>
                    {y}년
                  </option>
                ))}
              </select>
              <select
                className={inputClass}
                value={month}
                onChange={(e) => changeMonth(Number(e.target.value))}
              >
                {monthOptions.map((m) => (
                  <option key={m} value={m}>
                    {m}월
                  </option>
                ))}
              </select>
              <select
                className={inputClass}
                value={day}
                onChange={(e) => changeDay(Number(e.target.value))}
              >
                {dayOptions.map((d) => (
                  <option key={d} value={d}>
                    {d}일
                  </option>
                ))}
              </select>
            </div>
            <span className="text-xs text-[var(--parchment-faint)]">
              일 선택지엔 그 달의 일요일만 나옵니다. 콘티 제목은 날짜에서
              자동으로 만들어집니다 (예: {titleFromParts(month, day)}).
            </span>
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
