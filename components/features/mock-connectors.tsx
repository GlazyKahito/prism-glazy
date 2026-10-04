"use client";

import { Chat, Code, Doc, Folder, Mail, Sheet, Ticket } from "@/components/icons";
import { PrismMark } from "@/components/logo";
import { useLive } from "./use-live";

const inner = [Doc, Chat, Ticket];
const outer = [Folder, Mail, Code, Sheet];

function Orbit({
  icons,
  radius,
  reverse = false,
}: {
  icons: typeof inner;
  radius: number;
  reverse?: boolean;
}) {
  return (
    <div
      className={`absolute inset-0 m-auto rounded-full border border-dashed border-white/[0.09] ${reverse ? "animate-orbit-reverse" : "animate-orbit"}`}
      style={{ width: radius * 2, height: radius * 2 }}
    >
      {icons.map((Icon, i) => {
        const angle = (i / icons.length) * Math.PI * 2 + (reverse ? 0.6 : 0);
        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: Math.round(radius + Math.cos(angle) * radius),
              top: Math.round(radius + Math.sin(angle) * radius),
            }}
          >
            <div className={`-translate-x-1/2 -translate-y-1/2 ${reverse ? "animate-orbit" : "animate-orbit-reverse"}`}>
              <div className="flex size-10 items-center justify-center rounded-xl border border-white/10 bg-ink-800 text-mist shadow-[0_8px_24px_-12px_rgba(0,0,0,0.9)]">
                <Icon className="size-[18px]" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ConnectorsMock() {
  const { ref, inView } = useLive();

  return (
    <div
      ref={ref}
      data-paused={!inView}
      className="relative flex h-full min-h-[270px] items-center justify-center overflow-hidden"
    >
      <p className="sr-only">
        Connects to wikis, documents, chat, ticketing, drives, email, code and spreadsheets.
      </p>
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(125,108,255,0.18),transparent_55%)]" />
      <div aria-hidden="true" className="relative size-[270px]">
        <Orbit icons={inner} radius={66} />
        <Orbit icons={outer} radius={118} reverse />
        <div className="absolute inset-0 m-auto flex size-16 items-center justify-center rounded-2xl border border-white/15 bg-ink-850 shadow-[0_0_60px_-10px_rgba(174,164,255,0.7)]">
          <PrismMark className="size-9" />
        </div>
      </div>
    </div>
  );
}
