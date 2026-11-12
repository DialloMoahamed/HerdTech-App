
import { Link } from 'react-router-dom';

import {
    readStoredArray,
    readCurrentUser
} from '../services/storage';

import '../styles/dashboard.css';

const MAP_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5203.192079670324!2d2.107265076212854!3d13.49492658687067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x11d075cc688f53db%3A0xd6e35ffd601c2bb8!2sRiz%20du%20Niger!5e1!3m2!1sfr!2sne!4v1766001956920!5m2!1sfr!2sne";


// ============================================
// COMPOSANT CARTE RÉUTILISABLE
// ============================================

function DashboardCard({ title, children }) {
    return (
        <div className="card h-100 shadow-sm dashboard-detail-card">
            <div className="card-body">
                <h2 className="h6 fw-semibold mb-3">
                    {title}
                </h2>

                {children}
            </div>
        </div>
    );
}


// ============================================
// DASHBOARD
// ============================================

function Dashboard() {

    // 1. Utilisateur connecté

    const user = readCurrentUser();
    const userId = user?.id;


    // 2. Récupération et filtrage des données

    const animaux = userId == null
        ? []
        : readStoredArray("animaux").filter(
            animal => animal.userId === userId
        );

    const tags = userId == null
        ? []
        : readStoredArray("tags").filter(
            tag => tag.userId === userId
        );

    const taches = userId == null
        ? []
        : readStoredArray("taches").filter(
            tache => tache.userId === userId
        );

    // L'ancien système ne possède pas de userId
    // dans les objets notification.
    const notifications = readStoredArray("notifications");


    // ========================================
    // 3. STATISTIQUES GENERALES
    // ========================================

    const nbElementsCarte = animaux.length;

    const nbBovins = animaux.filter(
        animal =>
            animal.category === "Vache" ||
            animal.category === "Taureau"
    ).length;

    // Les chèvres sont comptées séparément
    // des moutons.
    const nbOvins = animaux.filter(
        animal => animal.category === "Mouton"
    ).length;

    const nbTags = tags.length;

    const nbTachesAFaire = taches.filter(
        tache => tache.completed === false
    ).length;

    const nbNotifications = notifications.length;

    // Valeur statique conservée depuis l'ancien HTML.
    const nbStockage = 7;


    // ========================================
    // 4. DETAIL DU CHEPTEL
    // ========================================

    const statistiquesAnimaux = [
        {
            nom: "Taureaux",
            nombre: animaux.filter(
                animal => animal.category === "Taureau"
            ).length,
            icone: "/assets/icons/Taureau.svg"
        },
        {
            nom: "Vaches",
            nombre: animaux.filter(
                animal => animal.category === "Vache"
            ).length,
            icone: "/assets/icons/Vache.svg"
        },
        {
            nom: "Béliers",
            nombre: animaux.filter(
                animal =>
                    animal.category === "Mouton" &&
                    animal.sex?.toLowerCase() === "male"
            ).length,
            icone: "/assets/icons/B%C3%A9liers.svg"
        },
        {
            nom: "Brebis",
            nombre: animaux.filter(
                animal =>
                    animal.category === "Mouton" &&
                    animal.sex?.toLowerCase() === "female"
            ).length,
            icone: "/assets/icons/Brebis.svg"
        }
    ];

    const nbChevres = animaux.filter(
        animal => animal.category === "Chèvre"
    ).length;


    // ========================================
    // 5. NOMBRE D'ANIMAUX PAR TAG
    // ========================================

    const statistiquesTags = tags.map(tag => {

        const nombreAnimaux = animaux.filter(
            animal => animal.rfid === tag.rfid
        ).length;

        return {
            id: tag.id,
            nom: tag.nom || tag.rfid,
            nombre: nombreAnimaux
        };
    });


    // ========================================
    // 6. STATISTIQUES DES TACHES
    // ========================================

    const tachesTerminees = taches.filter(
        tache => tache.completed === true
    ).length;


    // ========================================
    // 7. NOTIFICATIONS PAR CATEGORIE
    // ========================================

    const categoriesNotifications = [
        {
            categorie: "routine",
            nom: "Routine",
            icone: "bi-check-circle-fill",
            couleur: "#047a49"
        },
        {
            categorie: "verification",
            nom: "Vérification",
            icone: "bi-question-circle-fill",
            couleur: "#0B6EFE"
        },
        {
            categorie: "danger",
            nom: "Danger",
            icone: "bi-info-circle-fill",
            couleur: "#f5cb59"
        },
        {
            categorie: "critique",
            nom: "Critique",
            icone: "bi-exclamation-circle-fill",
            couleur: "#DD3546"
        }
    ];

    const statistiquesNotifications =
        categoriesNotifications.map(categorie => ({
            ...categorie,

            nombre: notifications.filter(
                notification =>
                    notification.categorie === categorie.categorie
            ).length
        }));


    // ========================================
    // 8. LEGENDE DES MARQUEURS
    // ========================================

    const marqueurs = [
        {
            nom: "Vache",
            type: "image",
            valeur: "/assets/icons/Vache.svg"
        },
        {
            nom: "Taureau",
            type: "image",
            valeur: "/assets/icons/Taureau.svg"
        },
        {
            nom: "Bélier",
            type: "image",
            valeur: "/assets/icons/B%C3%A9liers.svg"
        },
        {
            nom: "Brebis",
            type: "image",
            valeur: "/assets/icons/Brebis.svg"
        },
        {
            nom: "Véhicule",
            type: "fontawesome",
            valeur: "fa-solid fa-car"
        },
        {
            nom: "Stockage",
            type: "fontawesome",
            valeur: "fa-solid fa-database"
        },
        {
            nom: "Capteur",
            type: "fontawesome",
            valeur: "fa-solid fa-wifi"
        },
        {
            nom: "Ressource",
            type: "bootstrap",
            valeur: "bi bi-box-seam"
        }
    ];


    // ========================================
    // 9. INFORMATIONS DES CAPTEURS
    // ========================================

    const capteurs = [
        "Status",
        "Condition",
        "Power",
        "Door",
        "Temperature",
        "Humidity"
    ];


    // ========================================
    // 10. CARTES DU HAUT
    // ========================================

    const statistiques = [
        {
            id: 1,
            titre: "Nombre d'éléments sur carte",
            valeur: nbElementsCarte,
            icone: "/assets/icons/Carte%20de%20la%20ferme.svg",
            lien: "/carte"
        },
        {
            id: 2,
            titre: "Nombre de bovins",
            valeur: nbBovins,
            icone: "/assets/icons/Bovins.svg",
            lien: "/cheptel"
        },
        {
            id: 3,
            titre: "Nombres d'ovins",
            valeur: nbOvins,
            icone: "/assets/icons/Ovins.svg",
            lien: "/cheptel"
        },
        {
            id: 4,
            titre: "Nombre d'éléments stockés",
            valeur: nbStockage,
            icone: "/assets/icons/Stockage.svg",
            lien: "/stockage"
        },
        {
            id: 5,
            titre: "Nombre de TAG RFID configurés",
            valeur: nbTags,
            icone: "/assets/icons/Suivi_du_b%C3%A9tail.svg",
            lien: "/suivi"
        },
        {
            id: 6,
            titre: "Nombre de tâches à effectuer",
            valeur: nbTachesAFaire,
            icone: "/assets/icons/Gestionnaire%20de%20Taches.svg",
            lien: "/taches"
        },
        {
            id: 7,
            titre: "Nombre de notifications",
            valeur: nbNotifications,
            icone: "/assets/icons/Notifications.svg",
            lien: "/notifications"
        }
    ];


    // ========================================
    // AFFICHAGE
    // ========================================

    return (

        <div className="container-fluid dashboard-page py-3">

            {/* TITRE */}

            <div className="d-flex align-items-center gap-2 mb-3">

                <div className="dashboard-title-icon">

                    <img
                        src="/assets/icons/dashboard.svg"
                        alt=""
                    />

                </div>

                <h1 className="h4 mb-0">
                    Tableau de bord
                </h1>

            </div>


            {!user && (
                <div className="alert alert-warning">
                    Aucun utilisateur connecté.
                    Les statistiques sont affichées à zéro.
                </div>
            )}


            {/* ================================= */}
            {/* PARTIE SUPERIEURE */}
            {/* ================================= */}

            <div className="row g-3">

                {/* STATISTIQUES */}

                <div className="col-12 col-xl-7">

                    <div className="dashboard-panel h-100 p-3">

                        <div className="row g-2">

                            {statistiques.map(stat => (

                                <div
                                    className="col-6 col-md-4"
                                    key={stat.id}
                                >

                                    <Link
                                        to={stat.lien}
                                        className="dashboard-stat-link"
                                    >

                                        <div className="card dashboard-stat-card h-100 border-0 p-3">

                                            <div className="d-flex align-items-center justify-content-center gap-2">

                                                <img
                                                    src={stat.icone}
                                                    alt=""
                                                    className="dashboard-stat-icon"
                                                />

                                                <span className="fs-3 fw-semibold">
                                                    {stat.valeur}
                                                </span>

                                            </div>

                                            <span className="mt-2 text-center">
                                                {stat.titre}
                                            </span>

                                        </div>

                                    </Link>

                                </div>

                            ))}

                        </div>

                    </div>

                </div>


                {/* APERCU CARTE */}

                <div className="col-12 col-xl-5">

                    <div className="dashboard-panel h-100 p-3">

                        <div className="card border-0 mb-2">

                            <div className="card-body p-2">

                                <span className="fw-semibold">
                                    Coordonnées :
                                </span>

                                <span>
                                    13,495217679105107, 2.109454809067691
                                </span>

                            </div>

                        </div>

                        <iframe
                            src={MAP_URL}
                            title="Aperçu géographique de la ferme"
                            className="dashboard-map"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />

                    </div>

                </div>

            </div>


            {/* ================================= */}
            {/* SIX CARTES INFERIEURES */}
            {/* ================================= */}

            <div className="row g-2 dashboard-bottom-grid">


                {/* CARTE 1 : MARQUEURS */}

                <div className="col-12 col-md-6 col-xl-4">

                    <DashboardCard title="Liste des marqueurs configurés pour la carte">

                        <div className="dashboard-marker-grid">

                            {marqueurs.map((marqueur, index) => (

                                <div
                                    className="dashboard-marker-item"
                                    key={index}
                                    title={marqueur.nom}
                                >

                                    <div className="dashboard-marker-circle">

                                        {marqueur.type === "image" ? (

                                            <img
                                                src={marqueur.valeur}
                                                alt=""
                                            />

                                        ) : (

                                            <i className={marqueur.valeur}></i>

                                        )}

                                    </div>

                                    <span>
                                        {marqueur.nom}
                                    </span>

                                </div>

                            ))}

                        </div>

                    </DashboardCard>

                </div>


                {/* CARTE 2 : CHEPTEL */}

                <div className="col-12 col-md-6 col-xl-4">

                    <DashboardCard title="Répartition du cheptel">

                        <ul className="list-unstyled mb-0 dashboard-animal-list">

                            {statistiquesAnimaux.map(animal => (

                                <li
                                    key={animal.nom}
                                    className="dashboard-animal-row"
                                >

                                    <img
                                        src={animal.icone}
                                        alt=""
                                    />

                                    <span>
                                        {animal.nom} :
                                        <strong>{animal.nombre}</strong>
                                    </span>

                                </li>

                            ))}

                            <li className="dashboard-animal-row">

                                <span className="dashboard-animal-initial">
                                    C
                                </span>

                                <span>
                                    Chèvres :
                                    <strong>{nbChevres}</strong>
                                </span>

                            </li>

                        </ul>

                    </DashboardCard>

                </div>


                {/* CARTE 3 : CAPTEURS */}

                <div className="col-12 col-md-6 col-xl-4">

                    <DashboardCard title="Informations des capteurs">

                        <ul className="list-unstyled mb-0 dashboard-sensor-list">

                            {capteurs.map(capteur => (

                                <li key={capteur}>

                                    <strong>{capteur}</strong>

                                    <span className="text-muted">
                                        —
                                    </span>

                                </li>

                            ))}

                        </ul>

                        <p className="text-muted small mt-3 mb-0">
                            Aucune donnée de capteur connectée pour le moment.
                        </p>

                    </DashboardCard>

                </div>


                {/* CARTE 4 : TAG RFID */}

                <div className="col-12 col-md-6 col-xl-4">

                    <DashboardCard title="Liste des TAG RFID configurés">

                        {statistiquesTags.length > 0 ? (

                            <ul className="list-unstyled mb-0 dashboard-tag-list">

                                {statistiquesTags.map(tag => (

                                    <li key={tag.id}>

                                        <span>
                                            <i className="bi bi-tag-fill"></i>
                                            {tag.nom}
                                        </span>

                                        <strong>
                                            {tag.nombre}
                                        </strong>

                                    </li>

                                ))}

                            </ul>

                        ) : (

                            <p className="text-muted mb-0">
                                Aucun TAG RFID configuré.
                            </p>

                        )}

                    </DashboardCard>

                </div>


                {/* CARTE 5 : TACHES */}

                <div className="col-12 col-md-6 col-xl-4">

                    <DashboardCard title="Suivi des tâches">

                        <div className="dashboard-task-row">

                            <i className="bi bi-clipboard-check-fill text-warning"></i>

                            <span>
                                Nombre de tâches à faire :
                            </span>

                            <strong>
                                {nbTachesAFaire}
                            </strong>

                        </div>

                        <div className="dashboard-task-row">

                            <i className="bi bi-clipboard-check-fill text-success"></i>

                            <span>
                                Nombre de tâches effectuées :
                            </span>

                            <strong>
                                {tachesTerminees}
                            </strong>

                        </div>

                    </DashboardCard>

                </div>


                {/* CARTE 6 : NOTIFICATIONS */}

                <div className="col-12 col-md-6 col-xl-4">

                    <DashboardCard title="Notifications par catégorie">

                        {notifications.length > 0 ? (

                            <ul className="list-unstyled mb-0 dashboard-notification-list">

                                {statistiquesNotifications.map(notification => (

                                    <li key={notification.categorie}>

                                        <span>

                                            <i
                                                className={`bi ${notification.icone}`}
                                                style={{
                                                    color: notification.couleur
                                                }}
                                            ></i>

                                            Notifications de {notification.nom} :

                                        </span>

                                        <strong>
                                            {notification.nombre}
                                        </strong>

                                    </li>

                                ))}

                            </ul>

                        ) : (

                            <p className="text-muted mb-0">
                                Aucune notification enregistrée.
                            </p>

                        )}

                    </DashboardCard>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;
