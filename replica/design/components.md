# COLON AI — composants UI

## AppShell
- Variants : sidebar desktop, navigation compacte mobile.
- États : navigation active, session absente, session chargée.
- Accessibilité : landmarks, lien d'évitement, ordre de tabulation logique.

## Button
- Variants : primary, secondary, ghost, danger.
- États : default, hover, active, focus-visible, disabled, loading.
- Accessibilité : élément button natif, libellé conservé pendant loading.

## MatchCard
- Contenu : nom complet de la compétition, équipes, heure locale, statut et lien détail.
- États : live, à venir, terminé, données partielles.
- Ne jamais masquer la compétition ou inventer une statistique manquante.

## RiskBadge
- Valeurs : faible, modéré, élevé, indéterminé.
- Affiche une explication textuelle ; la couleur seule ne porte pas l'information.

## DataFreshnessLabel
- Affiche source, heure de mise à jour et avertissement si les données sont anciennes.

## StatCard / ProbabilityMeter
- Les nombres mesurés sont étiquetés « statistique » ; les probabilités sont étiquetées « estimation ».
- Pas de pourcentage sans source, méthode ou intervalle d'incertitude.

## FormField
- Label explicite, aide, erreur liée par aria-describedby, focus visible.

## EmptyState / LoadingSkeleton / ErrorPanel
- Chaque liste et widget possède ces trois états.
- L'erreur propose une action de reprise sans masquer la cause.

## CouponLeg / OddsCell
- Affichent bookmaker, marché, sélection, cote, source et horodatage.
- Un état périmé bloque le calcul final tant que l'utilisateur n'a pas confirmé la cote.

## ArbitrageCalculator
- Entrées éditables, calcul déterministe, commissions, arrondis et marge théorique.
- Affiche un avertissement explicite : arbitrage théorique ≠ gain garanti.

## UploadDropzone
- Formats image acceptés listés, taille max, progression, suppression.
- L'OCR ne sauvegarde rien avant confirmation/correction par l'utilisateur.

## MobileNav
- Contrôles accessibles au clavier et lecteur d'écran ; zones tactiles confortables.
