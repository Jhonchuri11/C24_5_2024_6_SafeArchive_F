import React, { useEffect, useState } from 'react';
import { fetchStudents, deleteUser, changeUserRole } from '../../services/api';
import { Link } from 'react-router-dom';
import '../../style/StudentList.css';
import { IconButton, Tooltip } from "@mui/material";
import { MdRemoveRedEye } from 'react-icons/md';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [studentsPerPage, setStudentsPerPage] = useState(10);

    useEffect(() => {
        const getStudents = async () => {
            try {
                const data = await fetchStudents();
                setStudents(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        getStudents();  
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredStudents = students.filter(student =>
        student.correoCorporativo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastStudent = currentPage * studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
    const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleChangeRole = async (userId) => {
        if (!selectedRole) {
            alert('Por favor, selecciona un rol primero.');
            return;
        }

        try {
            await changeUserRole(userId, { nombreRol: selectedRole });
            alert('Rol cambiado a ' + selectedRole);
        } catch (error) {
            alert('Error al cambiar el rol: ' + error.message);
        }
    };

    if (loading) return <div className="loading">Cargando...</div>;
    if (error) return <div className="error">Error: {error.message}</div>;

    return (
        <div className="student-list-container">
            <h1 className="student-list-title">Lista de Usuarios</h1>
            <div className="student-search-bar">
                <input
                    type="text"
                    placeholder="Buscar por correo..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="student-search-input"
                />
            </div>

            {/* Selector de cantidad de estudiantes por página */}
            <div className="students-per-page">
                <label htmlFor="students-per-page">Estudiantes por página:</label>
                <select
                    id="students-per-page"
                    value={studentsPerPage}
                    onChange={(e) => setStudentsPerPage(Number(e.target.value))}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                </select>
            </div>
            
            <ul className="student-list">
    {currentStudents.map(student => (
        <li key={student.userId} className="student-list-item">
            <span className="list-item-icon">📧</span>
            {student.correoCorporativo}

            <div className="button-container">
                <button className="view-button">
                    <Link to={`/student/${student.userId}`}>
                        Ver usuario
                    </Link>
                </button>

                <select
                className="select-role"
                    onChange={(e) => {
                        setSelectedRole(e.target.value);
                    }}
                >
                    <option value="">Seleccionar rol</option>
                    <option value="administrador">Administrador</option>
                    <option value="asesor">Asesor</option>
                    <option value="estudiante">Estudiante</option>
                </select>

                <button className="role-button" onClick={() => handleChangeRole(student.userId)}>
                    Cambiar rol
                </button>
            </div>
        </li>
    ))}
</ul>

            
            <div className="pagination">
                {Array.from({ length: Math.ceil(filteredStudents.length / studentsPerPage) }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={`student-page-button ${currentPage === index + 1 ? 'student-active' : ''}`}
                        disabled={currentPage === index + 1}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

        <div className="content_documento container ">
                <div className="row mb-3">
                    <div className="col-12">
                        <div className="box_block mt-3">
                            <div className="card-header box_header_1 py-2">
                                <span>USUARIOS - LISTADO</span>
                            </div>
                            <div className="card card-body rounded-0 border-0 ">
                                
                                <div className="table-responsive d-flex flex-column align-items-center mt-4">
                                    
                                    
                                    <table className="table table-hover table-bordered">
                                        <thead>
                                            <tr className="rounded-top text-center">
                                                <th className="tableheadercolor py-1" style={{ width: "80px" }}><b>USUARIO</b></th>
                                                <th className="tableheadercolor  py-1" style={{ width: "80px" }}><b>Role</b></th>
                                                <th className="tableheadercolor py-1" style={{ width: "80px" }}><b>Acción</b></th>
                                            </tr>
                                        </thead>
                                        <tbody className='text-center'>
                                            {currentStudents.map((log, id) => (
                                                <tr key={id}>
                                                    <td>{log.correoCorporativo}</td>
                                                    <td>{log.nombre_rol}</td>
                                                    <td>
                                                        <Tooltip>
                                                         
                                                                <IconButton>
                                                                    <MdRemoveRedEye color="#28AECE" />
                                                                </IconButton>
                                                          
                                                        </Tooltip>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentList;
