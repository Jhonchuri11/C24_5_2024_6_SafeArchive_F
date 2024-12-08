import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RegisterUsersListModal = () => {
    const [usersList, setUsersList] = useState([{ email: '', roleId: '' }]);
    const [roles, setRoles] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        axios.get('/roles')
            .then(response => {
                setRoles(response.data);
            })
            .catch(error => {
                console.error("Error al obtener roles", error);
            });
    }, []);

    const handleAddUser = () => {
        setUsersList([...usersList, { email: '', roleId: '' }]);
    };

    const handleRemoveUser = (index) => {
        const newList = [...usersList];
        newList.splice(index, 1);
        setUsersList(newList);
    };

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const newList = [...usersList];
        newList[index][name] = value;
        setUsersList(newList);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/register-users', usersList)
            .then(response => {
                console.log('Usuarios registrados:', response.data);
                setShowModal(false);
            })
            .catch(error => {
                console.error("Error al registrar los usuarios", error);
            });
    };

    return (
        <div>
            <button className="btn btn-secondary" onClick={() => setShowModal(true)}>Registrar Lista de Usuarios</button>
            {showModal && (
                <div className="modal show" style={{ display: 'block' }} role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Registrar Lista de Usuarios</h5>
                                <button type="button" className="close" onClick={() => setShowModal(false)}>
                                    <span>&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    {usersList.map((user, index) => (
                                        <div key={index} className="form-group">
                                            <label>Email</label>
                                            <input 
                                                type="email" 
                                                className="form-control" 
                                                name="email" 
                                                value={user.email} 
                                                onChange={(e) => handleInputChange(e, index)} 
                                                required 
                                            />
                                            <label>Rol</label>
                                            <select 
                                                className="form-control" 
                                                name="roleId" 
                                                value={user.roleId} 
                                                onChange={(e) => handleInputChange(e, index)} 
                                                required
                                            >
                                                <option value="">Seleccione un rol</option>
                                                {roles.map((role) => (
                                                    <option key={role.id} value={role.id}>{role.name}</option>
                                                ))}
                                            </select>
                                            <button 
                                                type="button" 
                                                className="btn btn-danger mt-2" 
                                                onClick={() => handleRemoveUser(index)}
                                            >
                                                Eliminar Usuario
                                            </button>
                                        </div>
                                    ))}
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary mb-3" 
                                        onClick={handleAddUser}
                                    >
                                        Añadir Usuario
                                    </button>
                                    <button type="submit" className="btn btn-primary">Registrar Usuarios</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegisterUsersListModal;
