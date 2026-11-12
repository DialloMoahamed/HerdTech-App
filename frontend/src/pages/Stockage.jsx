
import '../styles/stockage.css';

// ==========================================
// DONNEES DES ESPACES DE STOCKAGE
// ==========================================

const STORAGE_UNITS = [
    {
        id: 1,
        name: 'Hangar de Stockage Nord',
        image: '/assets/images/Storage-1.jpg',
        updatedAt: '8 Dec à 10:32'
    },
    {
        id: 2,
        name: 'Hangar de Stockage Ouest',
        image: '/assets/images/Storage-2.jpg',
        updatedAt: '8 Dec à 10:32'
    },
    {
        id: 3,
        name: 'Hangar de Stockage Sud',
        image: '/assets/images/Storage-3.jpg',
        updatedAt: '8 Dec à 10:32'
    },
    {
        id: 4,
        name: 'Hangar de Stockage Est',
        image: '/assets/images/Storage-4.jpg',
        updatedAt: '8 Dec à 10:32'
    },
    {
        id: 5,
        name: 'Hangar de Stockage Nord',
        image: '/assets/images/Storage-5.jpg',
        updatedAt: '8 Dec à 10:32'
    },
    {
        id: 6,
        name: 'Hangar de Stockage Nord',
        image: '/assets/images/Storage-6.jpg',
        updatedAt: '8 Dec à 10:32'
    },
    {
        id: 7,
        name: 'Hangar de Stockage Nord',
        image: '/assets/images/Storage-7.jpg',
        updatedAt: '8 Dec à 10:32'
    }
];


// ==========================================
// INFORMATIONS DES HANGARS
// ==========================================

const STORAGE_DETAILS = [
    { label: 'Status', value: 'Status' },
    { label: 'Condition', value: 'Condition' },
    { label: 'Power', value: 'Power' },
    { label: 'Door', value: 'Door' },
    { label: 'Temperature', value: 'Temperature' },
    { label: 'Humidity', value: 'Humidity' }
];


// ==========================================
// COMPOSANT CARTE DE STOCKAGE
// ==========================================

function StorageCard({ unit }) {

    return (

        <article className="stockage-card">

            <div className="stockage-card__header">

                <h3>{unit.name}</h3>

                <span>
                    <i className="bi bi-camera-video-fill"></i>
                    Caméra de surveillance
                </span>

            </div>

            <div className="stockage-card__content">

                {/* IMAGE DU HANGAR */}

                <div className="stockage-card__camera">

                    <img
                        src={unit.image}
                        alt={`Vue du ${unit.name}`}
                        className="stockage-card__image"
                    />

                    <span className="stockage-card__update">
                        Dernière mise à jour : {unit.updatedAt}
                    </span>

                </div>


                {/* INFORMATIONS DU HANGAR */}

                <div className="stockage-card__details">

                    <h4>Hangar</h4>

                    <ul>

                        {STORAGE_DETAILS.map(detail => (

                            <li key={detail.label}>

                                <strong>{detail.label}</strong>

                                <span>{detail.value}</span>

                            </li>

                        ))}

                    </ul>

                </div>

            </div>

        </article>

    );

}


// ==========================================
// PAGE STOCKAGE
// ==========================================

function Stockage() {

    return (

        <div className="stockage-page">

            {/* EN-TETE */}

            <div className="stockage-page__header">

                <div className="stockage-page__icon">

                    <img
                        src="/assets/icons/Stockage.svg"
                        alt=""
                    />

                </div>

                <h2>Stockage</h2>

            </div>


            {/* LISTE DES ESPACES DE STOCKAGE */}

            <section className="stockage-grid">

                {STORAGE_UNITS.map(unit => (

                    <StorageCard
                        key={unit.id}
                        unit={unit}
                    />

                ))}

            </section>

        </div>

    );

}

export default Stockage;
