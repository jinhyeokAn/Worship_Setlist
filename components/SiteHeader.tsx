import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-[var(--rule)] px-4 py-4">
      <div className="mx-auto flex w-full max-w-2xl items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--accent-soft)]">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="drop-shadow-[0_0_6px_rgba(224,152,63,0.55)] motion-safe:animate-[flicker_4.6s_ease-in-out_infinite]"
            >
              <path
                d="M12 2c1 3-3 4-3 8a3 3 0 0 0 6 0c0-1-.5-2-1-2.5.8.6 2 2 2 4.5a4 4 0 0 1-8 0c0-5 4-6.5 4-10z"
                fill="var(--accent)"
              />
            </svg>
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-base font-bold tracking-tight">
              청년부 콘티
            </span>
            <span className="font-signature text-base text-[var(--parchment-faint)]">
              J. J.
            </span>
          </span>
        </Link>
      </div>
    </header>
  );
}
