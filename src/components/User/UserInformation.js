import React from "react";
import { useMyContext } from "../../store/ContextApi";


const UserInfo = () => {

  // Access the currentUser and token hook using the useMyContext custom hook from the ContextProvider
  const { currentUser } = useMyContext();
    
    return (
      <div className="container mt-4">
        <div className="breadcrumb">
          <span>Inicio</span> &gt; <span>Mi perfil</span>
        </div>
        <div className="card">
          <div className="card-header d-flex align-items-center">
            <i className="bi bi-person-circle fs-1 me-3"></i>
            <h5 className="mb-0">{currentUser?.email}</h5>
          </div>
          <div className="card-header d-flex align-items-center">
            <h5 className="mb-0">ROLE: {currentUser?.roles}</h5>
          </div>
          <div className="card-body">
            <div className="alert alert-info mb-4">
              ¡Para brindarte un mejor  actualizados!
            </div>
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">Ubicación actual</label>
                <select className="form-select">
                  <option>PASCO</option>
                  <option>OXAPAMPA</option>
                  <option>PUERTO BERMUDEZ</option>
                </select>
              </div>
              <div className="col-md-8">
                <label className="form-label">Dirección actual</label>
                <input type="text" className="form-control" placeholder="CALLE" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  export default UserInfo;