// =====================================================
// TABLEAU DE BORD (index.html uniquement)
// Recupere les vraies donnees des autres pages en lisant
// les memes cles localStorage que Cheptel.html, Suivi.html,
// Taches.html et Notifications.html
// =====================================================

const animauxDashboard = JSON.parse(localStorage.getItem("animaux")) || [];
const tagsDashboard = JSON.parse(localStorage.getItem("tags")) || [];
const tachesDashboard = JSON.parse(localStorage.getItem("taches")) || [];
const notificationsDashboard = JSON.parse(localStorage.getItem("notifications")) || [];


function afficherTableauDeBord() {

    // Carte.html affiche un marqueur par animal enregistré
    const nbElementsCarte = animauxDashboard.length;

    // Cheptel.html : un animal est un bovin si sa categorie est
    // "Vache" ou "Taureau", un ovin si elle est "Chèvre" ou "Mouton"
    const nbBovins = animauxDashboard.filter(
        (animal) => animal.category === "Vache" || animal.category === "Taureau"
    ).length;

    const nbOvins = animauxDashboard.filter(
        (animal) => animal.category === "Chèvre" || animal.category === "Mouton"
    ).length;

    // Suivi.html : nombre de tags RFID deja configures
    const nbTags = tagsDashboard.length;

    // Taches.html : on ne compte que les taches pas encore terminees
    const nbTachesAFaire = tachesDashboard.filter(
        (tache) => tache.completed === false
    ).length;

    // Notifications.html : nombre total de notifications
    const nbNotifications = notificationsDashboard.length;

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
