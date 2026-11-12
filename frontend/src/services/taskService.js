
import {
    readStoredArray,
    readCurrentUser
} from './storage';


// ==========================================
// RECUPERER LES TACHES DE L'UTILISATEUR
// ==========================================

export function getTasksData() {

    const user = readCurrentUser();

    if (!user || user.id == null) {
        return {
            user: null,
            tasks: []
        };
    }

    const tasks = readStoredArray('taches').filter(
        task => String(task.userId) === String(user.id)
    );

    return {
        user,
        tasks
    };
}


// ==========================================
// SAUVEGARDER LES TACHES
// ==========================================

function saveUserTasks(userId, userTasks) {

    const allTasks = readStoredArray('taches');

    // Conserver les tâches des autres utilisateurs
    const otherTasks = allTasks.filter(
        task => String(task.userId) !== String(userId)
    );

    localStorage.setItem(
        'taches',
        JSON.stringify([
            ...otherTasks,
            ...userTasks
        ])
    );
}


// ==========================================
// GENERER UN IDENTIFIANT
// ==========================================

function generateTaskId() {

    const allTasks = readStoredArray('taches');

    const maxId = allTasks.reduce(
        (maximum, task) => Math.max(
            maximum,
            Number(task.id) || 0
        ),
        0
    );

    return maxId + 1;
}


// ==========================================
// AJOUTER UNE TACHE
// ==========================================

export function createTask(nom) {

    const user = readCurrentUser();

    if (!user) {
        throw new Error('Aucun utilisateur connecté.');
    }

    const cleanName = nom.trim();

    if (!cleanName) {
        throw new Error('Veuillez entrer une tâche.');
    }

    const { tasks } = getTasksData();

    const taskExists = tasks.some(
        task => task.nom.toLowerCase() === cleanName.toLowerCase()
    );

    if (taskExists) {
        throw new Error('Cette tâche existe déjà.');
    }

    const newTask = {
        id: generateTaskId(),
        userId: user.id,
        nom: cleanName,
        completed: false
    };

    saveUserTasks(
        user.id,
        [...tasks, newTask]
    );

    return newTask;
}


// ==========================================
// MODIFIER UNE TACHE
// ==========================================

export function updateTask(taskId, nouveauNom) {

    const { user, tasks } = getTasksData();

    if (!user) {
        throw new Error('Aucun utilisateur connecté.');
    }

    const cleanName = nouveauNom.trim();

    if (!cleanName) {
        throw new Error('Veuillez entrer une tâche.');
    }

    const task = tasks.find(
        item => String(item.id) === String(taskId)
    );

    if (!task) {
        throw new Error('Tâche introuvable.');
    }

    const duplicate = tasks.some(
        item =>
            String(item.id) !== String(taskId) &&
            item.nom.toLowerCase() === cleanName.toLowerCase()
    );

    if (duplicate) {
        throw new Error('Cette tâche existe déjà.');
    }

    const updatedTasks = tasks.map(item =>
        String(item.id) === String(taskId)
            ? { ...item, nom: cleanName }
            : item
    );

    saveUserTasks(user.id, updatedTasks);

    return updatedTasks;
}


// ==========================================
// TERMINER OU REPRENDRE UNE TACHE
// ==========================================

export function toggleTask(taskId) {

    const { user, tasks } = getTasksData();

    if (!user) {
        throw new Error('Aucun utilisateur connecté.');
    }

    const taskExists = tasks.some(
        task => String(task.id) === String(taskId)
    );

    if (!taskExists) {
        throw new Error('Tâche introuvable.');
    }

    const updatedTasks = tasks.map(task =>
        String(task.id) === String(taskId)
            ? {
                ...task,
                completed: !task.completed
            }
            : task
    );

    saveUserTasks(user.id, updatedTasks);

    return updatedTasks;
}


// ==========================================
// SUPPRIMER UNE TACHE
// ==========================================

export function deleteTask(taskId) {

    const { user, tasks } = getTasksData();

    if (!user) {
        throw new Error('Aucun utilisateur connecté.');
    }

    const task = tasks.find(
        item => String(item.id) === String(taskId)
    );

    if (!task) {
        throw new Error('Tâche introuvable.');
    }

    const remainingTasks = tasks.filter(
        item => String(item.id) !== String(taskId)
    );

    saveUserTasks(user.id, remainingTasks);

    return task;
}
