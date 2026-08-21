// Récupérer les notifications depuis localStorage
let notifications =
    JSON.parse(localStorage.getItem("notifications"));


// Si aucune notification n'existe encore
if (!notifications) {

    notifications = [

        {
            id: 1,
            categorie: "verification",
            message: "La réserve de fourrage est basse."
        },

        {
            id: 2,
            categorie: "routine",
            message: "Un nouvel animal a été ajouté à l'enclos."
        },

        {
            id: 3,
            categorie: "routine",
            message: "Un veau est né ce matin."
        },

        {
            id: 4,
            categorie: "danger",
            message: "Mise à jour de votre tableau de bord disponible."
        },

        {
            id: 5,
            categorie: "critique",
            message: "Un nouvel animal a été ajouté à l'enclos."
        },

        {
            id: 6,
            categorie: "routine",
            message: "Nettoyage général recommandé aujourd'hui."
        },

        {
            id: 7,
            categorie: "verification",
            message: "Nettoyage général recommandé aujourd'hui."
        },

        {
            id: 8,
            categorie: "verification",
            message: "Mise à jour de votre tableau de bord disponible."
        },

        {
            id: 9,
            categorie: "verification",
            message: "Un animal a besoin de vérification."
        },

        {
            id: 10,
            categorie: "danger",
            message: "Votre troupeau est en bonne santé."
        },

        {
            id: 11,
            categorie: "routine",
            message: "Un animal a besoin de vérification."
        },

        {
            id: 12,
            categorie: "routine",
            message: "Une visite vétérinaire est prévue bientôt."
        }

    ];


    // Sauvegarder les notifications initiales
    localStorage.setItem(
        "notifications",
        JSON.stringify(notifications)
    );
}    


// Conteneur des notifications
const listeNotifications =
    document.getElementById("listeNotifications");


// ===============================
// AFFICHER LES NOTIFICATIONS
// ===============================

function afficherNotifications() {

    // Cette fonction ne sert qu'a Notifications.html : sur les autres
    // pages, seul le badge (afficherBadgeNotifications) est utilise.
    if (!listeNotifications) {
        return;
    }

    // Vider la liste avant de l'afficher
    listeNotifications.innerHTML = "";


    notifications.forEach((notification) => {

        let couleur = "";

        // Déterminer la couleur selon la catégorie
        if (notification.categorie === "routine") {

            couleur = "#009D69";

        } else if (notification.categorie === "verification") {

            couleur = "#0075E7";

        } else if (notification.categorie === "danger") {

            couleur = "#FE9419";

        } else if (notification.categorie === "critique") {

            couleur = "#E84A5A";
        }


        listeNotifications.innerHTML += `

            <div class="col-lg-12">

                <div
                    class="card h-100 d-flex p-4 border-0"
                    style="
                        background-color: #ffff;
                        border-left: solid ${couleur} 40px !important;
                    "
                >

                    <div
                        class="d-flex justify-content-between align-items-center"
                    >

                        <h5>
                            Notification de ${notification.categorie}
                        </h5>

                        <button
                            class="btn btn-link text-dark"
                            onclick="supprimerNotification(${notification.id})"
                        >

                            <i class="bi bi-x-lg"></i>

                        </button>

                    </div>

                    <span>
                        ${notification.message}
                    </span>

                    <a href="">
                        Cliquez pour plus de détails
                    </a>

                </div>

            </div>

        `;
    });


    // Mettre à jour les nombres
    afficherNombreNotifications();
}


// ===============================
// COMPTER LES NOTIFICATIONS
// ===============================

function afficherNombreNotifications() {

    // Nombre de chaque catégorie

    const routine = notifications.filter(
        (notification) =>
            notification.categorie === "routine"
    ).length;


    const verification = notifications.filter(
        (notification) =>
            notification.categorie === "verification"
    ).length;


    const danger = notifications.filter(
        (notification) =>
            notification.categorie === "danger"
    ).length;


    const critique = notifications.filter(
        (notification) =>
            notification.categorie === "critique"
    ).length;


    // Nombre total

    const total = notifications.length;


    // Afficher dans les statistiques

    document.getElementById("nombreRoutine").textContent =
        routine;


    document.getElementById("nombreVerification").textContent =
        verification;


    document.getElementById("nombreDanger").textContent =
        danger;


    document.getElementById("nombreCritique").textContent =
        critique;


    // Afficher dans la navbar

    document.getElementById(
        "notificationBadgeNavbar"
    ).textContent = total;


    // Afficher dans la sidebar

    document.getElementById(
        "notificationBadgeSidebar"
    ).textContent = total;


    // Afficher dans la card 

    document.getElementById(
        "notificationcard"
    ).textContent = total;
}


// ===============================
// SUPPRIMER UNE NOTIFICATION
// ===============================

function supprimerNotification(id) {

    // Chercher l'index de la notification
    const index = notifications.findIndex(
        (notification) =>
            notification.id === Number(id)
    );


    // Vérifier qu'elle existe
    if (index === -1) {

        console.log("Notification introuvable");

        return;
    }


    // Supprimer du tableau
    notifications.splice(index, 1);


    // Sauvegarder dans localStorage
    localStorage.setItem(
        "notifications",
        JSON.stringify(notifications)
    );


    // Réafficher les notifications
    afficherNotifications();


    console.log(
        "Notification supprimée"
    );

    console.log(
        "Notifications restantes :",
        notifications
    );
}


function afficherBadgeNotifications() {

    const notifications =
        JSON.parse(localStorage.getItem("notifications")) || [];

    const total = notifications.length;


    // Badge navbar
    const badgeNavbar =
        document.getElementById("notificationBadgeNavbar");

    if (badgeNavbar) {
        badgeNavbar.textContent = total;
    }


    // Badge sidebar
    const badgeSidebar =
        document.getElementById("notificationBadgeSidebar");

    if (badgeSidebar) {
        badgeSidebar.textContent = total;
    }

    // Badge card
    const badgeCard =
        document.getElementById("notificationcard");

    if (badgeCard) {
        badgeCard.textContent = total;
    }
}


// Exécuter au chargement de la page
afficherBadgeNotifications();
// ===============================
// AFFICHAGE AU CHARGEMENT
// ===============================

afficherNotifications();