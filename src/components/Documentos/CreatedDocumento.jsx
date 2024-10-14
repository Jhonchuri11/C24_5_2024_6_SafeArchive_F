import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../style/CreatedDocumento.css";
import {toast, Toaster} from "react-hot-toast";
import api from "../../services/api";


export default function CreatedDocumento() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    // Estados para los datos del formulario
    const [titulo, setTitulo] = useState('');
    const [autores, setAutores] = useState('');
    const [resumen, setResumen] = useState('');
    const [anioPublicacion, setAnioPublicacion] = useState('');
    const [asesor, setAsesor] = useState('');
    const [categoria, setCategoria] = useState('');
    const [tema, setTema] = useState('');
    const [file, setFile] = useState(null);

    // Manejar el archivo PDF
    const handleFileChange = (event) => {
      setFile(event.target.files[0]);
    };

    // Manejar el envío del formulario
    const handleSubmit = async (event) => {
      event.preventDefault();
    
       // Verificar si los campos están vacíos
      if (!titulo || !autores || !resumen || !anioPublicacion || !asesor || !categoria || !tema || !file) {
        return toast.error("Todos los campos son obligatorios y debes subir un archivo.");
      }

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
        setLoading(true)
        // enviamos solicitud
        const response = await api.post('/documentos/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success("Documento create successsful");
        navigate("/documentos");

        console.log('Documento subido con éxito:', response.data);
      } catch (error) {
        console.error('Error al subir el documento:', error);
        toast.error("Error creating document");
      } finally {
        setLoading(false);
      }
    };

    return (
        <section className="container p-3">
  <h2>Creación de nuevo documento</h2>
  <hr />
  <div className="bg-light p-4 shadow rounded">
    <form onSubmit={handleSubmit} 
    encType="multipart/form-data" className="formulario">
      <div className="row g-4">
        <div className="col-6">
          <label>TITULO<span className="text-danger">*</span></label>
          <div className="input-group">
            <div className="input-group-text">
              <i className="bi bi-chat-right-dots"></i>
            </div>
            <input
              type="text"
              className="form-control"
              onChange={(e) => setTitulo(e.target.value)}
              id="titulo"
              name="titulo"
              value={titulo}
              placeholder="Título"
            />
          </div>
        </div>

        <div className="col-6">
          <label>AUTORES<span className="text-danger">*</span></label>
          <div className="input-group">
            <div className="input-group-text">
              <i className="bi bi-person-lines-fill"></i>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="Nombres y apellidos"
              onChange={(e) => setAutores(e.target.value)}
              id="autores"
              name="autores"
              value={autores}
            />
          </div>
        </div>

        <div className="col-12">
          <label>RESUMEN<span className="text-danger">*</span></label>
          <div className="input-group">
            <div className="input-group-text">
              <i className="bi bi-card-text"></i>
            </div>
            <textarea
              className="form-control"
              placeholder="Resumen"
              onChange={(e) => setResumen(e.target.value)}
              id="resumen"
              name="resumen"
              value={resumen}
            ></textarea>
          </div>
        </div>

        <div className="col-6">
          <label>AÑO DE PUBLICACIÓN<span className="text-danger">*</span></label>
          <div className="input-group">
            <div className="input-group-text">
              <i className="bi bi-calendar2-day"></i>
            </div>
            <input
              type="number"
              className="form-control"
              placeholder="Ejemplo: 2023"
              onChange={(e) => setAnioPublicacion(e.target.value)}
              id="anioPublicacion"
              name="anioPublicacion"
              value={anioPublicacion}
            />
          </div>
        </div>

        <div className="col-6">
          <label>ASESOR<span className="text-danger">*</span></label>
          <div className="input-group">
            <div className="input-group-text">
              <i className="bi bi-person-fill"></i>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="Nombres y apellidos"
              onChange={(e) => setAsesor(e.target.value)}
              id="asesor"
              name="asesor"
              value={asesor}
            />
          </div>
        </div>

        <div className="col-6">
          <label>CATEGORIA<span className="text-danger">*</span></label>
          <div className="input-group">
            <div className="input-group-text">
              <i className="bi bi-bookmark-star"></i>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="Categoria"
              onChange={(e) => setCategoria(e.target.value)}
              id="categoria"
              name="categoria"
              value={categoria}
            />
          </div>
        </div>

        <div className="col-6">
          <label>TEMA<span className="text-danger">*</span></label>
          <div className="input-group">
            <div className="input-group-text">
              <i className="bi bi-chat-square-text-fill"></i>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="Tema"
              onChange={(e) => setTema(e.target.value)}
              id="tema"
              name="tema"
              value={tema}
            />
          </div>
        </div>

        <div className="col-sm-6 mb-3">
          <label htmlFor="formFile" className="form-label">Archivo pdf:</label>
          <input className="form-control border" type="file" id="file" onChange={handleFileChange} accept="application/pdf" />
        </div>

        <div className="col-12">
          <button className="btn btn-info px-4 float-end mt-4 me-2">
            { loading ? <sp>Loading...</sp> : " Create documento" }
          </button>
      
          <Link to={'/documentos'} className="btn btn-success px-4 float-end mt-4 me-2">Volver</Link>
        </div>
      </div>
    </form>
  </div>
</section>

    )
}