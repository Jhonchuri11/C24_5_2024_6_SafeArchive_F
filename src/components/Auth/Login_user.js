import React from "react";
import logo_student from "../../assets/images/student-left-2.png";
import logo_tecsup from "../../assets/images/tecsup_update.png";
import logo_google from "../../assets/images/google-right.png";
import "../../style/Login_user.css";

export default function Login_user() {

    const baseUrl = process.env.REACT_APP_API_URL;

    const gooogleLogin = () => {
        window.location.href = `${baseUrl}/oauth2/authorization/google`;
    }
    
    return (
       <div className="login-page">
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="row border p-3 bg-white shadow box-area">
                <div className="col-md-6 border-end rounded d-flex justify-content-center align-items-center flex-column left-box">
                    <img src={logo_student} style={{ width: '100%' }} />
                </div>
                <div className="col-md-6 right-box">
                    <div className="row align-items-center">
                        <div className="header-text mb-4">
                            <img src={logo_tecsup} style={{ width: '50%' }}/>
                        </div>
                        <div className="mb-2">
                            <h2 class="subtitulo py-2">Te damos la bienvenida a la plataforma</h2>
                        </div>
                        <div className="mb-2">
                            <h2 class="subtitulo py-2">Iniciar sesión</h2>
                        </div>
                        <div className="mb-3 text-center">
                            <button onClick={gooogleLogin} className="btn btn-lg border btn-light fs-6 btn-login">
                                <img src={logo_google} style={ { width: '20px' }} className="me-2"/><small>Continuar con Google</small>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
       </div> 
    );
}