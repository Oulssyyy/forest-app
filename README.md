# Forest App - Calcul d'absorption de CO2

Ulysse HOLZINGER INFRES17

## Ce que j'ai fait
* Développement d'une API REST avec Express pour la gestion de l'absorption de CO2 par les arbres.
* Implémentation d'un CRUD complet pour les ressources Arbres et Forêts.
* Développement d'une fonctionnalité pour retourner toutes les espèces d'arbres d'une forêt.
* Développement d'un moteur de calcul d'absorption intégrant un ratio de diversité des espèces (plus de diversité = plus d'absorption).
* Ajout d'une fonctionnalité de calcul de la surface forestière nécessaire pour absorber une quantité donnée de CO2.
* Implémentation d'une fonctionnalité bonus : conversion de l'absorption en équivalent d'émissions annuelles de voitures.
* Mise en place d'une documentation interactive via Swagger/OpenAPI

## Comment je l'ai fait
* **Architecture Hexagonale** : Séparation stricte entre le Domaine (modèles et services métier), l'Infrastructure (adaptateurs) et la Présentation (contrôleurs).
* **Principes SOLID** : Utilisation de l'inversion de dépendance via des interfaces (Ports) pour découpler le cœur métier des détails d'implémentation.
* **Clean Code** : Typage TypeScript rigoureux (évitement du `any`), suppression des "nombres magiques" via des constantes nommées et respect des conventions de nommage explicites.
* **Robustesse** : Validation systématique des données entrantes avec la bibliothèque Zod pour prévenir les erreurs de format et sécuriser l'application contre les injections.
* **Tests unitaires** : Utilisation de Mocks pour isoler les tests et application du pattern "Arrange, Act, Assert" pour garantir la fiabilité du code métier.

## Comment lancer l’application
1. **Installation des dépendances** : `npm install`
2. **Lancement des tests** : `npm test`.
3. **Mode développement** : `npm run dev`
5. **Accès** : Le serveur écoute sur le port 3000 par défaut, et la documentation Swagger est accessible sur `http://localhost:3000/docs`.