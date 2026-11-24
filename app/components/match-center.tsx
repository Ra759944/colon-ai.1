"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarDays, ChevronDown, RefreshCw } from "lucide-react";

type Match = {
  id: string;
  date: string;
  time: string | null;
  round: string | null;
  competition: string;
  homeTeam: string;
  awayTeam: string;
  status: "finished" | "scheduled";
  goals: { home: number; away: number } | null;
};

type FixturesResponse = {
  competition?: string;
  season?: string;
  count?: number;
  matches?: Match[];
  notice?: string;
  error?: string;
  message?: string;
};

const leagues = [
  { id: "en.1", name: "Premier League — Angleterre" },
  { id: "en.2", name: "EFL Championship — Angleterre" },
  { id: "es.1", name: "LaLiga — Espagne" },
  { id: "fr.1", name: "Ligue 1 — France" },
  { id: "de.1", name: "Bundesliga — Allemagne" },
  { id: "it.1", name: "Serie A — Italie" },
  { id: "nl.1", name: "Eredivisie — Pays-Bas" },
  { id: "pt.1", name: "Primeira Liga — Portugal" },
];

function localDate() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lome", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

export default function MatchCenter() {
  const [date, setDate] = useState(localDate);
  const [league, setLeague] = useState("en.1");
  const [data, setData] = useState<FixturesResponse>({});
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/fixtures?date=${date}&league=${league}`);
      const result = await response.json() as FixturesResponse;
      setData(result);
    } catch {
      setData({ error: "NETWORK_ERROR", message: "Impossible de charger les matchs. Réessaie." });
    } finally {
      setLoading(false);
    }
  }, [date, league]);

  useEffect(() => { void load(); }, [load]);

  return (
    <section className="match-center" id="matchs">
      <div className="match-center-heading">
        <div><span className="eyebrow">DONNÉES FOOTBALL GRATUITES</span><h3>Matchs & résultats</h3></div>
        <button className="refresh-button" onClick={() => void load()} disabled={loading} aria-label="Actualiser"><RefreshCw size={15}/></button>
      </div>
      <div className="match-filters">
        <label><span>Compétition</span><span className="select-wrap"><select value={league} onChange={(event) => setLeague(event.target.value)}>{leagues.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select><ChevronDown size={14}/></span></label>
        <label><span>Date (heure de Lomé)</span><span className="date-wrap"><CalendarDays size={14}/><input type="date" value={date} onChange={(event) => setDate(event.target.value)}/></span></label>
      </div>
      {loading ? <p className="match-message">Chargement des données…</p> : data.error ? <p className="match-message">{data.message ?? "Erreur de chargement."}</p> : (
        <>
          <div className="match-list-title"><b>{data.competition ?? "Matchs"}</b><span>{data.count ?? 0} match(s) • {data.season ?? ""}</span></div>
          {data.matches?.length ? <div className="match-list">{data.matches.map((match) => <article className="match-row" key={match.id}>
            <div className="match-time">{match.time ?? "—"}<small>{match.round ?? match.date}</small></div>
            <div className="match-teams"><b>{match.homeTeam}</b><b>{match.awayTeam}</b></div>
            <div className="match-score">{match.goals ? <><b>{match.goals.home} - {match.goals.away}</b><small>Terminé</small></> : <small>À venir</small>}</div>
          </article>)}</div> : <p className="match-message">Aucun match trouvé pour cette date dans cette compétition.</p>}
          <p className="data-notice">{data.notice}</p>
        </>
      )}
      <div className="source-credit">Source : OpenFootball • Données publiques • Mise en cache jusqu’à 1 heure</div>
    </section>
  );
}
