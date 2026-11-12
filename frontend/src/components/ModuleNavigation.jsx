import { NavLink } from 'react-router-dom';
import { modules } from '../data/navigation';

import '../styles/navigation.css';

function ModuleNavigation({ notificationCount = 0 }) {

    return (
        <nav
            className="module-navigation d-none d-lg-block shadow-sm p-2"
            aria-label="Navigation principale"
        >
            <div className="row w-100 g-2">

                {modules.map((module) => (

                    <div className="col" key={module.id}>

                        <NavLink
                            to={module.path}
                            end={module.path === "/dashboard"}
                            className={({ isActive }) =>
                                `module-navigation__link text-decoration-none text-dark ${
                                    isActive ? "is-active" : ""
                                }`
                            }
                        >

                            <div className="card module-navigation__card h-100 d-flex p-2 justify-content-center align-items-center border-0">

                                <div className="d-flex flex-column align-items-center text-center">

                                    <img
                                        src={module.icon}
                                        style={{ width: module.iconWidth }}
                                        alt=""
                                        aria-hidden="true"
                                    />

                                    <span className="fw-bold mt-2">
                                        {module.name}
                                    </span>

                                </div>

                                {module.path === "/notifications" && (
                                    <span className="badge bg-danger position-absolute top-0 end-0">
                                        {notificationCount}
                                    </span>
                                )}

                            </div>

                        </NavLink>

                    </div>

                ))}

            </div>
        </nav>
    );
}

export default ModuleNavigation;