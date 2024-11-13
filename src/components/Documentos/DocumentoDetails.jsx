import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import Errors from "../Errors";
import Swal from "sweetalert2";


const DocumentoDetails = () => {
    
    const navigate = useNavigate();

    // obtaing id for params
    const { id } = useParams();
    const [documentos, setDocumentos] = useState({});

    // Estados para los datos del formulario

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    // categorias de documentos
    const [categories, setCategories] = useState([]);

    const [carreras, setCarreras] = useState([]);

    const [semestres, setSemestres] = useState([]);


    const fectchDocumentosDetails = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get("/documentos");

            // primero sacamos el documento que tenga el id
            const foundDocumento = response.data.find((n) => n.id.toString() === id);

            setDocumentos(foundDocumento);

            console.log(foundDocumento);

        } catch (error) {
            setError(error.response.data.message);
            toast.error("Error fetching document details", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    const fetchCategoria = useCallback(async () => {
        setLoading(true);
        try {
          const response = await api.get("/categorias");
  
          const categoriaList = Array.isArray (response.data) ? response.data : [];
  
          setCategories(categoriaList);;
  
          // eliminar
          console.log(categoriaList);
          
        } catch (error) {
          setError(error.response.data.message);
          toast.error("Error fetching categories.");
          console.log("Error fetching categories", error);
        } finally {
          setLoading(false);
        }
      }, []);

      const fetchCarreras = useCallback(async () => {
        setLoading(true);
        try {
          const response = await api.get("/carreras");
  
          const carreraList = Array.isArray (response.data) ? response.data : [];
  
          setCarreras(carreraList);;
  
          // eliminar
          console.log(carreraList);
          
        } catch (error) {
          setError(error.response.data.message);
          toast.error("Error fetching categories.");
          console.log("Error fetching categories", error);
        } finally {
          setLoading(false);
        }
      }, []);

      const fetchSemestres = useCallback(async () => {
        setLoading(true);
        try {
          const response = await api.get("/semestres");
  
          const semestreList = Array.isArray (response.data) ? response.data : [];
  
          setSemestres(semestreList);;
  
          // eliminar
          console.log(semestreList);
          
        } catch (error) {
          setError(error.response.data.message);
          toast.error("Error fetching categories.");
          console.log("Error fetching categories", error);
        } finally {
          setLoading(false);
        }
      }, []);

    useEffect(() => {
        if (id) {
            fectchDocumentosDetails();
        }
    }, [id, fectchDocumentosDetails]);

    // function update
    const handleUpdateDocument = async (event) => {

        event.preventDefault();
  
        // Crear un objeto FormData para enviar los datos
        const formData = new FormData();
        formData.append('titulo', documentos.titulo);
        formData.append('autores', documentos.autores);
        formData.append('resumen', documentos.resumen);
        formData.append('fechaPublicacion', documentos.fechaPublicacion);
        formData.append('asesor', documentos.asesor);
        formData.append('categoria', documentos.categoriaId);
        formData.append('carrera', documentos.carreraId);
        formData.append('ciclo', documentos.ciclo);
        formData.append('seccion', documentos.seccion);
        formData.append('semestre', documentos.semestreId);
  
        try {
          setLoading(true)
          // enviamos solicitud
          const response = await api.put(`/documentos/updatedrive/${id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          Swal.fire({
            title: "Documento actualizado!",
            text: "El documento ha sido guardado correctamente.",
            icon: "success",
            confirmButtonText: "Aceptar"
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/documentos");
            }
          })
  
          navigate("/documentos");
  
          console.log('Documento actualizado con éxito:', response.data);
        } catch (error) {
          setError(error.response.data.message);
          Swal.fire({
            title: "Error",
            text: "Ocurrió un error al intentar registrar el documento!",
            icon: "error",
            confirmButtonText: "Aceptar"
          });
        } finally {
          setLoading(false);
        } 

        formData.forEach((value, key) => {
          console.log(`${key}: ${value}`);
        });
        
      };

    useEffect(() => {
        fetchCategoria();
        fetchCarreras();
        fetchSemestres();
    }, [fetchCategoria, fetchCarreras, fetchSemestres])
    

    // if there is an error
    if (error) {
        return <Errors message={error} />
    }

    return (
        <div className="container mt-4">
            <div className="">
                <div className="row">
                    <div className="col-12 col-md-12 col-sm-12 col-lg-12 col-xl-12">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link to="/inicio" className="breadcrumb_inicio">Inicio</Link>
                                </li>
                                <li className="breadcrumb-item" aria-current="page">Documentos
                                </li>
                                <li className="breadcrumb-item active">
                                    Formato de edición de documento
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="card card-body bg-light p-4 shadow rounded">
                <form onSubmit={handleUpdateDocument} encType="multipart/form-data" className="formulario">
                <div className="row g-4">
                    <div className="col-6">
                        <label>Título<span className="text-success">*</span></label>
                        <div className="input-group">
                            <div className="input-group-text">
                                <i className="bi bi-chat-right-dots"></i>
                            </div>
                            <textarea
                                type="text"
                                className="form-control border border-grey-1"
                                id="titulo"
                                name="titulo"
                                value={documentos.titulo}
                                onChange={(e) => setDocumentos({ ...documentos, titulo: e.target.value })}
                            >
                            </textarea>
                        </div>
                    </div>
                    <div className="col-6">
                        <label>Autores<span className="text-success">*</span></label>
                        <div className="input-group">
                            <div className="input-group-text">
                                <i className="bi bi-person-lines-fill"></i>
                            </div>
                            <textarea
                                type="text"
                                className="form-control border border-grey-1"
                                id="autores"
                                name="autores"
                                value={documentos.autores}
                                onChange={(e) => setDocumentos({ ...documentos, autores: e.target.value })}
                            >
                            </textarea>
                        </div>
                    </div>
                    <div className="col-12">
                        <label>Resumen<span className="text-success">*</span></label>
                        <div className="input-group">
                            <div className="input-group-text">
                                <i className="bi bi-card-text"></i>
                            </div>
                            <textarea
                                type="text"
                                className="form-control border border-grey-1"
                                id="resumen"
                                name="resumen"
                                value={documentos.resumen}
                                onChange={(e) => setDocumentos({ ...documentos, resumen: e.target.value })}
                            >
                            </textarea>
                        </div>
                    </div>
                    <div className="col-6">
                        <label>Fecha de publicación<span className="text-success">*</span></label>
                        <div className="input-group">
                            <div className="input-group-text">
                                <i className="bi bi-calendar2-day"></i>
                            </div>
                            <input
                                type="Date"
                                className="form-control border border-grey-1"
                                id="fechaPublicacion"
                                name="fechaPublicacion"
                                value={documentos.fechaPublicacion}
                                onChange={(e) => setDocumentos({ ...documentos, fechaPublicacion: e.target.value })}
                            >
                            </input>
                        </div>
                    </div>
                    <div className="col-6">
                        <label>Asesor<span className="text-success">*</span></label>
                        <div className="input-group">
                            <div className="input-group-text">
                                <i className="bi bi-calendar2-day"></i>
                            </div>
                            <input
                                type="text"
                                className="form-control border border-grey-1"
                                id="asesor"
                                name="asesor"
                                value={documentos.asesor}
                                onChange={(e) => setDocumentos({ ...documentos, asesor: e.target.value })}
                                
                            >
                            </input>
                        </div>
                    </div>
                    <div className="col-6">
                        <label>Categoria<span className="text-success">*</span></label>
                        <div className="input-group">
                            <div className="input-group-text">
                                <i className="bi bi-bookmark-star"></i>
                            </div>
                            
                            <select
                                className="form-control border border-grey-1"
                                id="categoria"
                                name="categoria"
                                value={documentos.categoriaId || ""}
                                onChange={(e) => 
                                    setDocumentos({
                                        ...documentos,
                                        categoriaId: e.target.value,
                                    })
                                }
                            >   
                                {categories.map((cate) => (
                                    <option key={cate.id} value={cate.id}>
                                        {cate.nombreCategoria}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="col-6">
                        <label>Carrera<span className="text-success">*</span></label>
                        <div className="input-group">
                            <div className="input-group-text">
                                <i className="bi bi-chat-square-text-fill"></i>
                            </div>
                            <select
                                className="form-control border border-grey-1"
                                id="categoria"
                                name="categoria"
                                value={documentos.carreraId || ""}
                                onChange={(e) => 
                                    setDocumentos({
                                        ...documentos,
                                        carreraId: e.target.value,
                                    })
                                }
                            >   
                                {carreras.map((carre) => (
                                    <option key={carre.id} value={carre.id}>
                                        {carre.nombreCarrera}
                                    </option>
                                ))}
                            </select>
                     
                        </div>
                    </div>
                    <div className="col-6">
                        <label>Ciclo<span className="text-success">*</span></label>
                        <div className="input-group">
                            <div className="input-group-text">
                                <i className="bi bi-chat-square-text-fill"></i>
                            </div>
                            <input
                                type="text"
                                className="form-control border border-grey-1"
                                id="ciclo"
                                name="ciclo"
                                value={documentos.ciclo}
                                onChange={(e) => setDocumentos({ ...documentos, ciclo: e.target.value })}
                            >
                            </input>
                        </div>
                    </div>
                    <div className="col-6">
                        <label>Sección<span className="text-success">*</span></label>
                        <div className="input-group">
                            <div className="input-group-text">
                                <i className="bi bi-chat-square-text-fill"></i>
                            </div>
                            <input
                                type="text"
                                className="form-control border border-grey-1"
                                id="seccion"
                                name="seccion"
                                value={documentos.seccion}
                                onChange={(e) => setDocumentos({ ...documentos, seccion: e.target.value })}
                            >
                            </input>
                        </div>
                    </div>
                    <div className="col-6">
                        <label>Semestre<span className="text-success">*</span></label>
                        <div className="input-group">
                            <div className="input-group-text">
                                <i className="bi bi-chat-square-text-fill"></i>
                            </div>
                            <select
                                className="form-control border border-grey-1"
                                id="categoria"
                                name="categoria"
                                value={documentos.semestreId || ""}
                                onChange={(e) => 
                                    setDocumentos({
                                        ...documentos,
                                        semestreId: e.target.value,
                                    })
                                }
                            >   
                                {semestres.map((seme) => (
                                    <option key={seme.id} value={seme.id}>
                                        {seme.nombreSemestre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className="col-12">
                        <button
                            disabled={loading} 
                            className="btn btn-info px-4 float-end mt-4 me-2"
                        >
                            { loading ? <span>Loading...</span> : "Guardar documento" }
                        </button>
                        <Link to={'/documentos'} 
                        className="btn btn-success px-4 float-end mt-4 me-2">
                            Cancelar
                        </Link>
                    </div>
                </div>
                </form>
            </div>
            <div className="mt-3"/>
        </div>
    )
}

export default DocumentoDetails;