// =====================================================
// UTILISATEUR CONNECTÉ
// =====================================================

const userId = utilisateurConnecter.id;


// =====================================================
// RÉCUPÉRER LES DONNÉES
// =====================================================

const animaux = JSON.parse(
    localStorage.getItem("animaux")
) || [];

const tags = JSON.parse(
    localStorage.getItem("tags")
) || [];

const taches = JSON.parse(
    localStorage.getItem("taches")
) || [];

// const notifications = JSON.parse(
//     localStorage.getItem("notifications")
// ) || [];


// =====================================================
// FILTRER LES DONNÉES
// =====================================================

const mesAnimaux = animaux.filter(
    (animal) => animal.userId === userId
);

const mesTags = tags.filter(
    (tag) => tag.userId === userId
);

const mesTaches = taches.filter(
    (tache) => tache.userId === userId
);

// const mesNotifications = notifications.filter(
//     (notification) => notification.userId === userId
// );


// =====================================================
// TABLEAU DE BORD
// =====================================================

function afficherTableauDeBord() {


    // =================================================
    // CARTE
    // =================================================

    // Nombre d'animaux de l'utilisateur connecté

    const nbElementsCarte = mesAnimaux.length;


    // =================================================
    // CHEPTEL
    // =================================================

    const nbBovins = mesAnimaux.filter(
        (animal) =>
            animal.category === "Vache" ||
            animal.category === "Taureau"
    ).length;


    const nbOvins = mesAnimaux.filter(
        (animal) =>
            animal.category === "Chèvre" ||
            animal.category === "Mouton"
    ).length;


    // =================================================
    // SUIVI
    // =================================================

    const nbTags = mesTags.length;


    // =================================================
    // TÂCHES
    // =================================================

    const nbTachesAFaire = mesTaches.filter(
        (tache) =>
            tache.completed === false
    ).length;


    // =================================================
    // NOTIFICATIONS
    // =================================================

    // const nbNotifications =
    //     mesNotifications.length;


    // =================================================
    // AFFICHAGE
    // =================================================

    const elementCarte =
        document.getElementById("nbElementsCarte");

    if (elementCarte) {
        elementCarte.innerText =
            nbElementsCarte;
    }


    const elementBovins =
        document.getElementById("nbBovins");

    if (elementBovins) {
        elementBovins.innerText =
            nbBovins;
    }


    const elementOvins =
        document.getElementById("nbOvins");

    if (elementOvins) {
        elementOvins.innerText =
            nbOvins;
    }


    const elementTags =
        document.getElementById("nbTags");

    if (elementTags) {
        elementTags.innerText =
            nbTags;
    }


    const elementTaches =
        document.getElementById("nbTachesAFaire");

    if (elementTaches) {
        elementTaches.innerText =
            nbTachesAFaire;
    }


    // const elementNotifications =
    //     document.getElementById("nbNotifications");

    // if (elementNotifications) {
    //     elementNotifications.innerText =
    //         nbNotifications;
    // }


    // =================================================
    // DEBUG
    // =================================================

    console.log(
        "Utilisateur connecté :",
        utilisateurConnecter
    );

    console.log(
        "Mes animaux :",
        mesAnimaux
    );

    console.log(
        "Mes tags :",
        mesTags
    );

    console.log(
        "Mes tâches :",
        mesTaches
    );

    // console.log(
    //     "Mes notifications :",
    //     mesNotifications
    // );
}


// =====================================================
// LANCER LE DASHBOARD
// =====================================================

afficherTableauDeBord();