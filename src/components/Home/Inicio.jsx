import '../../style/Inicio.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useCallback, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import DocumentSkeleton from '../Skeleton/DocumentSkeleton';
//import 'react-loading-skeleton/dist/Skeleton';


export default function Inicio() {

    // filtro basico para categoria
    const [categoria, setCategoria] = useState('');

    const [resumen, setResumen] = useState('');

    const [sugerencias, setSugerencias] = useState([]);

    const [showSuggestions, setShowSuggestions] = useState(false);

    const [effect, setEffect] = useState("wave");

    // filtros avanzados
    const [filtrosAvanzados, setFiltrosAvanzados] = useState([{ campo: '', condicion: 'CONTAINT', valor: '' }]);


    // Definiendo variables para el funcionamiento de muestra de filtros
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    // documentos list
    const [documentos, setDocumentos] = useState([]);


    const [loading, setLoading] = useState(true);

    const [errorr, setError] = useState(false);

    // tipo de documento categorias
    const [categorias, setCategorias] = useState([]);

    // paginacion de documentos
    const [currentPage, setCurrentPage] = useState(0); // Página actual
    const [totalDocuments, setTotalDocuments] = useState(0); // Total de documentos


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

    const fetchDocumentos = useCallback(async (page = 0, limit = 5 ) => {
      
        try {
            setLoading(true);
            const response = await api.get(`/documentos/all/paginations`, { params: { page, limit }});
            const documentsData = Array.isArray(response.data) ? response.data : [];

            setDocumentos(documentsData);

            setLoading(false);

            // total documentos
            setTotalDocuments(parseInt(response.headers['x-total-count'], 10));

        } catch (err) {
            setError(err?.response?.data?.message);
            toast.error("Error fetching documentos", err);
        } 

    }, []);

    useEffect(() => {
        fetchDocumentos(currentPage);
        fetchCategorias();
    }, [fetchDocumentos, fetchCategorias, currentPage]);

    const construirCriteriosBusqueda = () => {

        const criterios = [];

        if ( categoria || resumen) {
            criterios.push({
                categoriaId: categoria,
                searchKey: "RESUMEN",
                searchValue: resumen || "",
                operatorDocument: "CONTAINT"
            });
        }
        
        
            filtrosAvanzados.forEach(filtro => {
                if (filtro.campo && filtro.valor) {
                    criterios.push({
                        categoriaId: '',
                        searchKey: filtro.campo,
                        searchValue: filtro.valor,
                        operatorDocument: filtro.condicion
                    });
                } 
            });
        
        return criterios;
    }
     // Manejo de búsqueda básica con retraso de Skeleton
     const handleSearchBasic = async () => {

        setLoading(true); // Activar Skeleton al iniciar la búsqueda

        setTimeout(async () => {

            try {
                
                const searchCriteria = construirCriteriosBusqueda(false);
                
                const response = await api.post(`documentos/document`, { searchCriteria });

                console.log(response);

                //setDocumentos(response.data);

                //setTotalDocuments(response.data.length);

                //setLoading(false); // Desactivar Skeleton después de recibir los datos

            } catch (error) {
                console.error("Error fetching documents:", error);
                //setLoading(false);
            }
        }, 5000); // 5 segundos de retraso para mostrar el Skeleton
    };

    // funcion paginacion
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        fetchDocumentos(pageNumber);
    }

    // start andvanc filters
    const aplicarFiltros = async () => {

        setLoading(true);

        setTimeout( async () => {

            try {
                
                const searchCriteria = construirCriteriosBusqueda(true);

                const response = await api.post(`documentos/document`, { searchCriteria });
    
                //setDocumentos(response.data);
                //setTotalDocuments(response.data.length);
                
                console.log(response);
    
            } catch (error) {
                console.log("Error en obtener documentos por filtes", error);
            } finally {
                setLoading(false);
            }    
        }, 5000);
        
    }

    const handleBusquedaChange = async (e) => {
        setResumen(e.target.value);
    }


    const handleCategoriaChange = (e) => {
        setCategoria(e.target.value);

    };

    const cambioEstado = () => {
        setMostrarFiltros(!mostrarFiltros);
    };

    const agregarFiltro = () => {
        setFiltrosAvanzados([...filtrosAvanzados, { campo: '', condicion: 'CONTAINT', valor: '' }]);
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
                        <select className="form-select border border-grey-1" aria-label="Default select example"
                        value={categoria}
                        onChange={handleCategoriaChange}
                        >
                            <option value="">Todo el repositorio</option>
                            <option value="TESIS">Tesis</option>
                            <option value="PROJECT">Projetos Integradores</option>
                        </select>
                    </div>
                    <div className="col-md-8 primero">
                        <div className="input-group mb-3">
                            <input type="text" class="form-control controlador border border-grey-1" placeholder="Ingresar su búsqueda"
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

                    <div className="row elemento" key={index}>
                        <div className="col-md-3">
                            <select class="form-select border border-grey-1" aria-label="Campo" 
                            value={filtro.campo}
                            onChange={(e) => handleFiltroChange(index, 'campo', e.target.value )} >
                                <option value="AUTORES">Autor</option>
                                <option value="TITULO">Título</option>
                                <option value="ASESOR">Asesor</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <select class="form-select border border-grey-1" aria-label="Condicion"
                            value={filtro.condicion}
                            onChange={(e) => handleFiltroChange(index, 'condicion', e.target.value )}>
                                <option value="CONTAINT">Contiene</option>
                                <option value="NOT_CONTAINT">No contiene</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <div className="input-group mb-3">
                                <input type="text" class="form-control border border-grey-1" 
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
                <p>
                    Mostrando items {currentPage * 10 + 1 }-
                    {Math.min((currentPage + 1 ) * 10, totalDocuments)} de {totalDocuments}
                </p>
                <div>
                
            </div>
            <div className="row">
                    {loading ? (
                        Array(10).fill().map((_, index) => <DocumentSkeleton key={index} />)
                    ) : (
                        documentos.map((documento, index) => (
                            <div className="row" key={index}>
                                <div className="col-md-3 mt-4">
                                    <Link to={`/detalle/${documento.id}`}>
                                        {documento.thumbnailUrl ? (
                                            <img
                                                className="imgdocumento"
                                                src={documento.thumbnailUrl}
                                                alt={`${documento.titulo}`}
                                                width={"240px"}
                                                height={"240px"}
                                            />
                                        ) : (
                                            <Skeleton width={240} height={340} />
                                        )}
                                    </Link>
                                </div>
                                <div className="col-md-9 mt-4">
                                    <Link to={`/detalle/${documento.id}`} className='documento'>{documento.titulo}</Link>
                                    <p>{documento.autores}</p>
                                    <p className="texto-resumen text-justify">
                                        {documento.resumen}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <nav aria-label="Page navigation">
                    <ul class="pagination">
                        <li class="page-item">
                            <button 
                                class="page-link" 
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 0}>
                                Anterior
                            </button>
                        </li>

                        {Array.from({ length: Math.ceil(totalDocuments / 10 ) }, (_, index ) => (
                            <li class="page-item" key={index}>
                                <button 
                                    class="page-link"
                                    onClick={() => handlePageChange(index)}
                                    disabled={index === currentPage}>
                                        { index + 1 }
                                </button>
                            </li>
                        ))}
                        
                        <li class="page-item">
                            <button 
                                class="page-link" 
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={(currentPage + 1 ) * 10 >= totalDocuments}>
                                    Siguiente
                            </button>
                        </li>
                    </ul>
                </nav>
                <hr/>
            </div>
        </section>
    )
}