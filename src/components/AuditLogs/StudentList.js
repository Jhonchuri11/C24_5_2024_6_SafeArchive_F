import React, { useEffect, useState } from 'react';
import { fetchStudents, deleteUser } from '../../services/api';
import '../../style/StudentList.css';


const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [studentsPerPage, setStudentsPerPage] = useState(10); 
    const [totalStudents, setTotalStudents] = useState(0); 

    useEffect(() => {
        const getStudents = async () => {
            try {
                const data = await fetchStudents();
                setStudents(data);
                setTotalStudents(data.length);
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

    const handleDelete = async (userId) => {
        try {
            await deleteUser(userId);
            setStudents(students.filter(student => student.userId !== userId));
        } catch (error) {
            console.error('Error al eliminar el estudiante:', error.response?.data || error.message);
        }
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
        <>
            <h1 className="title">Lista de Estudiantes</h1>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Buscar por correo..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
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

            <ul className="list">
                {currentStudents.map(student => (
                    <li key={student.userId} className="list-item">
                        <span className="list-item-icon">📧</span>
                        {student.correoCorporativo}
                        <button 
                            className="delete-button" 
                            onClick={() => handleDelete(student.userId)}
                        >
                            Eliminar
                        </button>
                    </li>
                ))}
            </ul>

            <div className="pagination">
                {Array.from({ length: Math.ceil(filteredStudents.length / studentsPerPage) }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                        disabled={currentPage === index + 1}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </>
    );
};

export default StudentList;