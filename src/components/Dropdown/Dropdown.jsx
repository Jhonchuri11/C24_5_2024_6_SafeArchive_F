import React, { useEffect, useState } from "react";
import '../../style/Dropdown.css';
import logout from '../../assets/images/logout.png';
import addDoc from '../../assets/images/addDoc.png';
import profile from '../../assets/images/profile.png';
import menu from '../../assets/images/menu.png';
import { Link, useNavigate } from "react-router-dom";
import { useMyContext } from "../../store/ContextApi";

export default function Dropdown() {

    // para mostrar  datos del user
    const [user, setuser] = useState('');

    // navigation
    const navigate = useNavigate();

    // Access the states by using the useMyContext hook from the ContextProvider
    const { token, setToken, setCurrentUser, isAdmin, setIsAdmin} =  useMyContext();

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

    /*
    useEffect(() => {
        axios.get('http://localhost:8080/user-info', {withCredentials: true})
        .then(response => {
            setuser(response.data);
            console.log(response.data);
        })
        .catch(error => {
            console.error('Error occured: ', error);
        })
    }, []);
*/
    return (
        <div className="sub-menu-wrap" id="subMenu">
            <div className="sub-menu">
                    
                    <div className="email-user">
                        <img src={profile} />
                        <h2>Nombre usuario</h2>
                    </div>
                    <hr/>
                    
                    <button onClick={handleLogout} className="sub-menu-link">
                        <img src={logout}/>
                        <p>Logout</p>
                        <span>&gt;</span>
                    </button>

                    <Link to={'/listadoDocumento'} className="sub-menu-link">
                        <img src={addDoc}/>
                        <p>Documentos</p>
                        <span>&gt;</span>
                    </Link>
                    <Link to={'/inicio'} className="sub-menu-link">
                        <img src={menu}/>
                        <p>Menú</p>
                        <span>&gt;</span>
                    </Link>
                    <Link to={'/createdoc'} className="sub-menu-link">
                        <img src={menu}/>
                        <p>Crear doc</p>
                        <span>&gt;</span>
                    </Link>
            </div>
        </div>
    )
};

