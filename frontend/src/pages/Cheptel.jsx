
import { useMemo, useState } from 'react';

import {
    getCheptelData,
    saveUserAnimals,
    generateAnimalId,
    calculateAnimalStats
} from '../services/cheptelService';

import '../styles/cheptel.css';


// ==========================================
// FORMULAIRE INITIAL
// ==========================================

const initialForm = {
    rfid: '',
    category: 'Vache',
    sex: 'Male',
    birthDate: '',
    status: 'sain'
};

const categories = [
    'Vache',
    'Taureau',
    'Chèvre',
    'Mouton'
];

const sexes = ['Male', 'Female'];

const statuts = [
    'sain',
    'malade',
    'vendu',
    'mort'
];


// ==========================================
// COMPOSANT CARTE DE STATISTIQUE
// ==========================================

function AnimalStatCard({ title, value, icon, children }) {

    return (
        <div className="card border-0 h-100 cheptel-stat-card">

            <div className="card-body">

                <div className="d-flex align-items-center justify-content-center gap-3">

                    <img
                        src={icon}
                        alt=""
                        className="cheptel-stat-icon"
                    />

                    <div className="text-center">

                        <h3 className="h5 fw-bold mb-1">
                            {title}
                        </h3>

                        <div className="fs-4 fw-semibold">
                            {value}
                        </div>

                    </div>

                </div>

                {children}

            </div>

        </div>
    );
}


// ==========================================
// PAGE CHEPTEL
// ==========================================

function Cheptel() {

    // --------------------------------------
    // 1. RECUPERATION DES DONNEES
    // --------------------------------------

    const [data, setData] = useState(
        () => getCheptelData()
    );

    const { user, animaux, tags } = data;


    // --------------------------------------
    // 2. ETATS DES FORMULAIRES ET MODALES
    // --------------------------------------

    const [showForm, setShowForm] = useState(false);

    const [showDelete, setShowDelete] = useState(false);

    const [formMode, setFormMode] = useState('add');

    const [selectedAnimal, setSelectedAnimal] = useState(null);

    const [formData, setFormData] = useState(initialForm);

    const [error, setError] = useState('');


    // --------------------------------------
    // 3. ETAT DES FILTRES
    // --------------------------------------

    const [filters, setFilters] = useState({
        rfid: '',
        sex: '',
        category: '',
        birthDate: '',
        status: ''
    });


    // --------------------------------------
    // 4. CALCUL DES STATISTIQUES
    // --------------------------------------

    const statistics = useMemo(
        () => calculateAnimalStats(animaux),
        [animaux]
    );


    // --------------------------------------
    // 5. RFID DISPONIBLES
    // --------------------------------------

    const rfidOptions = useMemo(() => {

        const valeurs = [
            ...tags.map(tag => tag.rfid || tag.nom),
            ...animaux.map(animal => animal.rfid)
        ];

        return [...new Set(valeurs.filter(Boolean))];

    }, [tags, animaux]);


    // --------------------------------------
    // 6. FILTRER LES ANIMAUX
    // --------------------------------------

    const animauxFiltres = useMemo(() => {

        return animaux.filter(animal => {

            if (
                filters.rfid &&
                animal.rfid !== filters.rfid
            ) {
                return false;
            }

            if (
                filters.sex &&
                animal.sex !== filters.sex
            ) {
                return false;
            }

            if (
                filters.category &&
                animal.category !== filters.category
            ) {
                return false;
            }

            if (
                filters.birthDate &&
                animal.birthDate !== filters.birthDate
            ) {
                return false;
            }

            if (
                filters.status &&
                animal.status !== filters.status
            ) {
                return false;
            }

            return true;
        });

    }, [animaux, filters]);


    // --------------------------------------
    // 7. ACTUALISER LES DONNEES
    // --------------------------------------

    function refreshData() {

        setData(getCheptelData());

    }


    // --------------------------------------
    // 8. GERER LES FILTRES
    // --------------------------------------

    function handleFilterChange(event) {

        const { name, value } = event.target;

        setFilters(previous => ({
            ...previous,
            [name]: value
        }));

    }


    function resetFilters() {

        setFilters({
            rfid: '',
            sex: '',
            category: '',
            birthDate: '',
            status: ''
        });

    }


    // --------------------------------------
    // 9. OUVRIR LE FORMULAIRE D'AJOUT
    // --------------------------------------

    function openAddModal() {

        setFormMode('add');

        setSelectedAnimal(null);

        setFormData(initialForm);

        setError('');

        setShowForm(true);

    }


    // --------------------------------------
    // 10. OUVRIR LE FORMULAIRE DE MODIFICATION
    // --------------------------------------

    function openEditModal(animal) {

        setFormMode('edit');

        setSelectedAnimal(animal);

        setFormData({
            rfid: animal.rfid || '',
            category: animal.category || 'Vache',
            sex: animal.sex || 'Male',
            birthDate: animal.birthDate || '',
            status: animal.status || 'sain'
        });

        setError('');

        setShowForm(true);

    }


    // --------------------------------------
    // 11. MODIFIER LES CHAMPS DU FORMULAIRE
    // --------------------------------------

    function handleFormChange(event) {

        const { name, value } = event.target;

        setFormData(previous => ({
            ...previous,
            [name]: value
        }));

    }


    // --------------------------------------
    // 12. ENREGISTRER UN ANIMAL
    // --------------------------------------

    function handleSubmit(event) {

        event.preventDefault();

        setError('');

        if (!user) {

            setError('Aucun utilisateur connecté.');

            return;

        }

        if (!formData.rfid) {

            setError('Veuillez sélectionner un TAG RFID.');

            return;

        }

        try {

            let nouveauxAnimaux;

            if (formMode === 'add') {

                const nouvelAnimal = {
                    id: generateAnimalId(),
                    userId: user.id,
                    rfid: formData.rfid,
                    category: formData.category,
                    sex: formData.sex,
                    birthDate: formData.birthDate,
                    status: formData.status
                };

                nouveauxAnimaux = [
                    ...animaux,
                    nouvelAnimal
                ];

            } else {

                nouveauxAnimaux = animaux.map(animal => {

                    if (
                        String(animal.id) ===
                        String(selectedAnimal.id)
                    ) {

                        return {
                            ...animal,
                            ...formData,
                            userId: user.id
                        };

                    }

                    return animal;

                });

            }

            saveUserAnimals(
                user.id,
                nouveauxAnimaux
            );

            refreshData();

            setShowForm(false);

            setFormData(initialForm);

        } catch (err) {

            setError(
                err.message || "Une erreur est survenue."
            );

        }

    }


    // --------------------------------------
    // 13. PREPARER LA SUPPRESSION
    // --------------------------------------

    function openDeleteModal(animal) {

        setSelectedAnimal(animal);

        setShowDelete(true);

    }


    // --------------------------------------
    // 14. CONFIRMER LA SUPPRESSION
    // --------------------------------------

    function confirmDelete() {

        if (!user || !selectedAnimal) {
            return;
        }

        try {

            const nouveauxAnimaux = animaux.filter(
                animal =>
                    String(animal.id) !==
                    String(selectedAnimal.id)
            );

            saveUserAnimals(
                user.id,
                nouveauxAnimaux
            );

            refreshData();

            setSelectedAnimal(null);

            setShowDelete(false);

        } catch (err) {

            setError(
                err.message || "Impossible de supprimer cet animal."
            );

            setShowDelete(false);

        }

    }


    // --------------------------------------
    // 15. AFFICHAGE DU STATUT
    // --------------------------------------

    function getStatusClass(status) {

        const classes = {
            sain: 'success',
            malade: 'danger',
            vendu: 'secondary',
            mort: 'dark'
        };

        return classes[status] || 'secondary';

    }


    // ======================================
    // AFFICHAGE DE LA PAGE
    // ======================================

    return (

        <div className="container-fluid py-3 cheptel-page">


            {/* TITRE */}

            <div className="d-flex align-items-center gap-2 mb-3">

                <div className="cheptel-title-icon">

                    <img
                        src="/assets/icons/Cheptel.svg"
                        alt=""
                    />

                </div>

                <h1 className="h4 mb-0">
                    Détails du Cheptel
                </h1>

            </div>


            {!user && (

                <div className="alert alert-warning">
                    Aucun utilisateur connecté.
                    Connecte-toi pour gérer ton cheptel.
                </div>

            )}


            {/* ================================= */}
            {/* STATISTIQUES GENERALES */}
            {/* ================================= */}

            <div className="card border-0 mb-3 cheptel-total-card">

                <div className="card-body text-center">

                    <span className="fs-5">
                        Total du cheptel
                    </span>

                    <div className="fs-2 fw-bold">
                        {statistics.total}
                    </div>

                </div>

            </div>


            <div className="row g-3 mb-4">


                {/* BOVINS */}

                <div className="col-12 col-lg-6">

                    <AnimalStatCard
                        title="Bovins"
                        value={statistics.bovins}
                        icon="/assets/icons/Bovins.svg"
                    >

                        <div className="row text-center mt-3">

                            <div className="col-6">

                                <img
                                    src="/assets/icons/Taureau.svg"
                                    alt=""
                                    className="cheptel-animal-icon"
                                />

                                <div>Taureaux</div>

                                <strong>
                                    {statistics.taureaux}
                                </strong>

                            </div>

                            <div className="col-6">

                                <img
                                    src="/assets/icons/Vache.svg"
                                    alt=""
                                    className="cheptel-animal-icon"
                                />

                                <div>Vaches</div>

                                <strong>
                                    {statistics.vaches}
                                </strong>

                            </div>

                        </div>

                    </AnimalStatCard>

                </div>


                {/* OVINS */}

                <div className="col-12 col-lg-6">

                    <AnimalStatCard
                        title="Ovins et chèvres"
                        value={statistics.ovins}
                        icon="/assets/icons/Ovins.svg"
                    >

                        <div className="row text-center mt-3">

                            <div className="col-4">

                                <img
                                    src="/assets/icons/B%C3%A9liers.svg"
                                    alt=""
                                    className="cheptel-animal-icon"
                                />

                                <div>Béliers</div>

                                <strong>
                                    {statistics.beliers}
                                </strong>

                            </div>

                            <div className="col-4">

                                <img
                                    src="/assets/icons/Brebis.svg"
                                    alt=""
                                    className="cheptel-animal-icon"
                                />

                                <div>Brebis</div>

                                <strong>
                                    {statistics.brebis}
                                </strong>

                            </div>

                            <div className="col-4">

                                <span className="cheptel-goat-icon" aria-hidden="true">
                                    🐐
                                </span>

                                <div>Chèvres</div>

                                <strong>
                                    {statistics.chevres}
                                </strong>

                            </div>

                        </div>

                    </AnimalStatCard>

                </div>

            </div>


            {/* ================================= */}
            {/* TABLEAU ET GESTION DES ANIMAUX */}
            {/* ================================= */}

            <div className="cheptel-table-panel p-3 p-md-4">

                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">

                    <h2 className="h5 mb-0">
                        Liste des animaux
                    </h2>

                    <button
                        type="button"
                        className="btn cheptel-add-button"
                        onClick={openAddModal}
                        disabled={!user}
                    >
                        <i className="bi bi-plus-lg me-2"></i>
                        Ajouter un animal
                    </button>

                </div>


                {/* MESSAGE SI AUCUN TAG */}

                {user && tags.length === 0 && (

                    <div className="alert alert-info">
                        Aucun TAG RFID n'est disponible.
                        La création d'un animal nécessite un TAG.
                        La gestion des TAG sera intégrée dans la page Suivi.
                    </div>

                )}


                {/* TABLEAU */}

                <div className="table-responsive">

                    <table className="table table-hover align-middle cheptel-table">

                        <thead>

                            <tr>
                                <th>ID</th>
                                <th>RFID</th>
                                <th>Sexe</th>
                                <th>Catégorie</th>
                                <th>Date de naissance</th>
                                <th>Statut</th>
                                <th colSpan="2">Actions</th>
                            </tr>

                            {/* FILTRES */}

                            <tr className="cheptel-filter-row">

                                <th>
                                    <span>Filtres</span>
                                </th>

                                <th>

                                    <select
                                        className="form-select form-select-sm"
                                        name="rfid"
                                        value={filters.rfid}
                                        onChange={handleFilterChange}
                                    >

                                        <option value="">
                                            Tous les TAG
                                        </option>

                                        {rfidOptions.map(rfid => (

                                            <option
                                                value={rfid}
                                                key={rfid}
                                            >
                                                {rfid}
                                            </option>

                                        ))}

                                    </select>

                                </th>

                                <th>

                                    <select
                                        className="form-select form-select-sm"
                                        name="sex"
                                        value={filters.sex}
                                        onChange={handleFilterChange}
                                    >

                                        <option value="">Tous</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>

                                    </select>

                                </th>

                                <th>

                                    <select
                                        className="form-select form-select-sm"
                                        name="category"
                                        value={filters.category}
                                        onChange={handleFilterChange}
                                    >

                                        <option value="">Toutes</option>

                                        {categories.map(category => (

                                            <option
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </option>

                                        ))}

                                    </select>

                                </th>

                                <th>

                                    <input
                                        type="date"
                                        className="form-control form-control-sm"
                                        name="birthDate"
                                        value={filters.birthDate}
                                        onChange={handleFilterChange}
                                    />

                                </th>

                                <th>

                                    <select
                                        className="form-select form-select-sm"
                                        name="status"
                                        value={filters.status}
                                        onChange={handleFilterChange}
                                    >

                                        <option value="">Tous</option>

                                        {statuts.map(status => (

                                            <option
                                                key={status}
                                                value={status}
                                            >
                                                {status}
                                            </option>

                                        ))}

                                    </select>

                                </th>

                                <th colSpan="2">

                                    <button
                                        type="button"
                                        className="btn btn-secondary btn-sm"
                                        onClick={resetFilters}
                                    >
                                        <i className="bi bi-arrow-counterclockwise me-1"></i>
                                        Reset
                                    </button>

                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {animauxFiltres.map(animal => (

                                <tr key={animal.id}>

                                    <td>{animal.id}</td>

                                    <td className="fw-semibold">
                                        {animal.rfid}
                                    </td>

                                    <td>{animal.sex}</td>

                                    <td>{animal.category}</td>

                                    <td>{animal.birthDate || '—'}</td>

                                    <td>

                                        <span className={`badge text-bg-${getStatusClass(animal.status)}`}>
                                            {animal.status}
                                        </span>

                                    </td>

                                    <td>

                                        <button
                                            type="button"
                                            className="btn btn-success btn-sm"
                                            onClick={() => openEditModal(animal)}
                                        >
                                            <i className="bi bi-pen-fill me-1"></i>
                                            Modifier
                                        </button>

                                    </td>

                                    <td>

                                        <button
                                            type="button"
                                            className="btn btn-danger btn-sm"
                                            onClick={() => openDeleteModal(animal)}
                                        >
                                            <i className="bi bi-trash3-fill me-1"></i>
                                            Supprimer
                                        </button>

                                    </td>

                                </tr>

                            ))}


                            {animauxFiltres.length === 0 && (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="text-center py-4 text-muted"
                                    >

                                        {animaux.length === 0
                                            ? "Aucun animal enregistré."
                                            : "Aucun animal ne correspond aux filtres."}

                                    </td>

                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>


                <div className="text-muted small mt-2">

                    {animauxFiltres.length} animal(aux) affiché(s)
                    sur {animaux.length}.

                </div>

            </div>


            {/* ================================= */}
            {/* MODALE AJOUT / MODIFICATION */}
            {/* ================================= */}

            {showForm && (

                <>

                    <div className="modal-backdrop fade show"></div>

                    <div
                        className="modal fade show d-block"
                        tabIndex="-1"
                        role="dialog"
                        aria-modal="true"
                    >

                        <div className="modal-dialog modal-dialog-centered modal-md">

                            <div className="modal-content">


                                <div className="modal-header cheptel-modal-header">

                                    <h2 className="modal-title h5">

                                        {formMode === 'add'
                                            ? 'Ajouter un animal'
                                            : 'Modifier un animal'}

                                    </h2>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowForm(false)}
                                        aria-label="Fermer"
                                    ></button>

                                </div>


                                <form onSubmit={handleSubmit}>

                                    <div className="modal-body cheptel-modal-body">

                                        {error && (

                                            <div className="alert alert-danger">
                                                {error}
                                            </div>

                                        )}

                                        <div className="row g-3">


                                            <div className="col-12">

                                                <label className="form-label">
                                                    RFID Tag
                                                </label>

                                                <select
                                                    className="form-select"
                                                    name="rfid"
                                                    value={formData.rfid}
                                                    onChange={handleFormChange}
                                                    required
                                                >

                                                    <option value="">
                                                        -- Sélectionner un RFID --
                                                    </option>

                                                    {formMode === 'edit' &&
                                                        formData.rfid &&
                                                        !rfidOptions.includes(formData.rfid) && (

                                                            <option value={formData.rfid}>
                                                                {formData.rfid}
                                                            </option>

                                                        )
                                                    }

                                                    {rfidOptions.map(rfid => (

                                                        <option
                                                            value={rfid}
                                                            key={rfid}
                                                        >
                                                            {rfid}
                                                        </option>

                                                    ))}

                                                </select>

                                            </div>


                                            <div className="col-12">

                                                <label className="form-label">
                                                    Catégorie
                                                </label>

                                                <select
                                                    className="form-select"
                                                    name="category"
                                                    value={formData.category}
                                                    onChange={handleFormChange}
                                                    required
                                                >

                                                    {categories.map(category => (

                                                        <option
                                                            key={category}
                                                            value={category}
                                                        >
                                                            {category}
                                                        </option>

                                                    ))}

                                                </select>

                                            </div>


                                            <div className="col-12">

                                                <label className="form-label">
                                                    Sexe
                                                </label>

                                                <select
                                                    className="form-select"
                                                    name="sex"
                                                    value={formData.sex}
                                                    onChange={handleFormChange}
                                                    required
                                                >

                                                    {sexes.map(sex => (

                                                        <option
                                                            key={sex}
                                                            value={sex}
                                                        >
                                                            {sex}
                                                        </option>

                                                    ))}

                                                </select>

                                            </div>


                                            <div className="col-12">

                                                <label className="form-label">
                                                    Date de naissance
                                                </label>

                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    name="birthDate"
                                                    value={formData.birthDate}
                                                    onChange={handleFormChange}
                                                    required
                                                />

                                            </div>


                                            <div className="col-12">

                                                <label className="form-label">
                                                    Statut
                                                </label>

                                                <select
                                                    className="form-select"
                                                    name="status"
                                                    value={formData.status}
                                                    onChange={handleFormChange}
                                                    required
                                                >

                                                    {statuts.map(status => (

                                                        <option
                                                            key={status}
                                                            value={status}
                                                        >
                                                            {status}
                                                        </option>

                                                    ))}

                                                </select>

                                            </div>

                                        </div>

                                    </div>


                                    <div className="modal-footer cheptel-modal-footer">

                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setShowForm(false)}
                                        >
                                            Annuler
                                        </button>

                                        <button
                                            type="submit"
                                            className="btn btn-success"
                                            disabled={!user || (formMode === 'add' && rfidOptions.length === 0)}
                                        >

                                            {formMode === 'add'
                                                ? 'Enregistrer'
                                                : 'Sauvegarder les changements'}

                                        </button>

                                    </div>

                                </form>

                            </div>

                        </div>

                    </div>

                </>

            )}


            {/* ================================= */}
            {/* MODALE DE SUPPRESSION */}
            {/* ================================= */}

            {showDelete && selectedAnimal && (

                <>

                    <div className="modal-backdrop fade show"></div>

                    <div
                        className="modal fade show d-block"
                        tabIndex="-1"
                        role="dialog"
                        aria-modal="true"
                    >

                        <div className="modal-dialog modal-dialog-centered">

                            <div className="modal-content">

                                <div className="modal-header cheptel-modal-header">

                                    <h2 className="modal-title h5 text-danger">
                                        Supprimer un animal
                                    </h2>

                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowDelete(false)}
                                        aria-label="Fermer"
                                    ></button>

                                </div>

                                <div className="modal-body cheptel-modal-body">

                                    Voulez-vous vraiment supprimer l'animal
                                    portant le RFID :

                                    <strong className="ms-1">
                                        {selectedAnimal.rfid}
                                    </strong>
                                    ?

                                    <p className="text-danger small mt-3 mb-0">
                                        Cette action est définitive.
                                    </p>

                                </div>

                                <div className="modal-footer cheptel-modal-footer">

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowDelete(false)}
                                    >
                                        Annuler
                                    </button>

                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={confirmDelete}
                                    >
                                        <i className="bi bi-trash3-fill me-1"></i>
                                        Confirmer la suppression
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>

                </>

            )}

        </div>
    );
}

export default Cheptel;
