import '../../style/Inicio.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import doctesis from '../../assets/images/doc_tesis.png';
import React, { useCallback, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Inicio() {

    // filtro basico para categoria
    const [selectedCategoria, setSelectedCategoria] = useState('');

    const [terminoBusqueda, setTerminoBusqueda] = useState('');

    // Definiendo variables para el funcionamiento de muestra de filtros
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    // documentos list
    const [documentos, setDocumentos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorr, setError] = useState(false);

    // estado que maneja los elementos dinamicos
    const [elementos, setElementos] = useState([{}]);

    // tipo de documento categorias
    const [categorias, setCategorias] = useState([]);

    const executeBusqueda = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get("/documentos/filtrar", {
                params: {
                    categoria: selectedCategoria,
                    termino: terminoBusqueda,
                }
            });

            const documentosData = Array.isArray(response.data) ? response.data : [];

            setDocumentos(documentosData);

            console.log(documentosData);

        } catch (err) {
            setError(err?.response?.data?.message);
            toast.error("Error fetching documentos");
        } finally {
            setLoading(false);
        }
    }, [selectedCategoria, terminoBusqueda])

    const fetchCategorias = useCallback(async () => {
        try {
          const response = await api.get("/categorias");
  
          const documentList = Array.isArray(response.data) ? response.data : [];
  
          setCategorias(documentList);;
  
          console.log(documentList);
          
        } catch (err) {
          setError(err?.response?.data?.message);
        }
    }, []);

    const fetchDocumentos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get("documentos/all");

            // prueba de log
            console.log(response.data);
            const documentsData = Array.isArray(response.data) ? response.data : [];
            setDocumentos(documentsData);
        } catch (err) {
            setError(err?.response?.data?.message);

            toast.error("Error fetching documentos", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDocumentos();
        fetchCategorias();
    }, [fetchDocumentos, fetchCategorias]);

    const handleCategoriaChange = (e) => {
        setSelectedCategoria(e.target.value);
    };

    const handleBusquedaChange = (e) => {
        setTerminoBusqueda(e.target.value);
    }

    const cambioEstado = () => {
        setMostrarFiltros(!mostrarFiltros);
    };

    // Funcionalidad para agregar nuevo elemento
    const agregarElemento = (index) => {
        const nuevoElementos = [...elementos];
        nuevoElementos.splice(index + 1, 0, {}); // agrega un nuevo elemento despues del actual
        setElementos(nuevoElementos);
    };

    // Funcionalidad para eliminar elemento
    const eliminarElemento = (index) => {
        const nuevoElementos = elementos.filter((_, i) => i !== index);
        setElementos(nuevoElementos);
    } 

    const restaurarElementos = () => {
        setElementos([{}]);
    };

    return (
        <section>
            <div className="container p-2">
                <h2 className='text-start'>Buscar</h2>
                <hr/>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <select className="form-select" aria-label="Default select example"
                        value={selectedCategoria}
                        onChange={handleCategoriaChange}
                        >
                            <option value="" selected>Todos</option>
                            {categorias.map((catego) => (
                                <option key={catego.categoria_id} value={catego.categoria_id}>
                                    {catego.nombre_categoria}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-8 primero">
                        <div className="input-group mb-3">
                            <input type="text" class="form-control controlador" placeholder="Ingresar su búsqueda"
                            value={terminoBusqueda}
                            onChange={handleBusquedaChange}/>

                            <button class="btn btn-outline-secondary" type="button" onClick={executeBusqueda} >
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <button class="btn btn-link"  onClick={cambioEstado}>
                            {mostrarFiltros ? 'Ocultar filtros' : 'Mostrar filtros'}  
                        </button>
                    </div>
                </div>
            </div>
            {mostrarFiltros && (
            <div className="container mt-3" >
                <div className="row">
                    <h2>Filtros</h2>
                    <p>Use los siguientes criterios para mejorar sus resultados</p>
                </div>
                <div id="contenedor">

                    {elementos.map((elemento, index) => 
                    <div className="row elemento">
                        <div className="col-md-3" key={index}>
                            <select class="form-select" aria-label="Default select example">
                                <option defaultValue>Todos</option>
                                <option value="1">Autor</option>
                                <option value="2">Título</option>
                                <option value="3">Asesor</option>
                                <option value="4">Tema</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <select class="form-select" aria-label="Default select example">
                                <option selected>Todos</option>
                                <option value="1">Contiene</option>
                                <option value="2">No contiene</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <div className="input-group mb-3">
                                <input type="text" class="form-control" placeholder="Ingresar su búsqueda" aria-label="Recipient's username" aria-describedby="button-addon2"/>
                                <button class="btn btn-outline-secondary" onClick={() => agregarElemento(index)}   type="button">
                                    <i class="bi bi-plus-circle"></i>
                                </button>
                                <button class="btn btn-outline-secondary" onClick={() => eliminarElemento(index)} disabled={elementos.length === 1}  type="button">
                                    <i class="bi bi-dash-circle"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                </div>
                <div class="col-md-3">
                    <button className='btn btn-grey border' onClick={restaurarElementos}>Restaurar</button>
                    <button class="btn btn-grey border">Aplicar</button>
                </div>
            </div>
            )}

             {/* Resultados de listado para documentos */}

            <div className="container mt-3">
                <p>Mostrando items 1-2 de 200</p>

                { loading ? (
                    <p>Cargando documentos</p>
                ) : errorr ? (
                    <p>{errorr}</p>
                ) : (
                <div className="row">
                    { documentos.map((documento, index) => (
                    
                    <div className="row" key={index}>
                        <div className="col-md-3 mt-4">
                            {/* Imagen de portada de documento */}
                            <img 
                            className="imgdocumento" 
                            src={doctesis} 
                            width={"240px"} 
                            height={"240px"} 
                            alt={documento}/>
                        </div>
                        <div className="col-md-9 mt-4">
                            <Link to={`/detalle/${documento.id}`} className='documento'>{documento.titulo} </Link>
                            <p>{documento.autores}</p>
                            <p class="text-justify">{documento.resumen}</p>
                        </div> 
                    </div>
                    ))}
                </div>
                )}
                <nav aria-label="Page navigation">
                    <ul class="pagination">
                        <li class="page-item"><a class="page-link" href="#">Anterior</a></li>
                        <li class="page-item"><a class="page-link" href="#">1</a></li>
                        <li class="page-item"><a class="page-link" href="#">2</a></li>
                        <li class="page-item"><a class="page-link" href="#">3</a></li>
                        <li class="page-item"><a class="page-link" href="#">Siguiente</a></li>
                    </ul>
                </nav>
                <hr/>
            </div>
        </section>
    )
}