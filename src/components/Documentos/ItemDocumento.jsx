import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import Errors from "../Errors";
import { format, formatDate } from "date-fns";
import { es } from "date-fns/locale";

const ItemDocumento = () => {

    // obtaing id for params
    const { id } = useParams();

    const formatDate = (date) => {
        return format(new Date(date), 'dd MMMM yyyy', { locale: es });
    };

    const [documentos, setDocumentos] = useState({});

    // Estados para los datos del formulario
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

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

    useEffect(() => {
        if (id) {
            fectchDocumentosDetails();
        }
    }, [id, fectchDocumentosDetails]);

     // to show and erros
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
                                    Documento detalle
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card-header box_header_1 py-2">
                    <span className="mb-0">DETALLE DE REGISTRO DE DOCUMENTO</span>
                </div>
                <div className="card-body ">
                    <strong className="mb-0 text-item-title">Detalle del asesor</strong>
                    <hr className="line_item"/>
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <p>Correo electrónico</p>
                            <strong>{documentos.nombreUsuario}</strong>
                        </div>
                        <div className="col-md-6">
                            <p>Nombres y Apellidos</p>
                            <strong>{documentos.asesor}</strong>
                         
                        </div>
                    </div>

                    <strong className="mb-3 text-item-title">Detalle del documento</strong>
                    <hr className="line_item"/>
                    <div className="row mb-4">
                         <div className="col-md-6">
                            <p>Categoria</p>
                            <strong>{documentos.nombreCategoria}</strong>
                        </div>
                        <div className="col-md-6">
                            <p>Título</p>
                            <strong>{documentos.titulo}</strong>
                            
                        </div>
                        <div className="col-md-6">
                            <p className="mt-2">Autores</p>
                            <strong>{documentos.autores}</strong>
                        </div>
                        <div className="col-md-6">
                            <p className="mt-2">Fecha de publicación</p>
                            <strong>{documentos.fechaPublicacion ? formatDate(documentos.fechaPublicacion) : ""}</strong>
                        </div>

                    </div>

                    <hr className="line_item"/>
                    <strong className="mb-3 text-item-title">Detalle de carrera y sección</strong>
                    <div className="row mb-4">
                        <div className="col-md-6">
                            <p>Carrera</p>
                            <strong>{documentos.nombreCarrera}</strong>
                        </div>
                        <div className="col-md-6">
                            <p>Ciclo</p>
                            <strong>{documentos.ciclo}</strong>
                        </div>
                        <div className="col-md-6">
                            <p className="mt-2">Sección</p>
                            <strong>{documentos.seccion}</strong>
                        </div>
                        <div className="col-md-6">
                            <p className="mt-2">Semestre</p>
                            <strong>{documentos.nombreSemestre}</strong>
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
            <div className="mt-3"/>
        </div>
        
    )
}

export default ItemDocumento;