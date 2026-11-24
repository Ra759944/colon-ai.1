# Architecture des données football — COLON AI

## Source MVP
- openfootball/football.json : calendriers et résultats en données du domaine public.
- Fichiers JSON servis depuis GitHub Raw, sans clé API.
- Route serveur : GET /api/fixtures?date=YYYY-MM-DD&league=en.1.
- Cache : environ une heure.
- Nom complet de la compétition transmis avec chaque match.

## Compétitions branchées
- Premier League (Angleterre) : en.1
- EFL Championship (Angleterre) : en.2
- LaLiga (Espagne) : es.1
- Ligue 1 (France) : fr.1
- Bundesliga (Allemagne) : de.1
- Serie A (Italie) : it.1\n- Eredivisie (Pays-Bas) : nl.1\n- Primeira Liga (Portugal) : pt.1

## Limites de la source
Pas de direct fiable, cotes, compositions, blessures, tirs cadrés ou corners. Les champs absents restent null ; ne pas générer de pronostic comme s'il était fondé sur des statistiques indisponibles.

## Sources complémentaires évaluées
- Open Matchday : résultats, calendriers et statistiques pour plusieurs compétitions, mais licence annoncée non commerciale ; exclu des fonctions premium/commerciales sans autorisation écrite.
- StatsBomb Open Data : événements détaillés sur un sous-ensemble de compétitions historiques, attribution/licence à respecter ; utile pour tester les modèles, pas pour couvrir les matchs du jour.
- openfootball/world : calendriers et résultats pour plusieurs ligues africaines, format Football.TXT à normaliser avant intégration.

Chaque donnée doit porter sa source et sa fraîcheur. Ne jamais inventer cotes, compositions, statistiques ou scores en direct.
