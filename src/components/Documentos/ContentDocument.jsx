import React, { useCallback, useEffect, useState } from "react";
import '../../style/ContentDocument.css';
import { Link } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import Errors from "../Errors";
import { IconButton, Tooltip } from "@mui/material";
import { MdRemoveRedEye } from "react-icons/md";
import { FaBan, FaCheck, FaChevronCircleLeft, FaChevronCircleRight,FaEdit, FaFileAlt, FaFileArchive, FaFileUpload, FaTrash } from "react-icons/fa";
import DocumentPreviewModal from "../Asesor/DocumentPreviewModal;";
import Swal from "sweetalert2";

const ContentDocument = () => {
    const [documentos, setDocumentos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [previewUrl, setPreviewUrl] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    // paginacion para tabla
    const [currentPage, setCurrentPage] = useState(1);
    const documentsPerPage = 5;

    const fectchDocumentos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get("/documentos");
            const documentData = Array.isArray(response.data) ? response.data : [];
            setDocumentos(documentData);
            console.log(response);
            
        } catch (error) {
            setError(error.response.data.message);
            toast.error("Error fetching document for user");
            console.error("Error fetching doc", error); 
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fectchDocumentos();
    }, [fectchDocumentos]);

    const handleViewDocument = async (docId) => {
        setLoading(true);

        try {
            const response = await api.get(`/documentos/${docId}/preview`);
            
            setPreviewUrl(response.data);
            setOpenModal(true);
            
            console.log(response.data);

        } catch (error) {
            console.error("Error al obtener la URL de previsualización", error);
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteDocumento = async (docId) => {
        Swal.fire({
            title: "Estás seguro?",
            text: "Este documento se eliminará de forma permanente.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "No, cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/documentos/deletedoc/${docId}`);
                    setDocumentos(documentos.filter((doc) => doc.id !== docId));
                    toast.success("Documento eliminado exitosamente!");
                } catch (error) {
                    console.error("Ocurrió un error eliminado el documento", error);
                    toast.error("No se puede eliminar el documento.");
                }
            }
        });
    };

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
                    console.error("Ocurrió un error al deshabilitar el documento", error);
                    
                    toast.error("No se puede deshabilitar el documento.");
                }
            }
        });
    };

    // Paginación
    const indexOfLastDocument = currentPage * documentsPerPage;
    const indexOfFirstDocument = indexOfLastDocument - documentsPerPage;
    const currentDocuments = documentos.slice(indexOfFirstDocument, indexOfLastDocument);

    const totalPages = Math.ceil(documentos.length / documentsPerPage);

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

    // funcion para el modal
    const handleCloseModal = () => {
        setOpenModal(false);
        setPreviewUrl(null);
    }


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
            <div className="content_documento container ">
                <div className="row mb-3">
                    <div className="col-12">
                        <div className="box_block">
                            <div className="card-header box_header_1 py-2">
                                
                                <span>FORMATO REGISTRO DE DOCUMENTO</span>
                            </div>
                            <div className="card card-body rounded-0 border-0 div-etapa" id="div-beneficio" data-nivel="0">
                                <div className="row d-flex flex-row justify-content-center align-items-center">
                                    <div className="card mx-3 mb-2 mb-sm-0 card-beneficio s_card_button" id="btn_iniciarRenuncia">
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
                            
                            <div className="card card-body rounded-0 border-0 ">
                                
                                <div className="table-responsive d-flex flex-column align-items-center mt-4">
                                    
                                    
                                    <table className="table table_document table-hover table-bordered">
                                        <thead>
                                            <tr className="rounded-top">
                                                <th className="tableheadercolor text-center py-1" style={{ width: "80px" }}><b>Título</b></th>
                                                <th className="tableheadercolor text-center py-1" style={{ width: "80px" }}><b>Autores</b></th>
                                                <th className="tableheadercolor text-center py-1" style={{ width: "10%" }}><b>Fecha de publicación</b></th>
                                                <th className="tableheadercolor text-center py-1" style={{ width: "80px" }}><b>Categoria</b></th>
                                                <th className="tableheadercolor text-center py-1" style={{ width: "1%" }}><b>Documento</b></th>
                                                <th className="tableheadercolor text-center py-1" style={{ width: "10%" }}><b>Fecha creado</b></th>
                                                <th className="tableheadercolor text-center py-1" style={{ width: "10%" }}><b>Fecha modificado</b></th>
                                                <th className="tableheadercolor text-center py-1" style={{ width: "100px" }}><b>Acciones</b></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentDocuments.map((doc) => (
                                                <tr 
                                                key={doc.id}
                                                className={doc.status ? 'row-enabled' : 'row-disabled' }>
                                                    <td className={doc.status ? 'row-enabled' : 'row-disabled' }>{doc.titulo}</td>
                                                    <td className={doc.status ? 'row-enabled' : 'row-disabled' }>{doc.autores}</td>
                                                    <td className={doc.status ? 'row-enabled' : 'row-disabled' }>{doc.fechaPublicacion}</td>
                                                    <td className={doc.status ? 'row-enabled' : 'row-disabled' }>{doc.nombreCategoria}</td>
                                                    <td className={doc.status ? 'row-enabled' : 'row-disabled'}>
                                                        <Tooltip title="Ver documento">
                                                        
                                                            <IconButton onClick={() => handleViewDocument(doc.id)}>
                                                                <FaFileAlt style={{ fontSize: "24px" }}/>
                                                            </IconButton>
                                                     
                                                        </Tooltip>
                                                    </td>
                                                    <td className={doc.status ? 'row-enabled' : 'row-disabled' }>{doc.created_at}</td>
                                                    <td className={doc.status ? 'row-enabled' : 'row-disabled' }>{doc.updated_at}</td>
                                                    <td className={doc.status ? 'row-enabled' : 'row-disabled' }>
                                                        <Tooltip title="Ver detalle de documento">
                                                            <Link to={`/documento-datos/${doc.id}`} style={{ margin: "0 6px" }}>
                                                                <IconButton>
                                                                    <MdRemoveRedEye color="#28AECE" />
                                                                </IconButton>
                                                            </Link>
                                                        </Tooltip>
                                                        <Tooltip title="Editar documento">
                                                            <Link to={`/documentos/editar-documento/${doc.id}`}>
                                                                <IconButton>
                                                                    <FaEdit color="black" />
                                                                </IconButton>
                                                            </Link>
                                                        </Tooltip>
                                                        <Tooltip title={doc.status ? "Deshabilitar documento" : "Habilitar documento"}> 
                                                            <IconButton onClick={() => handleDisableDocumento(doc.id, doc.status )} >
                                                                {doc.status ? <FaBan color="#28AECE"/> : <FaCheck color="green"/> }
                                                            </IconButton>
                                                        </Tooltip>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                <div aria-label="Page navigation">
                                    
                                    <span className="mt-2">Página {currentPage} de {totalPages}</span>
                                    
                                    <button className="rounded" onClick={handlePrevPage} disabled={currentPage === 1}>
                                        <FaChevronCircleLeft/>
                                    </button>
                                    <button className="rounded" onClick={handleNextPage} disabled={currentPage === totalPages}>
                                        <FaChevronCircleRight/>
                                     </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Modal para mostrar la previsualización del PDF */}
            <DocumentPreviewModal
            open={openModal}
            onclose={handleCloseModal}
            previewUrl={previewUrl}/>

        </div>
    );
}

export default ContentDocument;
