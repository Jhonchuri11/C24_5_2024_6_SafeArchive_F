import '../../style/Inicio.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { SkeletonBlock }  from "skeleton-elements/react";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function Inicio() {

    // filtro basico para categoria
    const [categoria, setCategoria] = useState('');

    const [resumen, setResumen] = useState('');

    // filtros avanzados
    const [filtrosAvanzados, setFiltrosAvanzados] = useState([{ campo: '', condicion: 'contiene', valor: '' }]);


    // Definiendo variables para el funcionamiento de muestra de filtros
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    // documentos list
    const [documentos, setDocumentos] = useState([]);


    const [loading, setLoading] = useState(false);
    const [errorr, setError] = useState(false);

    const [effect, setEffect] = useState(null); // Efecto de skeleton

    // tipo de documento categorias
    const [categorias, setCategorias] = useState([]);


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

    // funcion start busqueda basica
    const handleSearchBasic = async () => {
        try {
            const params = {};
            if (categoria) params.categoria = categoria;
            if (resumen) params.resumen = resumen;
            
            const response = await 
            api.get(`documentos/search`, { params });
            setDocumentos(response.data);
            console.log(response);

        } catch (error) {
            console.error("Error fetching documents:", error);
        }
    }

    // start andvanc filters
    const aplicarFiltros = async () => {
        try {
            const params = {};
            if (categoria) params.categoria = categoria;
            //if (filtrosAvanzados) params.filtrosAvanzados = filtrosAvanzados; 
            // Procesar filtros avanzados
            
            filtrosAvanzados.forEach((filtro, index) => {
                params[`campos`] = encodeURIComponent(filtro.campo);
                params[`condiciones`] = encodeURIComponent(filtro.condicion);
                params[`valores`] = encodeURIComponent(filtro.valor);
           });
           
           

            const response = await api.get(`documentos/search/advanced`, { params })

            setDocumentos(response.data);
            
            console.log(response);

        } catch (error) {
            console.log("Error en obtener documentos por filtes", error);
        }
    }

    const handleCategoriaChange = (e) => {
        setCategoria(e.target.value);

    };

    const handleBusquedaChange = (e) => {
        setResumen(e.target.value);
    }

    const cambioEstado = () => {
        setMostrarFiltros(!mostrarFiltros);
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
                        value={categoria}
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
                            value={resumen}
                            onChange={handleBusquedaChange}/>

                            <button class="btn btn-outline-secondary" onClick={(e)=> handleSearchBasic(e)} type="button" >
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
                                <option value="autores">Autor</option>
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
                                <option value="nocontiene">No contiene</option>
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
                    <button class="btn btn-grey border" onClick={(e)=> aplicarFiltros(e)}>Aplicar</button>
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
                            <img
                            className="imgdocumento" 
                            src={documento.thumbnailUrl} alt={`${documento.titulo}`}
                            width={"240px"} 
                            height={"240px"} 
                            />
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