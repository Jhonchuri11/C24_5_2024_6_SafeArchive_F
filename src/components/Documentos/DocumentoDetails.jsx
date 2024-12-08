import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import Errors from "../Errors";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { es } from 'date-fns/locale';
import "react-quill/dist/quill.snow.css";
import { FaSave } from "react-icons/fa";


const DocumentoDetails = () => {
    
    const navigate = useNavigate();

    const formatDate = (date) => {
        return format(new Date(date), 'dd MMMM yyyy', { locale: es });
    };

    const { id } = useParams();
    const [documentos, setDocumentos] = useState({});

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const fectchDocumentosDetails = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get("/documentos");

            const foundDocumento = response.data.find((n) => n.id.toString() === id);

            setDocumentos(foundDocumento);

        } catch (error) {
            setError(error.response.data.message);
            toast.error("Error fetching document details", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            fectchDocumentosDetails();
        }
    }, [id, fectchDocumentosDetails]);

    // function update
    const handleUpdateDocument = async (event) => {

        event.preventDefault();
        
        const formData = new FormData();
        formData.append('titulo', documentos.titulo);
        formData.append('autores', documentos.autores);
        formData.append('resumen', documentos.resumen);
        formData.append('fechaPublicacion', documentos.fechaPublicacion);
        formData.append('asesor', documentos.asesor);
  
        try {
          setLoading(true)
          const response = await api.put(`/documentos/updatedrive/${id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          Swal.fire({
            title: "Documento actualizado!",
            text: "El documento ha sido guardado correctamente.",
            icon: "success",
            confirmButtonText: "Aceptar"
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/documentos");
            }
          })
          navigate("/documentos");
        } catch (error) {
          setError(error.response.data.message);
          console.log(error);
          Swal.fire({
            title: "Error",
            text: "Ocurrió un error al intentar registrar el documento!",
            icon: "error",
            confirmButtonText: "Aceptar"
          });
        } finally {
          setLoading(false);
        } 

        formData.forEach((value, key) => {
          console.log(`${key}: ${value}`);
        });
        
      };
    

    // if there is an error
    if (error) {
        return <Errors message={error} />
    }

    return (
        <div className="container mt-4">
            <div className="">
                <div className="row">
                    <div className="col-12 col-md-12 col-sm-12 col-lg-12 col-xl-12">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/inicio" className="breadcrumb_inicio">Inicio</Link>
                                </li>
                                <li className="breadcrumb-item" aria-current="page">Documentos
                                </li>
                                <li className="breadcrumb-item active">
                                    Formato de edición de documento
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="card card-body bg-light p-4 shadow rounded">
                <form onSubmit={handleUpdateDocument} encType="multipart/form-data" className="formulario">
                <div className="row g-4">
                    <div className="col-6">
                        <label>Título<span className="text-success">*</span></label>
                        <div className="input-group">
                            <div className="input-group-text">
                                <i className="bi bi-chat-right-dots"></i>
                            </div>
                            <textarea
                                type="text"
                                className="form-control input_btn  border border-grey-1"
                                id="titulo"
                                name="titulo"
                                value={documentos.titulo}
                                onChange={(e) => setDocumentos({ ...documentos, titulo: e.target.value })}
                            >
                            </textarea>
                        </div>
                    </div>
                    <div className="col-6">
                        <label>Autores<span className="text-success">*</span></label>
                        <div className="input-group">
                            <div className="input-group-text">
                                <i className="bi bi-person-lines-fill"></i>
                            </div>
                            <textarea
                                type="text"
                                className="form-control border input_btn  border-grey-1"
                                id="autores"
                                name="autores"
                                value={documentos.autores}
                                onChange={(e) => setDocumentos({ ...documentos, autores: e.target.value })}
                            >
                            </textarea>
                        </div>
                    </div>
                    <div className="col-12">
                        <label>Resumen<span className="text-success">*</span></label>
                        <div className="input-group">
                            <div className="input-group-text">
                                <i className="bi bi-card-text"></i>
                            </div>
                            <textarea
                                type="text"
                                className="form-control input_btn  border border-grey-1"
                                id="resumen"
                                name="resumen"
                                value={documentos.resumen}
                                onChange={(e) => setDocumentos({ ...documentos, resumen: e.target.value })}
                                rows={5}
                            >
                            </textarea>
                        </div>
                    </div>
                    <div className="col-6">
                        <label>Fecha de publicación<span className="text-success">*</span></label>
                        <div className="input-group">
                            <div className="input-group-text">
                                <i className="bi bi-calendar2-day"></i>
                            </div>
                            <input
                                readOnly
                                type="text"
                                className="form-control input_btn  border border-grey-1"
                                id="fechaPublicacion"
                                name="fechaPublicacion"
                                value={documentos.fechaPublicacion ? formatDate(documentos.fechaPublicacion) : ""}
                                onChange={(e) => setDocumentos({ ...documentos, fechaPublicacion: e.target.value })}
                            >
                            </input>
                        </div>
                    </div>
                    <div className="col-6">
                        <label>Asesor<span className="text-success">*</span></label>
                        <div className="input-group">
                            <div className="input-group-text">
                                <i className="bi bi-calendar2-day"></i>
                            </div>
                            <input
                                type="text"
                                className="form-control input_btn  border border-grey-1"
                                id="asesor"
                                name="asesor"
                                value={documentos.asesor}
                            >
                            </input>
                        </div>
                    </div>
                    <div className="col-6">
                        <label>Categoria<span className="text-success">*</span></label>
                        <div className="input-group">
                            <div className="input-group-text">
                                <i className="bi bi-bookmark-star"></i>
                            </div>
                            
                            <input
                            readOnly
                                className="form-control input_btn  border border-grey-1"
                                id="categoria"
                                name="categoria"
                                value={documentos.nombreCategoria}
                            >   
                            </input>
                        </div>
                    </div>
                    <div className="col-6">
                        <label>Carrera<span className="text-success">*</span></label>
                        <div className="input-group">
                            <div className="input-group-text">
                                <i className="bi bi-chat-square-text-fill"></i>
                            </div>
                            <input
                                readOnly
                                className="form-control input_btn  border border-grey-1"
                                id="categoria"
                                name="categoria"
                                value={documentos.nombreCarrera}
                            >   
                            </input>
                     
                        </div>
                    </div>
                    <div className="col-6">
                        <label>Ciclo<span className="text-success">*</span></label>
                        <div className="input-group">
                            <div className="input-group-text">
                                <i className="bi bi-chat-square-text-fill"></i>
                            </div>
                            <input
                                readOnly
                                type="text"
                                className="form-control input_btn  border border-grey-1"
                                id="ciclo"
                                name="ciclo"
                                value={documentos.ciclo}
                            >
                            </input>
                        </div>
                    </div>
                    <div className="col-6">
                        <label>Sección<span className="text-success">*</span></label>
                        <div className="input-group">
                            <div className="input-group-text">
                                <i className="bi bi-chat-square-text-fill"></i>
                            </div>
                            <input
                                readOnly
                                type="text"
                                className="form-control input_btn  border border-grey-1"
                                id="seccion"
                                name="seccion"
                                value={documentos.seccion || 'Ninguna sección'}
                            >
                            </input>
                        </div>
                    </div>
                    <div className="col-6">
                        <label>Semestre<span className="text-success">*</span></label>
                        <div className="input-group">
                            <div className="input-group-text">
                                <i className="bi bi-chat-square-text-fill"></i>
                            </div>
                            <input
                                readOnly
                                className="form-control input_btn  border border-grey-1"
                                id="categoria"
                                name="categoria"
                                value={documentos.nombreSemestre}
                            >   
                            </input>
                        </div>
                    </div>
                    
                    <div className="col-12">
                        <button
                            disabled={loading} 
                            className="btn btn-info px-4 button_page_filter_register float-end mt-4 me-2"
                        >
                            <FaSave/>
                            { loading ? <span>Actualizando...</span> : " Guardar documento" }
                        </button>
                        <Link to={'/documentos'} 
                        className="btn btn-success button_page_filter_register px-4 float-end mt-4 me-2">
                            Cancelar
                        </Link>
                    </div>
                </div>
                </form>
            </div>
            <div className="mt-3"/>
        </div>
    )
}

export default DocumentoDetails;