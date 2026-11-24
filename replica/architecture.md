# COLON AI — architecture

## Stack
- Next.js 15 App Router + React 19 + TypeScript : conserve la base existante.
- CSS variables et composants accessibles maison : évite d'ajouter une grosse dépendance UI.
- Supabase Postgres + Supabase Auth + RLS : comptes et données personnelles.
- API-Football : calendrier, compétitions, équipes et statistiques ; clé exclusivement serveur.
- Vercel : hébergement Next.js et variables d'environnement.
- Pas de microservices au MVP. Pas de paiement avant validation du prestataire et du cadre légal.

## Principes de données
- Conserver la réponse brute minimale du fournisseur avec date de collecte et identifiant externe.
- Toute donnée affichée porte une source et une date de fraîcheur lorsque disponible.
- Distinguer statistiques observées, cotes observées, calculs déterministes et estimations de modèle.
- Enregistrer la compétition avec son nom complet.
- Stocker les heures en timestamptz UTC ; afficher dans le fuseau du profil.
- FCFA stocké comme montant entier en XOF (pas de décimales implicites).
- Aucune clé secrète dans le navigateur ou Git.

## Tables prévues
profiles, competitions, teams, matches, predictions, odds_snapshots, bankrolls, bankroll_transactions, coupons, coupon_legs, subscriptions, scan_jobs, audit_logs.

Toutes les tables privées ont un owner_id/user_id et des politiques RLS. Les données de référence de matchs sont lisibles selon la stratégie de cache publique définie ; les écritures sont réservées au service role côté serveur.

## Routes API prévues
| Méthode / chemin | Accès | Rôle |
|---|---|---|
| GET /api/fixtures?date=YYYY-MM-DD | public / limité | Matchs du jour via API-Football |
| GET /api/matches/:id | public / limité | Détail et statistiques |
| GET /api/predictions | connecté | Analyses et historique |
| POST /api/coupons | connecté | Enregistrer un coupon |
| POST /api/arbitrage/calculate | public / limité | Calcul pur à partir de cotes saisies |
| GET/POST /api/bankroll | connecté | Consulter et enregistrer ses opérations |
| POST /api/scan | connecté | OCR après validation du type et poids de fichier |
| POST /api/webhooks/:provider | fournisseur | Webhook signé et idempotent, seulement après sélection du prestataire |

## Sécurité
- Supabase RLS sur chaque table appartenant à un utilisateur.
- Validation serveur avec Zod avant toute mutation.
- API-Football uniquement côté serveur, timeout et gestion des quotas.
- Rate limit sur auth, scan et routes coûteuses.
- Ne jamais demander ou stocker mot de passe, cookie ou jeton de compte bookmaker.
- Webhooks signés, idempotents et journalisés.
- Images OCR limitées en taille/type et supprimées selon une politique explicite.
- Accès admin vérifié côté serveur, jamais depuis un simple booléen client.
- Pas de mise automatique.
- Mentions 18+, jeu responsable, risques et limites selon les juridictions.

## Plan de livraison vertical
1. Fondation : variables, clients Supabase server/browser, auth, middleware/session, migrations RLS, pages login/inscription.
2. Football MVP : valider API-Football, fixtures, compétition complète, fiche match et états erreur/vide/chargement.
3. Analyse : calculs reproductibles, probabilités explicitement estimées, historique et calibration.
4. Bankroll : saisie manuelle, limites, résultats et historique.
5. Coupons / odds : uniquement après identification d'une source de cotes autorisée et de ses conditions.
6. Arbitrage : calculateur transparent, commissions, minimums, arrondis et risque d'exécution.
7. OCR et premium, puis virtual/multi-sports.

## Risques techniques
- Quotas et couverture incomplète API-Football.
- Les cotes changent vite et les bookmakers peuvent limiter ou annuler un pari.
- La calibration des probabilités exige des données historiques fiables et une évaluation hors échantillon.
- Les paiements Mobile Money dépendent du fournisseur, du pays et des webhooks.
- OCR doit demander confirmation humaine avant enregistrement.
