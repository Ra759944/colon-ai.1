# COLON AI

Plateforme personnelle d'analyse football : statistiques, outils de pronostics prudents et suivi de bankroll.

## Stack
- Next.js 15 / React 19 / TypeScript
- Supabase (authentification et base de données, à configurer)
- API-Football (données de matchs, à configurer)
- Déploiement Vercel

## Démarrage
1. Installer les dépendances : `npm install`
2. Copier `.env.example` vers `.env.local`
3. Renseigner les variables Supabase et API-Football.
4. Lancer `npm run dev`.

## Variables d'environnement
- `NEXT_PUBLIC_SUPABASE_URL` : URL du projet Supabase.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` : clé publique/publishable Supabase.
- `API_FOOTBALL_KEY` : clé API-Football, conservée côté serveur.

Ne jamais publier de clé secrète dans GitHub ou dans le navigateur.

## État du projet
Le tableau de bord initial est en place. La route `/api/fixtures?date=AAAA-MM-JJ` interroge API-Football côté serveur lorsque la clé est configurée. Les intégrations Supabase, l'authentification et les outils d'analyse seront ajoutés progressivement. Les pronostics restent des estimations et ne garantissent aucun gain.
