
import { useEffect, useState } from 'react';

import '../styles/auth.css';

function AuthLayout({ children }) {

    const [isDark, setIsDark] = useState(
        () => localStorage.getItem('theme') === 'dark'
    );

    useEffect(() => {

        document.body.classList.toggle('dark-mode', isDark);

        localStorage.setItem(
            'theme',
            isDark ? 'dark' : 'light'
        );

    }, [isDark]);

    return (

        <div className="auth-page">

            <div className="container-fluid p-0">

                <div className="row g-0 auth-row">

                    {/* PARTIE FORMULAIRE */}

                    <div className="col-lg-6 col-12 d-flex flex-column p-4 p-md-5 auth-form-column">

                        <div className="d-flex justify-content-between align-items-center mb-4">

                            <img
                                src="/assets/icons/favico.svg"
                                alt="Logo HerdTech"
                                className="auth-logo"
                            />

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setIsDark(value => !value)}
                            >

                                <i className={`me-2 ${
                                    isDark
                                        ? 'bi bi-sun-fill'
                                        : 'fa-solid fa-moon'
                                }`}></i>

                                {isDark ? 'Mode clair' : 'Mode sombre'}

                            </button>

                        </div>

                        <div className="auth-form-content">

                            {children}

                        </div>

                    </div>


                    {/* IMAGE DE PRESENTATION */}

                    <div className="col-lg-6 auth-image d-none d-lg-block">

                        <img
                            src="/assets/images/Login_img.jpg"
                            alt="Présentation de la ferme HerdTech"
                        />

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AuthLayout;
