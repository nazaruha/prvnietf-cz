// Explainer "Proč evropská verze?" (docs/copy.md section 7). Short, prose width.

const NBSP = " ";

const HEADING = "Proč evropská verze, a ne VT nebo VOO?";
const PARAGRAPHS = [
  "Evropské nařízení PRIIPs vyžaduje, aby fond nabízený drobným investorům měl sdělení klíčových informací (KID). Americké fondy ho nevydávají, a tak je většina brokerů v EU drobným investorům neprodá.",
  "Evropské verze (UCITS) sledují stejný nebo podobný index, KID mají a koupíte je u běžných brokerů na německé burze Xetra v eurech.",
  "Výjimky existují – někteří brokeři americké ETF nabízejí. Evropská verze je ale pro začátečníka jednodušší cesta, protože ji má většina brokerů.",
];
const SOURCE = `Nařízení (EU) č.${NBSP}1286/2014 (PRIIPs)`;

export function Explainer() {
  return (
    <section aria-labelledby="explainer" className="px-gutter py-12">
      <div className="max-w-prose">
        <h2 id="explainer" className="text-3xl leading-[1.05] font-extrabold tracking-tight text-balance">
          {HEADING}
        </h2>
        <div className="mt-5 space-y-4 leading-relaxed">
          {PARAGRAPHS.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <p className="mt-5 text-sm text-ink-muted">{SOURCE}</p>
      </div>
    </section>
  );
}
