import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import Errors from "../Errors";


const DocumentoDetails = () => {
    
    // obtaing id for params
    const { id } = useParams();
    const [documentos, setDocumentos] = useState({});

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    // categorias de documentos
    const [categories, setCategories] = useState([]);


    const fectchDocumentosDetails = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get("/documentos");

            // primero sacamos el documento que tenga el id
            const foundDocumento = response.data.find((n) => n.id.toString() === id);

            setDocumentos(foundDocumento);

            console.log(foundDocumento);

        } catch (error) {
            setError(error.response.data.message);
            toast.error("Error fetching document details", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    const fetchCategoria = useCallback(async () => {
        setLoading(true);
        try {
          const response = await api.get("/categorias");
  
          const categoriaList = Array.isArray (response.data) ? response.data : [];
  
          setCategories(categoriaList);;
  
          // eliminar
          console.log(categoriaList);
          
        } catch (error) {
          setError(error.response.data.message);
          toast.error("Error fetching categories.");
          console.log("Error fetching categories", error);
        } finally {
          setLoading(false);
        }
      }, []);

    useEffect(() => {
        if (id) {
            fectchDocumentosDetails();
        }
    }, [id, fectchDocumentosDetails]);

    useEffect(() => {
        fetchCategoria();
    }, [fetchCategoria])
    

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
                <form encType="multipart/form-data">
                <div className="row g-4">
                    <div className="col-6">
                        <label>TITULO<span className="text-success">*</span></label>
                        <div className="input-group">
                            <div className="input-group-text">
                                <i className="bi bi-chat-right-dots"></i>
                            </div>
                            <input
                                type="text"
                                className="form-control border border-secondary"
                                id="titulo"
                                name="titulo"
                                value={documentos.titulo}
                            >
                            </input>
                        </div>
                    </div>
                    <div className="col-6">
                        <label>AUTORES<span className="text-success">*</span></label>
                        <div className="input-group">
                            <div className="input-group-text">
                                <i className="bi bi-person-lines-fill"></i>
                            </div>
                            <input
                                type="text"
                                className="form-control border border-secondary"
                                id="autores"
                                name="autores"
                                value={documentos.autores}
                            >
                            </input>
                        </div>
                    </div>
                    <div className="col-12">
                        <label>RESUMEN<span className="text-success">*</span></label>
                        <div className="input-group">
                            <div className="input-group-text">
                                <i className="bi bi-card-text"></i>
                            </div>
                            <textarea
                                type="text"
                                className="form-control border border-secondary"
                                id="resumen"
                                name="resumen"
                                value={documentos.resumen}
                            >
                            </textarea>
                        </div>
                    </div>
                    <div className="col-6">
                        <label>AÑO DE PUBLICACIÓN<span className="text-success">*</span></label>
                        <div className="input-group">
                            <div className="input-group-text">
                                <i className="bi bi-calendar2-day"></i>
                            </div>
                            <input
                                type="number"
                                className="form-control border border-secondary"
                                id="anioPublicacion"
                                name="anioPublicacion"
                                value={documentos.anioPublicacion}

                            >
                            </input>
                        </div>
                    </div>
                    <div className="col-6">
                        <label>ASESOR<span className="text-success">*</span></label>
                        <div className="input-group">
                            <div className="input-group-text">
                                <i className="bi bi-calendar2-day"></i>
                            </div>
                            <input
                                type="text"
                                className="form-control border border-secondary"
                                id="asesor"
                                name="asesor"
                                value={documentos.asesor}
                            >
                            </input>
                        </div>
                    </div>
                    <div className="col-6">
                        <label>CATEGORIA<span className="text-success">*</span></label>
                        <div className="input-group">
                            <div className="input-group-text">
                                <i className="bi bi-bookmark-star"></i>
                            </div>
                            
                            <select
                                className="form-control border border-secondary"
                                id="categoria"
                                name="categoria"
                                value={documentos.categoria ? documentos.categoria.nombre_categoria : ""}
                                aria-readonly
                            >   
                                {categories.map((category) => {
                                    return (
                                    <option key={category.categoria_id} value={category.categoria}>
                                        {category.nombre_categoria}
                                    </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="col-6">
                        <label>TEMA<span className="text-success">*</span></label>
                        <div className="input-group">
                            <div className="input-group-text">
                                <i className="bi bi-chat-square-text-fill"></i>
                            </div>
                            <input
                                type="text"
                                className="form-control border border-secondary"
                                id="tema"
                                name="tema"
                                value={documentos.tema}
                            >
                            </input>
                        </div>
                    </div>
                    <div className="col-sm-6 mb-3">
                        <label htmlFor="formFile" className="form-label">Archivo pdf:</label>
                        <input 
                        className="form-control border" type="file" id="file" accept="application/pdf"/>
                    </div>
                    <div className="col-12">
                        <button
                            disabled={loading} className="btn btn-info px-4 float-end mt-4 me-2">
                            { loading ? <span>Loading...</span> : " Updating documento" }
                        </button>
                        <Link to={'/documentos'} className="btn btn-success px-4 float-end mt-4 me-2">Cancelar</Link>
                    </div>
                </div>
                </form>
            </div>
        </div>
    )
}

export default DocumentoDetails;