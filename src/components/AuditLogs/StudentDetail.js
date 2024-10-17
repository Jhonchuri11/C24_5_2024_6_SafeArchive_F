import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchStudentById } from '../../services/api'; 

const StudentDetail = () => {
    const { userId } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getStudent = async () => {
            try {
                const data = await fetchStudentById(userId);
                setStudent(data);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        getStudent();
    }, [userId]);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!student) return <div>No se encontró el estudiante</div>;

    return (
        <div>
            <h1>Detalles del Estudiante</h1>
            <p><strong>Correo Corporativo:</strong> {student.correoCorporativo}</p>
            <p><strong>Nombre:</strong> {student.nombre}</p>
            <p><strong>Edad:</strong> {student.edad}</p>
        </div>
    );
};

export default StudentDetail;
