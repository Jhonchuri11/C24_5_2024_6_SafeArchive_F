import { createContext, useContext, useEffect, useState } from "react";
import api from  "../services/api";
import toast from  "react-hot-toast";

const ContextApi =  createContext();

export const  ContextProvider = ({ children }) => {

    // find the token in the Localstorage
    const getToken = localStorage.getItem("JWT_TOKEN")
    ? localStorage.getItem("JWT_TOKEN")
    : null;

    // find is the user admin status from the LocalStorage
    const isADmin = localStorage.getItem("IS_ADMIN")
    ? JSON.stringify(localStorage.getItem("IS_ADMIN"))
    : false;

    // find is the user asesor from the LocalStorage
    const isASesor = localStorage.getItem("IS_ASESOR")
    ? JSON.stringify(localStorage.getItem("IS_ASESOR"))
    : false;

    // store the token
    const [ token, setToken ] = useState(getToken);

    // store the current loggedin user
    const [ currentUser, setCurrentUser ] = useState(null);
    // handle sidebar opening and clasing in the admin panel
    const [openSidebar, setOpenSidebar ] = useState(true);
    // check the loggedin user is admin o not
    const [isAdmin, setIsAdmin] = useState(isADmin)

    // check the loggedir user is admin o not
    const [isAsesor, setIsAsesor] = useState(isASesor)

    //const [isAsesor, setIsAsesor] = useState(localStorage.getItem("IS_ASESOR") ? JSON.parse(localStorage.getItem("IS_ASESOR")) : false);

    // verificando el user
    const fetchUser = async () => {
        const user = JSON.parse(localStorage.getItem("USER"));

        if (user?.username) {
            try {
                const { data } = await api.get(`/auth/user`);
                const roles = data.roles;

                if (roles.includes("administrador")) {
                    localStorage.setItem("IS_ADMIN", JSON.stringify(true));
                    setIsAdmin(true);
                } else {
                    localStorage.removeItem("IS_ADMIN");
                    setIsAdmin(false);
                }
                if (roles.includes("asesor")) {
                    localStorage.setItem("IS_ASESOR", JSON.stringify(true));
                    setIsAsesor(true);
                } else {
                    localStorage.removeItem("IS_ASESOR");
                    setIsAsesor(false);
                }
                setCurrentUser(data);
            } catch (error) {
                console.error("Error fetching current user", error);
                toast.error("Token expirado");
            }
        }
    };

    // if token exist fecth the current user
    useEffect(() => {
        if (token) {
            fetchUser();
        }
    }, [token]);

    // through context provider you are sending all the datas so that we access at anywhere in your application
    return (
        <ContextApi.Provider
        value={{
            token,
            setToken,
            currentUser,
            setCurrentUser,
            openSidebar,
            setOpenSidebar,
            isAdmin,
            setIsAdmin,
            isAsesor, 
            setIsAsesor
        }}>
            { children }
        </ContextApi.Provider>
    );
};

// by using this (useMyContext) custom hook we can reach our context provier and access the datas across our component
export const useMyContext = () => {
    const context = useContext(ContextApi);

    return context;
}