# 📚 Exercices JavaScript — Gestion d'une application d'élevage

Ce projet regroupe plusieurs exercices JavaScript réalisés progressivement afin de pratiquer la manipulation du DOM, des tableaux, des objets et du `localStorage`.

L'objectif est de construire les fonctionnalités **une par une**, sans copier-coller directement une solution complète.

---

# 🌙 Exercice N°2 — Gestion du mode Dark & Light

## Objectif

Permettre à l'utilisateur de changer le thème de l'application depuis les paramètres de la navbar.

Le thème choisi doit rester enregistré même après actualisation de la page.

### Fonctionnalités

- Activer le mode sombre
- Activer le mode clair
- Modifier l'apparence de l'ensemble du site
- Adapter les icônes et les éléments visuels
- Sauvegarder le thème dans `localStorage`
- Restaurer automatiquement le thème au chargement de la page

### Notions pratiquées

```js
classList.toggle()
classList.add()
classList.contains()
localStorage.getItem()
localStorage.setItem()
```

---

# 🐄 Exercice N°3 — Gestion du cheptel

## Objectif

Développer un système permettant de gérer les animaux du cheptel.

L'utilisateur doit pouvoir :

- Créer un animal
- Modifier un animal
- Supprimer un animal
- Filtrer les animaux
- Consulter les statistiques du cheptel

---

## Étape 3.1 — Préparer les données

### À faire

- Définir la structure d'un animal
- Créer le tableau des animaux
- Récupérer les animaux depuis `localStorage`
- Préparer les données nécessaires au tableau

Exemple de structure :

```js
{
    id: 1,
    rfid: "TAG_1",
    sex: "male",
    category: "bovins",
    birthDate: "2023-07-19",
    status: "sain"
}
```

---

## Étape 3.2 — Génération de l'ID

### À faire

- Vérifier si le tableau est vide
- Commencer l'ID à `1`
- Récupérer le dernier ID existant
- Générer automatiquement le prochain ID

### Notions à pratiquer

```js
Math.max()
map()
length
```

---

## Étape 3.3 — Ajouter un animal

### À faire

- Récupérer les valeurs du formulaire
- Récupérer le RFID
- Récupérer la catégorie
- Récupérer le sexe
- Récupérer la date de naissance
- Récupérer le statut
- Créer l'objet animal
- Ajouter l'animal au tableau
- Sauvegarder dans `localStorage`
- Réafficher le tableau

### Notions à pratiquer

```js
value
push()
JSON.stringify()
localStorage.setItem()
```

---

## Étape 3.4 — Afficher les animaux

### À faire

- Supprimer les données écrites en dur dans le tableau
- Parcourir le tableau des animaux
- Générer dynamiquement les lignes `<tr>`
- Afficher les informations de chaque animal
- Ajouter les boutons Modifier / Supprimer
- Actualiser automatiquement le tableau après chaque modification

### Notions à pratiquer

```js
forEach()
innerHTML
```

---

## Étape 3.5 — Modifier un animal

### À faire

- Récupérer l'ID de l'animal
- Trouver l'animal concerné
- Afficher ses informations dans le formulaire
- Modifier les valeurs
- Mettre à jour l'animal
- Sauvegarder dans `localStorage`
- Actualiser le tableau

### Notions à pratiquer

```js
find()
findIndex()
```

---

## Étape 3.6 — Supprimer un animal

### À faire

- Récupérer l'ID de l'animal
- Demander une confirmation
- Supprimer l'animal
- Mettre à jour le tableau
- Sauvegarder dans `localStorage`
- Actualiser l'affichage

### Notion à pratiquer

```js
filter()
```

---

## Étape 3.7 — Filtrer les animaux

Les animaux doivent pouvoir être filtrés selon :

- RFID / TAG
- Sexe
- Catégorie
- Date de naissance
- Statut

### Progression recommandée

Commencer par :

```text
RFID
  ↓
Sexe
  ↓
Catégorie
  ↓
Date de naissance
  ↓
Statut
```

Puis permettre l'utilisation de **plusieurs filtres simultanément**.

### Notions à pratiquer

```js
filter()
includes()
```

---

## Étape 3.8 — Statistiques

Afficher automatiquement :

- Nombre total d'animaux
- Nombre de bovins
- Nombre d'ovins
- Nombre de chèvres
- Nombre par catégorie
- Autres statistiques utiles

### Notions à pratiquer

```js
length
filter()
forEach()
```

---

# 🏷️ Exercice N°4 — Gestion des TAG

## Objectif

Permettre de gérer les TAG utilisés pour identifier les animaux.

Un TAG doit pouvoir être :

- Créé
- Modifié
- Supprimé
- Associé à plusieurs animaux

---

## Étape 4.1 — Structure d'un TAG

Exemple :

```js
{
    id: 1,
    code: "TAG_1"
}
```

### À faire

- Créer le tableau des TAG
- Sauvegarder les TAG dans `localStorage`
- Générer automatiquement les IDs

---

## Étape 4.2 — CRUD des TAG

Créer les fonctionnalités :

- Créer un TAG
- Afficher les TAG
- Modifier un TAG
- Supprimer un TAG
- Sauvegarder les modifications
- Actualiser l'affichage

---

## Étape 4.3 — Afficher les animaux associés

Pour chaque TAG, afficher :

```text
TAG_1

Nombre d'animaux : 3

Animal 1
Animal 2
Animal 3
```

### À faire

- Rechercher les animaux associés à un TAG
- Compter les animaux associés
- Afficher la liste des animaux

### Notions à pratiquer

```js
filter()
length
forEach()
```

---

## Étape 4.4 — Synchronisation Cheptel ↔ TAG

Lorsqu'un animal change de TAG dans le cheptel :

```text
Avant :

Animal 1 → TAG_1

Après :

Animal 1 → TAG_3
```

La page des TAG doit automatiquement afficher les nouvelles informations.

### Principe important

Les animaux restent la **source principale des informations**.

```text
Animal
   ↓
TAG associé
   ↓
Recherche des animaux possédant ce TAG
   ↓
Calcul du nombre d'animaux
```

Cela évite de stocker inutilement les mêmes informations à plusieurs endroits.

---

# ✅ Exercice N°5 — Gestion des tâches

## Objectif

Permettre à l'utilisateur de gérer ses tâches.

---

## Étape 5.1 — Structure d'une tâche

Exemple :

```js
{
    id: 1,
    title: "Vacciner les bovins",
    completed: false
}
```

---

## Étape 5.2 — Créer une tâche

### À faire

- Récupérer les données du formulaire
- Générer un ID
- Créer la tâche
- Ajouter la tâche au tableau
- Sauvegarder dans `localStorage`
- Afficher la tâche

---

## Étape 5.3 — Afficher les tâches

Créer deux listes :

### Tâches à faire

```text
☐ Vacciner les bovins

☐ Vérifier les stocks

☐ Nettoyer l'étable
```

### Tâches complétées

```text
✓ Vacciner les bovins

✓ Vérifier les stocks
```

---

## Étape 5.4 — Compléter une tâche

Lorsqu'une tâche est cochée :

```text
completed: false
        ↓
completed: true
```

Puis :

- Sauvegarder la modification
- Retirer la tâche de la liste des tâches à faire
- Ajouter la tâche aux tâches complétées
- Actualiser l'affichage

---

## Étape 5.5 — Modifier / supprimer

### À faire

- Modifier une tâche
- Supprimer une tâche
- Sauvegarder les modifications
- Actualiser les listes

---

# 🔔 Exercice N°6 — Gestion des notifications

## Objectif

Gérer les notifications et maintenir automatiquement le compteur affiché dans la navbar.

---

## Étape 6.1 — Structure d'une notification

Exemple :

```js
{
    id: 1,
    message: "Nouvel animal ajouté",
    category: "cheptel"
}
```

---

## Étape 6.2 — Afficher les notifications

### À faire

- Récupérer les notifications
- Les afficher dans la page
- Afficher leur catégorie
- Ajouter un bouton Supprimer

---

## Étape 6.3 — Supprimer une notification

Lorsqu'une notification est supprimée :

```text
Notifications
      ↓
Suppression
      ↓
Mise à jour du tableau
      ↓
localStorage
      ↓
Mise à jour du compteur
```

---

## Étape 6.4 — Compteur de notifications

Si le compteur indique :

```text
16
```

Après suppression d'une notification :

```text
15
```

Le compteur doit être mis à jour :

- Dans la page Notifications
- Dans la navbar
- Dans la sidebar
- Selon la catégorie de notification supprimée

---

# 🧠 Notions JavaScript à maîtriser

À la fin des exercices, je dois être capable d'utiliser **et surtout de comprendre** :

## LocalStorage

```js
localStorage.getItem()
localStorage.setItem()
localStorage.removeItem()
```

## JSON

```js
JSON.parse()
JSON.stringify()
```

## Tableaux

```js
push()
map()
filter()
find()
findIndex()
some()
forEach()
```

## DOM

```js
getElementById()
querySelector()
querySelectorAll()

innerText
innerHTML
value
```

## Événements

```js
addEventListener()
```

## Classes CSS

```js
classList.add()
classList.remove()
classList.toggle()
classList.contains()
```

## Logique JavaScript

```text
if / else
conditions
fonctions
objets
tableaux
boucles
fonctions fléchées
```

---

# 🧩 Architecture générale du projet

L'ensemble des exercices repose sur le même principe :

```text
              localStorage
                   │
                   ▼
              Données JSON
                   │
                   ▼
          Tableau JavaScript
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
     Ajouter    Modifier   Supprimer
        │          │          │
        └──────────┼──────────┘
                   ▼
                Afficher
                   │
          ┌────────┴────────┐
          ▼                 ▼
       Filtres         Statistiques
```

---

# 🔗 Relations entre les données

Certains exercices vont fonctionner ensemble.

```text
                    CHEPTEL
                       │
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
        ANIMAL                     TAG
          │                         │
          └───────────┬─────────────┘
                      ▼
               Correspondance
```

Exemple :

```js
{
    id: 1,
    rfid: "TAG_1",
    category: "bovins"
}
```

Le TAG `TAG_1` permet donc de retrouver les animaux qui lui sont associés.

---

# 💾 Stockage des données

Les données seront stockées dans `localStorage`.

Exemple :

```text
localStorage
│
├── User
│
├── UserConnecter
│
├── theme
│
├── Data
│
├── Animals
│
├── Tags
│
├── Tasks
│
└── Notifications
```

Chaque fonctionnalité possède ainsi ses propres données.

---

# 🎯 Objectif final

À la fin des exercices, l'application doit fonctionner **entièrement en local**, sans serveur et sans base de données.

Les données doivent rester disponibles après :

- Actualisation de la page
- Fermeture de la page
- Réouverture du navigateur

Grâce à :

```text
HTML
   +
CSS
   +
JavaScript
   +
LocalStorage
```

---

# 🚀 Méthode de travail

Pour chaque fonctionnalité, suivre toujours la même logique :

```text
1. Comprendre le besoin
        ↓
2. Préparer la structure des données
        ↓
3. Récupérer les données
        ↓
4. Modifier les données
        ↓
5. Sauvegarder dans localStorage
        ↓
6. Afficher les données
        ↓
7. Tester
        ↓
8. Corriger les erreurs
```

L'objectif n'est pas seulement que **ça fonctionne**.

L'objectif est de comprendre **pourquoi ça fonctionne**.

> Learn → Build → Break → Debug → Understand → Improve 🚀
