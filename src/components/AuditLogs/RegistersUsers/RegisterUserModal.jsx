import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RegisterUserModal = () => {
    const [roles, setRoles] = useState([]);
    const [email, setEmail] = useState('');
    const [roleId, setRoleId] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Obtener los roles del backend
        axios.get('/roles')
            .then(response => {
                setRoles(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the roles!", error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = {
            email,
            roleId
        };

        axios.post('/register-user', userData)
            .then(response => {
                console.log('Usuario registrado:', response.data);
                // Cerrar el modal o realizar alguna acción adicional
                setShowModal(false);
            })
            .catch(error => {
                console.error("Error al registrar el usuario", error);
            });
    };

    return (
        <div>
           
        </div>
    );
};

export default RegisterUserModal;
