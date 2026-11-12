
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { registerUser } from '../services/authService';
import AuthLayout from '../layouts/AuthLayout';

function Signin() {

    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState('');

    function handleSubmit(event) {

        event.preventDefault();
        setError('');

        if (password !== confirmPassword) {

            setError(
                'La confirmation du mot de passe est incorrecte.'
            );

            return;
        }

        try {

            registerUser(name, email, password);

            navigate('/login', {
                replace: true,
                state: {
                    success: 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.'
                }
            });

        } catch (err) {

            setError(err.message);

        }
    }

    return (

        <AuthLayout>

            <h1 className="display-6 fw-bold text-center mb-2">
                Bienvenue sur HerdTech-App
            </h1>

            <p className="text-muted text-center mb-4">
                Créez votre compte pour commencer.
            </p>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                <label className="form-label">
                    Veuillez entrer vos informations d'inscription
                </label>

                <div className="mb-3 mt-3">

                    <label htmlFor="signinName" className="form-label">
                        Nom complet
                    </label>

                    <input
                        type="text"
                        id="signinName"
                        className="form-control p-3"
                        placeholder="Votre nom"
                        value={name}
                        onChange={event => setName(event.target.value)}
                        autoComplete="name"
                        required
                    />

                </div>

                <div className="mb-3">

                    <label htmlFor="signinEmail" className="form-label">
                        Adresse email
                    </label>

                    <input
                        type="email"
                        id="signinEmail"
                        className="form-control p-3"
                        placeholder="exemple@email.com"
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                        autoComplete="email"
                        required
                    />

                </div>

                <div className="mb-3">

                    <label htmlFor="signinPassword" className="form-label">
                        Mot de passe
                    </label>

                    <input
                        type="password"
                        id="signinPassword"
                        className="form-control p-3"
                        placeholder="Créer un mot de passe"
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                        autoComplete="new-password"
                        required
                    />

                </div>

                <div className="mb-4">

                    <label htmlFor="confirmPassword" className="form-label">
                        Confirmer le mot de passe
                    </label>

                    <input
                        type="password"
                        id="confirmPassword"
                        className="form-control p-3"
                        placeholder="Confirmer le mot de passe"
                        value={confirmPassword}
                        onChange={event => setConfirmPassword(event.target.value)}
                        autoComplete="new-password"
                        required
                    />

                </div>

                <button
                    type="submit"
                    className="btn btn-success px-5 py-2 mb-4"
                >
                    Créer mon compte
                </button>

                <div className="text-end">

                    <p className="mb-1 text-muted">
                        Vous avez déjà un compte ?
                    </p>

                    <Link
                        to="/login"
                        className="text-dark fw-bold"
                    >
                        Cliquez ici pour vous connecter
                    </Link>

                </div>

            </form>

        </AuthLayout>
    );
}

export default Signin;
