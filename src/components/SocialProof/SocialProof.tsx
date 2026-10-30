import { formatNumber } from "@/lib/format";

// Social proof strip (docs/copy.md section 5). Mock numbers until the page has real ones:
// `isMock` stays true and the visible label stays (.claude/rules/copy.md).

const NBSP = " ";

const SOCIAL_PROOF = {
  isMock: true,
  label: "Ilustrační data – ukázka, jak bude sekce vypadat po spuštění.",
  stats: [
    { value: formatNumber(1240), caption: "lidí si průvodce stáhlo" },
    { value: `${formatNumber(4.7, 1)}${NBSP}/${NBSP}5`, caption: "průměrné hodnocení průvodce" },
  ],
} as const;

/** Thin strip with two big numbers and the "illustrative data" label. */
export function SocialProof() {
  const { isMock, label, stats } = SOCIAL_PROOF;

  return (
    <section className="page-container py-8 md:py-12">
      {/* Wide: the two numbers on the left, the mock label at the right end of the same strip. */}
      <div className="md:flex md:items-end md:justify-between md:gap-10 md:border-y-2 md:border-mist md:py-6">
        <dl className="grid grid-cols-2 gap-x-6 border-y-2 border-mist py-5 md:gap-x-20 md:border-0 md:py-0">
          {stats.map((stat) => (
            <div key={stat.caption} className="flex flex-col-reverse">
              <dt className="mt-1 text-sm leading-snug text-ink-muted">{stat.caption}</dt>
              <dd className="text-4xl leading-none font-extrabold tracking-tight md:text-5xl">{stat.value}</dd>
            </div>
          ))}
        </dl>
        {isMock && <p className="mt-3 text-xs text-ink-muted italic md:mt-0 md:max-w-xs">{label}</p>}
      </div>
    </section>
  );
}
