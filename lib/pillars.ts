// Nationale Pillar-Seiten (Audit: Topical Authority war auf 50 Stadt-Varianten
// zersplittert, ohne kanonische nationale Seite je Thema).
// Handgeschriebener Content; Stadt-Varianten verlinken hierauf zurück
// (über internalLinksGrid) und die Pillars verlinken auf alle 50 Städte.

export interface PillarFaq {
  q: string;
  a: string;
}

export interface Pillar {
  slug: string;
  tag: string;
  title: string; // <title> (50-60 Zeichen)
  h1: string;
  description: string; // Meta-Description
  quickAnswer: string;
  sections: { h2: string; paragraphs: string[] }[];
  steps?: string[];
  faq: PillarFaq[];
  cityLinkLabel: string; // "Haus verkaufen {stadt}"
}

export const PILLARS: Pillar[] = [
  {
    slug: "haus-verkaufen",
    tag: "Verkauf",
    title: "Haus verkaufen: Ablauf, Kosten & Makler (Ratgeber 2026)",
    h1: "Haus verkaufen – Ablauf, Kosten und die Rolle des Maklers",
    description:
      "Haus verkaufen in Deutschland: der komplette Ablauf in 5 Schritten, alle Kostenblöcke von Provision bis Grunderwerbsteuer und wann sich ein Makler lohnt.",
    quickAnswer:
      "Ein Hausverkauf läuft in fünf Schritten ab: Wertermittlung, Unterlagen zusammenstellen, Vermarktung mit Exposé, Besichtigungen und Notartermin. Die größten Kostenblöcke sind die Maklerprovision (seit 2020 in der Regel zwischen Käufer und Verkäufer geteilt) und auf Käuferseite die Grunderwerbsteuer von 3,5 bis 6,5 % je nach Bundesland.",
    sections: [
      {
        h2: "Der Ablauf im Überblick",
        paragraphs: [
          "Am Anfang jedes Verkaufs steht die realistische Wertermittlung. Wer den Preis zu hoch ansetzt, verlängert die Vermarktungsdauer und muss später öffentlich sichtbar reduzieren – wer zu niedrig ansetzt, verschenkt Geld. Makler bieten meist eine kostenlose Ersteinschätzung an; für gerichtsfeste Zwecke (Erbauseinandersetzung, Scheidung) braucht es einen zertifizierten Gutachter.",
          "Danach folgen die Unterlagen: Grundbuchauszug, Energieausweis, Baupläne, bei Eigentumswohnungen zusätzlich Teilungserklärung und Protokolle der Eigentümerversammlung. Ein vollständiges Unterlagenpaket beschleunigt sowohl die Käufersuche als auch die Finanzierungszusage der Käuferbank.",
          "Die eigentliche Vermarktung entscheidet über den Preis: professionelle Fotos, ein vollständiges Exposé und die richtige Preisstrategie. Nach den Besichtigungen und der Käuferauswahl prüft der Notar den Kaufvertrag – erst mit der notariellen Beurkundung ist der Verkauf rechtswirksam.",
        ],
      },
      {
        h2: "Mit oder ohne Makler verkaufen?",
        paragraphs: [
          "Ein guter lokaler Makler bringt drei Dinge mit, die Privatverkäufern fehlen: einen realistischen Marktpreis aus laufenden Transaktionen, einen Pool vorgemerkter Kaufinteressenten und Verhandlungsroutine. Dem steht die Provision gegenüber. Ob sich das rechnet, hängt vor allem von Ihrer eigenen Zeit, Marktkenntnis und Verhandlungssicherheit ab – eine ausführliche Gegenüberstellung finden Sie im Ratgeber Makler oder privat verkaufen.",
          "Wichtig bei der Maklerwahl: nicht auf Werbung, sondern auf nachprüfbare Bewertungen achten. Unser Vergleich rankt Makler in 50 deutschen Städten ausschließlich nach echten Google-Bewertungen – wählen Sie unten Ihre Stadt für die lokale Übersicht.",
        ],
      },
    ],
    steps: [
      "Immobilienbewertung durch einen Sachverständigen oder Makler einholen",
      "Unterlagen zusammenstellen (Grundbuchauszug, Energieausweis, Baupläne)",
      "Exposé erstellen und Vermarktungsstrategie festlegen",
      "Besichtigungen mit Kaufinteressenten durchführen",
      "Notartermin vereinbaren und Kaufvertrag abschließen",
    ],
    faq: [
      {
        q: "Wie lange dauert ein Hausverkauf in Deutschland?",
        a: "Je nach Lage, Zustand und Preisstrategie dauert ein Hausverkauf typischerweise drei bis acht Monate – von der ersten Bewertung bis zum Notartermin. Gefragte Lagen mit realistischem Preis verkaufen sich deutlich schneller als überteuerte Objekte in schwächeren Märkten.",
      },
      {
        q: "Welche Kosten fallen beim Hausverkauf an?",
        a: "Verkäuferseitig: ggf. Maklerprovision (üblich ist die hälftige Teilung mit dem Käufer), Energieausweis, ggf. Löschung der Grundschuld und Vorfälligkeitsentschädigung bei laufender Finanzierung. Käuferseitig kommen Grunderwerbsteuer (3,5–6,5 % je nach Bundesland), Notar- und Grundbuchkosten hinzu.",
      },
      {
        q: "Muss ich Gewinn aus dem Hausverkauf versteuern?",
        a: "Innerhalb der zehnjährigen Spekulationsfrist ist der Gewinn grundsätzlich steuerpflichtig – außer die Immobilie wurde im Verkaufsjahr und den beiden Vorjahren selbst bewohnt. Nach zehn Jahren ist der Verkauf privat gehaltener Immobilien steuerfrei. Im Zweifel den Steuerberater fragen.",
      },
    ],
    cityLinkLabel: "Haus verkaufen {stadt}",
  },
  {
    slug: "immobilienbewertung",
    tag: "Bewertung",
    title: "Immobilienbewertung: kostenlos oder Gutachten? (2026)",
    h1: "Immobilienbewertung – kostenlose Einschätzung oder Gutachten?",
    description:
      "Immobilienbewertung erklärt: Online-Rechner, kostenlose Maklerbewertung oder Verkehrswertgutachten – was welche Bewertung leistet, kostet und wann sie nötig ist.",
    quickAnswer:
      "Für den Verkauf reicht meist eine kostenlose Marktpreiseinschätzung durch einen lokalen Makler. Ein kostenpflichtiges Verkehrswertgutachten (nach § 194 BauGB) brauchen Sie vor allem für Gericht, Finanzamt oder Erbauseinandersetzungen. Online-Rechner liefern nur grobe Orientierungswerte.",
    sections: [
      {
        h2: "Die drei Wege zur Bewertung",
        paragraphs: [
          "Online-Bewertungsrechner vergleichen Ihre Angaben mit Angebotsdaten aus Portalen. Das Ergebnis ist eine Spanne, keine belastbare Zahl – nützlich als erste Orientierung, ungeeignet als Preisgrundlage. Die Lage im konkreten Straßenzug, der Zustand und Sonderfaktoren wie Erbbaurecht fließen nicht ein.",
          "Die kostenlose Maklerbewertung ist der Standard vor einem Verkauf: Ein lokaler Makler besichtigt die Immobilie und leitet den Marktpreis aus vergleichbaren, tatsächlich abgeschlossenen Verkäufen ab. Seriöse Makler legen die Vergleichsbasis offen und rechnen nicht mit überhöhten Werten, um an den Auftrag zu kommen – prüfen Sie deshalb die Bewertungen des Maklers, bevor Sie ihn beauftragen.",
          "Das Verkehrswertgutachten eines öffentlich bestellten und vereidigten Sachverständigen kostet je nach Objekt meist einen vierstelligen Betrag und ist überall dort nötig, wo der Wert rechtssicher dokumentiert sein muss: bei Erbschaft und Schenkung gegenüber dem Finanzamt, bei Scheidung oder vor Gericht.",
        ],
      },
      {
        h2: "Was den Wert wirklich bestimmt",
        paragraphs: [
          "Die Lage bleibt der stärkste Werttreiber – Mikrolagen unterscheiden sich innerhalb einer Stadt erheblich, weshalb lokale Marktkenntnis durch nichts zu ersetzen ist. Danach folgen Zustand und energetische Qualität: Seit den gestiegenen Energiepreisen und den Anforderungen des Gebäudeenergiegesetzes preisen Käufer Sanierungskosten deutlich strenger ein als früher.",
        ],
      },
    ],
    faq: [
      {
        q: "Was kostet eine Immobilienbewertung?",
        a: "Die Ersteinschätzung durch einen Makler ist in der Regel kostenlos, da sie der Auftragsanbahnung dient. Ein Kurzgutachten kostet meist einige hundert Euro, ein vollständiges Verkehrswertgutachten je nach Objektgröße häufig 1.500 bis 3.000 Euro oder mehr.",
      },
      {
        q: "Welche Unterlagen brauche ich für die Bewertung?",
        a: "Grundbuchauszug, Flurkarte, Wohnflächenberechnung, Energieausweis und bei Wohnungen die Teilungserklärung. Je vollständiger die Unterlagen, desto präziser die Bewertung.",
      },
      {
        q: "Ist die kostenlose Maklerbewertung verbindlich?",
        a: "Nein. Sie ist eine fachliche Markteinschätzung ohne Rechtswirkung und verpflichtet Sie nicht, den Makler zu beauftragen. Rechtlich belastbar ist nur ein Verkehrswertgutachten eines Sachverständigen.",
      },
    ],
    cityLinkLabel: "Immobilienbewertung {stadt}",
  },
  {
    slug: "was-kostet-ein-immobilienmakler",
    tag: "Kosten",
    title: "Was kostet ein Immobilienmakler? Provision 2026 erklärt",
    h1: "Was kostet ein Immobilienmakler? Provision und Nebenkosten erklärt",
    description:
      "Maklerprovision 2026: übliche Sätze, die gesetzliche Teilung zwischen Käufer und Verkäufer seit Ende 2020 und welche Nebenkosten beim Immobilienkauf zusätzlich anfallen.",
    quickAnswer:
      "Die Maklerprovision liegt in Deutschland üblicherweise zwischen 5,95 und 7,14 % des Kaufpreises inklusive Mehrwertsteuer. Seit Dezember 2020 gilt beim Verkauf von Wohnungen und Einfamilienhäusern an Verbraucher: Beauftragt der Verkäufer den Makler, muss er mindestens die Hälfte der Provision selbst tragen.",
    sections: [
      {
        h2: "So funktioniert die Provisionsteilung",
        paragraphs: [
          "Das Gesetz über die Verteilung der Maklerkosten (§ 656a–d BGB) beendete 2020 die Praxis, die volle Provision auf Käufer abzuwälzen. Heute sind zwei Modelle üblich: die Doppelprovision, bei der Käufer und Verkäufer je die Hälfte zahlen, und die Innenprovision, bei der der Verkäufer alles übernimmt – was zunehmend als Verkaufsargument eingesetzt wird.",
          "Die Höhe ist frei verhandelbar. Regional haben sich unterschiedliche Gesamtsätze eingependelt; bei hochwertigen Objekten oder in nachfragestarken Märkten lässt sich häufig ein niedrigerer Satz vereinbaren. Entscheidend ist, was im Maklervertrag steht – mündliche Zusagen zählen nicht.",
          "Neben der Provision sollten Käufer die vollständigen Kaufnebenkosten einplanen: Grunderwerbsteuer (3,5 % in Bayern bis 6,5 % u. a. in NRW und Schleswig-Holstein), Notar und Grundbuch (zusammen rund 1,5–2 %) sowie gegebenenfalls Finanzierungsnebenkosten.",
        ],
      },
      {
        h2: "Wann sich die Provision lohnt",
        paragraphs: [
          "Die Provision ist nur dann gut angelegt, wenn der Makler nachweislich Leistung bringt: realistische Preisfindung, professionelle Vermarktung, vorqualifizierte Interessenten und sichere Abwicklung bis zum Notartermin. Genau deshalb lohnt der Blick auf echte Kundenbewertungen vor der Beauftragung – unser Städtevergleich unten zeigt die bestbewerteten Makler jeder Stadt.",
        ],
      },
    ],
    faq: [
      {
        q: "Wer zahlt die Maklerprovision – Käufer oder Verkäufer?",
        a: "Bei Wohnimmobilien, die an Verbraucher verkauft werden, gilt seit Dezember 2020: Die Partei, die den Makler beauftragt, trägt mindestens 50 % der Provision. In der Praxis teilen sich Käufer und Verkäufer die Provision meist hälftig.",
      },
      {
        q: "Ist die Maklerprovision verhandelbar?",
        a: "Ja, die Provision ist gesetzlich nicht festgelegt und damit frei verhandelbar. Verhandlungsspielraum besteht besonders bei gut verkäuflichen Objekten, hohen Kaufpreisen und in Märkten mit starker Nachfrage.",
      },
      {
        q: "Wann muss die Provision bezahlt werden?",
        a: "Der Provisionsanspruch entsteht mit dem wirksamen notariellen Kaufvertrag. Die Rechnung wird üblicherweise kurz nach der Beurkundung gestellt – nicht schon bei Besichtigung oder Reservierung.",
      },
    ],
    cityLinkLabel: "Maklerkosten {stadt}",
  },
  {
    slug: "wie-finde-ich-einen-guten-immobilienmakler",
    tag: "Auswahl",
    title: "Guten Immobilienmakler finden: 7 Kriterien, die zählen",
    h1: "Wie finde ich einen guten Immobilienmakler?",
    description:
      "Guten Immobilienmakler erkennen: die 7 wichtigsten Kriterien von Google-Bewertungen über Marktkenntnis bis Vertragsgestaltung – und die Warnsignale unseriöser Anbieter.",
    quickAnswer:
      "Ein guter Immobilienmakler erkennt man an vielen echten Google-Bewertungen mit hohem Schnitt, nachweisbarer lokaler Marktkenntnis, transparenter Preisherleitung, klarer Kommunikation und einem fairen Maklervertrag ohne überlange Bindung. Werbung und Selbstdarstellung sagen dagegen wenig über Qualität aus.",
    sections: [
      {
        h2: "Die Kriterien, die wirklich zählen",
        paragraphs: [
          "Bewertungen sind der ehrlichste Qualitätsindikator, den Eigentümer vorab prüfen können: Viele Bewertungen über einen langen Zeitraum mit konkreten Details zum Ablauf sind kaum zu fälschen. Achten Sie auf die Kombination aus Durchschnittsnote und Anzahl – 5,0 Sterne aus 8 Bewertungen sind weniger belastbar als 4,8 aus 250.",
          "Lokale Spezialisierung schlägt Größe: Ein Makler, der Ihren Stadtteil seit Jahren bearbeitet, kennt erzielte Preise, typische Käufergruppen und die Besonderheiten einzelner Straßenzüge. Fragen Sie nach Referenzobjekten aus der direkten Umgebung und nach der konkreten Herleitung des vorgeschlagenen Angebotspreises.",
          "Beim Maklervertrag gilt: seriöse Makler arbeiten mit nachvollziehbaren Laufzeiten (üblich sind drei bis sechs Monate), definierten Leistungen und ohne Vorkosten. Warnsignale sind auffällig hohe Preisversprechen zur Auftragsgewinnung, Druck zur schnellen Unterschrift und Intransparenz bei der Vermarktungsstrategie.",
        ],
      },
      {
        h2: "So nutzen Sie unseren Vergleich",
        paragraphs: [
          "Wir ranken die Makler jeder Stadt ausschließlich nach echten Google-Bewertungen – Sterne-Durchschnitt und Bewertungsanzahl, ohne bezahlte Platzierungen. Wählen Sie unten Ihre Stadt, sehen Sie sich die zwei bis drei bestbewerteten Büros an und führen Sie mit diesen jeweils ein Erstgespräch. Der Vergleich mehrerer Einschätzungen schützt zuverlässig vor Ausreißern bei Preis und Leistung.",
        ],
      },
    ],
    faq: [
      {
        q: "Woran erkenne ich einen unseriösen Makler?",
        a: "Typische Warnsignale: unrealistisch hohe Preisversprechen, Vorkosten vor Vertragsabschluss, Druck zu sofortiger Unterschrift, keine nachprüfbaren Bewertungen und ausweichende Antworten zur Vermarktungsstrategie oder zu Referenzen aus Ihrer Gegend.",
      },
      {
        q: "Sollte ich mehrere Makler vergleichen?",
        a: "Ja. Holen Sie mindestens zwei bis drei Einschätzungen ein und vergleichen Sie Preisherleitung, Vermarktungskonzept und persönlichen Eindruck. Große Abweichungen bei der Bewertung sind ein wertvolles Warnsignal.",
      },
      {
        q: "Was bedeutet ein Alleinauftrag?",
        a: "Beim Alleinauftrag vermarktet nur dieser eine Makler die Immobilie für die vereinbarte Laufzeit. Das erhöht seinen Einsatz, bindet Sie aber. Üblich und fair sind Laufzeiten von drei bis sechs Monaten mit klar definierten Leistungen.",
      },
    ],
    cityLinkLabel: "Makler finden {stadt}",
  },
  {
    slug: "immobilienmakler-oder-privat-verkaufen",
    tag: "Entscheidung",
    title: "Makler oder privat verkaufen? Der ehrliche Vergleich",
    h1: "Immobilienmakler oder privat verkaufen?",
    description:
      "Mit Makler oder privat verkaufen? Der ehrliche Vergleich: Kosten, Zeitaufwand, Preisrisiko und rechtliche Fallstricke – und für wen welcher Weg passt.",
    quickAnswer:
      "Der Privatverkauf spart die Maklerprovision, kostet aber typischerweise 50 bis 100 Stunden Arbeit und birgt Preis- und Rechtsrisiken. Ein Makler lohnt sich vor allem, wenn Ihnen Zeit oder Marktkenntnis fehlen, das Objekt erklärungsbedürftig ist oder Sie räumlich weit weg wohnen. Bei einfachem Objekt, viel Zeit und guter Marktkenntnis kann der Privatverkauf funktionieren.",
    sections: [
      {
        h2: "Was der Privatverkauf wirklich bedeutet",
        paragraphs: [
          "Wer privat verkauft, übernimmt alle Maklerleistungen selbst: Preisermittlung, Fotos und Exposé, Inserate, Anfragenmanagement, Besichtigungen, Bonitätsprüfung der Interessenten, Preisverhandlung und die Vorbereitung des Notartermins. Realistisch sind dafür 50 bis 100 Arbeitsstunden über mehrere Monate – zu Zeiten, die Interessenten vorgeben, also abends und am Wochenende.",
          "Das größte Risiko ist die Preisfindung: Ohne Zugang zu tatsächlichen Abschlusspreisen orientieren sich Privatverkäufer an Angebotspreisen aus Portalen, die systematisch über den erzielten Preisen liegen. Ein zu hoher Start führt zu langer Standzeit und sichtbaren Preissenkungen; ein zu niedriger verschenkt fünfstellige Beträge – oft mehr, als die Provision gekostet hätte.",
          "Auch rechtlich trägt der Verkäufer Verantwortung: Aufklärungspflichten über bekannte Mängel, korrekte Angaben im Exposé und der Energieausweis bei Besichtigungen sind keine Formalien – Fehler können Jahre später zu Rückabwicklung oder Schadensersatz führen.",
        ],
      },
      {
        h2: "Wann welcher Weg passt",
        paragraphs: [
          "Für den Privatverkauf sprechen: ein gefragtes Standardobjekt, ausreichend Zeit, Verhandlungserfahrung und die Bereitschaft, sich in die rechtlichen Pflichten einzuarbeiten. Für den Makler sprechen: Zeitmangel, Entfernung zum Objekt, besondere Immobilien, emotionale Nähe (etwa beim Elternhaus) – und der Wunsch, den Verhandlungsprozess einem Profi zu überlassen. Wenn Sie sich für einen Makler entscheiden, vergleichen Sie vorher die Bewertungen: unten finden Sie die bestbewerteten Makler Ihrer Stadt.",
        ],
      },
    ],
    faq: [
      {
        q: "Wie viel spare ich beim Privatverkauf wirklich?",
        a: "Nominal die Verkäuferhälfte der Provision. Dagegen rechnen müssen Sie eigene Kosten (Inserate, professionelle Fotos, ggf. Bewertung), 50–100 Stunden Arbeitszeit und das Risiko eines schlechteren Verkaufspreises durch falsche Preisstrategie oder schwächere Verhandlung.",
      },
      {
        q: "Kann ich erst privat versuchen und dann einen Makler nehmen?",
        a: "Ja, das ist möglich. Beachten Sie aber: Ein Objekt, das monatelang sichtbar erfolglos inseriert war, gilt bei Interessenten als 'verbrannt' und lässt sich auch für den Makler schwerer zum ursprünglichen Preis verkaufen. Wer diesen Weg wählt, sollte den Privatversuch zeitlich eng begrenzen.",
      },
      {
        q: "Übernimmt der Notar nicht die rechtliche Absicherung?",
        a: "Der Notar beurkundet neutral und prüft den Vertrag, berät aber nicht einseitig und prüft weder Preis noch Bonität des Käufers. Aufklärungspflichten und Verhandlungsführung bleiben beim Verkäufer bzw. dessen Makler.",
      },
    ],
    cityLinkLabel: "Makler oder privat {stadt}",
  },
];

export function getPillar(slug: string): Pillar | undefined {
  return PILLARS.find((p) => p.slug === slug);
}
