import Reveal from "@/components/Reveal";

// Shared sub-page banner: deep gradient, display-face title, lede.
export default function PageHeader({ title, lede }: { title: string; lede: string }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-mid via-deep to-abyss pb-16 pt-36 sm:pb-20 sm:pt-44">
      <div
        aria-hidden="true"
        className="drift pointer-events-none absolute -top-24 left-1/2 h-72 w-[120%] -translate-x-1/2 rounded-[100%] bg-lagoon/25 blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <h1 className="font-display text-4xl leading-tight tracking-tight text-balance sm:text-6xl">
            {title}
          </h1>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-(--ink-muted) sm:text-xl">
            {lede}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
