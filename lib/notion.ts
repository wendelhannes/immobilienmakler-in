// Trägt eingehende Leads in eine Notion-Datenbank ein (REST, keine SDK).
// Best-effort: Fehler werden geloggt, nicht geworfen – der E-Mail-Versand
// soll nie an Notion scheitern.
//
// Voraussetzung (in Notion anzulegen):
//   1. Integration erstellen -> notion.so/my-integrations -> "Internal Integration Secret" = NOTION_TOKEN
//   2. Datenbank anlegen mit exakt diesen Properties:
//        - "Name"     (Titel/Title)
//        - "Firma"    (Text)
//        - "E-Mail"   (E-Mail)
//        - "Telefon"  (Telefon)
//        - "Website"  (URL)
//        - "Score"    (Zahl)
//        - "Quelle"   (Auswahl/Select)
//   3. Datenbank für die Integration freigeben ("Verbindungen" -> Integration)
//   4. Datenbank-ID aus der URL = NOTION_DATABASE_ID

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

export const notionConfigured = Boolean(NOTION_TOKEN && NOTION_DATABASE_ID);

export interface LeadRecord {
  vorname: string;
  nachname: string;
  firma: string;
  email: string;
  telefon: string;
  website: string;
  score?: number;
  grade?: string;
}

export async function createLead(lead: LeadRecord): Promise<boolean> {
  if (!notionConfigured) {
    console.log(`[Notion übersprungen] ${lead.vorname} ${lead.nachname} · ${lead.firma} · ${lead.email}`);
    return false;
  }

  const website = /^https?:\/\//i.test(lead.website)
    ? lead.website
    : lead.website
      ? `https://${lead.website}`
      : null;

  const properties: Record<string, unknown> = {
    Name: { title: [{ text: { content: `${lead.vorname} ${lead.nachname}`.trim() } }] },
    Firma: { rich_text: [{ text: { content: lead.firma } }] },
    "E-Mail": { email: lead.email },
    Telefon: { phone_number: lead.telefon },
    Website: { url: website },
    Quelle: { select: { name: "Sichtbarkeits-Check" } },
  };
  if (typeof lead.score === "number") properties.Score = { number: lead.score };

  try {
    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "content-type": "application/json",
      },
      body: JSON.stringify({ parent: { database_id: NOTION_DATABASE_ID }, properties }),
    });
    if (!res.ok) {
      const t = await res.text().catch(() => "");
      console.error(`Notion-Insert fehlgeschlagen (${res.status}): ${t}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Notion-Insert-Fehler:", err);
    return false;
  }
}
