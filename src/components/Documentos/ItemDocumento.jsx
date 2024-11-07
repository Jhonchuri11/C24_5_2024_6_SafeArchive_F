import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";

const ItemDocumento = () => {

    // obtaing id for params
    const { id } = useParams();

    const [documentos, setDocumentos] = useState({});

    // Estados para los datos del formulario

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
                                    Documento detalle
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-header bg-info text-white">
                    <h5 className="mb-0">Detalle de registro documento</h5>
                </div>
                <div className="card-body">

                    <h6 className="mb-3 text-info">Detalle del asesor</h6>
                    <hr/>
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <strong>CORREO</strong>
                            <p></p>
                        </div>
                        <div className="col-md-6">
                            <strong>NOMBRES Y APELLIDOS</strong>
                            <p>{documentos.asesor}</p>
                        </div>
                    </div>

                    <hr/>
                    <h6 className="mb-3 text-info">Detalle del documento</h6>
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <strong>TITULO</strong>
                            <p>{documentos.titulo}</p>
                        </div>
                        <div className="col-md-6">
                            <strong>AUTORES</strong>
                            <p>{documentos.autores}</p>
                        </div>
                        <div className="col-md-6">
                            <strong>TEMA</strong>
                            <p>{documentos.tema}</p>
                        </div>
                        <div className="col-md-6">
                            <strong>FECHA DE PUBLICACIÓN</strong>
                            <p>{documentos.fechaPublicacion}</p>
                        </div>

                    </div>

                    <hr/>
                    <h6 className="mb-3 text-info">Detalle de carrera y sección</h6>
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <strong>CARRERA</strong>
                            <p>{documentos.carrera}</p>
                        </div>
                        <div className="col-md-6">
                            <strong>CICLO</strong>
                            <p>{documentos.ciclo}</p>
                        </div>
                        <div className="col-md-6">
                            <strong>SECCIÓN</strong>
                            <p>{documentos.seccion}</p>
                        </div>
                        <div className="col-md-6">
                            <strong>SEMESTRE</strong>
                            <p>{documentos.semestre}</p>
                        </div>
                    </div>
                    <div className="col-12">
                        <Link to={'/documentos'} 
                        className="btn btn-warning px-4 float-end mt-4 me-2">
                            Cerrar
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ItemDocumento;