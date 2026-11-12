
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { loginUser } from '../services/authService';
import AuthLayout from '../layouts/AuthLayout';

function Login() {

    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const successMessage = location.state?.success;

    function handleSubmit(event) {

        event.preventDefault();
        setError('');

        try {

            loginUser(email, password);

            navigate('/dashboard', {
                replace: true
            });

        } catch (err) {

            setError(err.message);

        }
    }

    return (

        <AuthLayout>

            <h1 className="display-6 fw-bold text-center mb-2">
                Bon retour sur HerdTech-App
            </h1>

            <p className="text-muted text-center mb-5">
                Connectez-vous pour accéder à votre ferme.
            </p>

            {successMessage && (
                <div className="alert alert-success">
                    {successMessage}
                </div>
            )}

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                <label className="form-label">
                    Veuillez entrer vos informations de connexion
                </label>

                <div className="mb-4 mt-3">

                    <label htmlFor="loginEmail" className="form-label">
                        Adresse email
                    </label>

                    <input
                        type="email"
                        id="loginEmail"
                        className="form-control p-3"
                        placeholder="exemple@email.com"
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                        autoComplete="email"
                        required
                    />

                </div>

                <div className="mb-4">

                    <label htmlFor="loginPassword" className="form-label">
                        Mot de passe
                    </label>

                    <input
                        type="password"
                        id="loginPassword"
                        className="form-control p-3"
                        placeholder="Votre mot de passe"
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                        autoComplete="current-password"
                        required
                    />

                </div>

                <button
                    type="submit"
                    className="btn btn-success px-5 py-2 mb-4"
                >
                    Se connecter
                </button>

                <div className="text-end">

                    <p className="mb-1 text-muted">
                        Vous n'avez pas de compte ?
                    </p>

                    <Link
                        to="/signin"
                        className="text-dark fw-bold"
                    >
                        Cliquez ici pour vous inscrire
                    </Link>

                </div>

            </form>

        </AuthLayout>
    );
}

export default Login;
