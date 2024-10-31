import axios from "axios";

console.log("API URL:", process.env.REACT_APP_API_URL);


const api = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api`, 
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true,
});

api.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("JWT_TOKEN"); 
        if (token) {    
            config.headers.Authorization = `Bearer ${token}`; 
        }

        let csrfToken = localStorage.getItem("CSRF_TOKEN");
        if (!csrfToken) {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/csrf-token`, 
                    { withCredentials: true }
                );
                csrfToken = response.data.token;
                localStorage.setItem("CSRF_TOKEN", csrfToken);
            } catch (error) {
                console.log("FAILED TO FETCH CSRF TOKEN", error);
            }
        }

        if (csrfToken) {
            config.headers["X-XSRF-TOKEN"] = csrfToken; 
        }
        console.log("X-XSRF-TOKEN " + csrfToken);
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
    // Asegúrate de que roleData sea un objeto que contenga un campo válido como 'nombreRol'
    const response = await api.put(`/admin/update-role?userId=${userId}&nombreRol=${roleData.nombreRol}`, {});
    return response.data;
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
