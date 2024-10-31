import React, { useCallback, useEffect, useState } from "react";
import '../../style/ContentDocument.css';
import { Link } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import Errors from "../Errors";
import { IconButton, Tooltip } from "@mui/material";
import { MdRemoveRedEye } from "react-icons/md";
import { FaBan, FaEdit, FaFileAlt, FaTrash } from "react-icons/fa";
import { FiDelete } from "react-icons/fi";
import DocumentPreviewModal from "../Asesor/DocumentPreviewModal;";

const ContentDocument = () => {
    const [documentos, setDocumentos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [previewUrl, setPreviewUrl] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const fectchDocumentos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get("/documentos");
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
                                        <Link to="/createDocumento">
                                            <div className="card-body p-3 mx-auto text-center" style={{ width: "160px" }}>
                                                <p className="card-title mb-1">Registro de información de documento</p>
                                                <Link to="/createDocumento"><i className="bi bi-file-earmark"></i></Link>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="box_block mt-3">
                            <div className="card-header box_header_1 py-2">
                                <span>LISTA DE DOCUMENTO</span>
                            </div>
                            <div className="card card-body rounded-0 border-0 ">
                                <div className="table-responsive d-flex flex-column align-items-center mt-4">
                                    <table className="table table-hover table-bordered">
                                        <thead>
                                            <tr className="rounded-top">
                                                <th className="tableheadercolor text-center py-1" style={{ width: "80px" }}><b>Título</b></th>
                                                <th className="tableheadercolor text-center py-1" style={{ width: "80px" }}><b>Autores</b></th>
                                                <th className="tableheadercolor text-center py-1" style={{ width: "80px" }}><b>Año publicado</b></th>
                                                <th className="tableheadercolor text-center py-1" style={{ width: "80px" }}><b>Tipo de documento</b></th>
                                                <th className="tableheadercolor text-center py-1" style={{ width: "80px" }}><b>Tema</b></th>
                                                <th className="tableheadercolor text-center py-1" style={{ width: "80px" }}><b>Documento</b></th>
                                                <th className="tableheadercolor text-center py-1" style={{ width: "80px" }}><b>Acción</b></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {documentos.map((doc, id) => (
                                                <tr key={id}>
                                                    <td>{doc.titulo}</td>
                                                    <td>{doc.autores}</td>
                                                    <td>{doc.anioPublicacion}</td>
                                                    <td>{doc.categoria ? doc.categoria.nombre_categoria : "N/A"}</td>
                                                    <td>{doc.tema}</td>
                                                    <td className="text-center py-2">

                                                        <Tooltip title="View document">
                                                        
                                                            <IconButton onClick={() => handleViewDocument(doc.id)}>
                                                                <FaFileAlt style={{ fontSize: "24px" }}/>
                                                            </IconButton>
                                                     
                                                        </Tooltip>

                                                    </td>
                                                    <td className="text-center">
                                                        <Link to={`/documentos/${doc.id}`} style={{ margin: "0 10px" }}>
                                                            <IconButton>
                                                              <FaTrash style={{ fontSize: "24px" }}/>
                                                            </IconButton>
                                                        </Link>
                                                        <Tooltip title="Editar documento">
                                                            <Link to={`/documentos/editar-documento/${doc.id}`}>
                                                                <IconButton>
                                                                    <FaEdit />
                                                                </IconButton>
                                                            </Link>
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

            {/* Modal para mostrar la previsualización del PDF */}
            <DocumentPreviewModal
            open={openModal}
            onclose={handleCloseModal}
            previewUrl={previewUrl}/>

        </div>
    );
}

export default ContentDocument;
