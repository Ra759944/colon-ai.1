import { NextRequest, NextResponse } from "next/server";

const API_URL = "https://v3.football.api-sports.io";

export async function GET(request: NextRequest) {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) {
    return NextResponse.json({ error: "API_FOOTBALL_KEY_NOT_CONFIGURED", message: "La clé API-Football doit être configurée dans les variables d’environnement du serveur." }, { status: 503 });
  }

  const date = request.nextUrl.searchParams.get("date") ?? new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "INVALID_DATE", message: "La date doit être au format AAAA-MM-JJ." }, { status: 400 });
  }

  try {
    const response = await fetch(`${API_URL}/fixtures?date=${date}`, {
      headers: { "x-apisports-key": key },
      cache: "no-store",
    });
    const data: unknown = await response.json();
    if (!response.ok) {
      return NextResponse.json({ error: "FOOTBALL_PROVIDER_ERROR", details: data }, { status: response.status });
    }
    return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "FOOTBALL_PROVIDER_UNAVAILABLE", message: "Impossible de joindre le fournisseur de données football." }, { status: 502 });
  }
}
