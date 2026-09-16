"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

const TAPS_REQUIRED = 5;
const TAP_WINDOW_MS = 3000;

export default function SiteFooter() {
  const router = useRouter();
  const tapCountRef = useRef(0);
  const lastTapRef = useRef(0);

  function handleTap() {
    const now = Date.now();
    if (now - lastTapRef.current > TAP_WINDOW_MS) {
      tapCountRef.current = 0;
    }
    lastTapRef.current = now;
    tapCountRef.current += 1;

    if (tapCountRef.current >= TAPS_REQUIRED) {
      tapCountRef.current = 0;
      router.push("/admin");
    }
  }

  return (
    <footer className="mx-auto w-full max-w-2xl border-t border-[var(--rule)] px-4 pb-10 pt-6 text-right">
      <button
        type="button"
        onClick={handleTap}
        className="font-signature text-2xl text-[var(--parchment-faint)]"
      >
        Soli Deo Gloria
      </button>
    </footer>
  );
}
