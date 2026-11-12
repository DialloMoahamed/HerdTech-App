
import {
    readStoredArray,
    readCurrentUser
} from './storage';


// ==========================================
// CONFIGURATION
// ==========================================

const STORAGE_KEY = 'notifications';

const INITIAL_NOTIFICATIONS = [

    {
        categorie: 'verification',
        message: 'La réserve de fourrage est basse.'
    },
    {
        categorie: 'routine',
        message: 'Un nouvel animal a été ajouté à l\'enclos.'
    },
    {
        categorie: 'routine',
        message: 'Un veau est né ce matin.'
    },
    {
        categorie: 'danger',
        message: 'Mise à jour de votre tableau de bord disponible.'
    },
    {
        categorie: 'critique',
        message: 'Un nouvel animal a été ajouté à l\'enclos.'
    },
    {
        categorie: 'routine',
        message: 'Nettoyage général recommandé aujourd\'hui.'
    },
    {
        categorie: 'verification',
        message: 'Nettoyage général recommandé aujourd\'hui.'
    },
    {
        categorie: 'verification',
        message: 'Mise à jour de votre tableau de bord disponible.'
    },
    {
        categorie: 'verification',
        message: 'Un animal a besoin de vérification.'
    },
    {
        categorie: 'danger',
        message: 'Votre troupeau est en bonne santé.'
    },
    {
        categorie: 'routine',
        message: 'Un animal a besoin de vérification.'
    },
    {
        categorie: 'routine',
        message: 'Une visite vétérinaire est prévue bientôt.'
    }

];


// ==========================================
// GENERER UN IDENTIFIANT UNIQUE
// ==========================================

function generateNotificationId(notifications) {

    return notifications.reduce(
        (maximum, notification) => Math.max(
            maximum,
            Number(notification.id) || 0
        ),
        0
    ) + 1;

}


// ==========================================
// RECUPERER LES NOTIFICATIONS
// ==========================================

export function getNotificationsData() {

    const user = readCurrentUser();

    if (!user || user.id == null) {

        return {
            user: null,
            notifications: []
        };

    }

    const userId = String(user.id);

    let allNotifications = readStoredArray(STORAGE_KEY);

    let hasChanges = false;


    // ==========================================
    // MIGRER LES ANCIENNES NOTIFICATIONS
    // ==========================================

    // Les anciennes notifications ne possédaient
    // pas de userId. On les attribue au premier
    // utilisateur connecté après cette migration.

    allNotifications = allNotifications.map(notification => {

        if (notification.userId == null) {

            hasChanges = true;

            return {
                ...notification,
                userId: user.id
            };

        }

        return notification;

    });


    // ==========================================
    // INITIALISER LES NOTIFICATIONS UTILISATEUR
    // ==========================================

    const initializationKey =
        `notifications_initialized_${userId}`;

    const alreadyInitialized =
        localStorage.getItem(initializationKey) === 'true';

    if (!alreadyInitialized) {

        const userHasNotifications = allNotifications.some(
            notification =>
                String(notification.userId) === userId
        );

        // Chaque nouvel utilisateur reçoit ses
        // notifications de démonstration une seule fois.

        if (!userHasNotifications) {

            let nextId = generateNotificationId(allNotifications);

            const initialForUser = INITIAL_NOTIFICATIONS.map(
                notification => ({

                    id: nextId++,

                    userId: user.id,

                    ...notification

                })
            );

            allNotifications = [
                ...allNotifications,
                ...initialForUser
            ];

            hasChanges = true;

        }

        localStorage.setItem(initializationKey, 'true');

    }


    // Sauvegarder les changements de migration
    if (hasChanges) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(allNotifications)
        );

    }


    // Retourner uniquement les notifications
    // de l'utilisateur connecté

    const notifications = allNotifications.filter(
        notification =>
            String(notification.userId) === userId
    );

    return {
        user,
        notifications
    };

}


// ==========================================
// COMPTER LES NOTIFICATIONS
// ==========================================

export function countNotifications(notifications) {

    return {

        routine: notifications.filter(
            notification =>
                notification.categorie === 'routine'
        ).length,

        verification: notifications.filter(
            notification =>
                notification.categorie === 'verification'
        ).length,

        danger: notifications.filter(
            notification =>
                notification.categorie === 'danger'
        ).length,

        critique: notifications.filter(
            notification =>
                notification.categorie === 'critique'
        ).length,

        total: notifications.length

    };

}


// ==========================================
// SUPPRIMER UNE NOTIFICATION
// ==========================================

export function deleteNotification(notificationId) {

    const { user, notifications } = getNotificationsData();

    if (!user) {

        throw new Error('Aucun utilisateur connecté.');

    }

    const notification = notifications.find(
        item => String(item.id) === String(notificationId)
    );

    if (!notification) {

        throw new Error('Notification introuvable.');

    }


    // Conserver les notifications des autres utilisateurs
    const allNotifications = readStoredArray(STORAGE_KEY);

    const remainingNotifications = allNotifications.filter(
        item => !(
            String(item.id) === String(notificationId) &&
            String(item.userId) === String(user.id)
        )
    );


    // Sauvegarder

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(remainingNotifications)
    );


    // Signaler le changement aux autres composants React
    if (typeof window !== 'undefined') {

        window.dispatchEvent(
            new Event('herdtech:notifications-updated')
        );

    }

    return notification;

}
