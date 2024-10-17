import React, { useState } from 'react';
import axios from 'axios';
import '../../style/FormularioReporte.css';

const FormularioReporte = () => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [prioridad, setPrioridad] = useState('baja');
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('JWT_TOKEN');

    if (!token) {
      setMensaje('No estás autenticado');
      return;
    }

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('prioridad', prioridad);
    if (archivo) {
      formData.append('archivo', archivo);
    }

    try {
      const response = await axios.post('http://localhost:8081/api/reportes/crear', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setMensaje('Reporte enviado con éxito');
    } catch (error) {
      setMensaje('Error al enviar el reporte');
      console.error('Error:', error.response?.data);
    }
  };

  return (
    <div className="formulario-reporte-container">
      <h2>Crear Reporte</h2>
      <form onSubmit={handleSubmit} className="formulario-reporte">
        <div className="form-group-reporte">
          <label htmlFor="titulo">Título del Reporte:</label>
          <input
            id="titulo"
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className="form-input-reporte"
          />
        </div>
        <div className="form-group-reporte">
          <label htmlFor="descripcion">Descripción:</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            className="form-textarea-reporte"
          />
        </div>
        <div className="form-group-reporte">
          <label htmlFor="prioridad">Prioridad:</label>
          <select
            id="prioridad"
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
            className="form-select-reporte"
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>
        <div className="form-group-reporte">
          <label htmlFor="archivo">Adjuntar Archivo (opcional):</label>
          <input
            id="archivo"
            type="file"
            onChange={(e) => setArchivo(e.target.files[0])}
            className="form-file-reporte"
          />
        </div>
        <button type="submit" className="form-button-reporte">Enviar Reporte</button>
      </form>
      {mensaje && <p className="form-message-reporte">{mensaje}</p>}
    </div>
  );
};

export default FormularioReporte;
