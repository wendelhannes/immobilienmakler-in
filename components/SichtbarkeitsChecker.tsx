"use client";

import { useState } from "react";

interface Signal {
  key: string;
  label: string;
  status: "pass" | "warn" | "fail";
  detail: string;
}
interface FreeResult {
  url: string;
  domain: string;
  score: number;
  grade: string;
  signals: Signal[];
  summary: string;
}

const STATUS_ICON: Record<string, string> = { pass: "✓", warn: "!", fail: "✕" };

export default function SichtbarkeitsChecker() {
  // Stufe 1 – Free-Check
  const [url, setUrl] = useState("");
  const [checkState, setCheckState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<FreeResult | null>(null);
  const [checkError, setCheckError] = useState("");

  // Stufe 2 – In-depth-Formular
  const [form, setForm] = useState({
    vorname: "",
    nachname: "",
    firma: "",
    email: "",
    telefon: "",
    website: "",
    consent: false,
    company_url: "", // Honeypot (unsichtbar)
  });
  const [reportState, setReportState] = useState<
    "idle" | "loading" | "done" | "limit" | "error"
  >("idle");
  const [reportMsg, setReportMsg] = useState("");

  async function runCheck(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setCheckState("loading");
    setCheckError("");
    try {
      const res = await fetch("/api/free-check", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCheckError(data.error || "Der Check ist fehlgeschlagen.");
        setCheckState("error");
        return;
      }
      setResult(data);
      setForm((f) => ({ ...f, website: data.url }));
      setCheckState("done");
    } catch {
      setCheckError("Netzwerkfehler. Bitte erneut versuchen.");
      setCheckState("error");
    }
  }

  function setField(field: keyof typeof form, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
    if (reportState === "error") setReportState("idle");
  }

  async function submitReport(e: React.FormEvent) {
    e.preventDefault();
    if (!form.vorname || !form.nachname || !form.firma || !form.email || !form.telefon) {
      setReportState("error");
      setReportMsg("Bitte alle Felder ausfüllen.");
      return;
    }
    if (!form.email.includes("@")) {
      setReportState("error");
      setReportMsg("Bitte eine gültige E-Mail-Adresse angeben.");
      return;
    }
    if (!form.consent) {
      setReportState("error");
      setReportMsg("Bitte der Datenverarbeitung zustimmen.");
      return;
    }
    setReportState("loading");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...form,
          freeScore: result?.score,
          freeGrade: result?.grade,
          freeDomain: result?.domain,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 409) {
        setReportState("limit");
        setReportMsg(data.message || "Für diese E-Mail wurde bereits ein Report angefordert.");
        return;
      }
      if (res.status === 429) {
        setReportState("limit");
        setReportMsg(data.message || "Zu viele Anfragen. Bitte später erneut versuchen.");
        return;
      }
      if (!res.ok) {
        setReportState("error");
        setReportMsg(data.message || data.error || "Etwas ist schiefgelaufen.");
        return;
      }
      setReportState("done");
    } catch {
      setReportState("error");
      setReportMsg("Netzwerkfehler. Bitte erneut versuchen.");
    }
  }

  return (
    <div className="checker">
      {/* ── STUFE 1: FREE-CHECK ── */}
      <form className="checker-bar" onSubmit={runCheck}>
        <input
          type="text"
          inputMode="url"
          placeholder="ihre-maklerwebsite.de"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          aria-label="Website-URL"
        />
        <button type="submit" className="btn-primary" disabled={checkState === "loading"}>
          {checkState === "loading" ? "Prüfe…" : "Kostenlos prüfen"}
        </button>
      </form>
      <p className="checker-hint">
        Kostenlos &amp; ohne Anmeldung · analysiert die technische Sichtbarkeits-Basis
        Ihrer Website.
      </p>

      {checkState === "error" && <div className="checker-error">{checkError}</div>}

      {checkState === "done" && result && (
        <div className="checker-result reveal visible">
          <div className="cr-head">
            <div className={`cr-score cr-${result.grade === "gut" ? "good" : result.grade === "ausbaufähig" ? "warn" : "bad"}`}>
              <span className="cr-num">{result.score}</span>
              <span className="cr-of">/100</span>
            </div>
            <div className="cr-headtext">
              <h3>Technischer Sichtbarkeits-Score für {result.domain}</h3>
              <p>{result.summary}</p>
            </div>
          </div>

          <ul className="cr-signals">
            {result.signals.map((s) => (
              <li key={s.key} className={`cr-signal cr-${s.status}`}>
                <span className="cr-ic">{STATUS_ICON[s.status]}</span>
                <span className="cr-label">{s.label}</span>
                <span className="cr-detail">{s.detail}</span>
              </li>
            ))}
          </ul>

          {/* ── STUFE 2: IN-DEPTH-FORMULAR ── */}
          <div className="cr-upsell">
            <div className="cta-tag">Kostenloser Ausführlicher Report</div>
            <h3>Wie oft empfiehlt die KI Sie – und wen stattdessen?</h3>
            <p>
              Der kostenlose Check oben deckt die Technik ab. Der ausführliche Report
              prüft zusätzlich Ihre <strong>echte Zitierbarkeit in ChatGPT, Google
              Gemini, Perplexity und Claude</strong> für typische Kundenfragen – inklusive
              der Quellen, die stattdessen genannt werden, und priorisierter Maßnahmen.
              Fordern Sie ihn kostenlos an – wir senden ihn Ihnen per E-Mail zu.
            </p>

            {reportState === "done" ? (
              <div className="report-success">
                <div className="rs-check">✓</div>
                <h4>Anfrage eingegangen – danke!</h4>
                <p>
                  Wir prüfen Ihre Sichtbarkeit bei Google und in den KI-Suchen und
                  melden uns mit Ihrem persönlichen Report an{" "}
                  <strong>{form.email}</strong>. Prüfen Sie ggf. den Spam-Ordner.
                </p>
              </div>
            ) : reportState === "limit" ? (
              <div className="report-limit">
                <p>{reportMsg}</p>
              </div>
            ) : (
              <form className="report-form" onSubmit={submitReport}>
                <div className="rf-row">
                  <input type="text" placeholder="Vorname" value={form.vorname} onChange={(e) => setField("vorname", e.target.value)} />
                  <input type="text" placeholder="Nachname" value={form.nachname} onChange={(e) => setField("nachname", e.target.value)} />
                </div>
                <input type="text" placeholder="Firma / Maklerbüro" value={form.firma} onChange={(e) => setField("firma", e.target.value)} />
                <div className="rf-row">
                  <input type="email" placeholder="E-Mail" value={form.email} onChange={(e) => setField("email", e.target.value)} />
                  <input type="tel" placeholder="Telefon" value={form.telefon} onChange={(e) => setField("telefon", e.target.value)} />
                </div>
                <input type="text" placeholder="Website" value={form.website} onChange={(e) => setField("website", e.target.value)} />

                {/* Honeypot – für Menschen unsichtbar */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hp-field"
                  value={form.company_url}
                  onChange={(e) => setField("company_url", e.target.value)}
                  aria-hidden="true"
                />

                <label className="rf-consent">
                  <input type="checkbox" checked={form.consent} onChange={(e) => setField("consent", e.target.checked)} />
                  <span>
                    Ich bin einverstanden, dass meine Angaben zur Erstellung und
                    Zusendung des Reports verarbeitet werden (siehe{" "}
                    <a href="/datenschutz" target="_blank" rel="noopener">Datenschutz</a>).
                  </span>
                </label>

                {reportState === "error" && <div className="checker-error">{reportMsg}</div>}

                <button type="submit" className="btn-primary" disabled={reportState === "loading"}>
                  {reportState === "loading" ? "Wird erstellt…" : "Ausführlichen Report kostenlos anfordern →"}
                </button>
                <p className="rf-note">Kostenlos &amp; unverbindlich · kein Abo, kein Verkaufsdruck.</p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
