import { useNavigate } from "react-router-dom"
import { FaExclamationTriangle } from "react-icons/fa";


const AccessDenied = () => {

    const navigate = useNavigate();

    const goHome = () => {
        navigate("/inicio");
    }

    return (
    <div class="container d-flex justify-content-center align-items-center vh-100">
        <div class="text-center card shadow p-4">
            <div class="warning-icon mb-3">
                <FaExclamationTriangle/>
            </div>
            <h3 class="mb-2">Access Denied</h3>
            <p class="text-muted">You do not have permission to view this page.</p>
            <button onClick={goHome} class="btn btn-primary mt-3">Go Back Home</button>
        </div>
    </div>
    )
}

export default AccessDenied;