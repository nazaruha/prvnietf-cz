import type { Metadata } from "next";
import type { ReactNode } from "react";

// Privacy page, verbatim from docs/soukromi.md (values checked 30. 10. 2026).
// The consent checkbox in the form links here. Plain reading layout at prose width.

const TITLE = "Zásady ochrany osobních údajů";
const CONTACT = "fedunnazarii20122001@gmail.com";

export const metadata: Metadata = {
  title: TITLE,
  robots: { index: false, follow: false },
};

function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl leading-tight font-extrabold">{heading}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

const contact = (
  <a href={`mailto:${CONTACT}`} className="font-bold underline underline-offset-2">
    {CONTACT}
  </a>
);

export default function PrivacyPage() {
  return (
    // Page column like the landing page; the text itself stays at prose width.
    <main className="page-container flex-1 pt-10 pb-16 *:max-w-prose md:pt-20 lg:pb-24">
      <h1 className="text-4xl leading-[0.95] font-extrabold tracking-tight text-balance md:text-5xl">{TITLE}</h1>
      <p className="mt-4 text-sm text-ink-muted">Platné od 30. 10. 2026.</p>

      <Section heading="Kdo vaše údaje zpracovává">
        <p>
          Správcem je <strong>Nazarii Fedun</strong>, kontakt: {contact}. Web prvnietf.cz je demo projekt vytvořený pro
          výběrové řízení.
        </p>
      </Section>

      <Section heading="Jaké údaje a proč">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>E-mailová adresa</strong> z formuláře. Pošleme vám na ni průvodce „První 3 roky s ETF“ a, pokud jste
            souhlasili, občasné tipy k investování do ETF.
          </li>
          <li>
            Spolu s ní ukládáme čas odeslání, znění souhlasu, fond, který jste si prohlédli, a údaj, z jaké reklamy jste
            přišli (parametry <code>utm</code>). Pomáhá nám to zjistit, která reklama funguje.
          </li>
        </ul>
        <p>
          Právním základem je <strong>váš souhlas</strong> (čl. 6 odst. 1 písm. a GDPR). Souhlas můžete kdykoli odvolat.
        </p>
      </Section>

      <Section heading="Jak dlouho">
        <p>
          Do odvolání souhlasu, nejdéle <strong>2 roky</strong> od odeslání formuláře. Pak údaje smažeme.
        </p>
      </Section>

      <Section heading="Kdo s údaji pracuje (zpracovatelé)">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Vercel Inc.</strong>: hosting webu.
          </li>
          <li>
            <strong>Neon</strong>: databáze, ve které je uložen váš e-mail (Frankfurt, EU).
          </li>
          <li>
            <strong>Resend</strong>: odesílání e-mailů. Resend zpracovává data převážně v USA; předání probíhá na základě
            standardních smluvních doložek.
          </li>
        </ul>
      </Section>

      <Section heading="Analytika bez cookies">
        <p>
          Návštěvnost měříme nástrojem <strong>PostHog (servery v EU, Frankfurt)</strong> v režimu bez cookies. Do vašeho
          zařízení nic neukládáme, IP adresy se neukládají a váš e-mail se do analytiky nikdy neposílá. Vidíme jen
          anonymní souhrny, například kolik lidí odpovědělo na otázky nebo odeslalo formulář.
        </p>
      </Section>

      <Section heading="Vaše práva">
        <p>
          Máte právo na přístup k údajům, jejich opravu, výmaz, omezení zpracování, přenositelnost a právo vznést
          námitku. Stačí napsat na {contact}. Z e-mailů se odhlásíte <strong>odkazem v každém e-mailu</strong>.
        </p>
        <p>
          Pokud máte za to, že údaje zpracováváme v rozporu s předpisy, můžete podat stížnost u{" "}
          <strong>Úřadu pro ochranu osobních údajů</strong> (
          <a href="https://www.uoou.cz" rel="noopener" className="underline underline-offset-2">
            www.uoou.cz
          </a>
          ).
        </p>
      </Section>
    </main>
  );
}
