import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import React from "react"

const DocumentPreviewModal = ({ open, onclose, previewUrl}) => {

    return (
        <Modal
        open={open}
        onClose={onclose}
        aria-labelledby="preview-document"
        aria-describedby="preview-document-description"
        >
            <Box sx={{ width: "80%", height: "80%", margin: "auto", backgroundColor: "white", padding: 2 }}>

                {previewUrl ? (
                    <iframe
                    
                    src={previewUrl}
                    title="Document preview"
                    width="100%"
                    height="100%"/>
                ) : (
                    <p>Cargando previsualización</p>
                )}
            </Box>
        </Modal>
    )
}

export default DocumentPreviewModal;