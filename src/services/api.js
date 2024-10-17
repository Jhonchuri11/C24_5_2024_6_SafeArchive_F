// src/api.js
import axios from "axios";

// Create an axios instance
const api = axios.create({
    baseURL: 'http://localhost:8081/api', // Asegúrate de que esta URL es correcta
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Add request interceptor to include JWT and CSRF tokens
api.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("JWT_TOKEN"); // Asegúrate de que este nombre coincida con el que usas para guardar el token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Esto añade el token a las cabeceras
        }

        let csrfToken = localStorage.getItem("CSRF_TOKEN");
        if (!csrfToken) {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/csrf-token`, // Asegúrate de que esta URL sea correcta
                    { withCredentials: true }
                );
                csrfToken = response.data.token;
                localStorage.setItem("CSRF_TOKEN", csrfToken);
            } catch (error) {
                console.log("FAILED TO FETCH CSRF TOKEN", error);
            }
        }

        if (csrfToken) {
            config.headers["X-XSRF-TOKEN"] = csrfToken; // Esto añade el token CSRF a las cabeceras
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// User API functions
export const fetchUsers = async () => {
    const response = await api.get('/users');
    return response.data;
};

export const createUser = async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
};

export const updateUser = async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
};

// Nueva función para obtener estudiantes por ID
export const fetchStudentById = async (userId) => {
    const response = await api.get(`/students/${userId}`); // Cambia la URL según tu API
    return response.data; // Devuelve solo los datos del estudiante
};


export const changeUserRole = async (userId, roleData) => {
    const response = await api.put(`/update-role?userId=${userId}&nombreRol=${roleData}`, {}); // Aquí pasas los datos
    return response.data; // Devuelve los datos de la respuesta
};

// Nueva función para obtener todos los estudiantes
export const fetchStudents = async () => {
    const response = await api.get('/admin/users');
    console.log(response);
    return response.data;    
};

export const deleteUser = async (userId) => {
    await api.delete(`/users/${userId}`);
    return userId; // Retorna el ID para eliminarlo de la lista
};


export default api;
