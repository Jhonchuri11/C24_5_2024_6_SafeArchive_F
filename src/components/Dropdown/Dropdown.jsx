import React, { useEffect, useState } from "react";
import '../../style/Dropdown.css';
import logout from '../../assets/images/logout.png';
import addDoc from '../../assets/images/addDoc.png';
import profile from '../../assets/images/profile.png';
import menu from '../../assets/images/menu.png';
import dashboard from '../../assets/images/dashboard.png';
import { Link, useNavigate } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";

export default function Dropdown() {

    // para mostrar  datos del user
    const [user, setUser] = useState('');

    // navigation
    const navigate = useNavigate();

    // Access the states by using the useMyContext hook from the ContextProvider
    const { token, setToken, setCurrentUser, isAdmin, setIsAdmin } = useMyContext();

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
        <div className="sub-menu-wrap" id="subMenu">
            <div className="sub-menu">
                    
                <div className="email-user">
                    <img src={profile} alt="profile" />
                    <h2>{user ? user.name : 'Nombre usuario'}</h2>
                </div>
                <hr/>
                
                {isAdmin && (
                    <Link to={'/dashboard'} className="sub-menu-link">
                        <img src={dashboard} alt="dashboard"/>
                        <p>Dashboard</p>
                        <span>&gt;</span>
                    </Link>
                )}

                <Link to={'/listadoDocumento'} className="sub-menu-link">
                    <img src={addDoc} alt="add document"/>
                    <p>Documentos</p>
                    <span>&gt;</span>
                </Link>

                <Link to={'/createdoc'} className="sub-menu-link">
                    <img src={menu} alt="create doc"/>
                    <p>Crear doc</p>
                    <span>&gt;</span>
                </Link>
                
                <button onClick={handleLogout} className="sub-menu-link">
                    <img src={logout} alt="logout"/>
                    <p>Logout</p>
                    <span>&gt;</span>
                </button>
            </div>
        </div>
    )
};