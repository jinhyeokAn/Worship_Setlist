import Link from "next/link";
import { notFound } from "next/navigation";
import { setlists } from "@/data/setlists";
import SetlistPlayer from "@/components/SetlistPlayer";
import StaffLines from "@/components/StaffLines";

export default async function SetlistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const setlist = setlists.find((s) => s.id === id);
  if (!setlist) notFound();

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <Link
        href="/"
        className="text-sm text-[var(--parchment-dim)] hover:text-[var(--foreground)]"
      >
        ← 전체 콘티
      </Link>
      <div className="mt-3">
        <StaffLines />
      </div>
      <h1 className="font-display mt-2 text-2xl font-bold tracking-tight">
        {setlist.title}
      </h1>
      <p className="text-sm text-[var(--parchment-dim)]">
        {setlist.date} · {setlist.songs.length}곡
      </p>

      {setlist.verse && (
        <blockquote className="mt-4 border-l border-[var(--accent-soft)] bg-[var(--accent)]/5 p-4 pl-6">
          <p className="font-hand whitespace-pre-line text-xl leading-loose text-[var(--foreground)]">
            {setlist.verse.text}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <cite className="font-accent text-sm italic tracking-wide text-[var(--parchment-dim)]">
              — {setlist.verse.reference}
            </cite>
            {setlist.verse.link && (
              <a
                href={setlist.verse.link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-accent shrink-0 border border-[var(--accent-soft)] px-3 py-1 text-xs italic text-[var(--accent)] transition hover:bg-[var(--accent)]/10"
              >
                전체 본문 보기 ↗
              </a>
            )}
          </div>
        </blockquote>
      )}

      <div className="mt-6">
        <SetlistPlayer setlist={setlist} />
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return setlists.map((s) => ({ id: s.id }));
}
