
import { useEffect, useMemo, useState } from 'react';

import {
    getNotificationsData,
    countNotifications,
    deleteNotification
} from '../services/notificationService';

import '../styles/notifications.css';


// ==========================================
// CONFIGURATION DES CATEGORIES
// ==========================================

const CATEGORIES = [
    {
        key: 'routine',
        label: 'Routine',
        description: 'Notifications de routine',
        icon: 'bi-check-circle-fill',
        color: '#009D69'
    },
    {
        key: 'verification',
        label: 'Vérification',
        description: 'Notifications de vérification',
        icon: 'bi-question-circle-fill',
        color: '#0075E7'
    },
    {
        key: 'danger',
        label: 'Danger',
        description: 'Notifications de danger',
        icon: 'bi-exclamation-circle-fill',
        color: '#FE9419'
    },
    {
        key: 'critique',
        label: 'Critique',
        description: 'Notifications critiques',
        icon: 'bi-x-circle-fill',
        color: '#E84A5A'
    }
];


// ==========================================
// PAGE NOTIFICATIONS
// ==========================================

function Notifications() {

    // ==========================================
    // DONNEES
    // ==========================================

    const [donnees, setDonnees] = useState(
        () => getNotificationsData()
    );

    const { user, notifications } = donnees;


    // ==========================================
    // MESSAGES
    // ==========================================

    const [messageErreur, setMessageErreur] = useState('');

    const [messageSucces, setMessageSucces] = useState('');


    // ==========================================
    // ACTUALISER LES DONNEES
    // ==========================================

    function actualiserDonnees() {

        setDonnees(getNotificationsData());

    }


    // Écouter les modifications des notifications
    // provenant des autres composants React.

    useEffect(() => {

        function actualiser() {

            actualiserDonnees();

        }

        window.addEventListener(
            'herdtech:notifications-updated',
            actualiser
        );

        window.addEventListener(
            'storage',
            actualiser
        );

        return () => {

            window.removeEventListener(
                'herdtech:notifications-updated',
                actualiser
            );

            window.removeEventListener(
                'storage',
                actualiser
            );

        };

    }, []);


    // ==========================================
    // COMPTER LES NOTIFICATIONS
    // ==========================================

    const statistiques = useMemo(

        () => countNotifications(notifications),

        [notifications]

    );


    // ==========================================
    // SUPPRIMER UNE NOTIFICATION
    // ==========================================

    function supprimer(notificationId) {

        try {

            deleteNotification(notificationId);

            actualiserDonnees();

            setMessageErreur('');

            setMessageSucces(
                'Notification supprimée avec succès.'
            );

        } catch (error) {

            setMessageErreur(error.message);

            setMessageSucces('');

        }

    }


    // ==========================================
    // AFFICHAGE
    // ==========================================

    return (

        <div className="notifications-page">


            {/* EN-TETE */}

            <div className="notifications-page__header">

                <div className="notifications-page__icon">

                    <img
                        src="/assets/icons/Notifications.svg"
                        alt=""
                    />

                </div>

                <div>

                    <h2>Notifications</h2>

                    <p>
                        Consultez les informations concernant votre ferme.
                    </p>

                </div>

            </div>


            {/* MESSAGES */}

            {messageSucces && (

                <div className="alert alert-success alert-dismissible fade show">

                    {messageSucces}

                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setMessageSucces('')}
                    ></button>

                </div>

            )}

            {messageErreur && (

                <div className="alert alert-danger alert-dismissible fade show">

                    {messageErreur}

                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setMessageErreur('')}
                    ></button>

                </div>

            )}


            {/* STATISTIQUES */}

            <section className="notifications-stats">

                {CATEGORIES.map(category => (

                    <article
                        className={`notifications-stat notifications-stat--${category.key}`}
                        key={category.key}
                    >

                        <i
                            className={`bi ${category.icon}`}
                            style={{ color: category.color }}
                        ></i>

                        <div className="notifications-stat__content">

                            <span>{category.description}</span>

                            <strong>
                                {statistiques[category.key]}
                            </strong>

                        </div>

                    </article>

                ))}

            </section>


            {/* LISTE DES NOTIFICATIONS */}

            <section className="notifications-list-section">

                <div className="notifications-list-section__header">

                    <div>

                        <h3>Liste des notifications</h3>

                        <p>
                            Utilisateur : {user?.name || 'Utilisateur'}
                        </p>

                    </div>

                    <span className="notifications-total">

                        <i className="bi bi-bell-fill"></i>

                        {statistiques.total} notification(s)

                    </span>

                </div>


                <div className="notifications-list">

                    {notifications.length === 0 ? (

                        <div className="notifications-empty">

                            <i className="bi bi-bell-slash"></i>

                            <h4>Aucune notification</h4>

                            <p>
                                Vous êtes à jour. Aucune notification
                                n'est disponible pour le moment.
                            </p>

                        </div>

                    ) : (

                        notifications.map(notification => {

                            const category = CATEGORIES.find(
                                item => item.key === notification.categorie
                            ) || {
                                label: notification.categorie,
                                color: '#777',
                                key: 'unknown'
                            };

                            return (

                                <article
                                    className="notification-card"
                                    key={notification.id}
                                    style={{
                                        borderLeftColor: category.color
                                    }}
                                >

                                    <div className="notification-card__header">

                                        <h4>

                                            Notification de {category.label.toLowerCase()}

                                        </h4>

                                        <button
                                            type="button"
                                            className="notification-card__delete"
                                            onClick={() => supprimer(notification.id)}
                                            title="Supprimer cette notification"
                                            aria-label={`Supprimer la notification ${notification.id}`}
                                        >

                                            <i className="bi bi-x-lg"></i>

                                        </button>

                                    </div>


                                    <p className="notification-card__message">

                                        {notification.message}

                                    </p>


                                    <span
                                        className="notification-card__category"
                                        style={{
                                            color: category.color
                                        }}
                                    >

                                        <i className="bi bi-circle-fill"></i>

                                        {category.label}

                                    </span>

                                </article>

                            );

                        })

                    )}

                </div>

            </section>

        </div>

    );

}

export default Notifications;
