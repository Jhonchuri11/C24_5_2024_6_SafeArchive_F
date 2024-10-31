import '../../style/Inicio.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import doctesis from '../../assets/images/doc_tesis.png';
import { SkeletonBlock, SkeletonImage, SkeletonText, }  from "skeleton-elements/react";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function Inicio() {

    // filtro basico para categoria
    const [selectedCategoria, setSelectedCategoria] = useState('');

    const [terminoBusqueda, setTerminoBusqueda] = useState('');

    // filtros avanzados
    const [filtrosAvanzados, setFiltrosAvanzados] = useState([{ campo: '', condicion: 'contiene', valor: '' }]);


    // Definiendo variables para el funcionamiento de muestra de filtros
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    // documentos list
    const [documentos, setDocumentos] = useState([]);

    // miniaturas del pdf
    const [thumbanails, setThumbanails] = useState({});

    const [loading, setLoading] = useState(false);
    const [errorr, setError] = useState(false);

    const [effect, setEffect] = useState(null); // Efecto de skeleton

    // estado que maneja los elementos dinamicos
    const [elementos, setElementos] = useState([{}]);

    // tipo de documento categorias
    const [categorias, setCategorias] = useState([]);

    const executeBusqueda = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                categoria: selectedCategoria || null,
                termino: terminoBusqueda || null,
                //filtrosAvanzados: filtrosAvanzados.filter(filtro => filtro.campo && filtro.valor)
            }

            const filtrosAvanzadosParams = filtrosAvanzados
            .filter(filtro => filtro.campo && filtro.valor)
            .flatMap((filtro, index) => [
                `filtrosAvanzadosCampo${index}=${encodeURIComponent(filtro.campo)}`,
                `filtrosAvanzadosCondicion${index}=${encodeURIComponent(filtro.condicion)}`,
                `filtrosAvanzadosValor${index}=${encodeURIComponent(filtro.valor)}`
            ])
            .join('&');


            const response = await api.get(`/documentos/filtrarAvanzado?${new URLSearchParams(params).toString()}&${filtrosAvanzadosParams}`);

            const documentosData = Array.isArray(response.data) ? response.data : [];

            //setDocumentos(documentosData);

            setTimeout(() => {
                setDocumentos(documentosData);
                setLoading(false); 
            }, 2000);

            //console.log(response);

            //console.log(documentosData);

        } catch (err) {
            setError(err?.response?.data?.message);
            toast.error("Error fetching documentos");
        } finally {
            setLoading(false);
        }
    }, [selectedCategoria, terminoBusqueda, filtrosAvanzados])

    // funcion para manejar el cambio de filtro
    const handleFiltroChange = (index, field, value) => {
        const nuevosFiltros = [...filtrosAvanzados];
        nuevosFiltros[index][field] = value;
        setFiltrosAvanzados(nuevosFiltros);
    }

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

            // objeto 
            const thumbnailsMap = {};

            // aqui llamos al otro enpoint para mostrar miniatura
            await Promise.all(
                documentsData.map( async (doc) => {
                    try {
                        const thumbnailResponse = await api.get(`documentos/img?id=${doc.id}`);
                        thumbnailsMap[doc.id] = thumbnailResponse.data.thumbnailUrl;
                    

                    } catch (thumbnailError) {
                        console.error(`Error al obtener miniatura para documento ${doc.id}:`, thumbnailError);
                        thumbnailsMap[doc.id] = null;
                    }
                })
            );

            setThumbanails(thumbnailsMap);
            console.log(thumbanails);

        } catch (err) {
            setError(err?.response?.data?.message);

            toast.error("Error fetching documentos", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDocumentosd = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get("/documentos/img?id=1");

            // prueba de log
            console.log(response);
            //const documentsData = Array.isArray(response.data) ? response.data : [];
            //setDocumentos(documentsData);
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
        fetchDocumentosd();
    }, [fetchDocumentos, fetchCategorias, fetchDocumentosd]);

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

    const agregarFiltro = () => {
        setFiltrosAvanzados([...filtrosAvanzados, { campo: '', condicion: 'contiene', valor: '' }]);
    };

    // Funcionalidad para eliminar elemento
    const eliminarFiltro = (index) => {
        const nuevoFiltros = filtrosAvanzados.filter((_, i) => i !== index);
        setFiltrosAvanzados(nuevoFiltros);
    } 

    const restaurarElementos = () => {
        setFiltrosAvanzados([{}]);
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
                            <option value="" selected>Todo el repositorio</option>
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

                            <Link class="btn btn-outline-secondary" type="button" onClick={executeBusqueda} >
                                <i className="bi bi-search"></i>
                            </Link>
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
                    <h2 className='text-start'>Filtros</h2>
                    <p>Use los siguientes criterios para mejorar sus resultados</p>
                </div>
                <div id="contenedor">

                    {filtrosAvanzados.map((filtro, index) => 
                    <div className="row elemento">
                        <div className="col-md-3" key={index}>
                            <select class="form-select" aria-label="Campo" 
                            value={filtro.campo}
                            onChange={(e) => handleFiltroChange(index, 'campo', e.target.value )} >
                                <option value="" defaultValue>Todos</option>
                                <option value="autor">Autor</option>
                                <option value="titulo">Título</option>
                                <option value="asesor">Asesor</option>
                                <option value="tema">Tema</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <select class="form-select" aria-label="Condicion"
                            value={filtro.condicion}
                            onChange={(e) => handleFiltroChange(index, 'condicion', e.target.value )}>
                                <option value="contiene" selected>Contiene</option>
                                <option value="no contiene">No contiene</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <div className="input-group mb-3">
                                <input type="text" class="form-control" 
                                placeholder="Ingresar su búsqueda" 
                                value={filtro.valor}
                                onChange={(e) => handleFiltroChange(index, 'valor', e.target.value )}
                               />

                                <button class="btn btn-outline-secondary" 
                                onClick={agregarFiltro}   type="button">
                                    <i class="bi bi-plus-circle"></i>
                                </button>
                                <button class="btn btn-outline-secondary" 
                                onClick={() => eliminarFiltro(index)} disabled={filtrosAvanzados.length === 1}  type="button">
                                    <i class="bi bi-dash-circle"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                </div>
                <div class="col-md-3">
                    <button className='btn btn-grey border' onClick={restaurarElementos}>Restaurar</button>
                    <button class="btn btn-grey border" onClick={executeBusqueda}>Aplicar</button>
                </div>
            </div>
            )}

             {/* Resultados de listado para documentos */}

            <div className="container mt-3">
                <p>Mostrando items 1-2 de 200</p>

                 {/* sKeleton*/}

                { loading ? (
                    <div className='row'>
                        {[...Array(4)].map((_, index) => {
                            
                        <div className='cold-md-12 mt-4' key={index}>
                             <SkeletonBlock tag="p" width={300} height={20} effect={effect}/>
                             <SkeletonBlock tag="p" width={200} height={20} effect={effect}/>
                             <SkeletonBlock tag="p" width="100%" height={100} effect={effect}/>
                         </div>
                     
                        })}
                    </div>

                ) : errorr ? (
                    toast.error("Failed documentos!")
                ) : (
                <div className="row">
                    { documentos.map((documento, index) => (
                    
                    <div className="row" key={index}>
                        <div className="col-md-3 mt-4">
                            {/* Imagen de portada de documento */}
                            
                            {thumbanails[documento.id] ? (
                            <img
                            className="imgdocumento" 
                            src={thumbanails[documento.id]} alt={`Miniatura de ${documento.titulo}`}
                            width={"240px"} 
                            height={"240px"} 
                            crossOrigin="use-credentials"
                            />
                            ) : (
                                <p>Cargando </p>
                            )}
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