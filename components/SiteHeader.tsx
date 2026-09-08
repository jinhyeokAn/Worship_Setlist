import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-white/10 px-4 py-4">
      <div className="mx-auto flex w-full max-w-2xl items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-fuchsia-500 text-lg">
            🎵
          </span>
          <span className="text-base font-extrabold tracking-tight">
            청년부 콘티
          </span>
        </Link>
      </div>
    </header>
  );
}
