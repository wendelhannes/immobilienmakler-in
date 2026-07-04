import type { Metadata } from "next";
import PillarPage from "@/components/PillarPage";
import { getPillar } from "@/lib/pillars";

const pillar = getPillar("haus-verkaufen")!;

export const metadata: Metadata = {
  title: { absolute: pillar.title },
  description: pillar.description,
  alternates: { canonical: "/haus-verkaufen" },
};

export default function Page() {
  return <PillarPage pillar={pillar} />;
}
