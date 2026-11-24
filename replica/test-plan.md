# COLON AI — plan de test initial

## F01 Inscription / connexion
- F01-H1 : inscription valide, email de confirmation, redirection vers dashboard.
- F01-N1 : mauvais mot de passe, message non révélateur et aucune session.
- F01-E1 : double clic sur soumission, un seul compte/opération.
- F01-E2 : rafraîchir après confirmation et vérifier la persistance de session.
- F01-E3 : utilisateur A ne peut pas lire les données de bankroll de B.

## F02 Matchs et analyse
- F02-H1 : choisir une date, afficher les rencontres et le nom complet de chaque compétition.
- F02-E1 : aucun match à la date choisie.
- F02-E2 : API indisponible ou quota dépassé, état d'erreur clair.
- F02-E3 : champs statistiques manquants, ne pas les remplacer par zéro.
- F02-E4 : horaire affiché dans le fuseau de profil.

## F03 Générateur de coupons
- F03-H1 : choisir une cote cible et ajouter des sélections valides.
- F03-N1 : cote invalide ou inférieure/égale à 1 rejetée.
- F03-E1 : cote mise à jour entre sélection et validation, recalcul demandé.
- F03-E2 : marché ou match supprimé/annulé, coupon marqué à vérifier.

## F04 Bankroll
- F04-H1 : créer un capital XOF et enregistrer dépôt, mise et retour.
- F04-N1 : montant nul, négatif ou dépassement de solde refusé.
- F04-E1 : deux onglets ouverts, aucune transaction dupliquée.
- F04-E2 : données d'un autre utilisateur invisibles par RLS.

## F05 Arbitrage
- F05-H1 : calcul avec deux cotes supérieures à 1 et affichage des mises théoriques.
- F05-N1 : cote manquante, nulle ou non numérique rejetée.
- F05-E1 : intégrer commission et arrondis XOF.
- F05-E2 : marge négative ou nulle affichée comme absence d'arbitrage.
- F05-E3 : afficher risques d'annulation, limites, changement de cote et exécution.

## F06 OCR
- F06-H1 : image lisible, extraction puis confirmation manuelle.
- F06-N1 : type non-image, image trop volumineuse ou corrompue rejetée.
- F06-E1 : OCR incertain, demander correction au lieu d'enregistrer silencieusement.

## Contrôles transverses
- Viewports : 390px et 1440px.
- Navigation clavier, focus visible, labels et erreurs accessibles.
- Pas d'erreur console ni de réponse 5xx sur les parcours valides.
- Contrôle RLS avec deux utilisateurs.
- Tests automatisés Playwright à ajouter lorsque l'environnement de build est disponible.

## Statut
Plan rédigé, aucun test d'exécution déclaré réussi à ce stade.
