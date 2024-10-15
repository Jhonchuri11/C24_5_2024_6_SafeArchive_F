import React, { useCallback, useEffect, useState } from "react";
import doctesis from '../../assets/images/doc_tesis.png';
import { useParams } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
export default function Detalle() {

    const [ loading, setLoading] = useState(false);

    const { documentoId} = useParams();

    const [documento, setDocumento] = useState(null);

    const [error, setError] = useState(null);


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
    const handleDowload = async () => {
        try 
        {
            const response = await api.get(`/documentos/download?id=${documentoId}`, {
                responseType: 'blob',
            });

            // Creamos una url para el archivo
            const url = window.URL.createObjectURL( new Blob([response.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', documento.titulo);
            document.body.appendChild(link);
            link.click();
            
            document.body.removeChild(link);
        } catch (err) {
            console.log(err?.response?.data?.message);
            toast.error("Error downloading document");
        }
    }


    useEffect(() => {
        fetchDocumentosDetails();
    }, [fetchDocumentosDetails]);



    if (loading) return <p>Cargando los resultados</p>;
    if (error) return <p>Error: {error}</p>
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
                        <img className="imgdocumento" src={doctesis} width={"240px"} height={"240px"}/>
                        <p class="mt-4">Ver y descargar documento</p>

                        <button onClick={handleDowload}  class="documento">Texto completo (3.44MB)</button>

                        <p class="mt-2">Autores</p>

                        <p>{documento.autores}<br/>{documento.autores}</p>
                    </div>
                    <div class="col-md-9 mt-4">
                        <h4>RESUMEN</h4>
                    <p class="resumen">{documento.resumen}</p>
                    <div className="mt-2">
                        <h4>Temas</h4>
                        <p>
                            {documento.tema}
                            <br/>
                            Música en el arte-Perú-Lima
                            <br/>
                            Actuación-Rítmo
                            <br/>
                            Jazz
                        </p>
                    </div>
                    </div>
                </div>
                <hr/>
            </div>
        </section>
    )
}