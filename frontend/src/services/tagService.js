
import {
    readStoredArray,
    readCurrentUser
} from './storage';


// ==========================================
// RECUPERER LES DONNEES DU SUIVI
// ==========================================

export function getSuiviData() {

    const user = readCurrentUser();

    if (!user || user.id == null) {
        return {
            user: null,
            tags: [],
            animaux: []
        };
    }

    const userId = String(user.id);

    // Récupérer uniquement les TAG de l'utilisateur
    const tags = readStoredArray('tags').filter(
        tag => String(tag.userId) === userId
    );

    // Récupérer uniquement ses animaux
    const animaux = readStoredArray('animaux').filter(
        animal => String(animal.userId) === userId
    );

    return {
        user,
        tags,
        animaux
    };
}


// ==========================================
// SAUVEGARDER LES TAG DE L'UTILISATEUR
// ==========================================

function saveUserTags(userId, tagsUtilisateur) {

    const tousLesTags = readStoredArray('tags');

    // Conserver les TAG des autres utilisateurs
    const autresTags = tousLesTags.filter(
        tag => String(tag.userId) !== String(userId)
    );

    const nouveauxTags = [
        ...autresTags,
        ...tagsUtilisateur
    ];

    localStorage.setItem(
        'tags',
        JSON.stringify(nouveauxTags)
    );
}


// ==========================================
// GENERER UN ID UNIQUE
// ==========================================

function generateTagId() {

    const tags = readStoredArray('tags');

    const dernierId = tags.reduce(
        (maximum, tag) => Math.max(
            maximum,
            Number(tag.id) || 0
        ),
        0
    );

    return dernierId + 1;
}


// ==========================================
// AJOUTER UN TAG
// ==========================================

export function createTag(rfid) {

    const user = readCurrentUser();

    if (!user) {
        throw new Error('Aucun utilisateur connecté.');
    }

    const nouveauRfid = rfid.trim();

    if (!nouveauRfid) {
        throw new Error('Veuillez entrer un TAG RFID.');
    }

    const tousLesTags = readStoredArray('tags');

    // Conserver l'unicité globale du RFID,
    // comme dans l'ancien tag.js.
    const tagExiste = tousLesTags.some(
        tag =>
            tag.rfid?.toLowerCase() === nouveauRfid.toLowerCase()
    );

    if (tagExiste) {
        throw new Error('Ce TAG existe déjà.');
    }

    const nouveauTag = {
        id: generateTagId(),
        userId: user.id,
        nom: nouveauRfid,
        rfid: nouveauRfid
    };

    const tagsUtilisateur = tousLesTags.filter(
        tag => String(tag.userId) === String(user.id)
    );

    saveUserTags(
        user.id,
        [...tagsUtilisateur, nouveauTag]
    );

    return nouveauTag;
}


// ==========================================
// ANIMAUX ASSOCIES A UN TAG
// ==========================================

export function getAnimalsForTag(tagId) {

    const { tags, animaux } = getSuiviData();

    const tag = tags.find(
        tag => String(tag.id) === String(tagId)
    );

    if (!tag) {
        throw new Error('TAG introuvable.');
    }

    return animaux.filter(
        animal => animal.rfid === tag.rfid
    );
}


// ==========================================
// MODIFIER UN TAG
// ==========================================

export function updateTag(tagId, nouveauRfid) {

    const { user, tags, animaux } = getSuiviData();

    if (!user) {
        throw new Error('Aucun utilisateur connecté.');
    }

    const cleanRfid = nouveauRfid.trim();

    if (!cleanRfid) {
        throw new Error('Veuillez entrer un nouveau RFID.');
    }

    const tag = tags.find(
        tag => String(tag.id) === String(tagId)
    );

    if (!tag) {
        throw new Error('TAG introuvable.');
    }

    const duplicate = readStoredArray('tags').some(
        autreTag =>
            String(autreTag.id) !== String(tagId) &&
            autreTag.rfid?.toLowerCase() === cleanRfid.toLowerCase()
    );

    if (duplicate) {
        throw new Error('Ce RFID est déjà utilisé.');
    }

    const ancienRfid = tag.rfid;

    // Modifier le RFID du TAG
    const nouveauxTags = tags.map(item =>
        String(item.id) === String(tagId)
            ? {
                ...item,
                nom: cleanRfid,
                rfid: cleanRfid
            }
            : item
    );

    // Modifier aussi le RFID des animaux associés
    const nouveauxAnimaux = animaux.map(animal =>
        animal.rfid === ancienRfid
            ? { ...animal, rfid: cleanRfid }
            : animal
    );

    // Sauvegarder les deux collections
    saveUserTags(user.id, nouveauxTags);

    const autresAnimaux = readStoredArray('animaux').filter(
        animal => String(animal.userId) !== String(user.id)
    );

    localStorage.setItem(
        'animaux',
        JSON.stringify([
            ...autresAnimaux,
            ...nouveauxAnimaux
        ])
    );

    return {
        ancienRfid,
        nouveauRfid: cleanRfid
    };
}


// ==========================================
// SUPPRIMER UN TAG
// ==========================================

export function deleteTag(tagId) {

    const { user, tags, animaux } = getSuiviData();

    if (!user) {
        throw new Error('Aucun utilisateur connecté.');
    }

    const tag = tags.find(
        tag => String(tag.id) === String(tagId)
    );

    if (!tag) {
        throw new Error('TAG introuvable.');
    }

    // Vérifier si des animaux utilisent ce TAG
    const animauxAssocies = animaux.filter(
        animal => animal.rfid === tag.rfid
    );

    if (animauxAssocies.length > 0) {

        throw new Error(
            `Ce TAG est utilisé par ${animauxAssocies.length} animal(aux) et ne peut pas être supprimé.`
        );

    }

    const nouveauxTags = tags.filter(
        item => String(item.id) !== String(tagId)
    );

    saveUserTags(user.id, nouveauxTags);

    return tag;
}
