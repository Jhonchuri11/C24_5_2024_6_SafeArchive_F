import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import '../../style/AuditLogs.css';
const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [logsPerPage, setLogsPerPage] = useState(5); // Valor inicial de registros por página

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/auditoria`, { params: { page: currentPage - 1, limit: logsPerPage } });
                setLogs(response.data);
            } catch (err) {
                toast.error("Error fetching auditorias!");
                setError('Error al cargar los registros de auditoría');
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [currentPage, logsPerPage]);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                            <div className="card card-body rounded-0 border-0">
                                {/* Selector de cantidad de registros por página */}
                                <div className="logs-per-page">
                                    <label htmlFor="logs-per-page">Registros por página:</label>
                                    <select
                                        id="logs-per-page"
                                        value={logsPerPage}
                                        onChange={(e) => setLogsPerPage(Number(e.target.value))}
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={15}>15</option>
                                        <option value={20}>20</option>
                                    </select>
                                </div>

                                <div className="table-responsive d-flex flex-column align-items-center mt-4">
                                    <table className="table table-hover table-bordered">
                                        <thead>
                                            <tr className="rounded-top text-center">
                                                <th className="tableheadercolor py-1" style={{ width: "80px" }}><b>USUARIO</b></th>
                                                <th className="tableheadercolor py-1" style={{ width: "80px" }}><b>Ciudad de acceso</b></th>
                                                <th className="tableheadercolor py-1" style={{ width: "80px" }}><b>Dirección IP</b></th>
                                                <th className="tableheadercolor py-1" style={{ width: "80px" }}><b>Fecha de ingreso</b></th>
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
                                
                                {/* Botones de paginación */}
                                <div className="pagination">
                                    {Array.from({ length: Math.ceil(logs.length / logsPerPage) }, (_, index) => (
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
