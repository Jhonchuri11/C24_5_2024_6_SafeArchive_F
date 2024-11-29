import React from "react";
import { useMyContext } from "../../store/ContextApi";
import { Link } from "react-router-dom";
import '../../style/User.css';

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
        {/* User Card */}
      <div className="card mx-auto shadow p-4" style={{ maxWidth: "600px", borderRadius: "10px" }}>
        <div className="row align-items-center">
          {/* User Image */}
          <div className="col-md-4 text-center mb-3 mb-md-0">
            <i className="bi bi-person-circle" style={{ fontSize: "150px", color: "#6c757d" }}></i>
          </div>

          {/* User Inputs */}
          <div className="col-md-8">
            <form>
              <div className="mb-3">
                <label htmlFor="email" className="form-label form-label_doc">CORREO ELECTRÓNICO</label>
                <input
                readOnly
                  type="email"
                  id="email"
                  className="form-control form-control_doc input_btn"
                  defaultValue={currentUser?.email || ""}
                  placeholder="example@email.com"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="role" className="form-label form-label_doc ">ROL</label>
                <input
                readOnly
                  type="text"
                  id="role"
                  className="form-control rol_user input_btn"
                  defaultValue={currentUser?.roles || ""}
                  placeholder="Rol del usuario"
                />
              </div>
            </form>
          </div>
        </div>
        
      </div>
      <hr/>
    </div>
    
    );
  }

  export default UserInfo;