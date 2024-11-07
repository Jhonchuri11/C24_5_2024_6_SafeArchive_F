import React, { useCallback, useEffect, useState } from "react";
import '../../style/ContentDocument.css';
import { Link } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import Errors from "../Errors";
import { IconButton, Tooltip } from "@mui/material";
import { MdRemoveRedEye } from "react-icons/md";
import { FaBan, FaCheckCircle, FaChevronCircleLeft, FaChevronCircleRight, FaEdit, FaFileAlt, FaTrash } from "react-icons/fa";
import { FiDelete } from "react-icons/fi";
import DocumentPreviewModal from "../Asesor/DocumentPreviewModal;";
import Swal from "sweetalert2";

const ListDisableDocument = () => {

    const [documentos, setDocumentos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [previewUrl, setPreviewUrl] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    // paginacion para tabla
    const [currentPage, setCurrentPage] = useState(1);
    const documentsPerPage = 2;


    const fectchDocumentos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get("/documentos", { params: { status: false } });
            const documentData = Array.isArray(response.data) ? response.data : [];
            setDocumentos(documentData);
            console.log(documentData);
            
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

    const handleDisableDocumento = async (docId) => {
        Swal.fire({
            title: "Estás seguro?",
            text: "Este documento se habilitará.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, habilitar",
            cancelButtonText: "No, cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.put(`/documentos/${docId}/habilitar`);
                    setDocumentos(documentos.filter((doc) => doc.id !== docId));
                    toast.success("El documento ha sido habilitado correctamente.");
                } catch (error) {
                    console.error("Ocurrió un error al habilitar el documento", error);
                    toast.error("No se puede habilitar el documento.");
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
                                <li className="breadcrumb-item active" aria-current="page"> Documentos deshabilitados</li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <hr/>
            </div>
            <div className="content_documento container ">
                <div className="row mb-3">
                    <div className="col-12">
                        <div className="box_block mt-3">
                            <div className="card-header box_header_1 py-2">
                                <span>LISTADO DE DOCUMENTO</span>
                            </div>
                            <div className="card card-body rounded-0 border-0 ">
                                
                                <div className="table-responsive d-flex flex-column align-items-center mt-4">
                                    
                                    
                                    <table className="table table-hover table-bordered">
                                        <thead>
                                            <tr className="rounded-top">
                                                <th className="tableheadercolor text-center py-1" style={{ width: "80px" }}><b>Asesor</b></th>
                                                <th className="tableheadercolor text-center py-1" style={{ width: "80px" }}><b>Título</b></th>
                                                <th className="tableheadercolor text-center py-1" style={{ width: "80px" }}><b>Autores</b></th>
                                                <th className="tableheadercolor text-center py-1" style={{ width: "80px" }}><b>Fecha de publicación</b></th>
                                                <th className="tableheadercolor text-center py-1" style={{ width: "80px" }}><b>Tipo de documento</b></th>
                                                <th className="tableheadercolor text-center py-1" style={{ width: "80px" }}><b>Tema</b></th>
                                                <th className="tableheadercolor text-center py-1" style={{ width: "80px" }}><b>Documento</b></th>
                                                <th className="tableheadercolor text-center py-1" style={{ width: "80px" }}><b>Fecha creado</b></th>
                                                <th className="tableheadercolor text-center py-1" style={{ width: "80px" }}><b>Fecha modificado</b></th>
                                                <th className="tableheadercolor text-center py-1" style={{ width: "80px" }}><b>Acciones</b></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentDocuments.map((doc, id) => (
                                                <tr key={id}>
                                                    <td>{doc.asesor}</td>
                                                    <td>{doc.titulo}</td>
                                                    <td>{doc.autores}</td>
                                                    <td>{doc.anioPublicacion}</td>
                                                    <td>{doc.categoria ? doc.categoria.nombre_categoria : "N/A"}</td>
                                                    <td>{doc.tema}</td>
                                                    <td className="text-center py-2">

                                                        <Tooltip title="Ver documento">
                                                        
                                                            <IconButton onClick={() => handleViewDocument(doc.id)}>
                                                                <FaFileAlt style={{ fontSize: "24px" }}/>
                                                            </IconButton>
                                                     
                                                        </Tooltip>

                                                    </td>
                                                    <td>{doc.created_at}</td>
                                                    <td>{doc.updated_at}</td>
                                                    <td className="text-center">
                                                        <Tooltip title="Ver detalle de documento">
                                                            <Link to={`/documento-datos/${doc.id}`} style={{ margin: "0 10px" }}>
                                                                <IconButton>
                                                                    <MdRemoveRedEye color="#28AECE"  style={{ fontSize: "24px" }}/>
                                                                </IconButton>
                                                            </Link>
                                                        </Tooltip>
                                                        <Tooltip title="Habilitar documento"> 
                                                            <IconButton>
                                                                <FaCheckCircle color="#28AECE" onClick={() => handleDisableDocumento(doc.id)}/>
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

export default ListDisableDocument;
