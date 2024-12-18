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

    if (error) return <div>Hubo un error al cargar el documento.</div>
    if (!pdfUrl) return <div className="loading-overlay">
                            <div className="spinner"></div>
                            <p>Cargando documento...</p>
                        </div>

    return (

                <div className="pdf-container" style={{ width: '100%', height: '100vh', position: 'relative' }}>
                <iframe
                        src={pdfUrl}
                        title="Documento"
                        width="100%"
                        height="100%"
                        style={{
                            border: 'none',
                            position: 'absolute',
                            top: 0,
                            left: 0
                        }}
                    ></iframe>
                </div>   
    )
}

export default DownloadView;