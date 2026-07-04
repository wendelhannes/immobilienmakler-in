import type { Metadata } from "next";
import PillarPage from "@/components/PillarPage";
import { getPillar } from "@/lib/pillars";

const pillar = getPillar("wie-finde-ich-einen-guten-immobilienmakler")!;

export const metadata: Metadata = {
  title: { absolute: pillar.title },
  description: pillar.description,
  alternates: { canonical: "/wie-finde-ich-einen-guten-immobilienmakler" },
};

export default function Page() {
  return <PillarPage pillar={pillar} />;
}
