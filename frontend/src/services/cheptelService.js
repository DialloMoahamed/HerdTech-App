
import {
    readStoredArray,
    readCurrentUser
} from './storage';


// ==========================================
// RECUPERER LES DONNEES DE L'UTILISATEUR
// ==========================================

export function getCheptelData() {

    const user = readCurrentUser();

    if (!user || user.id == null) {
        return {
            user: null,
            animaux: [],
            tags: []
        };
    }

    const userId = String(user.id);

    const animaux = readStoredArray('animaux').filter(
        animal => String(animal.userId) === userId
    );

    const tags = readStoredArray('tags').filter(
        tag => String(tag.userId) === userId
    );

    return {
        user,
        animaux,
        tags
    };
}


// ==========================================
// SAUVEGARDER LES ANIMAUX
// ==========================================

export function saveUserAnimals(userId, animauxUtilisateur) {

    if (userId == null) {
        throw new Error('Utilisateur non connecté.');
    }

    const userIdString = String(userId);

    const tousLesAnimaux = readStoredArray('animaux');

    // Ne pas modifier les données des autres utilisateurs
    const animauxAutresUtilisateurs = tousLesAnimaux.filter(
        animal => String(animal.userId) !== userIdString
    );

    // Réunir les anciens animaux des autres utilisateurs
    // avec les animaux actualisés de l'utilisateur courant
    const nouveauxAnimaux = [
        ...animauxAutresUtilisateurs,
        ...animauxUtilisateur.map(animal => ({
            ...animal,
            userId
        }))
    ];

    localStorage.setItem(
        'animaux',
        JSON.stringify(nouveauxAnimaux)
    );
}


// ==========================================
// GENERER UN ID
// ==========================================

export function generateAnimalId() {

    const animaux = readStoredArray('animaux');

    const dernierId = animaux.reduce(
        (maximum, animal) => Math.max(
            maximum,
            Number(animal.id) || 0
        ),
        0
    );

    return dernierId + 1;
}


// ==========================================
// CALCULER LES STATISTIQUES
// ==========================================

export function calculateAnimalStats(animaux) {

    const taureaux = animaux.filter(
        animal => animal.category === 'Taureau'
    ).length;

    const vaches = animaux.filter(
        animal => animal.category === 'Vache'
    ).length;

    const chevres = animaux.filter(
        animal => animal.category === 'Chèvre'
    ).length;

    const beliers = animaux.filter(
        animal =>
            animal.category === 'Mouton' &&
            animal.sex?.toLowerCase() === 'male'
    ).length;

    const brebis = animaux.filter(
        animal =>
            animal.category === 'Mouton' &&
            animal.sex?.toLowerCase() === 'female'
    ).length;

    const bovins = taureaux + vaches;

    // Convention de l'ancien projet :
    // le total Ovins inclut les moutons et les chèvres.
    const ovins = beliers + brebis + chevres;

    return {
        total: animaux.length,
        bovins,
        ovins,
        taureaux,
        vaches,
        beliers,
        brebis,
        chevres
    };
}
