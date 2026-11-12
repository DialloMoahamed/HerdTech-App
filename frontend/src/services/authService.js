
import { readStoredArray } from './storage';


// ==========================================
// RECUPERER LES UTILISATEURS
// ==========================================

function getUsers() {
    return readStoredArray('User');
}


// ==========================================
// RECUPERER L'UTILISATEUR CONNECTE
// ==========================================

export function getCurrentUser() {

    try {
        return JSON.parse(
            localStorage.getItem('UserConnecter') || 'null'
        );
    } catch {
        return null;
    }

}


// ==========================================
// GENERER UN NOUVEL ID
// ==========================================

function generateUserId(users) {

    return users.reduce(
        (maximum, user) => Math.max(
            maximum,
            Number(user.id) || 0
        ),
        0
    ) + 1;

}


// ==========================================
// CREER UN COMPTE
// ==========================================

export function registerUser(name, email, password) {

    const users = getUsers();

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
        throw new Error('Tous les champs sont obligatoires.');
    }

    const emailExists = users.some(
        user => user.email?.toLowerCase() === cleanEmail
    );

    if (emailExists) {
        throw new Error('Cet email possède déjà un compte.');
    }

    const newUser = {
        id: generateUserId(users),
        name: cleanName,
        email: cleanEmail,
        password
    };

    users.push(newUser);

    localStorage.setItem(
        'User',
        JSON.stringify(users)
    );

    return newUser;

}


// ==========================================
// CONNECTER UN UTILISATEUR
// ==========================================

export function loginUser(email, password) {

    const users = getUsers();

    const cleanEmail = email.trim().toLowerCase();

    const user = users.find(
        user =>
            user.email?.toLowerCase() === cleanEmail &&
            user.password === password
    );

    if (!user) {
        throw new Error('Email ou mot de passe incorrect.');
    }

    const sessionUser = {
        id: user.id,
        name: user.name,
        email: user.email
    };

    localStorage.setItem(
        'UserConnecter',
        JSON.stringify(sessionUser)
    );

    return sessionUser;
}


// ==========================================
// DECONNECTER UN UTILISATEUR
// ==========================================

export function logoutUser() {

    localStorage.removeItem('UserConnecter');

}
