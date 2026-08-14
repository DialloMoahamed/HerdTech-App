# Tutoriel — Ajouter les fonctionnalités JS à HerdTech-App

Ce tutoriel s'appuie sur le contenu réel de ton dépôt
`https://github.com/DialloMoahamed/HerdTech-App.git` (Login.html, Signin.html,
index.html, Cheptel.html, Suivi.html, Taches.html, Notifications.html,
style.css). Le site est actuellement 100% statique (HTML + Bootstrap 5 +
MDB), sans aucun fichier JS ni backend. On va donc tout faire **côté
navigateur avec `localStorage`**, ce qui est suffisant pour valider les 7
exercices.

## Architecture générale

```
HerdTech-App/
├── css/
│   └── dark-mode.css        ← Exercice 2
├── js/
│   ├── storage.js           ← base commune (isolation des données, Exercice 7)
│   ├── auth.js               ← Exercice 1
│   ├── theme.js               ← Exercice 2
│   ├── cheptel.js             ← Exercice 3
│   ├── tags.js                 ← Exercice 4
│   ├── taches.js               ← Exercice 5
│   └── notifications.js       ← Exercice 6
```

Les 7 fichiers JS/CSS sont fournis ci-joints, prêts à copier dans ton dépôt.
Ce document explique **où les brancher** et **quels `id` ajouter** dans tes
pages HTML existantes pour que le JS puisse s'y accrocher (ton HTML actuel
n'a presque aucun `id`, on va donc en ajouter aux endroits utiles).

### Pourquoi `localStorage` et pas une vraie base de données ?

Le site n'a aucun backend (pas de serveur Node/PHP, pas d'API). Deux options :

1. **`localStorage`** (ce tutoriel) : tout reste dans le navigateur, aucune
   dépendance externe, parfait pour valider les exercices.
2. Un vrai backend (Firebase, Supabase, une API perso...) : plus proche
   d'une vraie appli, mais hors-scope si le but est juste de valider les 7
   exercices en JS pur.

### Comment l'isolation des données (Exercice 7) est gérée

`storage.js` préfixe **chaque** clé `localStorage` par l'id de l'utilisateur
connecté : `herdtech_<userId>_animals`, `herdtech_<userId>_tags`, etc. Un
utilisateur A ne peut donc jamais lire les clés de l'utilisateur B, même s'ils
utilisent le même navigateur. Ce module doit être chargé **en premier**, sur
**toutes** les pages protégées.

---

## Notions JavaScript utilisées dans le code

Avant de brancher les fichiers, voici les notions JS employées partout dans
`storage.js`, `auth.js`, `theme.js`, `cheptel.js`, `tags.js`, `taches.js` et
`notifications.js` — utile si tu dois comprendre ou expliquer le code.

### 1. IIFE + closure (le pattern `const X = (() => { ... })();`)

Chaque fichier écrit son module comme ceci :

```js
const HerdCheptel = (() => {
  let animalToDelete = null; // variable privée
  function render() { ... }
  return { render }; // seule "render" est exposée publiquement
})();
```

C'est une **IIFE** (*Immediately Invoked Function Expression*) : la fonction
fléchée est définie puis exécutée immédiatement (`(() => {...})()`). Elle
retourne un objet qui ne contient que les fonctions qu'on veut rendre
publiques (`render`, `openEditModal`, etc.). Les variables comme
`animalToDelete` restent privées au module grâce à la **closure** : elles ne
sont accessibles qu'aux fonctions définies à l'intérieur. Ça évite de
polluer l'espace global (`window`) avec des dizaines de petites fonctions et
variables qui pourraient entrer en conflit entre les fichiers.

### 2. `localStorage` + `JSON.stringify` / `JSON.parse`

`localStorage` ne sait stocker que du **texte**. Pour y ranger un tableau ou
un objet JS, on doit le convertir en texte JSON avant de l'écrire, et le
reconvertir en objet JS en le relisant :

```js
localStorage.setItem('cle', JSON.stringify(['a', 'b']));      // écrire
const valeurs = JSON.parse(localStorage.getItem('cle'));      // lire
```

C'est exactement ce que font `HerdStorage.get()` et `HerdStorage.set()`.

### 3. Template literals (les backticks `` ` ``)

Utilisés partout pour construire du HTML ou des messages avec des variables
insérées directement dedans (`${...}`), sans concaténer avec `+` :

```js
tbody.innerHTML = `<tr><td>${a.category}</td></tr>`;
```

Ça permet aussi d'écrire du texte sur plusieurs lignes facilement.

### 4. Fonctions fléchées (`=>`) et fonctions classiques

Les deux syntaxes sont utilisées : `function nom() {}` pour les fonctions
"principales" du module (plus lisibles dans les longs blocs), et les
fonctions fléchées `(x) => x.id === id` surtout **en argument** d'une
méthode de tableau (`.map()`, `.filter()`...), car c'est plus court.

### 5. Méthodes de tableau : `map`, `filter`, `find`, `findIndex`

Ce sont les quatre méthodes les plus utilisées dans le code :

- **`find`** : renvoie le **premier élément** qui correspond, ou
  `undefined`. Utilisé pour retrouver UN animal/tag/tâche par son id :
  `animals.find(a => a.id === id)`.
- **`findIndex`** : comme `find`, mais renvoie la **position** (index) dans
  le tableau au lieu de l'élément. Utilisé quand on doit *modifier*
  l'élément à cet endroit : `animals[idx] = { ...animals[idx], ...data }`.
- **`filter`** : renvoie un **nouveau tableau** ne gardant que les éléments
  qui remplissent une condition. Utilisé pour les filtres du Cheptel, pour
  séparer tâches en cours / complétées, ou pour supprimer un élément
  (`animals.filter(a => a.id !== idASupprimer)` = "garde tout sauf celui-là").
- **`map`** : transforme chaque élément d'un tableau en autre chose — ici,
  transforme chaque objet animal/tag/tâche en un morceau de HTML (`<tr>...`),
  puis `.join('')` recolle tous ces morceaux en une seule chaîne de
  caractères insérée dans `innerHTML`.

Aucune de ces méthodes ne modifie le tableau d'origine (sauf quand on
réassigne un index directement, comme `animals[idx] = ...`), c'est pour ça
que le code réécrit systématiquement le tableau entier dans `localStorage`
après une modification (`saveAnimals(animals)`).

### 6. Décomposition (spread `...`) et copie d'objet

```js
animals[idx] = { ...animals[idx], ...data };
```

`{ ...animals[idx] }` copie toutes les propriétés de l'ancien animal, puis
`...data` écrase celles présentes dans `data` avec les nouvelles valeurs.
Ça évite de perdre des champs qu'on n'a pas touchés et évite de modifier
l'objet original directement (bonne pratique en JS).

### 7. Chaînage optionnel (`?.`) et opérateur `??` / `||`

```js
document.getElementById('btnSaveTag')?.addEventListener('click', saveTag);
const tagName = tags.find(t => t.id === a.tagId)?.name || '-';
```

`?.` évite une erreur si l'élément est `null` (par exemple si l'`id` HTML
n'existe pas encore sur une page, ou si aucun tag ne correspond) : au lieu
de planter, l'expression s'arrête et renvoie `undefined` plutôt que
d'essayer d'appeler `.addEventListener` ou `.name` sur `null`. Combiné à
`|| '-'`, on affiche une valeur par défaut quand la donnée est absente.
Note : `?.` ne peut être utilisé qu'en *lecture* — pour écrire une
propriété, il faut d'abord vérifier que l'élément existe :

```js
const total = document.getElementById('statTotal');
if (total) total.textContent = animals.length;
```

### 8. `document.addEventListener('DOMContentLoaded', init)`

Chaque module attend que le HTML soit entièrement chargé avant de
s'exécuter, sinon `document.getElementById(...)` risquerait de ne pas
trouver les éléments (s'ils n'existent pas encore dans la page au moment où
le script s'exécute).

### 9. `addEventListener` pour réagir aux clics / changements / soumissions

```js
document.getElementById('btnSaveAnimal')?.addEventListener('click', saveAnimal);
select.addEventListener('change', render);
form.addEventListener('submit', saveTache);
```

Plutôt que d'utiliser `onclick="..."` partout dans le HTML (ce qui est fait
uniquement pour les boutons générés dynamiquement dans `innerHTML`, car on
n'a pas d'autre moyen simple d'attacher un listener à du HTML qui n'existe
pas encore), on préfère `addEventListener` pour les éléments fixes du DOM :
ça sépare mieux le HTML de la logique JS.

### 10. L'API JavaScript de Bootstrap (`new bootstrap.Modal(...)`)

```js
new bootstrap.Modal(document.getElementById('animalModal')).show();
bootstrap.Modal.getInstance(document.getElementById('animalModal'))?.hide();
```

Bootstrap fournit sa propre classe JS `bootstrap.Modal` pour piloter les
popups (`data-bs-toggle="modal"` dans le HTML fait la même chose, mais en
JS on doit ouvrir/fermer le modal "à la main" après avoir sauvegardé ou
supprimé une donnée). `getInstance()` récupère le modal déjà existant sur la
page pour le fermer, sans en recréer un nouveau.

### 11. `event.preventDefault()`

```js
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  ...
});
```

Par défaut, soumettre un `<form>` recharge la page (et perd toutes les
variables JS en mémoire). `e.preventDefault()` empêche ce rechargement pour
laisser le JS gérer la soumission lui-même (validation, écriture dans
`localStorage`, etc.).

---

## Étape 0 — Mettre en place les fichiers communs

1. Crée les dossiers `js/` et `css/` à la racine du dépôt et copie-y les
   fichiers fournis.
2. Dans **chaque page** (`Login.html`, `Signin.html`, `index.html`,
   `Cheptel.html`, `Suivi.html`, `Taches.html`, `Notifications.html`,
   `Carte.html`, `Stockage.html`) :
   - ajoute `css/dark-mode.css` dans le `<head>`, juste après `style.css` :
     ```html
     <link rel="stylesheet" href="style.css">
     <link rel="stylesheet" href="css/dark-mode.css">
     ```
   - ajoute les scripts en bas de page, **juste avant** `</body>`, dans cet
     ordre (`storage.js` et `theme.js` toujours en premier) :
     ```html
     <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
     <script src="js/storage.js"></script>
     <script src="js/theme.js"></script>
     <script src="js/auth.js"></script>
     <!-- + le script spécifique à la page, voir chaque exercice -->
     ```

---

## Exercice 1 — Connectivité (création de compte + connexion)

Fichier : `js/auth.js`.

### `Signin.html` (création de compte)

Ajoute des `id` sur les deux champs email/mot de passe (actuellement les deux
inputs ont le même `id="nomHangar"`, ce qui est invalide en HTML) et
transforme le lien "Register" en vrai bouton :

```html
<form id="signinForm">
    <div class="form-outline mb-4 mt-3">
        <input type="email" id="suEmail" class="form-control p-3" required />
        <label class="form-label" for="suEmail">Enter your email</label>
    </div>
    <div class="form-outline mb-4 mt-3">
        <input type="password" id="suPassword" class="form-control p-3" required />
        <label class="form-label" for="suPassword">Enter your password</label>
    </div>
    <div class="form-outline mb-4 mt-3">
        <input type="password" id="suPasswordConfirm" class="form-control p-3" required />
        <label class="form-label" for="suPasswordConfirm">type your password to confirm</label>
    </div>
    <div id="signinError" class="text-danger mb-3"></div>

    <button type="submit" class="btn btn-success w-auto px-5 py-2 mb-4">Register</button>
    ...
</form>
```

Puis, juste avant `</body>`, après `auth.js` :

```html
<script>
  document.getElementById('signinForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('suEmail').value;
    const pwd = document.getElementById('suPassword').value;
    const pwdConfirm = document.getElementById('suPasswordConfirm').value;
    const errorBox = document.getElementById('signinError');
    errorBox.textContent = '';

    if (pwd !== pwdConfirm) {
      errorBox.textContent = 'Les mots de passe ne correspondent pas.';
      return;
    }
    try {
      HerdAuth.register(email, pwd);
      HerdAuth.login(email, pwd);
      window.location.href = 'index.html';
    } catch (err) {
      errorBox.textContent = err.message;
    }
  });
</script>
```

### `Login.html` (connexion)

Même logique : donne des `id` propres aux champs (`liEmail`, `liPassword`),
un `id="loginForm"` au `<form>`, un `<div id="loginError">`, transforme le
lien "Login" en bouton `submit`, puis :

```html
<script>
  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('liEmail').value;
    const pwd = document.getElementById('liPassword').value;
    const errorBox = document.getElementById('loginError');
    try {
      HerdAuth.login(email, pwd);
      window.location.href = 'index.html';
    } catch (err) {
      errorBox.textContent = err.message;
    }
  });
</script>
```

### Protéger les pages internes

Sur `index.html`, `Cheptel.html`, `Suivi.html`, `Taches.html`,
`Notifications.html`, `Carte.html`, `Stockage.html`, appelle
`HerdAuth.requireAuth()` — c'est déjà fait automatiquement au chargement de
chaque module (`cheptel.js`, `taches.js`, etc. appellent
`HerdAuth.requireAuth()` dans leur `init()`). Pour les pages qui n'ont pas
encore de module dédié (`index.html`, `Carte.html`, `Stockage.html`), ajoute
simplement :

```html
<script>HerdAuth.requireAuth();</script>
```

### Déconnexion + affichage de l'email connecté

Le lien "Se déconnecter" existe déjà dans chaque page
(`<a class="dropdown-item" href="Login.html">`). Remplace son `href` par
`href="#"` et ajoute :

```html
<a class="dropdown-item" href="#" onclick="HerdAuth.logout()">
  <i class="bi bi-box-arrow-right"></i> Se déconnecter
</a>
```

Pour afficher l'email au lieu de "Mallam!" en dur :

```html
<h3 id="welcomeUser">Bienvenue !</h3>
<script>
  document.getElementById('welcomeUser').textContent =
    'Bienvenue, ' + (HerdAuth.currentUser()?.email || '') + ' !';
</script>
```

---

## Exercice 2 — Mode Dark / Light

Fichiers : `css/dark-mode.css` + `js/theme.js` (déjà inclus partout depuis
l'Étape 0).

Sur **chaque page**, le lien "Mode Sombre" du dropdown Paramètre existe 2 ou
3 fois (navbar desktop + sidebar mobile + Login/Signin). Remplace chacun par :

```html
<li>
  <a class="dropdown-item theme-toggle" href="#">
    <i class="fa-solid fa-moon"></i>
    <span class="theme-toggle-label"> Mode Sombre</span>
  </a>
</li>
```

`theme.js` écoute automatiquement tous les éléments `.theme-toggle`, bascule
la classe `dark-mode` sur `<body>`, et met à jour le libellé
(Mode Sombre ↔ Mode Clair). Le thème est mémorisé dans `localStorage` et
réappliqué au chargement de chaque page — donc le mode reste actif quand on
navigue entre les pages.

**Icônes qui ne s'adaptent pas bien** (ex. le logo HerdTech en SVG avec un
`fill` fixe) : ajoute la classe `icon-invert` dessus, `dark-mode.css`
l'inversera automatiquement en mode sombre :

```html
<svg class="icon-invert" ...>
```

---

## Exercice 3 — Gestion du cheptel

Fichier : `js/cheptel.js`, à inclure uniquement sur `Cheptel.html` (après
`auth.js`).

### Modal d'ajout/modification

Un seul modal `#animalModal` sert pour Ajouter **et** Modifier. Ajoute les
`id` suivants dans le formulaire existant :

```html
<div class="modal-header" style="background-color: #D2D2D2;">
  <h5 class="modal-title" id="animalModalLabel">Ajouter un animal</h5>
  ...
</div>
<div class="modal-body" style="background-color: #EDEDED;">
  <form id="animalForm" class="row g-3">
    <input type="hidden" id="fAnimalId">
    <div class="col-md-12">
      <label class="form-label">RFID Tag</label>
      <select class="form-select" id="fTag"></select>
    </div>
    <div class="col-md-12">
      <label class="form-label">Category</label>
      <select class="form-select" id="fCategory">
        <option>Vache</option><option>Taureau</option>
        <option>Chèvre</option><option>Mouton</option>
      </select>
    </div>
    <div class="col-md-12">
      <label class="form-label">Sex</label>
      <select class="form-select" id="fSex">
        <option>Male</option><option>Female</option>
      </select>
    </div>
    <div class="col-md-12">
      <label class="form-label">Birth Date</label>
      <input type="date" class="form-control" id="fBirth">
    </div>
    <div class="col-md-12">
      <label class="form-label">Status</label>
      <select class="form-select" id="fStatus">
        <option>sain</option><option>malade</option>
        <option>vendu</option><option>mort</option>
      </select>
    </div>
  </form>
</div>
<div class="modal-footer" style="background-color: #D2D2D2;">
  <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
  <button class="btn btn-success" id="btnSaveAnimal">Save Animal</button>
</div>
```

**Supprime le modal `#modifierModal` séparé** : `cheptel.js` réutilise
`#animalModal` pour l'édition via `HerdCheptel.openEditModal(id)`.

### Modal de suppression

Dans `#sprimerModal`, remplace le texte statique par :

```html
<div class="modal-body" style="background-color: #EDEDED;">
  Are you sure you want to delete animal with RFID <strong id="deleteAnimalTag"></strong>
</div>
<div class="modal-footer" style="background-color: #D2D2D2;">
  <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
  <button class="btn btn-danger" id="btnConfirmDelete">Delete</button>
</div>
```

### Filtres + tableau

Ajoute des `id` aux `<select>`/`<input>` de la ligne "Filtre" :
`filterTag`, `filterSex`, `filterCategory`, `filterBirth`, `filterStatus`, et
`id="btnResetFilters"` sur le bouton "Reset". Sur le `<tbody>` qui contient
les lignes d'animaux (supprime les lignes statiques d'exemple), mets
`id="cheptelTableBody"` :

```html
<tbody id="cheptelTableBody"></tbody>
```

### Statistiques

Ajoute `id="statTotal"`, `id="statBovins"`, `id="statOvins"` sur les
`<span class="fs-4">Total: 11</span>` etc. `cheptel.js` les recalcule à
chaque modification.

Inclus enfin le script :

```html
<script src="js/cheptel.js"></script>
```

---

## Exercice 4 — Gestion des TAGs (synchronisée avec le cheptel)

Fichier : `js/tags.js`, à inclure sur la page qui liste les tags (par
exemple `Suivi.html`, ou une nouvelle page `Tags.html` si tu préfères en
créer une dédiée).

Remplace le bloc statique "Listes des Tags RFID configuré" par :

```html
<div class="row" id="tagsList"></div>
<button class="btn btn-success mt-2" data-bs-toggle="modal" data-bs-target="#tagModal">
  + Ajouter un TAG
</button>
```

Ajoute deux modals (structure identique à ceux de Cheptel.html) :

- `#tagModal` avec `id="tagForm"`, `id="fTagId"` (hidden), `id="fTagName"`,
  bouton `id="btnSaveTag"`.
- `#supTagModal` avec `id="deleteTagName"`, bouton `id="btnConfirmDeleteTag"`.

**Le point clé de l'exercice** ("quand on change le TAG d'un animal dans
Cheptel, ça se met à jour aussi dans l'onglet TAG") est déjà géré : `tags.js`
ne stocke jamais le nombre d'animaux par tag, il le **recalcule** à chaque
affichage en filtrant `herdtech_<user>_animals` par `tagId`. Comme
`Cheptel.html` écrit dans ce même tableau, la synchronisation est automatique
— pas besoin d'événement particulier entre les deux pages, il suffit que
chaque page relise les données à son chargement.

Inclus le script :

```html
<script src="js/tags.js"></script>
```

---

## Exercice 5 — Gestion des tâches

Fichier : `js/taches.js`, à inclure uniquement sur `Taches.html`.

Le modal d'ajout existant réutilise `id="animalModal"` (copié-collé depuis
Cheptel.html dans ton HTML actuel) — renomme-le en `id="tacheModal"` pour
éviter toute confusion, et donne-lui :

```html
<form id="tacheForm">
  <input type="hidden" id="fTacheId">
  <div class="mb-3">
    <label class="form-label">Titre de la tâche</label>
    <input type="text" class="form-control" id="fTacheTitre">
  </div>
  <div class="mb-3">
    <label class="form-label">Description</label>
    <textarea class="form-control" id="fTacheDesc"></textarea>
  </div>
</form>
```

et `id="btnSaveTache"` sur le bouton "Confirmer".

Modal suppression `#supModal` → ajoute `id="deleteTacheTitre"` sur le texte
et `id="btnConfirmDeleteTache"` sur le bouton "Delete".

Les deux tableaux ("Nombre de tâche à faire" et "Nombre de tâche déjà
accomplie") pointent chacun vers un `<tbody>` différent :

```html
<!-- tableau du haut -->
<tbody id="tachesEnCoursBody"></tbody>
...
<span class="fs-5">Tâches à faire (<span id="countEnCours">0</span>)</span>

<!-- tableau du bas -->
<tbody id="tachesCompleteesBody"></tbody>
...
<span class="fs-5">Tâches complétées (<span id="countCompletees">0</span>)</span>
```

Le comportement demandé ("quand une tâche est cochée, elle passe dans la
liste des tâches complétées") est géré par la case à cocher de chaque ligne,
qui appelle `HerdTaches.toggleComplete(id, checked)` — la tâche change juste
de tableau au prochain rendu, sans rechargement de page.

Inclus le script :

```html
<script src="js/taches.js"></script>
```

---

## Exercice 6 — Gestion des notifications

Fichier : `js/notifications.js`.

### Sur `Notifications.html`

Ajoute les `id` sur les 4 compteurs de la ligne du haut :

```html
<span>Nombre de notification de routine : <strong id="countRoutine">0</strong></span>
<span>Nombre de notification de vérification : <strong id="countVerification">0</strong></span>
<span>Nombre de notification de danger : <strong id="countDanger">0</strong></span>
<span>Nombre de notification critique : <strong id="countCritique">0</strong></span>
```

Remplace toutes les cartes statiques de notifications par un seul
conteneur :

```html
<div class="row" id="notifList"></div>
```

`notifications.js` génère chaque carte avec un bouton "Suprimer" qui appelle
`HerdNotifications.remove(id)` : la notification disparaît, son compteur de
catégorie diminue, et le badge global se met à jour.

### Partout ailleurs (navbar / sidebar)

Le badge rouge existe déjà (`<span class="badge bg-danger ...">16</span>`
dans la sidebar). Donne-lui `id="notifBadge"`, et ajoute juste après
`storage.js`/`auth.js` :

```html
<script src="js/notifications.js"></script>
```

`notifications.js` appelle automatiquement `updateBadge()` au chargement de
chaque page où il est inclus, donc le total affiché reste synchronisé même
si on supprime une notification depuis `Notifications.html` puis qu'on
revient sur `index.html`.

---

## Exercice 7 — Isolation des données entre utilisateurs

Rien à coder en plus : c'est `storage.js` (Étape 0) qui s'en charge, en
préfixant chaque clé `localStorage` par l'id de l'utilisateur connecté. Pour
vérifier que ça fonctionne :

1. Crée un compte A, ajoute un animal, une tâche, un tag.
2. Déconnecte-toi, crée un compte B.
3. Le cheptel, les tâches et les tags de B doivent être vides — les données
   de A restent invisibles.

⚠️ Limite à connaître : `localStorage` est propre à un **navigateur**, pas
un vrai compte serveur. Si tu ouvres le site depuis un autre ordinateur, les
comptes créés sur le premier n'existeront pas. Pour une vraie isolation
multi-appareils il faudrait un backend (API + base de données) — hors scope
ici, mais bon à savoir si un évaluateur pose la question.

---

## Résumé — quel script sur quelle page

| Page                              | Scripts à inclure (en plus de`storage.js`)                   |
| --------------------------------- | --------------------------------------------------------------- |
| `Login.html`                    | `theme.js`, `auth.js` + script inline connexion             |
| `Signin.html`                   | `theme.js`, `auth.js` + script inline inscription           |
| `index.html`                    | `theme.js`, `auth.js`, `notifications.js` (pour le badge) |
| `Cheptel.html`                  | `theme.js`, `auth.js`, `cheptel.js`                       |
| `Suivi.html` (ou `Tags.html`) | `theme.js`, `auth.js`, `tags.js`                          |
| `Taches.html`                   | `theme.js`, `auth.js`, `taches.js`                        |
| `Notifications.html`            | `theme.js`, `auth.js`, `notifications.js`                 |
| `Carte.html`, `Stockage.html` | `theme.js`, `auth.js`, `notifications.js` (badge)         |

Une fois les `id` ajoutés selon les sections ci-dessus et les scripts
inclus dans le bon ordre, chaque exercice devient fonctionnel sans backend.
