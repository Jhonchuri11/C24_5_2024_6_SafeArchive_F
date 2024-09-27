import React from "react";
import logotec from '../../assets/images/Tec-update-01.png';
import profile from '../../assets/images/profile.png';
import Dropdown from "../Dropdown/Dropdown";

export default function MainNav() {


    // Para mostrar la foto de perfil del user
    /*
    const [user, setuser] = useState('');

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
    const toggleMenu = () => {

        var subMenu = document.getElementById("subMenu");
        subMenu.classList.toggle("open-menu");
    }
    return (
        // Nav principal
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <img src={logotec} width={"250px"}  class="navbar-brand"/>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navmenu">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse  navbar-collapse" id="navMneu">
                    <div className="navbar-nav ms-auto">
                        
                        <li className="nav-item">
                            <button  className="nav-link" onClick={toggleMenu}><img src={profile} width={"40px"} /></button>
                        </li>
                    </div>
                </div>
                
            </div>
        
            <div>
            {
                toggleMenu && (
                    <Dropdown/>  
                )
            } 
            </div>
        </nav>
    
    )
}