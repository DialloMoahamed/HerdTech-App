
import { useMemo, useState } from 'react';

import {
    getTasksData,
    createTask,
    updateTask,
    toggleTask,
    deleteTask
} from '../services/taskService';

import '../styles/taches.css';


function Taches() {

    // ==========================================
    // DONNEES
    // ==========================================

    const [donnees, setDonnees] = useState(() => getTasksData());

    const { user, tasks } = donnees;

    function actualiserDonnees() {
        setDonnees(getTasksData());
    }


    // ==========================================
    // SEPARER LES DEUX LISTES
    // ==========================================

    const tachesAFaire = useMemo(
        () => tasks.filter(task => task.completed !== true),
        [tasks]
    );

    const tachesAccomplies = useMemo(
        () => tasks.filter(task => task.completed === true),
        [tasks]
    );


    // ==========================================
    // ETATS DE L'INTERFACE
    // ==========================================

    const [modal, setModal] = useState(null);

    const [tacheActive, setTacheActive] = useState(null);

    const [nomTache, setNomTache] = useState('');

    const [messageErreur, setMessageErreur] = useState('');

    const [messageSucces, setMessageSucces] = useState('');


    // ==========================================
    // OUVRIR LES MODALES
    // ==========================================

    function ouvrirAjout() {

        setNomTache('');
        setMessageErreur('');
        setModal('ajouter');

    }

    function ouvrirModification(tache) {

        setTacheActive(tache);
        setNomTache(tache.nom);
        setMessageErreur('');
        setModal('modifier');

    }

    function ouvrirSuppression(tache) {

        setTacheActive(tache);
        setMessageErreur('');
        setModal('supprimer');

    }

    function fermerModal() {

        setModal(null);
        setTacheActive(null);
        setNomTache('');
        setMessageErreur('');

    }


    // ==========================================
    // AJOUTER UNE TACHE
    // ==========================================

    function enregistrerTache(e) {

        e.preventDefault();

        try {

            createTask(nomTache);

            actualiserDonnees();

            fermerModal();

            setMessageSucces('Tâche ajoutée avec succès.');

        } catch (error) {

            setMessageErreur(error.message);

        }

    }


    // ==========================================
    // MODIFIER UNE TACHE
    // ==========================================

    function sauvegarderModification(e) {

        e.preventDefault();

        if (!tacheActive) return;

        try {

            updateTask(tacheActive.id, nomTache);

            actualiserDonnees();

            fermerModal();

            setMessageSucces('Tâche modifiée avec succès.');

        } catch (error) {

            setMessageErreur(error.message);

        }

    }


    // ==========================================
    // TERMINER OU REPRENDRE UNE TACHE
    // ==========================================

    function changerEtat(tacheId) {

        try {

            toggleTask(tacheId);

            actualiserDonnees();

            setMessageErreur('');

        } catch (error) {

            setMessageErreur(error.message);

        }

    }


    // ==========================================
    // SUPPRIMER UNE TACHE
    // ==========================================

    function confirmerSuppression() {

        if (!tacheActive) return;

        try {

            deleteTask(tacheActive.id);

            actualiserDonnees();

            fermerModal();

            setMessageSucces('Tâche supprimée avec succès.');

        } catch (error) {

            setMessageErreur(error.message);

        }

    }


    // ==========================================
    // COMPOSANT TABLEAU
    // ==========================================

    function afficherListeTaches(liste, estAccomplie) {

        return (

            <div className="table-responsive">

                <table className="table table-hover align-middle taches-table">

                    <thead>
                        <tr>
                            <th>État</th>
                            <th>Tâche</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {liste.length === 0 ? (

                            <tr>
                                <td colSpan="3">

                                    <div className="taches-empty">

                                        <i className={
                                            estAccomplie
                                                ? 'bi bi-clipboard-check'
                                                : 'bi bi-clipboard-x'
                                        }></i>

                                        <p>
                                            {estAccomplie
                                                ? 'Aucune tâche accomplie pour le moment.'
                                                : 'Aucune tâche à effectuer.'
                                            }
                                        </p>

                                    </div>

                                </td>
                            </tr>

                        ) : (

                            liste.map(tache => (

                                <tr key={tache.id}>

                                    <td>

                                        <input
                                            type="checkbox"
                                            className="form-check-input taches-checkbox"
                                            checked={tache.completed === true}
                                            onChange={() => changerEtat(tache.id)}
                                            aria-label={
                                                tache.completed
                                                    ? `Reprendre ${tache.nom}`
                                                    : `Terminer ${tache.nom}`
                                            }
                                        />

                                    </td>

                                    <td>

                                        <span className={
                                            tache.completed
                                                ? 'taches-name taches-name--completed'
                                                : 'taches-name'
                                        }>
                                            {tache.nom}
                                        </span>

                                    </td>

                                    <td>

                                        <div className="taches-actions">

                                            {!estAccomplie && (

                                                <button
                                                    type="button"
                                                    className="taches-edit-button"
                                                    onClick={() => ouvrirModification(tache)}
                                                    title="Modifier la tâche"
                                                >
                                                    <i className="bi bi-pen-fill"></i>
                                                    Modifier
                                                </button>

                                            )}

                                            <button
                                                type="button"
                                                className="taches-delete-button"
                                                onClick={() => ouvrirSuppression(tache)}
                                                title="Supprimer la tâche"
                                            >
                                                <i className="bi bi-trash3-fill"></i>
                                                Supprimer
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        );

    }


    // ==========================================
    // AFFICHAGE PRINCIPAL
    // ==========================================

    return (

        <div className="taches-page">

            {/* EN-TETE */}

            <div className="taches-page__header">

                <div>

                    <h2>Gestion de tâches à faire</h2>

                    <p>
                        Organisez et suivez vos activités quotidiennes.
                    </p>

                </div>

                <button
                    type="button"
                    className="taches-add-button"
                    onClick={ouvrirAjout}
                    disabled={!user}
                >
                    <i className="bi bi-plus-lg"></i>
                    Ajouter une tâche
                </button>

            </div>


            {/* UTILISATEUR CONNECTE */}

            <div className="taches-user">

                <i className="bi bi-person-circle"></i>

                Utilisateur connecté : {user?.name || 'Utilisateur'}

            </div>


            {/* MESSAGE DE SUCCES */}

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


            {/* MESSAGE D'ERREUR */}

            {messageErreur && !modal && (

                <div className="alert alert-danger alert-dismissible fade show">

                    {messageErreur}

                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setMessageErreur('')}
                    ></button>

                </div>

            )}


            {/* DEUX LISTES */}

            <div className="taches-grid">


                {/* TACHES A FAIRE */}

                <section className="taches-panel">

                    <div className="taches-panel__heading">

                        <div className="taches-panel__title">

                            <i className="bi bi-clipboard2-x-fill"></i>

                            <h3>Tâches à faire</h3>

                        </div>

                        <span className="taches-count taches-count--pending">
                            {tachesAFaire.length}
                        </span>

                    </div>

                    <div className="taches-panel__table">

                        {afficherListeTaches(tachesAFaire, false)}

                    </div>

                </section>


                {/* TACHES ACCOMPLIES */}

                <section className="taches-panel">

                    <div className="taches-panel__heading">

                        <div className="taches-panel__title">

                            <i className="bi bi-clipboard-check-fill"></i>

                            <h3>Tâches accomplies</h3>

                        </div>

                        <span className="taches-count taches-count--completed">
                            {tachesAccomplies.length}
                        </span>

                    </div>

                    <div className="taches-panel__table">

                        {afficherListeTaches(tachesAccomplies, true)}

                    </div>

                </section>

            </div>


            {/* MODALES */}

            {modal && (

                <div
                    className="taches-modal-backdrop"
                    onMouseDown={fermerModal}
                >

                    <section
                        className="taches-modal"
                        role="dialog"
                        aria-modal="true"
                        onMouseDown={e => e.stopPropagation()}
                    >

                        {/* AJOUTER */}

                        {modal === 'ajouter' && (

                            <form onSubmit={enregistrerTache}>

                                <div className="taches-modal__header">

                                    <h4>Ajouter une tâche</h4>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={fermerModal}
                                    ></button>

                                </div>

                                <div className="taches-modal__body">

                                    <label htmlFor="nouvelleTache">
                                        Nom de la tâche
                                    </label>

                                    <input
                                        id="nouvelleTache"
                                        type="text"
                                        className="form-control"
                                        placeholder="Exemple : Nourrir les animaux"
                                        value={nomTache}
                                        onChange={e => setNomTache(e.target.value)}
                                        autoFocus
                                        required
                                    />

                                    {messageErreur && (
                                        <p className="taches-error">
                                            {messageErreur}
                                        </p>
                                    )}

                                </div>

                                <div className="taches-modal__footer">

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={fermerModal}
                                    >
                                        Annuler
                                    </button>

                                    <button
                                        type="submit"
                                        className="taches-add-button"
                                    >
                                        Confirmer
                                    </button>

                                </div>

                            </form>

                        )}


                        {/* MODIFIER */}

                        {modal === 'modifier' && (

                            <form onSubmit={sauvegarderModification}>

                                <div className="taches-modal__header">

                                    <h4>Modifier la tâche</h4>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={fermerModal}
                                    ></button>

                                </div>

                                <div className="taches-modal__body">

                                    <label htmlFor="modifierTache">
                                        Nouveau nom
                                    </label>

                                    <input
                                        id="modifierTache"
                                        type="text"
                                        className="form-control"
                                        value={nomTache}
                                        onChange={e => setNomTache(e.target.value)}
                                        autoFocus
                                        required
                                    />

                                    {messageErreur && (
                                        <p className="taches-error">
                                            {messageErreur}
                                        </p>
                                    )}

                                </div>

                                <div className="taches-modal__footer">

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={fermerModal}
                                    >
                                        Annuler
                                    </button>

                                    <button
                                        type="submit"
                                        className="taches-add-button"
                                    >
                                        Sauvegarder
                                    </button>

                                </div>

                            </form>

                        )}


                        {/* CONFIRMATION SUPPRESSION */}

                        {modal === 'supprimer' && (

                            <>

                                <div className="taches-modal__header">

                                    <h4>
                                        <i className="bi bi-trash3-fill text-danger"></i>
                                        {' '}Supprimer la tâche
                                    </h4>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={fermerModal}
                                    ></button>

                                </div>

                                <div className="taches-modal__body">

                                    <p>
                                        Voulez-vous vraiment supprimer cette tâche ?
                                    </p>

                                    <strong>
                                        {tacheActive?.nom}
                                    </strong>

                                    <p className="text-muted small mt-2">
                                        Cette action est irréversible.
                                    </p>

                                    {messageErreur && (
                                        <p className="taches-error">
                                            {messageErreur}
                                        </p>
                                    )}

                                </div>

                                <div className="taches-modal__footer">

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={fermerModal}
                                    >
                                        Annuler
                                    </button>

                                    <button
                                        type="button"
                                        className="taches-delete-button"
                                        onClick={confirmerSuppression}
                                    >
                                        <i className="bi bi-trash3-fill"></i>
                                        Supprimer
                                    </button>

                                </div>

                            </>

                        )}

                    </section>

                </div>

            )}

        </div>

    );

}

export default Taches;
