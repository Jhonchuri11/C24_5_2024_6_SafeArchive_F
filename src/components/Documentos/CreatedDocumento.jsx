import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
//import "../../style/CreatedDocumento.css";
import "../../style/ContentDocument.css";
import {toast, Toaster} from "react-hot-toast";
import api from "../../services/api";
import Errors from "../Errors";


export default function CreatedDocumento() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(false);

    // Estados para los datos del formulario
    const [titulo, setTitulo] = useState('');
    const [autores, setAutores] = useState('');
    const [resumen, setResumen] = useState('');
    const [anioPublicacion, setAnioPublicacion] = useState('');
    const [asesor, setAsesor] = useState('');
    const [categoria, setCategoria] = useState('');
    const [tema, setTema] = useState('');
    const [file, setFile] = useState(null);

    // categorias de documentos
    const [categoriasList, setCategoriasList] = useState([]);

    const fetchCategoria = useCallback(async () => {
      setLoading(true);
      try {
        const response = await api.get("/categorias");

        const documentList = Array.isArray (response.data) ? response.data : [];

        setCategoriasList(documentList);;

        // eliminar
        console.log(documentList);
        
      } catch (error) {
        setError(error.response.data.message);
        console.log("Error fetching category", error);
      } finally {
        setLoading(false);
      }
    }, []);


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
        setError(error.response.data.message);
        console.error("Error al subir el documento:", error);
        toast.error("Error creating document");
      } finally {
        setLoading(false);
      }

      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
      
    };
    
    useEffect(() => {
      fetchCategoria();
    }, [fetchCategoria])

    // to show and erros
    if (error) {
      return <Errors message={error} />
    }

    return (
        <section className="container p-3">
          <div className="row">
                    <div className="col-12 col-md-12 col-sm-12 col-lg-12 col-xl-12">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/inicio" className="breadcrumb_inicio">Inicio</Link></li>
                                <li className="breadcrumb-item" aria-current="page">Documentos</li>
                                <li className="breadcrumb-item active" aria-current="page"> Registro de documento</li>
                            </ol>
                        </nav>
                    </div>
                </div>
  <hr />
  <div className="card card-body bg-light p-4 shadow rounded">
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
            <select
              className="form-control"
              onChange={(e) => { setCategoria(e.target.value);
                console.log('Categoria seleccionada:', e.target.value);
               }
              }
              id="categoria"
              name="categoria"
              value={categoria}
            >
              <option value="">Seleccione una categoria</option>
              {categoriasList.map((cate) => (
                <option key={cate.categoria_id} value={cate.categoria_id}>
                  {cate.nombre_categoria}
                </option>
              ))}
            </select>
            
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
            { loading ? <sp>Loading...</sp> : " Crear documento" }
          </button>
      
          <Link to={'/documentos'} className="btn btn-success px-4 float-end mt-4 me-2">Cancelar</Link>
          
        </div>
      </div>
    </form>
  </div>
</section>

    )
}