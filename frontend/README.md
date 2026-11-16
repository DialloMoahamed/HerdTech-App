# HerdTech — Application React

Ce dossier contient la nouvelle application front-end de **HerdTech**, construite avec React et Vite.

> **Documentation principale :** consulte le [`README.md`](../README.md) à la racine du dépôt pour découvrir le projet, ses fonctionnalités, son architecture et ses limites actuelles.

## Prérequis

- Node.js compatible avec la version de Vite utilisée par le projet.
- npm.
- Une connexion Internet pour charger les tuiles satellite Esri de la carte.

## Installation

Depuis ce dossier (`frontend/`), installe les dépendances :

```bash
npm ci
```

## Commandes disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Démarre le serveur de développement Vite. |
| `npm run lint` | Analyse le code avec ESLint. |
| `npm run build` | Génère la version de production dans `dist/`. |
| `npm run preview` | Prévisualise localement le build de production. |

Pour démarrer l'application :

```bash
npm run dev
```

Vite indique dans le terminal l'adresse locale à ouvrir dans le navigateur (généralement `http://localhost:5173`).

Avant de valider une modification, vérifie le code et le build :

```bash
npm run lint
npm run build
```

## Organisation du code

- `src/components/` : composants de navigation et composants partagés.
- `src/data/` : données de navigation et coordonnées de la ferme.
- `src/layouts/` : mises en page principales et authentification.
- `src/pages/` : pages de l'application.
- `src/services/` : logique métier et accès au `localStorage`.
- `src/styles/` : feuilles de style des pages et composants.
- `public/assets/` : icônes, images et maquettes utilisées par l'application.

Les dépendances de l'application sont définies dans `package.json` et verrouillées dans `package-lock.json`. Le dossier `node_modules/` et le résultat de compilation `dist/` ne doivent pas être versionnés.
