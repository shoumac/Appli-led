# LED3 Academy

Application statique de révision LED3, compatible GitHub Pages.

## Mise à jour
- Sessions 01 à 24 disponibles.
- Sessions 17 à 24 ajoutées avec résumé, notions essentielles et flashcards de session.
- Banque de QCM enrichie avec les nouvelles questions des sessions 17 à 24 et des questions de consolidation.
- Flashcards et anti-sèche complétées.

## Publication
Décompresser le contenu du ZIP puis téléverser les fichiers à la racine du dépôt GitHub Pages, en conservant les noms des fichiers et les images existantes.


## Sessions 25 à 31 et suivi pédagogique

Les sessions 25 à 31 sont intégrées avec cours et QCM de cinq questions par session. La progression est disponible dans `progression.html` avec export PDF via impression du navigateur et sauvegarde JSON. `formateur.html` fournit une synthèse locale des résultats. Sur GitHub Pages statique, les données restent locales à l’appareil ; un suivi distant sécurisé nécessite un backend avec authentification.


## Synchronisation Supabase (préparation)
- Ouvrir `connexion.html` pour se connecter avec un compte déjà créé dans Supabase Authentication.
- Les résultats `led3_*` sont envoyés vers `student_snapshots` après connexion.
- `formateur.html` exige une session et un lien explicite dans `trainer_student_links`.
- Exécuter `supabase-setup.sql` dans l'Éditeur SQL si nécessaire. Les tables/politiques existantes peuvent être conservées.
- Après création des comptes élève et formateur, un administrateur doit insérer le lien entre leurs UUID dans `trainer_student_links`. Ne jamais mettre une clé secrète dans les fichiers du site.
- Tester d'abord avec des comptes de test : l'intégration n'est pas une certification de sécurité.
