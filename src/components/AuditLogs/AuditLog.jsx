import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLogs = async (page = 0, limit = 4 ) => {
            try {
                const response = await api.get(`/auditoria`, { params: { page, limit }} );
                console.log(response); 
                setLogs(response.data);
            } catch (err) {
                toast.error("Error fetching autorias!.");
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
        <div className="container">
    
        <div className="content_documento container ">
                <div className="row mb-3">
                    <div className="col-12">
                        <div className="box_block mt-3">
                            <div className="card-header box_header_1 py-2">
                                <span>LISTADO DE INGRESO DE USUARIOS</span>
                            </div>
                            <div className="card card-body rounded-0 border-0 ">
                                
                                <div className="table-responsive d-flex flex-column align-items-center mt-4">
                                    
                                    
                                    <table className="table table-hover table-bordered">
                                        <thead>
                                            <tr className="rounded-top text-center">
                                                <th className="tableheadercolor py-1" style={{ width: "80px" }}><b>USUARIO</b></th>
                                                <th className="tableheadercolor  py-1" style={{ width: "80px" }}><b>Ciudad de acceso</b></th>
                                                <th className="tableheadercolor py-1" style={{ width: "80px" }}><b>Dirección IP</b></th>
                                                <th className="tableheadercolor  py-1" style={{ width: "80px" }}><b>Fecha de ingreso</b></th>
                                                <th className="tableheadercolor py-1" style={{ width: "80px" }}><b>Navegador</b></th>
                        
                                            </tr>
                                        </thead>
                                        <tbody className='text-center'>
                                            {logs.map((log, id) => (
                                                <tr key={id}>
                                                    <td>{log.id_usuario.correoCorporativo}</td>
                                                    <td>{log.ciudad_acceso}</td>
                                                    <td>{log.direccion_ip}</td>
                                                    <td>{new Date(log.fecha_ingreso).toLocaleString()}</td>
                                                    <td>{log.navegador}</td>
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

export default AuditLogs;
