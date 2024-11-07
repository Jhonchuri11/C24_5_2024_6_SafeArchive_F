import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Link, useNavigate } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";

export default function MainNav() {
    const navigate = useNavigate();
    const { setToken, setCurrentUser, isAdmin, setIsAdmin, isAsesor, setIsAsesor } = useMyContext();
    const [showModal, setShowModal] = useState(false);

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
                        <img src="/placeholder.svg?height=50&width=250" width="250" height="50" className="navbar-brand" alt="Logo" />
                    </Link>
                    <button 
                        className="navbar-toggler" 
                        type="button" 
                        onClick={() => setShowModal(true)}
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navmenu">
                        <div className="navbar-nav ms-auto">
                            <li className="nav-item dropdown">
                                <button
                                    className="btn"
                                    id="navbarDropdown"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="true"
                                >
                                    <i className="icon_user text-white bi bi-list"></i>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end show" aria-labelledby="navbarDropdown">
                                    <li>
                                        <Link to="/MiPerfil" className="sub-menu-link dropdown-item">Mi cuenta</Link>
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

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Opciones</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul className="list-unstyled">
                        <li>
                            <Link to="/MiPerfil" className="sub-menu-link" onClick={() => setShowModal(false)}>Mi cuenta</Link>
                        </li>
                        {isAsesor && (
                            <li>
                                <Link to={'/documentos'} className="sub-menu-link" onClick={() => setShowModal(false)}>
                                    <p>Documentos</p>
                                </Link>
                            </li>
                        )}
                        {isAdmin && (
                            <li>
                                <Link to={'/admin'} className="sub-menu-link" onClick={() => setShowModal(false)}>
                                    <p>Panel de control</p>
                                </Link>
                            </li>
                        )}
                        <li>
                            <hr />
                        </li>
                        <li>
                            <button onClick={() => { handleLogout(); setShowModal(false); }} className="sub-menu-link">
                                <p>Cerrar sesión</p>
                            </button>
                        </li>
                    </ul>
                </Modal.Body>
            </Modal>
        </header>
    )
}