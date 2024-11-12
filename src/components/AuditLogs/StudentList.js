import React, { useEffect, useState } from 'react';
import { fetchStudents, changeUserRole } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../style/StudentList.css';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [selectedRole, setSelectedRole] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [studentsPerPage, setStudentsPerPage] = useState(10);

    useEffect(() => {
        const getStudents = async () => {
            try {
                const data = await fetchStudents();
                const studentsWithRoles = data.map(student => ({
                    ...student,
                    rol: student.role_id 
                }));
                setStudents(studentsWithRoles);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };
    
        getStudents();  
    }, []);

    const handleChangeRole = async (userId) => {
        const newRole = selectedRole[userId];
        if (!newRole) {
            toast.error('Por favor, selecciona un rol primero.');
            return;
        }

        try {
            await changeUserRole(userId, { nombreRol: newRole });
            toast.success(`Rol cambiado a ${newRole}`);
            setStudents(students.map(student => 
                student.userId === userId ? { ...student, rol: newRole } : student
            ));
        } catch (error) {
            toast.error(`Error al cambiar el rol: ${error.message}`);
        }
    };

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

    if (loading) return <div className="loading">Cargando...</div>;
    if (error) return <div className="error">Error: {error.message}</div>;

    return (
        <div className="student-list-container">
            <h1 className="student-list-title">Lista de Usuarios</h1>

            {/* Configuración de ToastContainer */}
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            <div className="student-search-bar">
                <input
                    type="text"
                    placeholder="Buscar por correo..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="student-search-input"
                />
            </div>

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

            <table className="student-table">
                <thead>
                    <tr>
                        <th>Usuarios</th>
                        <th>Selección</th>
                        <th>Cambiar</th>
                        <th>Rol</th>
                    </tr>
                </thead>
                <tbody>
                    {currentStudents.map(student => (
                        <tr key={student.userId}>
                            <td>{student.correoCorporativo}</td>
                            <td>
                                <select
                                    className="select-role"
                                    value={selectedRole[student.userId] || ''}
                                    onChange={(e) => {
                                        setSelectedRole({ ...selectedRole, [student.userId]: e.target.value });
                                    }}
                                >
                                    <option value="">Seleccionar rol</option>
                                    <option value="administrador">Administrador</option>
                                    <option value="asesor">Asesor</option>
                                    <option value="estudiante">Estudiante</option>
                                </select>
                            </td>
                            <td>
                                <button 
                                    className="role-button" 
                                    onClick={() => handleChangeRole(student.userId)}
                                >
                                    Cambiar rol
                                </button>
                            </td>
                            <td>
                                {student.rol}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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
        </div>
    );
};

export default StudentList;
