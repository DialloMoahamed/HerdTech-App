
import { useMemo, useState } from 'react';
import L from 'leaflet';

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup
} from 'react-leaflet';

import mapCoordinates from '../data/Map-coordinates.json';

import '../styles/carte.css';


// ==========================================
// CONFIGURATION DES CATEGORIES
// ==========================================

const CATEGORIES = [
    {
        name: 'Vaches',
        src: '/assets/icons/Vache.svg'
    },
    {
        name: 'Taureaux',
        src: '/assets/icons/Taureau.svg'
    },
    {
        name: 'Béliers',
        src: '/assets/icons/Béliers.svg'
    },
    {
        name: 'Brebis',
        src: '/assets/icons/Brebis.svg'
    },
    {
        name: 'Véhicule',
        biIcon: 'bi-car-front-fill'
    },
    {
        name: 'Ressources',
        biIcon: 'bi-database-fill'
    },
    {
        name: 'Stockage',
        biIcon: 'bi-box-seam'
    },
    {
        name: 'Capteurs',
        biIcon: 'bi-wifi'
    }
];


// ==========================================
// CONVERTIR LES COORDONNEES GPS
// ==========================================

function parseCoordinate(coordinate) {

    const [latitude, longitude] = coordinate
        .split(',')
        .map(value => Number(value.trim()));

    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
    ) {
        return null;
    }

    return [latitude, longitude];
}


// ==========================================
// POSITION CENTRALE DE LA FERME
// ==========================================

const centerData = mapCoordinates.find(
    item => item.category === 'MAP-CENTER'
);

const CENTER = centerData
    ? parseCoordinate(centerData.coordinate)
    : null;


// ==========================================
// PREPARER LES 27 MARQUEURS
// ==========================================

const MARKERS = mapCoordinates
    .filter(item => item.category !== 'MAP-CENTER')
    .map((item, index) => ({
        ...item,
        id: `${item.category}-${index}`,
        position: parseCoordinate(item.coordinate)
    }))
    .filter(item => (
        item.position !== null &&
        CATEGORIES.some(category => category.name === item.category)
    ));


// ==========================================
// CREER LES ICONES LEAFLET
// ==========================================

function createMarkerIcon(categoryName) {

    const category = CATEGORIES.find(
        item => item.name === categoryName
    );

const content = category.src
    ? `
        <img
            src="${category.src}"
            alt=""
        />
    `
    : `
        <i class="bi ${category.biIcon}"></i>
    `;

    return L.divIcon({

        className: 'carte-leaflet-icon',

        html: `
            <div class="carte-marker-pin">
                ${content}
            </div>
        `,

        iconSize: [44, 44],

        iconAnchor: [22, 22],

        popupAnchor: [0, -22]

    });

}


const MARKER_ICONS = Object.fromEntries(

    CATEGORIES.map(category => [

        category.name,

        createMarkerIcon(category.name)

    ])

);


// ==========================================
// ICONE DES CATEGORIES DANS LES FILTRES
// ==========================================

function CategoryIcon({ category }) {

    if (category.src) {

        return (
            <img
                src={category.src}
                alt={category.name}
                className="carte-filter__image"
            />
        );

    }

    return (
        <i
            className={`bi ${category.biIcon}`}
            aria-hidden="true"
        ></i>
    );

}


// ==========================================
// COMPOSANT PRINCIPAL
// ==========================================

function Carte() {

    // Toutes les categories sont visibles au depart
    const [visibleCategories, setVisibleCategories] = useState(
        () => Object.fromEntries(
            CATEGORIES.map(category => [
                category.name,
                true
            ])
        )
    );


    // Marqueurs correspondant aux categories actives
    const visibleMarkers = useMemo(() => {

        return MARKERS.filter(
            marker => visibleCategories[marker.category]
        );

    }, [visibleCategories]);


    // Activer ou desactiver une categorie
    function toggleCategory(categoryName, isVisible) {

        setVisibleCategories(previous => ({
            ...previous,
            [categoryName]: isVisible
        }));

    }


    return (

        <div className="carte-page">

            {/* EN-TETE */}

            <div className="carte-page__header">

                <div className="carte-page__title-icon">
                    <img
                        src="/assets/icons/Carte de la ferme.svg"
                        alt=""
                    />
                </div>

                <div>
                    <h2>Détails de la carte</h2>

                    <p>
                        Visualisation géographique de votre ferme.
                    </p>
                </div>

            </div>


            {/* FILTRES DES CATEGORIES */}

            <section
                className="carte-page__filters"
                aria-label="Filtres des catégories"
            >

                {CATEGORIES.map(category => (

                    <div
                        className="carte-filter"
                        key={category.name}
                    >

                        <div className="carte-filter__icon">

                            <CategoryIcon category={category} />

                        </div>

                        <span className="carte-filter__label">
                            {category.name}
                        </span>

                        <div className="form-check form-switch mb-0">

                            <input
                                type="checkbox"
                                className="form-check-input"
                                role="switch"
                                checked={visibleCategories[category.name]}
                                onChange={event => toggleCategory(
                                    category.name,
                                    event.target.checked
                                )}
                                aria-label={`Afficher ${category.name}`}
                            />

                        </div>

                    </div>

                ))}

            </section>


            {/* CARTE SATELLITE */}

            <section className="carte-page__map-panel">

                <div className="carte-page__map-info">

                    <span>
                        <i className="bi bi-geo-alt-fill"></i>
                        {visibleMarkers.length} / {MARKERS.length} emplacements visibles
                    </span>

                </div>

                <MapContainer
                    center={CENTER || [13.495344113294335, 2.109491190281782]}
                    zoom={18}
                    minZoom={15}
                    maxZoom={19}
                    scrollWheelZoom={true}
                    className="carte-page__map"
                >

                    {/* IMAGERIE SATELLITE */}

                    <TileLayer
                        attribution="Tiles © Esri — Sources: Esri, Maxar, Earthstar Geographics, and the GIS User Community"
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        maxZoom={19}
                    />


                    {/* MARQUEURS GPS */}

                    {visibleMarkers.map(marker => (

                        <Marker
                            key={marker.id}
                            position={marker.position}
                            icon={MARKER_ICONS[marker.category]}
                        >

                            <Popup>

                                <strong>
                                    {marker.category}
                                </strong>

                                <br />

                                Coordonnées : {marker.coordinate}

                            </Popup>

                        </Marker>

                    ))}

                </MapContainer>

            </section>

        </div>

    );

}

export default Carte;
