import Reveal from "@/components/Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={align === "center" ? "text-center" : ""}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-shallow">{eyebrow}</p>
      )}
      <h2 className="mt-3 font-display text-3xl leading-tight tracking-tight text-balance sm:text-5xl">
        {title}
      </h2>
    </Reveal>
  );
}
