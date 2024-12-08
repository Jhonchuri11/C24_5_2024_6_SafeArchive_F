import React from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi";

const Errors = ({ message }) => {
    const navigate = useNavigate();
    const onBackHandler = () => {
        navigate(-1);
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="text-center card shadow p-4">
                <div className="warning-icon mb-3">
                    <FiAlertCircle className="text-red-500 mb-4" size={40}/>
                </div>
                <h3 class="mb-2">¡Ups! Algo salió mal.</h3>
                <p className="text-gray-600 mb-6 font-semibold">{message}</p>
                <div className="flex justify-center">
                    <button onClick={onBackHandler} className="btn btn-primary mt-3">Go Back</button>
                </div>
            </div>
        </div>
    );
}

export default Errors;