import type { Metadata } from "next";
import PillarPage from "@/components/PillarPage";
import { getPillar } from "@/lib/pillars";

const pillar = getPillar("was-kostet-ein-immobilienmakler")!;

export const metadata: Metadata = {
  title: { absolute: pillar.title },
  description: pillar.description,
  alternates: { canonical: "/was-kostet-ein-immobilienmakler" },
};

export default function Page() {
  return <PillarPage pillar={pillar} />;
}
