
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { modules } from '../data/navigation';

import '../styles/sidebar.css';

const PRIMARY_PATHS = [
    '/dashboard',
    '/carte',
    '/cheptel',
    '/stockage'
];

const MOBILE_LABELS = {
    '/dashboard': 'Accueil',
    '/carte': 'Carte',
    '/cheptel': 'Cheptel',
    '/stockage': 'Stockage'
};

function Sidebar({ notificationCount = 0 }) {

    const [isMoreOpen, setIsMoreOpen] = useState(false);

    const location = useLocation();

    // Séparer les accès directs et les autres modules
    const primaryModules = modules.filter(
        module => PRIMARY_PATHS.includes(module.path)
    );

    const moreModules = modules.filter(
        module => !PRIMARY_PATHS.includes(module.path)
    );

    const isMoreActive = moreModules.some(
        module => module.path === location.pathname
    );

    return (

        <nav
            className="mobile-bottom-nav d-lg-none"
            aria-label="Navigation mobile"
        >

            {/* MENU PLUS */}

            {isMoreOpen && (

                <div
                    className="mobile-bottom-nav__popover"
                    id="mobile-more-menu"
                >

                    <div className="mobile-bottom-nav__popover-header">
                        <strong>Autres modules</strong>

                        <button
                            type="button"
                            onClick={() => setIsMoreOpen(false)}
                            aria-label="Fermer le menu"
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>

                    {moreModules.map(module => (

                        <NavLink
                            key={module.id}
                            to={module.path}
                            onClick={() => setIsMoreOpen(false)}
                            className={({ isActive }) =>
                                `mobile-bottom-nav__menu-link ${
                                    isActive ? 'is-active' : ''
                                }`
                            }
                        >

                            <img
                                src={module.icon}
                                alt=""
                                className="mobile-bottom-nav__menu-icon"
                            />

                            <span>{module.name}</span>

                            {module.path === '/notifications' &&
                                notificationCount > 0 && (

                                    <span className="mobile-bottom-nav__menu-badge">
                                        {notificationCount > 99
                                            ? '99+'
                                            : notificationCount}
                                    </span>

                                )}

                        </NavLink>

                    ))}

                </div>

            )}


            {/* BARRE DE NAVIGATION */}

            <div className="mobile-bottom-nav__items">

                {primaryModules.map(module => (

                    <NavLink
                        key={module.id}
                        to={module.path}
                        end={module.path === '/dashboard'}
                        onClick={() => setIsMoreOpen(false)}
                        className={({ isActive }) =>
                            `mobile-bottom-nav__link ${
                                isActive ? 'is-active' : ''
                            }`
                        }
                        aria-label={module.name}
                    >

                        <img
                            src={module.icon}
                            alt=""
                            className="mobile-bottom-nav__icon"
                        />

                        <span>
                            {MOBILE_LABELS[module.path] || module.name}
                        </span>

                    </NavLink>

                ))}


                {/* BOUTON PLUS */}

                <button
                    type="button"
                    className={`mobile-bottom-nav__link mobile-bottom-nav__more-button ${
                        isMoreOpen || isMoreActive ? 'is-active' : ''
                    }`}
                    onClick={() => setIsMoreOpen(previous => !previous)}
                    aria-expanded={isMoreOpen}
                    aria-controls="mobile-more-menu"
                >

                    <span className="mobile-bottom-nav__more-icon">

                        <i className={
                            isMoreOpen
                                ? 'bi bi-x-lg'
                                : 'bi bi-three-dots'
                        }></i>

                        {notificationCount > 0 && (

                            <span className="mobile-bottom-nav__badge">

                                {notificationCount > 99
                                    ? '99+'
                                    : notificationCount}

                            </span>

                        )}

                    </span>

                    <span>Plus</span>

                </button>

            </div>

        </nav>

    );

}

export default Sidebar;
