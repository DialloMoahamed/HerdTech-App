
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from '../components/Navbar';
import ModuleNavigation from '../components/ModuleNavigation';
import Sidebar from '../components/Sidebar';

import {
    getNotificationsData
} from '../services/notificationService';

import '../styles/layout.css';


// ==========================================
// RECUPERER LE NOMBRE DE NOTIFICATIONS
// ==========================================

function getNotificationCount() {

    const { notifications } = getNotificationsData();

    return notifications.length;

}


// ==========================================
// LAYOUT PRINCIPAL
// ==========================================

function Layout() {

    const [notificationCount, setNotificationCount] = useState(
        getNotificationCount
    );


    // Actualiser les badges automatiquement
    useEffect(() => {

        function actualiserBadge() {

            setNotificationCount(getNotificationCount());

        }

        // Modification dans la même fenêtre
        window.addEventListener(
            'herdtech:notifications-updated',
            actualiserBadge
        );

        // Modification depuis un autre onglet
        window.addEventListener(
            'storage',
            actualiserBadge
        );

        return () => {

            window.removeEventListener(
                'herdtech:notifications-updated',
                actualiserBadge
            );

            window.removeEventListener(
                'storage',
                actualiserBadge
            );

        };

    }, []);


    return (

        <div className="herdtech-shell">

            {/* Navigation supérieure */}
            <Navbar />

            {/* Navigation horizontale desktop */}
            <ModuleNavigation
                notificationCount={notificationCount}
            />

            {/* Zone de travail */}
            <div className="d-flex herdtech-content">

                {/* Navigation mobile */}
                <Sidebar
                    notificationCount={notificationCount}
                />

                {/* Contenu des pages */}
                <main className="flex-fill herdtech-main">

                    <Outlet />

                </main>

            </div>

        </div>

    );

}

export default Layout;
