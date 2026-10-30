import { PrivacyLink } from "./PrivacyLink";

// Footer (docs/copy.md section 8). The only link goes to /soukromi; no navigation menu.

const DEMO = "Demo projekt pro výběrové řízení";
const PRIVACY = "Ochrana osobních údajů";

export function Footer() {
  return (
    <footer className="border-t-2 border-mist py-6 text-sm text-ink-muted">
      <p className="page-container">
        {DEMO} ·{" "}
        <PrivacyLink className="inline-block py-2 underline underline-offset-4">{PRIVACY}</PrivacyLink>
      </p>
    </footer>
  );
}
