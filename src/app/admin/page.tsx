import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { getDb } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { ADMIN_COPY } from "./copy";

// Leads table, newest first (docs/project.md "Admin", DECISIONS.md D16).
// Basic Auth happens in src/proxy.ts before this page renders.

export const metadata: Metadata = {
  title: ADMIN_COPY.title,
  robots: { index: false, follow: false },
};

type Column = keyof typeof ADMIN_COPY.columns;
const COLUMNS = Object.keys(ADMIN_COPY.columns) as Column[];

export default function AdminPage() {
  return (
    <main className="flex-1 px-gutter pt-8 pb-16">
      <h1 className="text-4xl leading-none font-extrabold tracking-tight">{ADMIN_COPY.title}</h1>
      {/* Leads are request-time data: under cacheComponents they must sit inside Suspense. */}
      <Suspense fallback={null}>
        <LeadsTable />
      </Suspense>
    </main>
  );
}

// "30. 10. 2026 14:05" in Prague time; format.ts covers dates only.
const timeFormat = new Intl.DateTimeFormat("cs-CZ", {
  timeZone: "Europe/Prague",
  hour: "2-digit",
  minute: "2-digit",
});

function pragueDateTime(date: Date): string {
  const isoDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Prague" }).format(date);
  return `${formatDate(isoDay)} ${timeFormat.format(date)}`;
}

async function LeadsTable() {
  await connection();
  const leads = await getDb().lead.findMany({ orderBy: { createdAt: "desc" } });

  if (leads.length === 0) return <p className="mt-6 text-lg">{ADMIN_COPY.empty}</p>;

  const cell = (value: string | null) => value || ADMIN_COPY.none;

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm whitespace-nowrap">
        <thead>
          <tr className="border-b-2 border-ink">
            {COLUMNS.map((column) => (
              <th key={column} scope="col" className="py-2 pr-4 font-semibold text-ink-muted">
                {ADMIN_COPY.columns[column]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b border-mist align-top">
              <td className="py-2 pr-4">{pragueDateTime(lead.createdAt)}</td>
              <td className="py-2 pr-4 font-semibold">{lead.email}</td>
              <td className="py-2 pr-4">{cell(lead.fund)}</td>
              <td className="py-2 pr-4">{cell(lead.adVersion)}</td>
              <td className="py-2 pr-4">{cell(lead.utmSource)}</td>
              <td className="py-2 pr-4">{cell(lead.utmMedium)}</td>
              <td className="py-2 pr-4">{cell(lead.utmCampaign)}</td>
              <td className="py-2 pr-4">{cell(lead.utmContent)}</td>
              <td className="py-2 pr-4">{cell(lead.utmTerm)}</td>
              <td className="py-2 pr-4">{lead.consent ? ADMIN_COPY.yes : ADMIN_COPY.none}</td>
              <td className="py-2 pr-4">{lead.unsubscribedAt ? pragueDateTime(lead.unsubscribedAt) : ADMIN_COPY.none}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
