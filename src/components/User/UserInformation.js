import React from "react";
import { useMyContext } from "../../store/ContextApi";
import { Link } from "react-router-dom";


const UserInfo = () => {

  // Access the currentUser and token hook using the useMyContext custom hook from the ContextProvider
  const { currentUser } = useMyContext();
    
    return (
      <div className="container mt-4">
        <div className="breadcrumb">
        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/inicio" className="breadcrumb_inicio">Inicio</Link></li>
                                <li className="breadcrumb-item" aria-current="page">Mi Perfil</li>
                            </ol>
        </nav>
        </div>
        <div className="card">
          <div className="card-header d-flex align-items-center">
            <i className="bi bi-person-circle fs-1 me-3"></i>
            <h5 className="mb-0">{currentUser?.email}</h5>
          </div>
          <div className="card-body">
            <div className="alert alert-info mb-4">
              <h5 className="mb-0">ROLE: {currentUser?.roles}</h5>
            </div>
          </div>
        </div>
      </div>
    );
  }

  export default UserInfo;