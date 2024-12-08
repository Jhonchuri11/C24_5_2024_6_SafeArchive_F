import React, { useCallback, useEffect, useState } from "react";
import '../../style/ContentDocument.css';
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { format } from 'date-fns';
import toast from "react-hot-toast";
import Errors from "../Errors";
import { IconButton, Tooltip } from "@mui/material";
import { MdRemoveRedEye } from "react-icons/md";
import { FaBan, FaCheck, FaChevronCircleLeft, FaChevronCircleRight,FaEdit, FaFileAlt, FaFileUpload, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";

const ContentDocument = () => {

    const navigate = useNavigate();

    const [documentos, setDocumentos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [busqueda, setBusqueda] = useState('');

    // filter frontend
    const [filteredDocs, setFilteredDocs] = useState([]);     

    const [carrera, setCarrera] = useState('');             
    const [carrerasUnicas, setCarrerasUnicas] = useState([]); 

    // paginacion para tabla
    const [currentPage, setCurrentPage] = useState(1);
    const documentsPerPage = 5;

    const fectchDocumentos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get("/documentos");
            const documentData = Array.isArray(response.data) ? response.data : [];
            setDocumentos(documentData);

            const uniqueCarrer = [...new Set(response.data.map(doc => doc.nombreCarrera))];
            setCarrerasUnicas(uniqueCarrer);
            
        } catch (error) {
            setError(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fectchDocumentos();
    }, [fectchDocumentos]);

    useEffect(() => {
        let filtered = documentos;

        if (busqueda.trim()) {
            filtered = filtered.filter(doc =>
                doc.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                doc.autores.toLowerCase().includes(busqueda.toLocaleLowerCase()) ||
                doc.nombreCategoria.toLocaleLowerCase().includes(busqueda.toLocaleLowerCase())
            );
        }

        if (carrera) {
            filtered = filtered.filter(doc =>
                doc.nombreCarrera === carrera
            )
        }

        setFilteredDocs(filtered);
    }, [busqueda , carrera, documentos]);

    const handleViewDocument = async (docId) => {
        navigate(`/view-document/${docId}`);
    }

    const handleDisableDocumento = async (docId, currentStatus) => {
        
        const confirmMessage = currentStatus ? "deshabilitar" : "habilitar";

        Swal.fire({
            title: `Estás seguro de ${confirmMessage} este documento?`,
            text: currentStatus
                 ? "Este documento se deshabilitará, pero puedes volver a habilitarlo."
                 : "El documento se habilitará y estará disponible nuevamente",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: `Sí, ${confirmMessage}`,
            cancelButtonText: "No, cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.put(`/documentos/${docId}/status?status=${!currentStatus}`);

                    setDocumentos(documentos.map(doc =>
                         doc.id === docId ? { ...doc, status: !currentStatus } : doc 
                    ));

                    toast.success(`Documento ${confirmMessage} correctamente.`);

                } catch (error) {

                    setError(error.response.data.message);
                    
                    toast.error("No se puede deshabilitar el documento.");
                }
            }
        });
    };

    // Paginación
    const indexOfLastDocument = currentPage * documentsPerPage;
    const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
    const currentDocuments = filteredDocs.slice(indexOfFirstDocument, indexOfLastDocument);

    const totalPages = Math.ceil(filteredDocs.length / documentsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // to show and erros
    if (error) {
        return <Errors message={error} />
    }

    return (
        <div>
            <div className="container mt-4">
                <div className="row">
                    <div className="col-12 col-md-12 col-sm-12 col-lg-12 col-xl-12">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/inicio" className="breadcrumb_inicio">Inicio</Link>
                                </li>
                                <li className="breadcrumb-item" aria-current="page">Documentos
                                </li>
                                <li className="breadcrumb-item active" aria-current="page"> Formato registro de documento</li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <hr/>
            </div>
            <div className="content_documento container">
                <div className="row mb-3">
                    <div className="col-12">
                        <div className="box_block">
                            <div className="card-header box_header_1 py-2">
                                
                                <span>FORMATO REGISTRO DE DOCUMENTO</span>
                            </div>
                            <div className="card card-body rounded-0 border-0 div-etapa" id="div-beneficio" data-nivel="0">
                                <div className="row d-flex flex-row justify-content-center align-items-center">
                                    <div className="card mx-3 mb-2 mb-sm-0 card-beneficio s_card_button">
                                        <Link className="btn_register" to="/createDocumento">
                                            <div className="card-body p-3 mx-auto text-center" style={{ width: "160px" }}>
                                                <p className="card-title mb-1">Registro de información de documento</p>
                                                <FaFileUpload size={30} color="#28AECE"/>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="box_block mt-3">
                            <div className="card-header box_header_1 py-2">
                                <span>LISTADO DE DOCUMENTO</span>
                            </div>
                            
                            <div className="card card-body rounded-0 border-0">
                                
                            <div className="row d-flex align-items-center">
                                {/* Buscador */}
                                <div className="col-md-4 d-flex  align-items-center">
                                    <div className="input-group">
                                        <input
                                        type="text"
                                        placeholder="Buscar..."
                                        className="form-control input_btn border border-grey-1" 
                                        value={busqueda}
                                        onChange={(e) => setBusqueda(e.target.value)}
                                        />
                                        <span className="input-group-text button_page_filters bg-white">
                                            <FaSearch />
                                        </span>
                                    </div>
                                </div>
                                 {/* Filtro */}
                                <div className="col-md-4 text-center">
                                    <label className="me-2 fw-bold">Filtrar:</label>
                                    <select
                                    className="form-select input_btn d-inline-block w-75"
                                    value={carrera}
                                    onChange={(e) => setCarrera(e.target.value)}
                                    >
                                    <option value="">Todas las carreras</option>
                                    {carrerasUnicas.map((uniqueCar, i) => (
                                        <option key={i} value={uniqueCar}>
                                            {uniqueCar}
                                        </option>
                                    ))}
                                </select>
                                </div>

                                {/* Paginación */}
                                <div className="col-md-4 d-flex justify-content-end align-items-center">
                                    <span className="me-3">Página {currentPage} de {totalPages}</span>
                                    <button 
                                    className="rounded button_page_list_doc" 
                                    onClick={handlePrevPage} 
                                    disabled={currentPage === 1}
                                    >
                                        <FaChevronCircleLeft/>
                                    </button>
                                    <button 
                                    className="rounded button_page_list_doc" 
                                    onClick={handleNextPage} 
                                    disabled={currentPage === totalPages}
                                    >
                                        <FaChevronCircleRight/>
                                    </button>
                                </div>
                            </div>
                            
                                <div className="table-responsive d-flex flex-column align-items-center mt-4">
                                
                                    
                                    <table className="table table_document table-hover table-bordered">
                                        
                                        <thead>
                                            <tr className="rounded-top">
                                                <th className="tableheadercolor text-center" style={{ width: "80px" }}><b>Título</b></th>
                                                <th className="tableheadercolor text-center" style={{ width: "80px" }}><b>Autores</b></th>
                                                <th className="tableheadercolor text-center py-1" style={{ width: "10%" }}><b>Publicado</b></th>
                                                <th className="tableheadercolor text-center py-1" style={{ width: "80px" }}><b>Categoria</b></th>
                                                <th className="tableheadercolor text-center py-1" style={{ width: "1%" }}><b>Documento</b></th>
                                                <th className="tableheadercolor text-center py-1" style={{ width: "10%" }}><b>Creado</b></th>
                                                <th className="tableheadercolor text-center py-1" style={{ width: "10%" }}><b>Modificado</b></th>
                                                <th className="tableheadercolor text-center py-1" style={{ width: "100px" }}><b>Acciones</b></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {documentos.length === 0 ? (
                                                <tr>
                                                    <td colSpan="8" className="text-center">
                                                        No cuentas con ningún registro actualmente.
                                                    </td>
                                                </tr>
                                            ) : currentDocuments.length === 0 ? (
                                                <tr>
                                                    <td colSpan="8" className="text-center">
                                                        No se encontró ningún resultado.
                                                    </td>
                                                </tr>
                                            ) : (
                                             currentDocuments.map((doc) => (
                                                <tr 
                                                key={doc.id}
                                                className={doc.status ? 'row-enabled' : 'row-disabled' }>
                                                    <td className={doc.status ? 'row-enabled' : 'row-disabled' }>{doc.titulo}</td>
                                                    <td className={doc.status ? 'row-enabled' : 'row-disabled' }>{doc.autores}</td>
                                                    <td className={doc.status ? 'row-enabled' : 'row-disabled' }>
                                                       {format(new Date(doc.fechaPublicacion), 'yyyy-MM-dd')}</td>
                                                    <td className={doc.status ? 'row-enabled' : 'row-disabled' }>{doc.nombreCategoria}</td>
                                                    <td className={doc.status ? 'row-enabled' : 'row-disabled'}>
                                                        <Tooltip title="Ver documento">
                                                        
                                                            <IconButton onClick={() => handleViewDocument(doc.id)}>
                                                                <FaFileAlt color="#28AECE" style={{ fontSize: "24px" }}/>
                                                            </IconButton>
                                                     
                                                        </Tooltip>
                                                    </td>
                                                    <td className={doc.status ? 'row-enabled' : 'row-disabled' }>
                                                    {format(new Date(doc.created_at), 'yyyy-MM-dd')}</td>
                                                    <td className={doc.status ? 'row-enabled' : 'row-disabled' }>
                                                    {format(new Date(doc.updated_at), 'yyyy-MM-dd')}</td>
                                                    <td className={doc.status ? 'row-enabled' : 'row-disabled' }>
                                                        <Tooltip title="Ver detalle de documento">
                                                            <Link to={`/documento-datos/${doc.id}`} style={{ margin: "0 6px" }}>
                                                                <IconButton>
                                                                    <MdRemoveRedEye color="#28AECE" />
                                                                </IconButton>
                                                            </Link>
                                                        </Tooltip>
                                                        <Tooltip title="Editar documento">
                                                            <Link  to={`/documentos/editar-documento/${doc.id}`}>
                                                                <IconButton>
                                                                    <FaEdit color="black" />
                                                                </IconButton>
                                                            </Link>
                                                        </Tooltip>
                                                        <Tooltip title={doc.status ? "Deshabilitar documento" : "Habilitar documento"}> 
                                                            <IconButton onClick={() => handleDisableDocumento(doc.id, doc.status )} >
                                                                {doc.status ? <FaBan color="#f58a93"/> : <FaCheck color="green"/> }
                                                            </IconButton>
                                                        </Tooltip>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                                {/* AQUI LA PAGINACION */}
                                {loading && (
                                    <div className="loading-overlay">
                                        <div className="spinner"></div>
                                    </div>

                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContentDocument;
