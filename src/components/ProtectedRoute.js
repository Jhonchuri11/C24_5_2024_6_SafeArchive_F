
import { Navigate } from "react-router-dom";
import { useMyContext } from "../store/ContextApi";

const ProtectedRoute = ({ children, adminPage }) => {
    // access the token and isAdmin state by using the useMyContext hook from the contextProvider
    const { token, isAdmin } = useMyContext();

    // navigate top login page to an unauthenticated
    if (!token) {
        return <Navigate to="/" />;
    }

    // navigate to access-denied page if a user try to access the admin page
    if (token && adminPage && !isAdmin) {
        return <Navigate to="/access-denied" />
    }

    return children;
}

export default ProtectedRoute;