// Lire un tableau enregistré dans localStorage
export function readStoredArray(key) {
    try {
        const data = JSON.parse(
            localStorage.getItem(key) || "[]"
        );

        return Array.isArray(data) ? data : [];

    } catch {
        return [];
    }
}

// Récupérer l'utilisateur connecté
export function readCurrentUser() {
    try {
        return JSON.parse(
            localStorage.getItem("UserConnecter") || "null"
        );

    } catch {
        return null;
    }
}