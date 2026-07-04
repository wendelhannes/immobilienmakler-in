import type { Metadata } from "next";
import PillarPage from "@/components/PillarPage";
import { getPillar } from "@/lib/pillars";

const pillar = getPillar("immobilienbewertung")!;

export const metadata: Metadata = {
  title: { absolute: pillar.title },
  description: pillar.description,
  alternates: { canonical: "/immobilienbewertung" },
};

export default function Page() {
  return <PillarPage pillar={pillar} />;
}
