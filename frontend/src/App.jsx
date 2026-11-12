
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';

import Layout from './layouts/Layout';

import Login from './pages/Login';
import Signin from './pages/Signin';
import Dashboard from './pages/Dashboard';
import Cheptel from './pages/Cheptel';
import Stockage from './pages/Stockage';
import Carte from './pages/Carte';
import Suivi from './pages/Suivi';
import Taches from './pages/Taches';
import Notifications from './pages/Notifications';

import ProtectedRoute from './components/ProtectedRoute';


function App() {

    return (

        <BrowserRouter>

            <Routes>


                {/* ================================= */}
                {/* AUTHENTIFICATION */}
                {/* ================================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/signin"
                    element={<Signin />}
                />


                {/* ================================= */}
                {/* PAGES PROTEGEES */}
                {/* ================================= */}

                <Route
                    element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }
                >

                    <Route
                        index
                        element={
                            <Navigate
                                to="/dashboard"
                                replace
                            />
                        }
                    />

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/cheptel"
                        element={<Cheptel />}
                    />

                    <Route
                        path="/carte"
                        element={
                            <Carte />
                        }
                    />

                    <Route
                        path="/stockage"
                        element={
                            <Stockage />
                        }
                    />

                    <Route
                        path="/suivi"
                        element={
                            <Suivi />
                        }
                    />

                    <Route
                        path="/taches"
                        element={
                            <Taches />
                        }
                    />

                    <Route
                        path="/notifications"
                        element={
                            <Notifications />
                        }
                    />

                </Route>


                {/* ================================= */}
                {/* ROUTE INCONNUE */}
                {/* ================================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;
