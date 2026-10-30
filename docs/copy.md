# Page copy (Czech) — approved

Last checked 30. 10. 2026. `/soukromi` text: `docs/soukromi.md`. PDF guide: `public/prvni-3-roky-s-etf.pdf`. Not written yet: the unsubscribe confirmation page; ask before inventing it.

Formal *vy*. Decimal comma (0,14 %), non-breaking space before % and Kč, thousands separated by a space (100 000 Kč). Text in `[brackets]` is filled in by the page.

## Meta

- `<html lang="cs">`, exactly one `<h1>` (the hero headline)
- Title: **Které ETF koupit jako první? Srovnání pro investory z Česka**
- Description: Odpovězte na 2 otázky a uvidíte ETF, které se k vám hodí – s poplatky, daněmi a tím, co čekat po nákupu. Zdarma, bez registrace.
- Open Graph: same title and description; `og:image` 1200 × 630 in the page's look
- `noindex` on `/dekujeme`, `/soukromi`, `/admin`

## 1. Hero

**Variant A** (default; no parameter or `?v=a`; Ad A "Which ETF to start with")
- Label: 2 otázky · 20 vteřin · bez registrace
- Headline: **Které ETF si koupit jako první?**
- Subline: Odpovězte na 2 otázky a uvidíte fond, který se k vám hodí – i s poplatky a tím, jak ho koupit z Česka.

**Variant B** (`?v=b` only; Ad B "Koupeno. A co dál?")
- Label: 2 otázky · 20 vteřin · bez registrace
- Headline: **Koupeno. A co dál?** (repeats the ad headline word for word)
- Subline: Poklesy, dividendy, daně. Odpovězte na 2 otázky a uvidíte, co čekat u fondu, který se k vám hodí.

## 2. Picker

**Otázka 1 ze 2** — Jak dlouho chcete peníze nechat investované?
- Méně než 3 roky
- 3 roky a víc

**Otázka 2 ze 2** — Představte si, že vaše investice za rok klesne o 30 %. Co uděláte?
- Prodám, nechci přijít o víc
- Nechám to být a počkám
- Přikoupím, je to sleva

Small link under question 2: ← Zpět

## 3. Result cards

Shared header: **Lidé s podobnými odpověďmi obvykle volí:**

### 3+ roky + "Nechám to být" → Celý svět
- Title: **Celý svět v jednom fondu**
- Line: Známý americký fond **VT** → evropská verze, kterou koupíte u běžných brokerů: **VWCE**
- Full name: Vanguard FTSE All-World UCITS ETF (USD) Accumulating
- Roční poplatek (TER): **0,14 %** (VT: 0,06 %)
- Dividendy: automaticky se reinvestují
- Obsahuje: 3 821 firem, USA 62 %, Japonsko 6 %, Tchaj-wan 3,5 %
- Cena: [price] EUR (Xetra, [date])
- ISIN: IE00BK5BQT80
- Proč se hodí: Nečekáte rychlé peníze a pokles vás nerozhodí. Jeden fond, široké rozložení, nic dalšího neřešíte.
- Small note: Evropská verze je o něco dražší. Platíte za to, že ji jako drobný investor v EU běžně koupíte.

### 3+ roky + "Přikoupím" → S&P 500
- Title: **500 největších firem v USA**
- Line: Známý americký fond **VOO** → evropská verze: **VUAA**
- Full name: Vanguard S&P 500 UCITS ETF (USD) Accumulating
- Roční poplatek (TER): **0,07 %** (VOO: 0,03 %)
- Dividendy: automaticky se reinvestují
- Největší firmy: NVIDIA, Apple, Microsoft (the 3 largest holdings in `data/ucits-funds.json`, spelled as in the factsheet)
- Cena: [price] EUR (Xetra, [date])
- ISIN: IE00BFMXXD54
- Proč se hodí: Poklesy berete jako příležitost. Fond je soustředěnější než celý svět – víc USA, víc technologií, větší výkyvy.

### 3+ roky + "Prodám" → Klidnější mix
- Title: **Klidnější mix: 60 % akcie, 40 % dluhopisy**
- Line: Podobný americký fond **AOR** → evropský fond podobného typu: **V60A**
- Label: *podobný typ fondu, ne přesná obdoba*
- Full name: Vanguard LifeStrategy 60% Equity UCITS ETF (EUR) Accumulating
- Roční poplatek (TER): **0,25 %** (AOR: 0,15 % po dočasné slevě, bez ní 0,20 %)
- Dividendy: automaticky se reinvestují
- Složení: zhruba 60 % akciových a 40 % dluhopisových fondů Vanguard
- Cena: [price] EUR (Xetra, [date])
- ISIN: IE00BMVB5P51
- Proč se hodí: Pokles by vás lákal prodat. Dluhopisy výkyvy tlumí, takže je snazší vydržet.

### Méně než 3 roky → Zatím ne
- Title: **Na ETF je teď možná brzy**
- Text: Když peníze budete potřebovat do 3 let, pokles se nemusí stihnout vrátit. A při prodeji dřív než za 3 roky můžete platit daň ze zisku. Na krátkou dobu se obvykle hodí spořicí účet nebo termínovaný vklad.
- Lead-in to the form: Až budete připraveni, průvodce se vám bude hodit.

**Under every card (small text):** Ceny jsou závěrečné z předchozího obchodního dne. Údaje o fondech: factsheety Vanguard k [30. 9. 2026], iShares k [26. 10. 2026]. Nejde o investiční doporučení. (Dates from `asOf` in `data/`.)

## 4. Form

Next to the form: PDF cover image, title **První 3 roky s ETF**.

- Heading: **Co vás čeká v prvních 3 letech s [VWCE]?**
- Heading for "zatím ne": **Průvodce na dobu, kdy budete připraveni**
- Heading when the picker was skipped (e.g. via the second CTA; the form is open, `fund` is empty): **První 3 roky s ETF**
- Subline: Krátký průvodce v PDF. Hned si ho stáhnete a pošleme vám ho i e-mailem.
- What's inside:
  - Co čekat v prvních měsících po nákupu
  - Co dělat, když trh spadne – skutečné propady a jak dlouho trvalo, než se vrátily
  - Daně: kdy platíte a kdy ne (3 roky, 100 000 Kč)
  - Kdy dává smysl prodat
- Field label: **Váš e-mail** · placeholder: jmeno@email.cz
- Consent: Souhlasím se zpracováním e-mailu a se zasíláním průvodce a tipů k investování do ETF. Odhlásit se můžu kdykoli. [Zásady ochrany osobních údajů](/soukromi)
- Button: **Poslat mi průvodce**
- Under the button: Bez spamu. Odhlásit se můžete jedním kliknutím.

Errors:
- Bad email: Zkontrolujte prosím e-mail, něco v něm chybí.
- No consent: Bez souhlasu vám průvodce nemůžeme poslat.
- Server error: Něco se nepovedlo. Zkuste to prosím znovu za chvíli.

States:
- Sending (button label while the request runs): Posíláme…
- Success (shown briefly before the redirect to `/dekujeme`): Hotovo. Průvodce vám posíláme na e-mail.

## 5. Social proof strip (mock, `isMock: true`)

- **1 240** lidí si průvodce stáhlo
- **4,7 / 5** průměrné hodnocení průvodce
- Label: *Ilustrační data – ukázka, jak bude sekce vypadat po spuštění.*

## 6. Timeline: Co se stane po nákupu

- Heading: **Co se stane po nákupu**
- Subline: Pár věcí, které začátečníky překvapí – a co s nimi.

1. **První dny a týdny.** Hodnota se mění každý den. Výkyvy o pár procent jsou běžné a nic neznamenají. Nemusíte dělat nic.
2. **První větší pokles.** Přijde dřív nebo později. Takhle vypadaly ty největší za posledních 25 let:

   (Numbers: `data/crashes.json`, rendered by `src/data/crashes.ts`.)

   | Období | Pokles | Zpátky na původní úroveň |
   |---|---|---|
   | 2022 (inflace) | −24 % | prosinec 2023 |
   | 2020 (covid) | −19 % | červenec 2020 |
   | 2007–2009 (finanční krize) | −51 % | březen 2012 |
   | 2000–2002 (dot-com) | −45 % | listopad 2006 |

   Under the table: Všechny propady se zatím vrátily – některé za měsíce, jiné za roky. Minulé výnosy ale nezaručují budoucí. Počítáno z měsíčních závěrečných cen, během měsíce byly propady místy hlubší.
   Source line: SPY, měsíční závěrečné ceny v USD vč. dividend (Alpha Vantage).
3. **Dividendy.** U akumulačních fondů (Acc) se dividendy samy reinvestují. Do daňového přiznání je nepíšete.
4. **Po 3 letech.** Když fond držíte déle než 3 roky, zisk z prodeje je osvobozený od daně. Prodáte-li dřív, je osvobozený jen tehdy, když vaše prodeje za rok nepřesáhnou 100 000 Kč. Počítá se celá prodejní cena, ne zisk.
5. **Pravidelné investování.** Většina lidí si nastaví pravidelný nákup, třeba 1 000 Kč měsíčně, a pak to nechá běžet.

Link at the end: **Podrobně to máme v průvodci →** (scrolls to the form)

## 7. Explainer: Proč evropská verze?

- Heading: **Proč evropská verze, a ne VT nebo VOO?**
- Evropské nařízení PRIIPs vyžaduje, aby fond nabízený drobným investorům měl sdělení klíčových informací (KID). Americké fondy ho nevydávají, a tak je většina brokerů v EU drobným investorům neprodá.
- Evropské verze (UCITS) sledují stejný nebo podobný index, KID mají a koupíte je u běžných brokerů na německé burze Xetra v eurech.
- Výjimky existují – někteří brokeři americké ETF nabízejí. Evropská verze je ale pro začátečníka jednodušší cesta, protože ji má většina brokerů.
- Source: Nařízení (EU) č. 1286/2014 (PRIIPs)

## 8. Second CTA, disclaimer, footer

- Heading: **Fond máte. Teď už jen vědět, co čekat.**
- Button: **Chci průvodce zdarma** (scrolls to the form)
- Disclaimer: Nejde o investiční doporučení ani daňové poradenství. Stránka srovnává veřejně dostupné údaje o fondech. Hodnota investice může klesat i růst a minulé výnosy nezaručují budoucí. Údaje o fondech: Vanguard k [30. 9. 2026], iShares k [26. 10. 2026]. Ceny z předchozího obchodního dne. Daňová pravidla podle zákona č. 586/1992 Sb. ve znění pro rok 2026. (Dates from `asOf` in `data/`; built as `DISCLAIMER` in `src/data/etfs.ts`.)
- Sources: Vanguard (factsheety VWCE, VUAA, V60A, VT, VOO) · iShares (AOR) · Alpha Vantage (ceny) · Nařízení (EU) č. 1286/2014 · Zákon č. 586/1992 Sb.
- Footer: Demo projekt pro výběrové řízení · Ochrana osobních údajů

## 9. Thank-you page `/dekujeme`

- Heading: **Hotovo. Průvodce je váš.**
- Button: **Stáhnout PDF** (opens in a new tab)
- Text: Kopii jsme poslali na [e-mail]. Pokud nedorazí do pár minut, podívejte se do spamu.
- Fund reminder: Váš fond: **[VWCE]** · ISIN [IE00BK5BQT80] – podle ISIN ho najdete u brokera.
- Small link: ← Zpět na srovnání

## 10. Email (Resend)

- From: `pruvodce@mail.prvnietf.cz`
- Subject: **Váš průvodce: První 3 roky s ETF**

```
Dobrý den,

děkujeme za zájem. Váš průvodce si stáhnete tady: [Stáhnout PDF]

V průvodci najdete, co čekat v prvních měsících, co dělat při poklesu, jak je to s daněmi a kdy dává smysl prodat.

Fond, který jste si prohlédli: [VWCE] (ISIN [IE00BK5BQT80]).

Nejde o investiční doporučení ani daňové poradenství.

Odhlásit se můžete jedním kliknutím: [Odhlásit]
```

[Odhlásit] links to `/odhlasit` (signed token, unsubscribes via a button, plus `List-Unsubscribe` headers); see `docs/STATUS.md`. Don't ship the email before that page works.
