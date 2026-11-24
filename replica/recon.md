# COLON AI — reconnaissance fonctionnelle

- Référence étudiée : https://alvecapital.fr/ (pages publiques uniquement)
- Produit cible : application web responsive, mobile-first, identité COLON AI originale
- Public : utilisateurs majeurs recherchant des données et outils d'analyse sportive, football prioritaire
- Périmètre : reproduire des catégories de fonctionnalités et parcours, jamais le code, la marque, les textes, les visuels ou les API privées de la référence.
- Méthode : lecture manuelle des pages publiques et de leur contenu indexé ; aucune connexion, collecte massive ou extraction de code.

## Sources publiques
| Source | Apports |
|---|---|
| https://alvecapital.fr/ | Générateur de coupons, choix bookmaker et cote cible, aperçu d'opportunités d'arbitrage |
| https://alvecapital.fr/about | Positionnement IA, analyses multi-sports, ScanBet/OCR, historique vérifiable, transparence et avertissements |
| https://alvecapital.fr/VoixTest | Présentation publique de quatre modules : arbitrage, coupons, pronostics, montante/virtuel |
| https://alvecapital.fr/contact | Parcours public de personnalisation d'un générateur et informations de contact |
| https://alvecapital.fr/privacy | Catégories de données, comptes, abonnements, consentements et risques de l'automatisation |

Limite : l'espace connecté, les états après connexion, les algorithmes internes, les flux de paiement et les pages privées ne sont pas observables. Ils ne sont pas supposés connus. Les écrans privés COLON AI seront conçus à partir des besoins propres au produit.

## Inventaire des écrans
| ID | Écran / route proposée | But | Éléments clés | États à gérer |
|---|---|---|---|---|
| S01 | / | Présentation et accès | proposition de valeur, modules, CTA connexion/inscription | visiteur, mobile |
| S02 | /auth/sign-up | Créer un compte | email, mot de passe, validation, consentements | erreur, chargement, confirmation |
| S03 | /auth/sign-in | Se connecter | formulaire, récupération mot de passe | erreur, session expirée |
| S04 | /dashboard | Vue personnelle | activité, matchs du jour, bankroll, alertes | vide, chargé, erreur |
| S05 | /matches | Calendrier des matchs | date, compétition complète, équipes, statut | chargement, aucun match, erreur |
| S06 | /matches/[id] | Analyse d'un match | forme, buts, tirs cadrés, corners, absences si disponibles, cotes et incertitudes | données partielles, indisponible |
| S07 | /predictions | Analyses et pronostics | filtres, probabilité estimée, justification, niveau de risque | vide, chargé |
| S08 | /coupon-builder | Générateur de coupons | bookmaker, cote cible, marchés, budget, exclusions | aucune sélection, validation, limites |
| S09 | /odds | Comparateur de cotes | marché, opérateur, horodatage, écart | cotes périmées, fournisseur indisponible |
| S10 | /arbitrage | Calculateur d'arbitrage | deux issues ou plus, cotes, commission, répartition des mises, marge théorique | aucune opportunité, cotes changées |
| S11 | /bankroll | Gestion du capital | dépôts, mises, résultats, limites, historique | nouveau compte, erreur |
| S12 | /ticket-scanner | Lecture de ticket | import image, OCR, extraction et confirmation manuelle | image invalide, OCR incertain |
| S13 | /virtual | Football virtuel | catalogue et analyses distinctes des matchs réels | fournisseur absent |
| S14 | /pricing | Offres | fonctionnalités gratuites/premium, conditions claires | plan actif, plan expiré |
| S15 | /profile | Profil et préférences | profil, devise FCFA, fuseau, limites, suppression compte | sauvegarde, erreur |
| S16 | /admin | Administration | utilisateurs, rôles, contenu et audit | accès refusé |

## Parcours principaux
- F01 — Découvrir et s'inscrire : S01 → S02 → confirmation email → S04.
- F02 — Analyser un match : S04/S05 → S06 → consulter données, faits, estimations et risques.
- F03 — Construire un coupon : S08 → sélectionner bookmaker et cote cible → filtrer les matchs → vérifier les sélections → enregistrer le coupon.
- F04 — Comparer des cotes : S09 → choisir match et marché → comparer les cotes horodatées.
- F05 — Évaluer un arbitrage : S10 → saisir/importer des cotes → calculer la marge et les mises → vérifier frais, limites et changement de cote avant toute décision.
- F06 — Suivre la bankroll : S11 → enregistrer une mise/résultat → recalculer solde et performance.
- F07 — Scanner un ticket : S12 → importer une image → OCR → confirmer/corriger chaque donnée → enregistrer.
- F08 — Gérer un abonnement : S14 → choisir une offre → paiement via prestataire légal disponible → webhook vérifié → accès mis à jour.
- F09 — Administrer : S16 → contrôle du rôle serveur → action journalisée.

## Composants partagés
AppShell, Sidebar, MobileNav, Topbar, MatchCard, CompetitionBadge, OddsCell, StatCard, RiskBadge, ProbabilityMeter, FilterBar, DateSelector, EmptyState, LoadingSkeleton, ErrorPanel, ConfirmDialog, FormField, Toast, Paywall, BankrollSummary, CouponLeg, ArbitrageCalculator, UploadDropzone, DataFreshnessLabel.

## Modèle de données inféré
- profiles : identité publique et préférences utilisateur.
- matches / competitions / teams : cache de données sportives provenant d'API autorisées.
- predictions : une analyse par match et marché, avec méthode, probabilité estimée, justification, version de modèle et résultat.
- odds_snapshots : cotes observées, bookmaker, marché, sélection et horodatage.
- coupons / coupon_legs : coupons de l'utilisateur et sélections associées.
- bankrolls / transactions : capital, mises, gains/pertes et devise.
- subscriptions : plan et état confirmé côté serveur.
- scan_jobs : image et résultat OCR, avec suppression/rétention contrôlée.
- audit_logs : actions administratives sensibles.

Les données fournisseurs et les probabilités sont distinctes : une cote n'est pas une probabilité garantie. Les valeurs calculées par COLON AI sont marquées comme estimations.

## Hors périmètre / limites
- Pas de copie de logo, nom, textes, images, code, design exact ou éléments protégés d'AL VE CAPITAL.
- Pas d'accès à ses comptes, endpoints privés, bundles, cookies, réseau interne ou base de données.
- Pas d'exécution automatique de paris ni de stockage d'identifiants/cookies bookmaker.
- Pas de promesse de gain ni de présentation d'un arbitrage comme absolument sans risque : limites de mise, annulations, commissions, latence, erreurs et changements de cote peuvent annuler l'avantage théorique.
- Les marchés virtuels, autres sports, OCR avancé et paiements premium seront activés seulement après validation des fournisseurs et obligations légales.

## Taille et ordre de réalisation
Taille globale : XL si tout le catalogue est livré simultanément. Réduction du risque par tranches :
1. MVP : authentification, matchs/compétitions réels, fiche match, analyses transparentes, bankroll manuelle.
2. Coupons et comparateur alimentés par sources licenciées.
3. Arbitrage calculateur manuel/assisté avec garde-fous.
4. OCR, premium, administration, sports virtuels et multi-sports.
Les écrans et fonctionnalités sont planifiés, pas encore tous implémentés.
