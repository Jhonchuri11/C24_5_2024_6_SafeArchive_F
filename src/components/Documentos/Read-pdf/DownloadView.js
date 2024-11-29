import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import '../../../style/AllPages.css';
// worker
import { Worker } from '@react-pdf-viewer/core';
// import the main component
import { Viewer } from '@react-pdf-viewer/core';
// Import the viewer styles
import '@react-pdf-viewer/core/lib/styles/index.css';

// default layout plugin styles
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import { getFilePlugin } from '@react-pdf-viewer/get-file';

const DownloadView = () => {

    // create plugin instance
    //const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const getFilePluginInstance = getFilePlugin();
    const { DownloadButton } = getFilePluginInstance;

    const {docId} = useParams();
    const [pdfUrl, setPdfUrl] = useState()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);


    useEffect(() => {
        
        let url ;

        const fetchPdfs = async () => {

            setLoading(true);
    
            try {
                const response = await api.get(`/documentos/download/pdf?id=${docId}`, {
                    responseType: 'blob',
                });
                
                const blob = new Blob([response.data], 
                    { type: 'application/pdf' }
                );
    
                url = URL.createObjectURL(blob);
    
                setPdfUrl(url);
    
            } catch (error) {
                console.error("Error al obtener la URL de previsualización", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPdfs();
        
        return() => {
            if (url) {
                window.URL.revokeObjectURL(url);
            }
        }
        
    }, [docId]);

    if (loading) return <div>Cargando...</div>
    if (error) return <div>Hubo un error al cargar el documento.</div>

    return (
        <div className="container mt-2">
            <div className="pdf-container">
                <div className="pdf-header">
                    <DownloadButton/>
                </div>
                <div className="pdf-viewer">
                    <Worker workerUrl='https://unpkg.com/pdfjs-dist@3.4.120/legacy/build/pdf.worker.js'>
                        <Viewer 
                        fileUrl={pdfUrl}
                        plugins={[getFilePluginInstance]}
                        />; 
                    </Worker> 
                    </div>   
                </div>
        </div>
    )
}

export default DownloadView;