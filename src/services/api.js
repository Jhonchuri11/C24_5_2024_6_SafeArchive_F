import axios from "axios";

console.log("API URL:", process.env.REACT_APP_API_URL);

// create  an axios instance
const api =  axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api`,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true,
});

// Add request  intercepter to include JWT and CSRF tokens
api.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("JWT_TOKEN");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        let  csrfToken = localStorage.getItem("CSRF_TOKEN");
        if (!csrfToken) {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/csrf-token`,
                    { withCredentials: true }
                );
                csrfToken = response.data.token;
                localStorage.setItem("CSRF_TOKEN", csrfToken);
            } catch (error) {
                console.log("FAILED TO FETCH CSRF TOKEN",  error);
            }
        }

        if (csrfToken) {
            config.headers["X-XSRF-TOKEN"] = csrfToken;
        }
        console.log("X-XSRF-TOKEN" + csrfToken);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;