import { NextRequest, NextResponse } from "next/server";
import { runFreeChecks } from "@/lib/audit/free-checks";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const url = (body.url || "").trim();
  if (!url || url.length > 300) {
    return NextResponse.json({ error: "Bitte eine gültige Website-URL angeben." }, { status: 400 });
  }

  const result = await runFreeChecks(url);
  if ("error" in result) {
    return NextResponse.json(result, { status: 422 });
  }

  return NextResponse.json(result, {
    // Kurzes Edge/CDN-Caching pro Domain gegen Mehrfach-Ausführung.
    headers: { "Cache-Control": "public, max-age=0, s-maxage=3600" },
  });
}
