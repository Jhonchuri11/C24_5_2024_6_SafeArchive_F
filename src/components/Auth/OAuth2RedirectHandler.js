import { useLocation, useNavigate } from "react-router-dom"
import { useMyContext } from "../../store/ContextApi";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setToken, setIsAdmin } = useMyContext();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        console.log("OAuth2RedirectHandler: Params:", params.toString());
        console.log("OAuth2RedirectHandler: Token:", token);

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                console.log("Decoded Token:", decodedToken);

                localStorage.setItem('JWT_TOKEN', token);

                const user = {
                    username: decodedToken.sub,
                    roles: decodedToken.roles.split(','),
                };
                console.log("User Object: ", user);
                localStorage.setItem('USER', JSON.stringify(user));

                // update context state
                setToken(token);
                setIsAdmin(user.roles.includes('administrador'));

                // Delay navigation to ensure local storage operations complete
                setTimeout(() => {
                    console.log("Navigation to /inicio");
                    //navigate('/admin');
                    navigate('/inicio');
                }, 100); // 100ms delay
            } catch (error) {
                console.error('Token decoding failed:', error);
                navigate('/');
            }
        } else {
            console.log("Token not found in URL redirecting to login");
            navigate('/');
        }
    }, [ location, navigate, setToken, setIsAdmin ]);

    return <div>Redirecting...</div>;
};

export default OAuth2RedirectHandler;