import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await axios.get('localhost:8000/api/audit-logs'); 
                setLogs(response.data);
            } catch (err) {
                setError('Error al cargar los registros de auditoría');
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Ciudad de Acceso</th>
                    <th>Dirección IP</th>
                    <th>Fecha de Ingreso</th>
                    <th>Navegador</th>
                </tr>
            </thead>
            <tbody>
                {logs.map(log => (
                    <tr key={log.id}>
                        <td>{log.id}</td>
                        <td>{log.ciudad_acceso}</td>
                        <td>{log.direccion_ip}</td>
                        <td>{new Date(log.fecha_ingreso).toLocaleString()}</td>
                        <td>{log.navegador}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default AuditLogs;
