import Link from "next/link";
import { notFound } from "next/navigation";
import { setlists } from "@/data/setlists";
import SetlistPlayer from "@/components/SetlistPlayer";

export default async function SetlistPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const setlist = setlists.find((s) => s.id === id);
  if (!setlist) notFound();

  const verseText = setlist.verse?.text.trim() ?? "";
  const dropcap = verseText.charAt(0);
  const verseRest = verseText.slice(1);

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <Link
        href="/"
        className="text-sm text-[var(--parchment-dim)] hover:text-[var(--foreground)]"
      >
        ← 전체 콘티
      </Link>
      <h1 className="font-display mt-2 text-2xl font-bold tracking-tight">
        {setlist.title}
      </h1>
      <p className="text-sm text-[var(--parchment-dim)]">
        {setlist.date} · {setlist.songs.length}곡
      </p>

      {setlist.verse && (
        <blockquote className="relative mt-4 border-l border-[var(--accent-soft)] bg-[var(--accent)]/5 p-4 pl-14">
          <span className="font-display absolute left-3 top-2 text-4xl font-bold leading-none text-[var(--accent)]">
            {dropcap}
          </span>
          <p className="font-display whitespace-pre-line text-sm leading-relaxed text-[var(--foreground)]">
            {verseRest}
          </p>
          <cite className="font-accent mt-2 block text-xs italic text-[var(--parchment-faint)]">
            {setlist.verse.reference}
          </cite>
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
