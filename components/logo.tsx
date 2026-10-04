"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

export function PrismMark({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-7", className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-face`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#b8aeff" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={`${id}-sp`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff6b81" />
          <stop offset="0.35" stopColor="#ffdd6e" />
          <stop offset="0.65" stopColor="#5ad7ff" />
          <stop offset="1" stopColor="#b98cff" />
        </linearGradient>
      </defs>
      <path
        d="M16 4.2c.7 0 1.3.4 1.7 1l10 17.6c.8 1.3-.2 3-1.7 3H6c-1.5 0-2.5-1.7-1.7-3l10-17.6c.4-.6 1-1 1.7-1z"
        fill="none"
        stroke={`url(#${id}-face)`}
        strokeWidth="2"
      />
      <path d="M1 18.6 15 16.3" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity="0.9" />
      <path d="M17.5 16.2 31 12v9z" fill={`url(#${id}-sp)`} opacity="0.95" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <PrismMark />
      <span className="font-display text-[1.2rem] font-semibold tracking-[-0.02em] text-snow">
        Prism
      </span>
    </span>
  );
}
