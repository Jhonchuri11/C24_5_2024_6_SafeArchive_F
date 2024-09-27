import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';
import "../../style/CreatedDocumento.css";

export default function CreatedDocumento() {

    const navigate = useNavigate();

    // Variable que permite crear nuevo documento
    const [formNewDocumento, setformNewDocumento] = useState({
        titulo: "",
        autores: "",
        resumen: "",
        anioPublicacion: "",
        asesor: "",
        categoria: "",
        tema: ""
    });

    const handleChange = (e) => {
        setformNewDocumento({
            ...formNewDocumento,
            [e.target.name]: e.target.value,
        });
    }
    // Funcionalidad que permite insertar nuevo documento
    const handleInsertDocument = async (e) => {
        e.preventDefault();

        if (!formNewDocumento.titulo || !formNewDocumento.autores || !formNewDocumento.resumen
            || !formNewDocumento.anioPublicacion || !formNewDocumento.asesor || !formNewDocumento.categoria ||
            !formNewDocumento.tema) {
            alert("Completar los campos para el registro de documento");
            return;
        }

        try {
            const DataToSend = {
               ...formNewDocumento
            };

            const response = await axios.post("http://localhost:8080/api/documentos", DataToSend);
            console.log("Producto creado", response.data);

            // Despues de la insercion se deja vacio los camppos
            setformNewDocumento({
                titulo: "",
                autores: "",
                resumen: "",
                anioPublicacion: "",
                asesor: "",
                categoria: "",
                tema: ""
            });
        
            navigate('/listadoDocumento');

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Documento registrado correctamente!",
                showConfirmButton: false,
                timer: 1900,
                customClass: {
                    popup: 'swal-medium'
                }
            });
        
        } catch (error) {
          console.error('Error creando producto:', error);

          if (error.response) {
            console.log('Detalles del error:', error.response.data);
          } else if (error.request) {
            console.log('Error en la solicitud:', error.request);
          } else {
            console.log('Error general:', error.message);
          }
        }
    }

    return (
        <section>
        <div className="container p-3">
        <h2>Creación de nuevo documento</h2>
        <hr/>
        <div className="login-pages bg-light">
            <div className="container p-4">
               <div className="row">
                    <div className="col-lg-12">
                        <div className="bg-white shadow rounded">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-left h-100 py-5 px-5">
                                        <form onSubmit={handleInsertDocument} className="formulario">
                                            <div className="row g-4">
                                                <div className="col-6">
                                                    <label>TITULO<span class="text-danger">*</span></label>
                                                                    <div className="input-group">
                                                                    <div className="input-group-text">
                                                                        <i class="bi bi-chat-right-dots"></i>
                                                                    </div>
                                                                    <input 
                                                                    type="text"
                                                                    className="form-control"
                                                                    onChange={handleChange}
                                                                    id="titulo"
                                                                    name="titulo"
                                                                    value={formNewDocumento.titulo} 
                                                                    placeholder="Título"/>
                                                                    </div>
                                                            </div>
                                                            <div className="col-6">
                                                                <label>AUTORES<span className="text-danger">*</span></label>
                                                                    <div className="input-group">
                                                                    <div className="input-group-text">
                                                                        <i class="bi bi-person-lines-fill"></i>
                                                                    </div>
                                                                    <input
                                                                    type="text" 
                                                                    className="form-control" 
                                                                    placeholder="Nombres y apellidos"
                                                                    onChange={handleChange}
                                                                    id="autores"
                                                                    name="autores"
                                                                    value={formNewDocumento.autores}/>
                                                                    </div>
                                                            </div>
                                                            <div className="col-12">
                                                                <label>RESUMEN<span class="text-danger">*</span></label>
                                                                    <div className="input-group">
                                                                    <div className="input-group-text">
                                                                        <i className="bi bi-card-text"></i>
                                                                    </div>
                                                                    <textarea 
                                                                    className="form-control" 
                                                                    placeholder="Resumen"
                                                                    onChange={handleChange}
                                                                    id="resumen"
                                                                    name="resumen"
                                                                    value={formNewDocumento.resumen}
                                                                    ></textarea>
                                                                    </div>
                                                            </div>
                                                            <div className="col-6">
                                                                <label>AÑO DE PUBLICACIÓN<span class="text-danger">*</span></label>
                                                                    <div className="input-group">
                                                                    <div className="input-group-text">
                                                                        <i className="bi bi-calendar2-day"></i>
                                                                    </div>
                                                                    <input 
                                                                    type="number" 
                                                                    class="form-control" 
                                                                    placeholder="Ejemplo: 2023"
                                                                    onChange={handleChange}
                                                                    id="anioPublicacion"
                                                                    name="anioPublicacion"
                                                                    value={formNewDocumento.anioPublicacion}/>
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
                                                                    onChange={handleChange}
                                                                    id="asesor"
                                                                    name="asesor"
                                                                    value={formNewDocumento.asesor}/>
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
                                                                    onChange={handleChange}
                                                                    id="categoria"
                                                                    name="categoria"
                                                                    value={formNewDocumento.categoria}/>
                                                                    </div>
                                                            </div>
                                                            <div className="col-6">
                                                                <label>TEMA<span className="text-danger">*</span></label>
                                                                    <div className="input-group">
                                                                    <div className="input-group-text">
                                                                        <i class="bi bi-chat-square-text-fill"></i>
                                                                    </div>
                                                                    <input 
                                                                    type="text" 
                                                                    className="form-control" 
                                                                    placeholder="Tema"
                                                                    onChange={handleChange}
                                                                    id="tema"
                                                                    name="tema"
                                                                    value={formNewDocumento.tema}/>
                                                                    </div>
                                                            </div>
                                                            <div class="col-sm-6">
                                                                <div class="mb-3">
                                                                    <label for="formFile" class="form-label">DOC</label>
                                                                    <input class="form-control border" type="file" id="formFile"/>
                                                                </div>
                                                            </div>
                                                            <div class="col-12">
                                                                <button class="btn btn-info px-4 float-end mt-4 me-2">Registrar</button>
                                                                <Link to={'/listadoDocumento'} class="btn btn-success px-4 float-end mt-4 me-2">Volver</Link>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div>
    </section>
    )
}