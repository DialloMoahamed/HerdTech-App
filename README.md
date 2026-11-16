# HerdTech — Gestion intelligente d'une ferme

HerdTech est une application web de démonstration destinée à faciliter le suivi d'une exploitation d'élevage : gestion du cheptel, identification RFID, suivi des tâches, notifications et visualisation géographique de la ferme.

La nouvelle interface est développée avec **React**, **Vite** et **React Router**. La migration conserve également l'ancienne version HTML/CSS/JavaScript dans le dépôt afin de garder une référence pendant la transition.

> **État du projet :** prototype front-end. Les données métier sont actuellement enregistrées dans le `localStorage` du navigateur. L'application ne dispose pas encore d'un backend ni d'une base de données serveur.

## Fonctionnalités

### Authentification

- Inscription et connexion à l'application.
- Protection des pages réservées aux utilisateurs connectés.
- Déconnexion et gestion de la session dans le navigateur.

### Tableau de bord

- Vue d'ensemble des informations du cheptel et de l'exploitation.
- Indicateurs calculés à partir des données disponibles dans le navigateur.

### Carte de la ferme

- Carte satellite interactive construite avec **React Leaflet** et **Leaflet**.
- Centrage sur les coordonnées de la ferme définies dans `frontend/src/data/Map-coordinates.json`.
- Affichage de **27 emplacements** positionnés à partir des coordonnées GPS fournies.
- Filtres indépendants pour masquer ou afficher les huit catégories : Vaches, Taureaux, Béliers, Brebis, Véhicule, Ressources, Stockage et Capteurs.
- Fenêtre d'information sur les coordonnées de chaque marqueur.

La couche satellite utilise le service **Esri World Imagery** et nécessite une connexion Internet.

### Gestion du cheptel

- Ajout, modification et suppression des animaux.
- Affichage des animaux et de leurs informations.
- Filtres et statistiques du cheptel.

### Suivi des traqueurs RFID

- Ajout et modification des TAG RFID.
- Affichage du nombre d'animaux associés à chaque TAG.
- Consultation des animaux associés.
- Mise à jour du RFID des animaux lorsqu'un TAG est modifié.
- Suppression interdite lorsqu'un TAG est encore associé à un ou plusieurs animaux.

### Stockage

- Présentation de sept cartes d'espaces de stockage.
- Affichage des images locales et des informations descriptives prévues dans la maquette.

Les images sont des visuels statiques : aucun flux de caméra n'est connecté. Les champs `Status`, `Condition`, `Power`, `Door`, `Temperature` et `Humidity` sont encore des valeurs de démonstration, pas des mesures réelles de capteurs.

### Gestion des tâches

- Création, modification et suppression des tâches.
- Déplacement d'une tâche entre « À faire » et « Accomplies ».
- Compteurs mis à jour automatiquement.

### Notifications

- Affichage des notifications par catégorie : Routine, Vérification, Danger et Critique.
- Compteurs par catégorie et compteur total.
- Suppression individuelle des notifications.
- Synchronisation du badge de navigation après une suppression.

### Interface responsive

- Navigation horizontale sur grand écran.
- Barre de navigation fixe en bas sur mobile, avec accès directs et menu « Plus ».
- Prise en charge du thème clair et du thème sombre.

## Technologies

| Technologie | Utilisation |
|---|---|
| React 19 | Interface utilisateur |
| Vite 8 | Serveur de développement et build |
| React Router 7 | Navigation et routes protégées |
| Leaflet 1.9 | Moteur cartographique |
| React Leaflet 5 | Intégration de Leaflet dans React |
| Bootstrap 5 | Mise en page et composants |
| Bootstrap Icons | Icônes |
| CSS | Styles et responsive design |
| `localStorage` | Persistance locale des données de démonstration |

## Prérequis

- Node.js compatible avec la version de Vite utilisée par le projet.
- npm.
- Une connexion Internet pour charger les tuiles satellite Esri.

## Installation

Les commandes npm doivent être exécutées dans le dossier `frontend`.

```bash
# Depuis la racine du dépôt
cd frontend

# Installer les dépendances depuis le lockfile
npm ci

# Démarrer le serveur de développement
npm run dev
```

Vite affiche dans le terminal l'adresse locale à ouvrir dans le navigateur (habituellement `http://localhost:5173`).

## Scripts disponibles

Depuis `frontend/` :

| Commande | Description |
|---|---|
| `npm run dev` | Démarre le serveur de développement Vite |
| `npm run lint` | Vérifie le code avec ESLint |
| `npm run build` | Génère la version de production dans `dist/` |
| `npm run preview` | Sert localement le build de production |

Avant de proposer une modification, il est recommandé de lancer :

```bash
npm run lint
npm run build
```

## Organisation du projet

```text
HerdTech-App/
├── README.md
├── README-exercices-JavaScript.md  # Documentation des exercices JavaScript d'origine
├── Carte.html                     # Ancienne interface HTML conservée
├── Cheptel.html
├── Login.html
├── Notifications.html
├── Signin.html
├── Stockage.html
├── Suivi.html
├── Taches.html
├── index.html
├── js/                             # Anciens scripts JavaScript conservés
├── style.css                       # Ancienne feuille de style conservée
└── frontend/                       # Nouvelle application React
    ├── public/
    │   └── assets/
    │       ├── designs/
    │       ├── icons/
    │       └── images/
    └── src/
        ├── components/             # Navbar, navigation, routes protégées
        ├── data/                   # Navigation et coordonnées GPS
        ├── layouts/                # Layout principal et layout d'authentification
        ├── pages/                  # Pages React de l'application
        ├── services/               # Authentification et logique métier
        └── styles/                 # Feuilles de style par module
```

## Données et limites actuelles

- Les comptes, sessions, animaux, TAG, tâches et notifications sont stockés dans le `localStorage` du navigateur.
- Les collections métier utilisent un identifiant utilisateur pour filtrer les données affichées par compte.
- Les données restent propres au navigateur et à son origine : elles ne sont pas synchronisées entre appareils.
- L'isolation par `userId` dans le front-end est une organisation des données de démonstration, **pas un mécanisme de sécurité serveur**.
- Dans cette version de démonstration, le mot de passe est conservé dans le `localStorage`. Cette méthode n'est pas adaptée à une application en production. Une future version devra utiliser un backend, un stockage sécurisé des mots de passe (hachage côté serveur), une authentification robuste et des autorisations vérifiées côté serveur.
- Les données de stockage et les notifications initiales sont des exemples. Elles ne proviennent pas encore de capteurs, de caméras ou d'un service distant.

## État de la migration

La nouvelle interface React comprend les modules suivants :

- Authentification
- Tableau de bord
- Carte
- Cheptel
- Stockage
- Suivi RFID
- Gestion des tâches
- Notifications

L'ancienne version HTML/CSS/JavaScript est conservée dans le dépôt comme référence pendant la migration. La nouvelle application se trouve dans `frontend/`.

## Pistes d'évolution

- Ajouter un backend et une base de données pour synchroniser les données entre appareils.
- Déplacer l'authentification et les contrôles d'accès côté serveur.
- Connecter les capteurs et les caméras à de vraies sources de données.
- Remplacer les valeurs de démonstration du stockage par des mesures réelles.
- Optimiser le découpage du bundle JavaScript et le chargement des pages.

---

**HerdTech** — prototype de gestion d'une exploitation d'élevage.
