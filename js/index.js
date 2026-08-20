const utilisateurConnecter = JSON.parse(
    localStorage.getItem("UserConnecter")
);

if (!utilisateurConnecter) {
    window.location.href = "Login.html";
}

const welcome = document.getElementById("welcome");

welcome.innerText = `Bienvenue ${utilisateurConnecter.name}`;


// =====================================================
// RECUPERER LES VRAIES DONNEES DES AUTRES PAGES
// (mêmes clés localStorage que Cheptel.html, Suivi.html,
// Taches.html et Notifications.html)
// =====================================================

const animaux = JSON.parse(localStorage.getItem("animaux")) || [];
const tags = JSON.parse(localStorage.getItem("tags")) || [];
const taches = JSON.parse(localStorage.getItem("taches")) || [];
const notifications = JSON.parse(localStorage.getItem("notifications")) || [];


// =====================================================
// CALCULER LES CHIFFRES DU TABLEAU DE BORD
// =====================================================

function afficherTableauDeBord() {

    // Carte.html affiche un marqueur par animal enregistré
    const nbElementsCarte = animaux.length;

    // Cheptel.html : un animal est un bovin si sa categorie est
    // "Vache" ou "Taureau", un ovin si elle est "Chèvre" ou "Mouton"
    const nbBovins = animaux.filter(
        (animal) => animal.category === "Vache" || animal.category === "Taureau"
    ).length;

    const nbOvins = animaux.filter(
        (animal) => animal.category === "Chèvre" || animal.category === "Mouton"
    ).length;

    // Suivi.html : nombre de tags RFID deja configures
    const nbTags = tags.length;

    // Taches.html : on ne compte que les taches pas encore terminees
    const nbTachesAFaire = taches.filter(
        (tache) => tache.completed === false
    ).length;

    // Notifications.html : nombre total de notifications
    const nbNotifications = notifications.length;

    // Affichage dans les cards du tableau de bord
    document.getElementById("nbElementsCarte").innerText = nbElementsCarte;
    document.getElementById("nbBovins").innerText = nbBovins;
    document.getElementById("nbOvins").innerText = nbOvins;
    document.getElementById("nbTags").innerText = nbTags;
    document.getElementById("nbTachesAFaire").innerText = nbTachesAFaire;
    document.getElementById("nbNotifications").innerText = nbNotifications;

    // Stockage.html n'a pas encore de donnees enregistrees dans le
    // localStorage (pas de js/Stockage.js pour l'instant), donc on
    // ne peut pas encore afficher un vrai chiffre ici.
    // document.getElementById("nbStockage").innerText = nbStockage;
}

afficherTableauDeBord();
