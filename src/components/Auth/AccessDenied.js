import { useNavigate } from "react-router-dom"


const AccessDenied = () => {

    const navigate = useNavigate();

    const goHome = () => {
        navigate("/inicio");
    }

    return (
        <div>
            <p> No tiene permiso</p>
            <button onClick={goHome}>
                Go back home
            </button>
        </div>
    )
}

export default AccessDenied;