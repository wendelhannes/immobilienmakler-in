import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Datenschutzerklärung von immobilienmakler-in.com.",
  alternates: { canonical: "/datenschutz" },
  robots: { index: true, follow: true },
};

export default function DatenschutzPage() {
  return (
    <div className="legal">
      <h1>Datenschutzerklärung</h1>

      <h2>Allgemeiner Hinweis und Pflichtinformationen</h2>

      <h3>Benennung der verantwortlichen Stelle</h3>
      <p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:</p>
      <p>
        Hannes Wendel
        <br />
        Uhlandstraße 42
        <br />
        76135 Karlsruhe
      </p>
      <p>
        Die verantwortliche Stelle entscheidet allein oder gemeinsam mit anderen
        über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten
        (z. B. Namen, Kontaktdaten o. Ä.).
      </p>

      <h3>Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>
      <p>
        Nur mit Ihrer ausdrücklichen Einwilligung sind einige Vorgänge der
        Datenverarbeitung möglich. Ein Widerruf Ihrer bereits erteilten
        Einwilligung ist jederzeit möglich. Für den Widerruf genügt eine formlose
        Mitteilung per E-Mail. Die Rechtmäßigkeit der bis zum Widerruf erfolgten
        Datenverarbeitung bleibt vom Widerruf unberührt.
      </p>

      <h3>Recht auf Beschwerde bei der zuständigen Aufsichtsbehörde</h3>
      <p>
        Als Betroffener steht Ihnen im Falle eines datenschutzrechtlichen Verstoßes
        ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu. Zuständige
        Aufsichtsbehörde bezüglich datenschutzrechtlicher Fragen ist der
        Landesdatenschutzbeauftragte des Bundeslandes, in dem sich der Sitz unseres
        Unternehmens befindet. Der folgende Link stellt eine Liste der
        Datenschutzbeauftragten sowie deren Kontaktdaten bereit:{" "}
        <a
          href="https://www.bfdi.bund.de/DE/Service/Anschriften/anschriften_node.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://www.bfdi.bund.de/DE/Service/Anschriften/anschriften_node.html
        </a>
        .
      </p>

      <h3>Recht auf Datenübertragbarkeit</h3>
      <p>
        Ihnen steht das Recht zu, Daten, die wir auf Grundlage Ihrer Einwilligung
        oder in Erfüllung eines Vertrags automatisiert verarbeiten, an sich oder an
        Dritte aushändigen zu lassen. Die Bereitstellung erfolgt in einem
        maschinenlesbaren Format. Sofern Sie die direkte Übertragung der Daten an
        einen anderen Verantwortlichen verlangen, erfolgt dies nur, soweit es
        technisch machbar ist.
      </p>

      <h3>Recht auf Auskunft, Berichtigung, Sperrung, Löschung</h3>
      <p>
        Sie haben jederzeit im Rahmen der geltenden gesetzlichen Bestimmungen das
        Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen
        Daten, Herkunft der Daten, deren Empfänger und den Zweck der
        Datenverarbeitung und ggf. ein Recht auf Berichtigung, Sperrung oder
        Löschung dieser Daten. Diesbezüglich und auch zu weiteren Fragen zum Thema
        personenbezogene Daten können Sie sich jederzeit über die im Impressum
        aufgeführten Kontaktmöglichkeiten an uns wenden.
      </p>

      <h3>SSL- bzw. TLS-Verschlüsselung</h3>
      <p>
        Aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher
        Inhalte, die Sie an uns als Seitenbetreiber senden, nutzt unsere Website
        eine SSL- bzw. TLS-Verschlüsselung. Damit sind Daten, die Sie über diese
        Website übermitteln, für Dritte nicht mitlesbar. Sie erkennen eine
        verschlüsselte Verbindung an der „https://“-Adresszeile Ihres Browsers und
        am Schloss-Symbol in der Browserzeile.
      </p>

      <h2>Server-Log-Dateien</h2>
      <p>
        In Server-Log-Dateien erhebt und speichert der Provider der Website
        automatisch Informationen, die Ihr Browser automatisch an uns übermittelt.
        Dies sind:
      </p>
      <ul>
        <li>Besuchte Seite auf unserer Domain</li>
        <li>Datum und Uhrzeit der Serveranfrage</li>
        <li>Browsertyp und Browserversion</li>
        <li>Verwendetes Betriebssystem</li>
        <li>Referrer-URL</li>
        <li>Hostname des zugreifenden Rechners</li>
        <li>IP-Adresse</li>
      </ul>
      <p>
        Diese Daten sind für uns technisch erforderlich, um Ihnen unsere Website
        anzuzeigen und die Stabilität und Sicherheit zu gewährleisten
        (Rechtsgrundlage der Datenverarbeitung bildet Art. 6 Abs. 1 lit. f DSGVO).
        Es findet keine Zusammenführung dieser Daten mit anderen Datenquellen statt.
      </p>

      <h2>Reichweitenmessung (Vercel Analytics)</h2>
      <p>
        Zur statistischen Auswertung der Websitenutzung setzen wir Vercel Analytics
        ein, einen Dienst der Vercel Inc. Vercel Analytics erhebt anonymisierte
        Nutzungsdaten (z. B. aufgerufene Seiten, ungefähre Herkunftsregion,
        Gerätetyp) und verzichtet dabei auf Cookies sowie auf die Speicherung
        personenbezogener Daten und individueller Nutzerprofile. Eine
        Identifizierung einzelner Besucher ist nicht möglich. Rechtsgrundlage ist
        unser berechtigtes Interesse an einer reichweitenoptimierten Darstellung
        unseres Angebots (Art. 6 Abs. 1 lit. f DSGVO).
      </p>

      <h2>Externe Links</h2>
      <p>
        Unsere Seiten verlinken auf die Websites der verglichenen Immobilienmakler.
        Beim Anklicken eines solchen Links verlassen Sie unsere Website; für die
        Datenverarbeitung auf den verlinkten Seiten ist der jeweilige Betreiber
        verantwortlich.
      </p>

      <h2>Kontaktaufnahme</h2>
      <p>
        Nehmen Sie per E-Mail Kontakt mit uns auf, werden Ihre Angaben zwecks
        Bearbeitung der Anfrage sowie für den Fall von Anschlussfragen gespeichert.
        Eine Weitergabe dieser Daten findet ohne Ihre Einwilligung nicht statt. Die
        Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO
        (vorvertragliche Maßnahme) bzw. Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
        Interesse an der Bearbeitung Ihrer Anfrage).
      </p>

      <h2>Sichtbarkeits-Check &amp; ausführlicher Report</h2>
      <p>
        Auf der Seite „Sichtbarkeits-Check" können Sie zunächst anonym die URL Ihrer
        Website eingeben, um einen kostenlosen technischen Sofort-Check zu erhalten.
        Dabei rufen wir öffentlich zugängliche Inhalte der angegebenen Website ab
        (z. B. Startseite, robots.txt, llms.txt, sitemap.xml) und werten sie technisch
        aus. Es werden hierfür keine personenbezogenen Daten von Ihnen benötigt.
      </p>
      <p>
        Für den <strong>ausführlichen Report</strong> erheben wir die von Ihnen im
        Formular angegebenen Daten (Vor- und Nachname, Firma, E-Mail-Adresse,
        Telefonnummer und Website). Diese verwenden wir, um Ihre Anfrage zu bearbeiten,
        den Report zu erstellen und Ihnen per E-Mail zuzusenden sowie um Sie ggf. zu
        Ihrem Anliegen zu kontaktieren. Rechtsgrundlage ist Ihre Einwilligung
        (Art. 6 Abs. 1 lit. a DSGVO) sowie Art. 6 Abs. 1 lit. b/f DSGVO
        (vorvertragliche Maßnahme bzw. berechtigtes Interesse). Ihre Einwilligung
        können Sie jederzeit formlos widerrufen.
      </p>
      <p>
        Der E-Mail-Versand (Ihre Bestätigung sowie unsere interne Benachrichtigung)
        erfolgt über den Dienstleister <strong>Resend</strong> (Resend, Inc.). Zur
        Verwaltung und Bearbeitung Ihrer Anfrage speichern wir die genannten Daten
        zudem in einer <strong>Notion</strong>-Datenbank (Notion Labs, Inc.). Beide
        Anbieter sind als Auftragsverarbeiter für uns tätig; dabei kann eine
        Übermittlung in die USA erfolgen. Wir speichern Ihre Daten nur so lange, wie es
        zur Bearbeitung Ihrer Anfrage erforderlich ist bzw. bis zu Ihrem Widerruf.
      </p>

      <p>
        <small>Stand: Juli 2026</small>
      </p>
    </div>
  );
}
