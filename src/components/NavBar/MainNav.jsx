import React from 'react';
import logotec from '../../assets/images/Tec-update-01.png';
import profile from '../../assets/images/profile.png';
import addDoc from '../../assets/images/addDoc.png';
import dashboard from '../../assets/images/dashboard.png';
import report from '../../assets/images/report.png'; // Asegúrate de que este icono esté disponible
import logout from '../../assets/images/logout.png';
import '../../style/Dropdown.css';
import { useNavigate, Link } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";

export default function MainNav() {

    // navigation
    const navigate = useNavigate();

    // Access the states by using the useMyContext hook from the ContextProvider
    const { setToken, setCurrentUser, isAdmin, setIsAdmin } = useMyContext();

    const handleLogout = () => {
        localStorage.removeItem("JWT_TOKEN"); // update to remove token from localStorage
        localStorage.removeItem("USER"); // remove user details as well
        localStorage.removeItem("CSRF_TOKEN");
        localStorage.removeItem("IS_ADMIN");
        setToken(null);
        setCurrentUser(null);
        setIsAdmin(false);
        navigate("/");
    }

    return (
        <header className='sticky-top shadow-sm'>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <Link to="/inicio">
                        <img src={logotec} width={"250px"} className="navbar-brand" />
                    </Link>
                   
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navmenu">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    
                    <div className="collapse navbar-collapse" id="navmenu">
                        <div className="navbar-nav ms-auto">
                        
                            <li className="nav-item dropdown">
                                <button
                                    className="btn dropdown-toggle"
                                    id="navbarDropdown"
                                    data-bs-toggle="dropdown"
                                >
                                    <img src={profile} width={"40px"} alt="Profile" />
                                </button>

                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    <li>
                                        <Link to="/MiPerfil" className="dropdown-item">Usuario</Link>
                                    </li>
                                    <li>
                                        <Link to={'/documentos'} className="sub-menu-link">
                                            <img src={addDoc} alt="Documentos" />
                                            <p>Documentos</p>
                                            <span>&gt;</span>
                                        </Link>
                                    </li>

                                    {/* Opción de Hacer un Reporte para usuarios */}
                                    {!isAdmin && (
                                        <li>
                                            <Link to={'/crear-reporte'} className="sub-menu-link">
                                                <img src={report} alt="Reportar" />
                                                <p>Hacer un reporte</p>
                                                <span>&gt;</span>
                                            </Link>
                                        </li>
                                    )}

                                    {isAdmin && (
                                        <li>
                                            <Link to={'/ver-reportes'} className="sub-menu-link">
                                                <img src={report} alt="Ver reportes" />
                                                <p>Ver reportes</p>
                                                <span>&gt;</span>
                                            </Link>
                                        </li>
                                    )}

                                    {isAdmin && (
                                        <li>
                                            <Link to={'/admin'} className="sub-menu-link">
                                                <img src={dashboard} alt="Dashboard" />
                                                <p>Dashboard</p>
                                                <span>&gt;</span>
                                            </Link>
                                        </li>
                                    )}

                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                        <button onClick={handleLogout} className="sub-menu-link">
                                            <img src={logout} alt="logout" />
                                            <p>Logout</p>
                                            <span>&gt;</span>
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="py-2 bg-info text-light">
                <div className='container'>
                    <p className="container m-0 text-white">Tesis y proyectos de Tecnología Digital</p>
                </div>
            </div>
        </header>
    )
}
