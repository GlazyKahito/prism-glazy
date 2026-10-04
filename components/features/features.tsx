import { Lock, Refresh, Search, Sparkle, Shield, Folder } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { BentoCard } from "./bento-card";
import { AskMock } from "./mock-ask";
import { CitedMock } from "./mock-cited";
import { ConnectorsMock } from "./mock-connectors";
import { PermissionsMock } from "./mock-permissions";
import { SyncMock } from "./mock-sync";
import { UnsureMock } from "./mock-unsure";

export function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="relative py-28 sm:py-36"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          id="features-title"
          eyebrow="What Prism does"
          title={
            <>
              One search box.{" "}
              <span className="text-spectrum">Every answer accounted for.</span>
            </>
          }
          lede="Prism sits on top of the tools your team already writes in. Ask the way you'd ask a colleague and get an answer you can check in one click."
        />

        <Reveal
          stagger={0.09}
          amount={0.08}
          className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mt-20 lg:grid-cols-6"
        >
          <BentoCard
            className="md:col-span-2 lg:col-span-4"
            layout="split"
            icon={<Search className="size-4" />}
            title="Ask in plain language"
            body="No keywords, filters or boolean tricks. Prism reads the question, finds the passages that answer it and writes a short reply in your team's words."
          >
            <AskMock />
          </BentoCard>

          <BentoCard
            className="lg:col-span-2 lg:row-span-2"
            icon={<Sparkle className="size-4" />}
            title="Every sentence, cited"
            body="Each claim links to the exact paragraph it came from, with when it was last edited. Hover a number to see the source."
          >
            <CitedMock />
          </BentoCard>

          <BentoCard
            className="lg:col-span-2"
            icon={<Lock className="size-4" />}
            title="Permissions built in"
            body="Prism mirrors the access rules of every source, so people only get answers from documents they could already open."
          >
            <PermissionsMock />
          </BentoCard>

          <BentoCard
            className="lg:col-span-2"
            icon={<Folder className="size-4" />}
            title="Connect everything"
            body="Wikis, drives, tickets, chat, email and code. Read-only connectors that take minutes to set up."
          >
            <ConnectorsMock />
          </BentoCard>

          <BentoCard
            className="lg:col-span-3"
            icon={<Refresh className="size-4" />}
            title="Always up to date"
            body="Edits are picked up within minutes and stale copies are retired, so the newest version of a policy wins."
          >
            <SyncMock />
          </BentoCard>

          <BentoCard
            className="md:col-span-2 lg:col-span-3"
            icon={<Shield className="size-4" />}
            title="Honest when it isn't sure"
            body="When the sources are thin or contradict each other, Prism says so and points you to the person who owns the answer."
          >
            <UnsureMock />
          </BentoCard>
        </Reveal>
      </div>
    </section>
  );
}
