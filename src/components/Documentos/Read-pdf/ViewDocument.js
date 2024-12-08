import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import '../../../style/AllPages.css';
import { Worker } from '@react-pdf-viewer/core';

import { Viewer } from '@react-pdf-viewer/core';

// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';

const ViewDocument = () => {

    const {docId} = useParams();
    const [pdfUrl, setPdfUrl] = useState()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);


    useEffect(() => {

        let url ;

        const fetchPdf = async () => {

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
                
                console.log(url);
    
            } catch (error) {
                console.error("Error al obtener la URL de previsualización", error);
            } finally {
                setLoading(false);
            }
        }
        fetchPdf();

        return() => {
            if (url) {
                window.URL.revokeObjectURL(url);
            }
        }
        
    }, [docId]);

    if (!pdfUrl) return <div className="loading-overlay">
                            <div className="spinner"></div>
                        </div>

    return (
        <div className="container mt-2">
            <div className="all-page-container">
                <Worker workerUrl='https://unpkg.com/pdfjs-dist@3.4.120/legacy/build/pdf.worker.js'>
                    <Viewer  fileUrl={pdfUrl} />;
                </Worker>
            </div>
            <div className="mt-3">

            </div>
        </div>
    )
}

export default ViewDocument;