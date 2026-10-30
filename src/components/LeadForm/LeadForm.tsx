"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import type { FormContext } from "@/data/etfs";
import { currentAttribution, track } from "@/lib/analytics";
import { UTM_KEYS, withAttribution, type UtmKey } from "@/lib/attribution";
import { LEAD_FORM_ID } from "./anchor";
import { CONSENT_BEFORE_LINK, PRIVACY_LINK } from "./consent";
import { submitLead } from "./submitLead";
import { LEAD_ERRORS, normalizeEmail, validateLead, type LeadFieldErrors } from "./validateLead";

// Owner: lead agent. Copy from docs/copy.md "4. Form"; submits through submitLead.ts.
// Tracks `form_viewed`, `form_started`, and `form_submitted` (only after `{ ok: true }`)
// with track(); redirects with withAttribution() (see CLAUDE.md pitfalls).

export type LeadFormProps = {
  /** The result shown above the form, or SKIPPED_PICKER when the picker isn't finished. */
  context: FormContext;
};

const GUIDE_TITLE = "První 3 roky s ETF";
const SUBLINE = "Krátký průvodce v PDF. Hned si ho stáhnete a pošleme vám ho i e-mailem.";
const BULLETS = [
  "Co čekat v prvních měsících po nákupu",
  "Co dělat, když trh spadne – skutečné propady a jak dlouho trvalo, než se vrátily",
  // Non-breaking spaces inside the amount (docs/copy.md conventions).
  "Daně: kdy platíte a kdy ne (3 roky, 100 000 Kč)",
  "Kdy dává smysl prodat",
];
const EMAIL_LABEL = "Váš e-mail";
const EMAIL_PLACEHOLDER = "jmeno@email.cz";
const BUTTON = "Poslat mi průvodce";
const BUTTON_SENDING = "Posíláme…";
const UNDER_BUTTON = "Bez spamu. Odhlásit se můžete jedním kliknutím.";
const SUCCESS = "Hotovo. Průvodce vám posíláme na e-mail.";

type Status = "idle" | "sending" | "success" | "error";

/** Form heading per context (docs/copy.md "4. Form"). */
function headingFor(context: FormContext): string {
  switch (context.kind) {
    case "fund":
      return `Co vás čeká v prvních 3 letech s ${context.ucits.ticker}?`;
    case "not-yet":
      return "Průvodce na dobu, kdy budete připraveni";
    case "skipped":
      return GUIDE_TITLE;
  }
}

/** The form is always open, also when the picker was skipped. */
export function LeadForm({ context }: LeadFormProps) {
  const router = useRouter();
  const ids = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);
  const viewed = useRef(false);
  const started = useRef(false);
  // Synchronous lock: state from the render closure is stale for submits fired before a re-render.
  const inFlight = useRef(false);

  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<LeadFieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const fund = context.kind === "fund" ? context.ucits.ticker : null;
  const sending = status === "sending" || status === "success";

  useEffect(() => {
    const section = sectionRef.current;
    // Tracked once per mount; a later result change doesn't count as a new view.
    if (!section || viewed.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || viewed.current) return;
        viewed.current = true;
        track("form_viewed", { fund });
        observer.disconnect();
      },
      { threshold: 0.4 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [fund]);

  function markStarted() {
    if (started.current) return;
    started.current = true;
    track("form_started", { fund });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;

    const fieldErrors = validateLead({ email, consent });
    setErrors(fieldErrors);
    if (fieldErrors.email) return emailRef.current?.focus();
    if (fieldErrors.consent) return consentRef.current?.focus();

    inFlight.current = true;
    setStatus("sending");
    const attribution = currentAttribution();
    const utm: Partial<Record<UtmKey, string>> = {};
    for (const key of UTM_KEYS) {
      const value = attribution[key];
      if (value) utm[key] = value;
    }

    const result = await submitLead({
      email: normalizeEmail(email),
      consent,
      fund,
      adVersion: attribution.ad_version,
      utm,
      website,
    });

    if (!result.ok) {
      inFlight.current = false;
      setStatus("error");
      return;
    }

    // Stays locked on success: the page is leaving for /dekujeme.
    setStatus("success");
    track("form_submitted", { fund });
    router.push(withAttribution(fund ? `/dekujeme?etf=${fund}` : "/dekujeme", attribution));
  }

  const emailErrorId = `${ids}-email-error`;
  const consentErrorId = `${ids}-consent-error`;
  const headingId = `${ids}-heading`;

  return (
    <section
      ref={sectionRef}
      id={LEAD_FORM_ID}
      aria-labelledby={headingId}
      className="grid scroll-mt-4 grid-cols-[6rem_1fr] items-center gap-x-4 px-gutter py-12 md:mx-auto md:max-w-4xl md:grid-cols-[16rem_1fr] md:items-start md:gap-x-12"
    >
      {/* Phone: small tilted cover beside the heading. Wide: large cover in its own column. */}
      <Image
        src="/pdf-cover.png"
        alt={`Obálka průvodce ${GUIDE_TITLE}`}
        width={794}
        height={1123}
        sizes="(min-width: 768px) 16rem, 6rem"
        className="w-full -rotate-3 rounded-sm shadow-[0_8px_24px_-8px_rgb(20_24_31/0.45)] md:row-span-4 md:rotate-0"
      />
      <h2 id={headingId} className="min-w-0 text-2xl leading-tight font-extrabold text-balance md:text-3xl">
        {headingFor(context)}
      </h2>

      <p className="col-span-2 mt-6 max-w-prose md:col-span-1 md:col-start-2 md:mt-3">{SUBLINE}</p>

      <ul className="col-span-2 mt-5 max-w-prose space-y-2.5 border-l-2 border-mist pl-4 md:col-span-1 md:col-start-2">
        {BULLETS.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>

      <div className="col-span-2 md:col-span-1 md:col-start-2">
        <form noValidate onSubmit={handleSubmit} className="mt-8 max-w-prose" aria-busy={sending}>
          <label htmlFor={`${ids}-email`} className="block font-bold">
            {EMAIL_LABEL}
          </label>
          <input
            ref={emailRef}
            id={`${ids}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder={EMAIL_PLACEHOLDER}
            value={email}
            onChange={(event) => {
              markStarted();
              setEmail(event.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? emailErrorId : undefined}
            className={`mt-2 block h-tap w-full rounded-xl border-2 bg-paper px-4 text-lg text-ink placeholder:text-ink-muted ${
              errors.email ? "border-chip-red" : "border-ink"
            }`}
          />
          {errors.email && <FieldError id={emailErrorId}>{errors.email}</FieldError>}

          <div className="mt-5 flex gap-3">
            <input
              ref={consentRef}
              id={`${ids}-consent`}
              name="consent"
              type="checkbox"
              checked={consent}
              onChange={(event) => {
                markStarted();
                setConsent(event.target.checked);
                if (errors.consent) setErrors((prev) => ({ ...prev, consent: undefined }));
              }}
              aria-invalid={errors.consent ? true : undefined}
              aria-describedby={errors.consent ? consentErrorId : undefined}
              className="mt-0.5 size-6 shrink-0 accent-ink"
            />
            <label htmlFor={`${ids}-consent`} className="text-sm leading-snug">
              {CONSENT_BEFORE_LINK}{" "}
              <a href="/soukromi" className="underline underline-offset-2">
                {PRIVACY_LINK}
              </a>
            </label>
          </div>
          {errors.consent && <FieldError id={consentErrorId}>{errors.consent}</FieldError>}

          {/* Honeypot: invisible to people, filled by bots (docs/project.md "Lead flow"). */}
          <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor={`${ids}-website`}>Web</label>
            <input
              id={`${ids}-website`}
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="mt-6 h-14 w-full rounded-full bg-cta px-6 text-lg font-extrabold text-cta-ink transition-opacity disabled:cursor-wait disabled:opacity-70"
          >
            {sending ? BUTTON_SENDING : BUTTON}
          </button>

          <div aria-live="polite" className="mt-3 text-sm">
            {status === "error" && <FieldError>{LEAD_ERRORS.server}</FieldError>}
            {status === "success" && <p className="font-bold">{SUCCESS}</p>}
          </div>
          <p className="mt-2 text-sm text-ink-muted">{UNDER_BUTTON}</p>
        </form>
      </div>
    </section>
  );
}

/** Error text in ink (chip red fails AA as small text), marked with a red bar. */
function FieldError({ id, children }: { id?: string; children: string }) {
  return (
    <p id={id} className="mt-2 border-l-4 border-chip-red pl-2 text-sm font-bold text-ink">
      {children}
    </p>
  );
}
