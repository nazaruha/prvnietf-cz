---
paths:
  - "src/app/**/*.tsx"
  - "src/components/**"
  - "src/emails/**"
  - "docs/copy.md"
---

# Copy and legal rules

- All visible text comes from `docs/copy.md`, word for word. If a text is missing there, ask; never write new Czech copy yourself.
- Formal *vy*, short sentences.
- Never *doporučujeme*, never tell the visitor what to buy. Results say what people with similar answers usually choose.
- The disclaimer (not investment or tax advice, past returns don't guarantee future ones) stays under every result and in the footer.
- AOR → V60A is labelled *podobný typ fondu, ne přesná obdoba*.
- Social proof keeps `isMock: true` and its visible label *Ilustrační data – ukázka…* until real numbers exist.
- Consent checkbox is never pre-ticked. The consent text that was shown is stored with the lead (`consentText`).
- One `<h1>` per page, `lang="cs"`. Pages `/dekujeme`, `/soukromi` and `/admin` are `noindex`.
