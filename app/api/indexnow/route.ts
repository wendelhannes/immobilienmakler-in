import { NextResponse } from "next/server";

const KEY = "8c71b7c3460c101edbff48a2552867d5";
const HOST = "https://immobilienmakler-in.com";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";

export async function POST(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.INDEXNOW_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { urls?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const urls = body.urls;
  if (!Array.isArray(urls) || urls.length === 0) {
    return NextResponse.json({ error: "urls array required" }, { status: 400 });
  }

  const fullUrls = urls.map((u) =>
    u.startsWith("http") ? u : `${HOST}${u.startsWith("/") ? "" : "/"}${u}`
  );

  const payload = {
    host: "immobilienmakler-in.com",
    key: KEY,
    keyLocation: `${HOST}/${KEY}.txt`,
    urlList: fullUrls.slice(0, 10000),
  };

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  return NextResponse.json({
    status: res.status,
    submitted: fullUrls.length,
    indexNowResponse: res.ok ? "accepted" : await res.text(),
  });
}
