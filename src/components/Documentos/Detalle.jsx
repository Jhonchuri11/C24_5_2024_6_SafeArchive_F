import React, { useCallback, useEffect, useState } from "react";
import doctesis from '../../assets/images/doc_tesis.png';
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import Skeleton from "react-loading-skeleton";
import Errors from "../Errors";
import { FaFile } from "react-icons/fa";
import { format } from "date-fns";
export default function Detalle() {

    const navigate = useNavigate();

    const [ loading, setLoading] = useState(false);

    const { documentoId} = useParams();

    const [documento, setDocumento] = useState(null);

    const [error, setError] = useState(null);

    const [imageLoaded, setImageLoaded] = useState(false);

    const fetchDocumentosDetails = useCallback( async () => {
        setLoading(true);
        try {
            const response = await api.get(`/documentos/${documentoId}`);
            setDocumento(response.data);
            console.log(response);
        } catch (err) {
            setError(err?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    }, [documentoId]);

    const handleDownloadViewDocument = async (docId) => {
        navigate(`/download-view-document/${docId}`);
    }

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    useEffect(() => {
        fetchDocumentosDetails();
    }, [fetchDocumentosDetails]);

    if (loading) return <p>Cargando los resultados</p>;
     if (error) {
        return <Errors message={error} />
    }
    if (!documento) return null;

    return (
        <section>
            <div className="container mt-4">
                <h3>{documento.titulo}</h3>
                <hr/>
            </div>
            <div className="container mt-3">
                <div className="row">
                    <div className="col-md-3 mt-4">

                        {!imageLoaded && <Skeleton width={240} height={340} />}
                        <img 
                        className="imgdocumento" 
                        src={documento.thumbnail_link || doctesis} 
                        alt={`${documento.titulo}`} 
                        width={"240px"} 
                        height={"240px"}
                        onLoad={handleImageLoad}
                        style={{ display: imageLoaded ? 'block' : 'none' }}/>
                        <div className="mt-4">
                            Ver documento
                            <br/>
                            <FaFile className="me-2"/>
                            <a type="button" onClick={() => handleDownloadViewDocument(documento.id)}  className="text-decoration-none">
                            Documento completo aquí!</a>
                        </div>
                        <div className="mt-4">
                            Autores
                            <p>{documento.autores}</p>
                        </div>
                        <div>
                            Fecha de publicación
                            <p>{format(new Date(documento.fecha_publicacion), 'yyyy-MM-dd')}</p>
                        </div>
                    </div>
                    <div class="col-md-9 mt-4">
                    <p class="resumen">{documento.resumen}</p>
                    <div className="mt-2">
                        <h4>Carrera</h4>
                        <p>
                            {documento.nombreCarrera}
                            <br/>
                        </p>
                    </div>
                    </div>
                </div>
                <hr/>
            </div>
        </section>
    )
}