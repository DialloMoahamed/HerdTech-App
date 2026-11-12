import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/navbar.css';

function Navbar() {
    const navigate = useNavigate();

    // Récupérer l'utilisateur connecté
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(
                localStorage.getItem('UserConnecter')
            );
        } catch {
            return null;
        }
    });

    // Récupérer le thème enregistré
    const [isDark, setIsDark] = useState(
        () => localStorage.getItem('theme') === 'dark'
    );

    // Appliquer le thème au document
    useEffect(() => {
        document.body.classList.toggle('dark-mode', isDark);

        localStorage.setItem(
            'theme',
            isDark ? 'dark' : 'light'
        );
    }, [isDark]);

    // Changer de thème
    function changerTheme() {
        setIsDark(previousTheme => !previousTheme);
    }

    // Déconnexion
    function deconnexion() {
        localStorage.removeItem('UserConnecter');
        setUser(null);
        navigate('/login');
    }

    const nomUtilisateur =
        user?.name ||
        user?.nom ||
        user?.email ||
        '';

    return (
        <nav className="navbar d-none d-lg-flex herdtech-navbar">

            <div className="container-fluid">

                {/* Logo et bienvenue */}
                <div className="d-flex align-items-center gap-3">

                    <img
                        src="/assets/icons/favico.svg"
                        className="herdtech-logo"
                        alt="Logo HerdTech"
                    />

                    <h3 className="herdtech-welcome">
                        {nomUtilisateur
                            ? `Bienvenue, ${nomUtilisateur} !`
                            : 'Bienvenue !'}
                    </h3>

                </div>

                {/* Paramètres et compte */}
                <div className="d-flex align-items-center gap-3">

                    {/* Menu paramètres */}
                    <div className="dropdown">

                        <button
                            className="btn btn-light dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="fa-solid fa-gear me-2"></i>
                            Paramètres
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end">

                            <li>
                                <button
                                    className="dropdown-item"
                                    type="button"
                                    onClick={changerTheme}
                                >
                                    <i className={`me-2 ${
                                        isDark
                                            ? 'bi bi-sun-fill'
                                            : 'fa-solid fa-moon'
                                    }`}></i>

                                    {isDark
                                        ? 'Mode Clair'
                                        : 'Mode Sombre'}
                                </button>
                            </li>

                            <li>
                                <button
                                    className="dropdown-item"
                                    type="button"
                                    disabled
                                >
                                    <i className="bi bi-globe me-2"></i>
                                    Langue (bientôt disponible)
                                </button>
                            </li>

                        </ul>

                    </div>

                    {/* Menu compte */}
                    <div className="dropdown">

                        <button
                            className="btn btn-light dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="fa-solid fa-user me-2"></i>
                            Compte
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end">

                            <li>
                                <button
                                    className="dropdown-item"
                                    type="button"
                                    disabled
                                >
                                    <i className="bi bi-person-fill-gear me-2"></i>
                                    Paramètres du compte
                                </button>
                            </li>

                            <li>
                                <hr className="dropdown-divider" />
                            </li>

                            <li>
                                <button
                                    className="dropdown-item text-danger"
                                    type="button"
                                    onClick={deconnexion}
                                >
                                    <i className="bi bi-box-arrow-right me-2"></i>
                                    Se déconnecter
                                </button>
                            </li>

                        </ul>

                    </div>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;
