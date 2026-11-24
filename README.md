# COLON AI

Plateforme d'analyse football en français, avec gestion de bankroll et outils de pronostics prudents.

## Stack
- Next.js 15 / React 19 / TypeScript
- Supabase Auth + PostgreSQL + RLS
- Vercel
- OpenFootball : calendriers et résultats en données du domaine public

## Données gratuites
Le MVP utilise [openfootball/football.json](https://github.com/openfootball/football.json), sans clé API.
Compétitions intégrées : Premier League (Angleterre), EFL Championship (Angleterre), LaLiga (Espagne), Ligue 1 (France), Bundesliga (Allemagne), Serie A (Italie), Eredivisie (Pays-Bas), Primeira Liga (Portugal).
Route : \`GET /api/fixtures?date=AAAA-MM-JJ&league=en.1\`.
Codes : \`en.1\`, \`en.2\`, \`es.1\`, \`fr.1\`, \`de.1\`, \`it.1\`. Saison automatique ou \`season=2026-27\`.

## Limites
Cette source ne garantit pas les scores en direct et ne fournit pas les cotes, compositions, absences, tirs cadrés ou corners. La couverture et la fraîcheur dépendent des contributeurs.
Les pronostics restent des estimations, sans garantie de gains.

## Démarrage
1. \`npm install\`
2. Configurer \`.env.local\` avec les variables Supabase.
3. \`npm run dev\`

Variables : \`NEXT_PUBLIC_SUPABASE_URL\`, \`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY\` (ou ancienne \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`).
Aucune clé RapidAPI ou API-Football n'est nécessaire pour le centre de matchs actuel.
