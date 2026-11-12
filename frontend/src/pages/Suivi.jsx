
import { useMemo, useState } from 'react';

import {
    getSuiviData,
    createTag,
    updateTag,
    deleteTag
} from '../services/tagService';

import '../styles/suivi.css';

function Suivi() {

    // ==========================================
    // DONNEES DU SUIVI
    // ==========================================

    const [donnees, setDonnees] = useState(() => getSuiviData());

    const { user, tags, animaux } = donnees;

    function actualiserDonnees() {
        setDonnees(getSuiviData());
    }

    // ==========================================
    // ETATS DE L'INTERFACE
    // ==========================================

    const [modal, setModal] = useState(null);

    const [tagActif, setTagActif] = useState(null);

    const [rfid, setRfid] = useState('');

    const [messageErreur, setMessageErreur] = useState('');

    const [messageSucces, setMessageSucces] = useState('');

    // ==========================================
    // ANIMAUX ASSOCIES A UN TAG
    // ==========================================

    const animauxAssocies = useMemo(() => {

        if (!tagActif) return [];

        return animaux.filter(
            animal => animal.rfid === tagActif.rfid
        );

    }, [tagActif, animaux]);

    function compterAnimaux(tag) {

        return animaux.filter(
            animal => animal.rfid === tag.rfid
        ).length;

    }

    // ==========================================
    // OUVRIR LES MODALES
    // ==========================================

    function ouvrirAjout() {

        setRfid('');
        setMessageErreur('');
        setModal('ajouter');

    }

    function ouvrirModification(tag) {

        setTagActif(tag);
        setRfid(tag.rfid);
        setMessageErreur('');
        setModal('modifier');

    }

    function ouvrirAnimaux(tag) {

        setTagActif(tag);
        setModal('animaux');

    }

    function ouvrirSuppression(tag) {

        setTagActif(tag);
        setMessageErreur('');

        const nombreAnimaux = compterAnimaux(tag);

        if (nombreAnimaux > 0) {

            setMessageErreur(
                `Ce TAG est utilisé par ${nombreAnimaux} animal(aux) et ne peut pas être supprimé.`
            );

            setModal('erreur');

            return;
        }

        setModal('supprimer');

    }

    function fermerModal() {

        setModal(null);
        setTagActif(null);
        setRfid('');
        setMessageErreur('');

    }

    // ==========================================
    // AJOUTER UN TAG
    // ==========================================

    function enregistrerTag(e) {

        e.preventDefault();

        try {

            createTag(rfid);

            actualiserDonnees();

            fermerModal();

            setMessageSucces('Nouveau TAG ajouté avec succès.');

        } catch (error) {

            setMessageErreur(error.message);

        }

    }

    // ==========================================
    // MODIFIER UN TAG
    // ==========================================

    function sauvegarderModification(e) {

        e.preventDefault();

        if (!tagActif) return;

        try {

            updateTag(tagActif.id, rfid);

            actualiserDonnees();

            fermerModal();

            setMessageSucces('TAG modifié avec succès.');

        } catch (error) {

            setMessageErreur(error.message);

        }

    }

    // ==========================================
    // SUPPRIMER UN TAG
    // ==========================================

    function confirmerSuppression() {

        if (!tagActif) return;

        try {

            deleteTag(tagActif.id);

            actualiserDonnees();

            fermerModal();

            setMessageSucces('TAG supprimé avec succès.');

        } catch (error) {

            setMessageErreur(error.message);

            setModal('erreur');

        }

    }

    // ==========================================
    // AFFICHAGE
    // ==========================================

    const totalAnimauxSuivis = animaux.filter(
        animal => tags.some(tag => tag.rfid === animal.rfid)
    ).length;

    return (

        <div className="suivi-page">

            {/* EN-TETE */}

            <div className="suivi-page__header">

                <div>
                    <h2>Suivi du troupeau</h2>

                    <p>
                        Gérez vos traqueurs RFID et les animaux associés.
                    </p>
                </div>

                <button
                    className="suivi-page__add-button"
                    onClick={ouvrirAjout}
                    disabled={!user}
                >
                    <i className="bi bi-plus-lg"></i>
                    Configurer un nouveau traqueur RFID
                </button>

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

            {/* STATISTIQUES */}

            <div className="suivi-page__stats">

                <div className="suivi-page__stat-card">
                    <i className="bi bi-tags-fill"></i>

                    <div>
                        <span>Total des TAG</span>
                        <strong>{tags.length}</strong>
                    </div>
                </div>

                <div className="suivi-page__stat-card">
                    <i className="bi bi-clipboard2-check-fill"></i>

                    <div>
                        <span>Animaux suivis</span>
                        <strong>{totalAnimauxSuivis}</strong>
                    </div>
                </div>

                <div className="suivi-page__stat-card">
                    <i className="bi bi-broadcast"></i>

                    <div>
                        <span>TAG disponibles</span>
                        <strong>
                            {tags.filter(tag => compterAnimaux(tag) === 0).length}
                        </strong>
                    </div>
                </div>

            </div>

            {/* LISTE DES TAG */}

            <section className="suivi-page__panel">

                <div className="suivi-page__panel-header">

                    <div>
                        <h3>Liste des traqueurs RFID</h3>

                        <p>
                            Consultez et gérez les TAG enregistrés.
                        </p>
                    </div>

                    <span className="suivi-page__count">
                        {tags.length} TAG(s)
                    </span>

                </div>

                <div className="table-responsive">

                    <table className="table table-hover align-middle suivi-page__table">

                        <thead>
                            <tr>
                                <th>Tag</th>
                                <th>Propriétaire</th>
                                <th>Animaux assignés</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {tags.length === 0 ? (

                                <tr>
                                    <td colSpan="4">

                                        <div className="suivi-page__empty">

                                            <i className="bi bi-broadcast"></i>

                                            <h5>Aucun TAG enregistré</h5>

                                            <p>
                                                Configurez votre premier traqueur RFID
                                                pour commencer le suivi.
                                            </p>

                                        </div>

                                    </td>
                                </tr>

                            ) : (

                                tags.map(tag => (

                                    <tr key={tag.id}>

                                        <td>

                                            <div className="suivi-page__tag">

                                                <strong>
                                                    <i className="bi bi-tags-fill"></i>
                                                    {tag.nom || tag.rfid}
                                                </strong>

                                                <span>{tag.rfid}</span>

                                            </div>

                                        </td>

                                        <td>
                                            <div className="suivi-page__owner">

                                                <i className="bi bi-person-circle"></i>

                                                {user?.name || 'Utilisateur'}

                                            </div>
                                        </td>

                                        <td>

                                            <button
                                                className="suivi-page__animal-count"
                                                onClick={() => ouvrirAnimaux(tag)}
                                            >
                                                {compterAnimaux(tag)}
                                                <span>Voir les animaux</span>
                                            </button>

                                        </td>

                                        <td>

                                            <div className="suivi-page__actions">

                                                <button
                                                    className="suivi-page__edit-button"
                                                    onClick={() => ouvrirModification(tag)}
                                                    title="Modifier ce TAG"
                                                >
                                                    <i className="bi bi-pen-fill"></i>
                                                    Modifier
                                                </button>

                                                <button
                                                    className="suivi-page__delete-button"
                                                    onClick={() => ouvrirSuppression(tag)}
                                                    title="Supprimer ce TAG"
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

            </section>

            {/* MODALES */}

            {modal && (

                <div
                    className="suivi-modal-backdrop"
                    onMouseDown={fermerModal}
                >

                    <section
                        className="suivi-modal"
                        role="dialog"
                        aria-modal="true"
                        onMouseDown={e => e.stopPropagation()}
                    >

                        {/* AJOUTER UN TAG */}

                        {modal === 'ajouter' && (

                            <form onSubmit={enregistrerTag}>

                                <div className="suivi-modal__header">

                                    <h4>Configurer un nouveau traqueur</h4>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={fermerModal}
                                    ></button>

                                </div>

                                <div className="suivi-modal__body">

                                    <label htmlFor="nouveauRfid">
                                        TAG RFID
                                    </label>

                                    <input
                                        id="nouveauRfid"
                                        type="text"
                                        className="form-control"
                                        placeholder="Exemple : RFID-001"
                                        value={rfid}
                                        onChange={e => setRfid(e.target.value)}
                                        autoFocus
                                        required
                                    />

                                    {messageErreur && (
                                        <p className="suivi-modal__error">
                                            {messageErreur}
                                        </p>
                                    )}

                                </div>

                                <div className="suivi-modal__footer">

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={fermerModal}
                                    >
                                        Annuler
                                    </button>

                                    <button
                                        type="submit"
                                        className="suivi-page__add-button"
                                    >
                                        Enregistrer
                                    </button>

                                </div>

                            </form>

                        )}

                        {/* MODIFIER UN TAG */}

                        {modal === 'modifier' && (

                            <form onSubmit={sauvegarderModification}>

                                <div className="suivi-modal__header">

                                    <h4>Modifier le TAG</h4>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={fermerModal}
                                    ></button>

                                </div>

                                <div className="suivi-modal__body">

                                    <label htmlFor="modifierRfid">
                                        Nouveau numéro RFID
                                    </label>

                                    <input
                                        id="modifierRfid"
                                        type="text"
                                        className="form-control"
                                        value={rfid}
                                        onChange={e => setRfid(e.target.value)}
                                        required
                                    />

                                    {messageErreur && (
                                        <p className="suivi-modal__error">
                                            {messageErreur}
                                        </p>
                                    )}

                                    <small>
                                        Les animaux associés seront automatiquement
                                        actualisés avec le nouveau RFID.
                                    </small>

                                </div>

                                <div className="suivi-modal__footer">

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={fermerModal}
                                    >
                                        Annuler
                                    </button>

                                    <button
                                        type="submit"
                                        className="suivi-page__add-button"
                                    >
                                        Sauvegarder
                                    </button>

                                </div>

                            </form>

                        )}

                        {/* ANIMAUX ASSOCIES */}

                        {modal === 'animaux' && (

                            <>

                                <div className="suivi-modal__header">

                                    <h4>Animaux associés au TAG</h4>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={fermerModal}
                                    ></button>

                                </div>

                                <div className="suivi-modal__body">

                                    <p>
                                        <strong>TAG :</strong> {tagActif?.nom}
                                    </p>

                                    <p>
                                        <strong>Nombre d'animaux :</strong>{' '}
                                        {animauxAssocies.length}
                                    </p>

                                    <div className="table-responsive">

                                        <table className="table table-hover align-middle">

                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>RFID</th>
                                                    <th>Catégorie</th>
                                                    <th>Sexe</th>
                                                    <th>Date de naissance</th>
                                                    <th>Statut</th>
                                                </tr>
                                            </thead>

                                            <tbody>

                                                {animauxAssocies.length === 0 ? (

                                                    <tr>
                                                        <td
                                                            colSpan="6"
                                                            className="text-center text-muted"
                                                        >
                                                            Aucun animal n'est associé à ce TAG.
                                                        </td>
                                                    </tr>

                                                ) : (

                                                    animauxAssocies.map(animal => (

                                                        <tr key={animal.id}>
                                                            <td>{animal.id}</td>
                                                            <td>{animal.rfid}</td>
                                                            <td>{animal.category}</td>
                                                            <td>{animal.sex}</td>
                                                            <td>{animal.birthDate}</td>
                                                            <td>{animal.status}</td>
                                                        </tr>

                                                    ))

                                                )}

                                            </tbody>

                                        </table>

                                    </div>

                                </div>

                                <div className="suivi-modal__footer">

                                    <button
                                        className="btn btn-secondary"
                                        onClick={fermerModal}
                                    >
                                        Fermer
                                    </button>

                                </div>

                            </>

                        )}

                        {/* CONFIRMATION SUPPRESSION */}

                        {modal === 'supprimer' && (

                            <>

                                <div className="suivi-modal__header">

                                    <h4>
                                        <i className="bi bi-trash3-fill text-danger"></i>
                                        {' '}Supprimer le TAG
                                    </h4>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={fermerModal}
                                    ></button>

                                </div>

                                <div className="suivi-modal__body">

                                    <p>
                                        Voulez-vous vraiment supprimer ce TAG ?
                                    </p>

                                    <p>
                                        TAG : <strong>{tagActif?.rfid}</strong>
                                    </p>

                                    <small className="text-muted">
                                        Cette action est irréversible.
                                    </small>

                                </div>

                                <div className="suivi-modal__footer">

                                    <button
                                        className="btn btn-secondary"
                                        onClick={fermerModal}
                                    >
                                        Annuler
                                    </button>

                                    <button
                                        className="suivi-page__delete-button"
                                        onClick={confirmerSuppression}
                                    >
                                        <i className="bi bi-trash3-fill"></i>
                                        Supprimer
                                    </button>

                                </div>

                            </>

                        )}

                        {/* ERREUR DE SUPPRESSION */}

                        {modal === 'erreur' && (

                            <>

                                <div className="suivi-modal__header">

                                    <h4>
                                        <i className="bi bi-exclamation-triangle-fill text-danger"></i>
                                        {' '}Suppression impossible
                                    </h4>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={fermerModal}
                                    ></button>

                                </div>

                                <div className="suivi-modal__body">

                                    <p className="suivi-modal__error">
                                        {messageErreur}
                                    </p>

                                </div>

                                <div className="suivi-modal__footer">

                                    <button
                                        className="btn btn-secondary"
                                        onClick={fermerModal}
                                    >
                                        Compris
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

export default Suivi;
