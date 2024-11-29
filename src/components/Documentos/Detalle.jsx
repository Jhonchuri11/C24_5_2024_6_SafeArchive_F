import React, { useCallback, useEffect, useState } from "react";
import doctesis from '../../assets/images/doc_tesis.png';
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import Errors from "../Errors";
export default function Detalle() {

    const navigate = useNavigate();

    const [ loading, setLoading] = useState(false);

    const { documentoId} = useParams();

    const [documento, setDocumento] = useState(null);

    const [error, setError] = useState(null);

    const [imageLoaded, setImageLoaded] = useState(false);


    // utilizamos el endpont para listar un documento por su id
    const fetchDocumentosDetails = useCallback( async () => {
        setLoading(true);
        try {
            const response = await api.get(`/documentos/${documentoId}`);
            console.log(response.data);
            setDocumento(response.data);
        } catch (err) {
            console.log(err);
            setError(err?.response?.data?.message);
            toast.error("Error fetching documentos details");
        } finally {
            setLoading(false);
        }
    }, [documentoId]);

    // funcion para descargar documentor
    const handleDownloadViewDocument = async (docId) => {
        navigate(`/download-view-document/${docId}`);
    }

    const handleDowload = async () => {
        try 
        {
            const response = await api.get(`/documentos/download/pdf?id=${documentoId}`, {
                responseType: 'blob',
            });

            console.log(response.headers);
            console.log(response.data);
            console.log(response);

            // Creamos una url para el archivo
            const url = window.URL.createObjectURL( new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', documento.autores);
            document.body.appendChild(link);
            link.click();
            
            document.body.removeChild(link);
        } catch (error) {
            console.log(error?.response?.data?.message);
            //toast.error("Error downloading document");
        }
    }


    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    useEffect(() => {
        fetchDocumentosDetails();
    }, [fetchDocumentosDetails]);



    if (loading) return <p>Cargando los resultados</p>;
    if (error) return <p>Error: {error}</p>
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
                        src={documento.thumbnailUrl || doctesis} 
                        alt={`${documento.titulo}`} 
                        width={"240px"} 
                        height={"240px"}
                        onLoad={handleImageLoad}
                        style={{ display: imageLoaded ? 'block' : 'none' }}/>
                        

                        <p class="mt-4">Ver y descargar documento</p>

                        <button onClick={() => handleDownloadViewDocument(documento.id)}  className="btn btn-info documento">
                            Click aquí!</button>

                        <p class="mt-2">Autores</p>

                        <p>{documento.autores}<br/></p>
                    </div>
                    <div class="col-md-9 mt-4">
                        <h4>RESUMEN</h4>
                    <p class="resumen">{documento.resumen}</p>
                    <div className="mt-2">
                        <h4>CARRERA</h4>
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