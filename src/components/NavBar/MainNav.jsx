import React from 'react';
import logotec from '../../assets/images/Tec-update-01.png';
import '../../style/Dropdown.css';
import { useNavigate, Link } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";

export default function MainNav() {
    const navigate = useNavigate();
    const { setToken, setCurrentUser, isAdmin, setIsAdmin, isAsesor, setIsAsesor } = useMyContext();

    const handleLogout = () => {
        localStorage.removeItem("JWT_TOKEN"); 
        localStorage.removeItem("USER"); 
        localStorage.removeItem("CSRF_TOKEN");
        localStorage.removeItem("IS_ADMIN");
        localStorage.removeItem("IS_ASESOR");
        setToken(null);
        setCurrentUser(null);
        setIsAdmin(false);
        setIsAsesor(false);
        navigate("/");
    }

    return (
        <header className='sticky-top shadow-sm'>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container">
                    <Link to="/inicio">
                        <img src={logotec} width={"250px"} className="navbar-brand" alt="Logo" />
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
                                    <i className="icon_user text-white bi bi-list"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    <li>
                                        <Link to="/MiPerfil" className="sub-menu-link dropdown-item">Mi cuenta</Link>
                                    </li>
                                    <li>
                                        <Link to="/inicio" className="sub-menu-link dropdown-item">Inicio</Link>
                                    </li>
                                    {isAsesor && (
                                        <li>
                                            <Link to={'/documentos'} className="sub-menu-link dropdown-item">
                                                <p>Documentos</p>
                                            </Link>
                                        </li>
                                    )}
                                    {isAdmin && (
                                        <li>
                                            <Link to={'/admin'} className="sub-menu-link dropdown-item">
                                                <p>Panel de control</p>
                                            </Link>
                                        </li>
                                    )}
                                    <li>
                                        <hr className="dropdown-divider" />
                                    </li>
                                    <li>
                                        <button onClick={handleLogout} className="sub-menu-link dropdown-item">
                                            <p>Cerrar sesión</p>
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
