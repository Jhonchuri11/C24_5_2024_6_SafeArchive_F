import React, { useState } from 'react';
import api from "../../services/api";

const DocumentoUploadForm = () => {
  // Estados para los datos del formulario
  const [titulo, setTitulo] = useState('');
  const [autores, setAutores] = useState('');
  const [resumen, setResumen] = useState('');
  const [anioPublicacion, setAnioPublicacion] = useState('');
  const [asesor, setAsesor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tema, setTema] = useState('');
  const [file, setFile] = useState(null); // Estado para el archivo PDF

  // Manejar el archivo PDF
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Crear un objeto FormData para enviar los datos
    const formData = new FormData();
    formData.append('file', file); 
    formData.append('titulo', titulo);
    formData.append('autores', autores);
    formData.append('resumen', resumen);
    formData.append('anioPublicacion', anioPublicacion);
    formData.append('asesor', asesor);
    formData.append('categoria', categoria);
    formData.append('tema', tema);

    try {
      // Enviar la solicitud al backend
      const response = await api.post('/documentos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Documento subido con éxito:', response.data);
    } catch (error) {
      console.error('Error al subir el documento:', error);
    }
  };

  return (
    <div>
      <h2>Subir Documento</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Título:</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Autores:</label>
          <input
            type="text"
            value={autores}
            onChange={(e) => setAutores(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Resumen:</label>
          <textarea
            value={resumen}
            onChange={(e) => setResumen(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Año de Publicación:</label>
          <input
            type="number"
            value={anioPublicacion}
            onChange={(e) => setAnioPublicacion(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Asesor:</label>
          <input
            type="text"
            value={asesor}
            onChange={(e) => setAsesor(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Categoría:</label>
          <input
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Tema:</label>
          <input
            type="text"
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label>Archivo PDF:</label>
          <input type="file" onChange={handleFileChange} accept="application/pdf" required />
        </div>
        <button type="submit">Subir Documento</button>
      </form>
    </div>
  );
};

export default DocumentoUploadForm;
