import '../../style/Inicio.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useCallback, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import api from '../../services/api';
import doctesis from '../../assets/images/doc_tesis.png';
import 'react-loading-skeleton/dist/skeleton.css';
import DocumentSkeleton from '../Skeleton/DocumentSkeleton';
import Errors from '../Errors';
import { FaChevronCircleLeft, FaChevronCircleRight, FaCog } from 'react-icons/fa';
import { format } from 'date-fns';

export default function Inicio() {

    // filtro basico para categoria
    const [categoria, setCategoria] = useState('');

    const [resumen, setResumen] = useState('');

    // filtros avanzados
    const [filtrosAvanzados, setFiltrosAvanzados] = useState([{ campo: 'TITULO', condicion: 'CONTAINT', valor: '' }]);


    // Definiendo variables para el funcionamiento de muestra de filtros
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    const [limit, setLimit] = useState(10);

    // documentos list
    const [documentos, setDocumentos] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(false);

    // tipo de documento categorias
    const [categorias, setCategorias] = useState([]);

    // paginacion de documentos
    const [currentPage, setCurrentPage] = useState(0); // Página actual
    const [totalDocuments, setTotalDocuments] = useState(0); // Total de documentos

    // order
    const [orden, setOrden] = useState('relevancia');

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
          
        } catch (error) {
          setError(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDocumentos = useCallback(async (page = 0, limit = 10 ) => {
      
        try {
            setLoading(true);
            const response = await api.get(`/documentos/all/paginations`, { 
                params: { page, limit }
            });
            const documentsData = Array.isArray(response.data) ? response.data : [];

            setDocumentos(documentsData);

            setTotalDocuments(parseInt(response.headers['x-total-count'], 10));

        } catch (error) {
            setError(error?.response?.data?.message);
        } finally {
            setLoading(false);
        }

    }, []);

    useEffect(() => {
        fetchDocumentos(currentPage);
        fetchCategorias();
    }, [fetchDocumentos, fetchCategorias, currentPage]);

    const construirCriteriosBusqueda = (esAvanzado) => {
        const criterios = [];

        if (categoria) {
            criterios.push({ searchKey: "CATEGORIAID", searchValue: categoria || '', operator: "EQUALS" });
        }

        if (resumen) {
            criterios.push({ searchKey: "RESUMEN", searchValue: resumen || '', operator: "CONTAINT" });
        }

        if (esAvanzado) {
            filtrosAvanzados.forEach(filtro => {
                if (filtro.campo && filtro.valor) {
                    criterios.push({
                        searchKey: filtro.campo,
                        searchValue: filtro.valor || '',
                        operator: filtro.condicion
                    });
                }
            });
        }

        return { searchCriteria: criterios };
    }

     const handleSearchBasic = async () => {

        setLoading(true); 

        setTimeout(async () => {

            try {
                
                const searchCriteria = construirCriteriosBusqueda(false);
                
                const response = await api.post(`/documentos/document`, searchCriteria );

                setDocumentos(response.data);

                setTotalDocuments(response.data.length);

            } catch (error) {
                setError(error?.response?.data?.message);
            } finally {
                setLoading(false);
            }
        }, 2000); 
    };

    // funcion paginacion
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        fetchDocumentos(pageNumber, limit);
    }

    // start andvanc filters
    const aplicarFiltros = async () => {

        setLoading(true);

        setTimeout( async () => {

            try {
                
                const searchCriteria = construirCriteriosBusqueda(true);

                const response = await api.post(`/documentos/document`, searchCriteria  );
    
                setDocumentos(response.data);
                setTotalDocuments(response.data.length);
    
            } catch (error) {
                setError(error?.response?.data?.message);
            } finally {
                setLoading(false);
            }    
        }, 2000);
        
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
        setFiltrosAvanzados([...filtrosAvanzados, { campo: 'TITULO', condicion: 'CONTAINT', valor: '' }]);
    };

  
    const eliminarFiltro = (index) => {
        const nuevoFiltros = filtrosAvanzados.filter((_, i) => i !== index);
        setFiltrosAvanzados(nuevoFiltros);
    } 

    const restaurarElementos = () => {
        setFiltrosAvanzados([{ campo: 'TITULO', condicion: 'CONTAINT', valor: '' }]);
        setCategoria('');
        setResumen('');
    };

    const ordenarDocumentos = (documentos, criterio) => {
        switch (criterio) {
            case 'titulo_asc':
                return [...documentos].sort((a, b) => a.titulo.localeCompare(b.titulo));
            case 'titulo_desc':
                return [...documentos].sort((a, b) => b.titulo.localeCompare(a.titulo));
            case 'fecha_asc':
                return [...documentos].sort((a, b) => a.fecha_publicacion.localeCompare(b.fecha_publicacion));
            case 'fecha_desc':
                return [...documentos].sort((a, b) => b.fecha_publicacion.localeCompare(a.fecha_publicacion));
            case 'relevancia':
                return documentos;
            default:
                return documentos;
        }
    };

    const handleOrdenChange = (criterio) => {
        setOrden(criterio);
        setCurrentPage(0);
        fetchDocumentos(0, limit);
       
    };

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setCurrentPage(0);
        fetchDocumentos(currentPage, newLimit);
    };

    const highlightMatch = (text, keyword) => {
        if (!keyword) return text;
        const regex = new RegExp(`(${keyword})`, 'gi');
        return text.replace(regex, '<strong>$1</strong>');
    };

     if (error) {
        return <Errors message={error} />
    }

    return (
        <section>
            <div className="container p-2">
                <h3 className='text-start'>Buscar</h3>
                <hr/>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <select className="form-select input_btn border border-grey-1" aria-label="Default select example"
                        value={categoria}
                        onChange={handleCategoriaChange}
                        >
                            <option value="">Todo el repositorio</option>
                            {categorias.map((catego) => (
                                <option key={catego.id} value={catego.id}>
                                    {catego.nombreCategoria}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-8 primero">
                        <div className="input-group mb-3">
                            <input type="text" 
                            className="form-control controlador input_btn border border-grey-1" placeholder="Ingresar su búsqueda por resumen"
                            value={resumen}
                            onChange={handleBusquedaChange}/>

                            <button className="btn button_page_filters btn-outline-secondary" onClick={(e)=> handleSearchBasic(e)} type="button" >
                                <i className="bi bi-search"></i>
                            </button>
                        </div>

                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-link"  onClick={cambioEstado}>
                            {mostrarFiltros ? 'Ocultar filtros' : 'Mostrar filtros'}  
                        </button>
                    </div>
                </div>
            </div>
            {mostrarFiltros && (
            <div className="container mt-3" >
                <div className="row">
                    <h4 className='text-start'>Filtros</h4>
                    <p>Use los siguientes criterios para mejorar sus resultados</p>
                </div>
                <div id="contenedor">

                    {filtrosAvanzados.map((filtro, index) => 

                    <div className="row elemento" key={index}>
                        <div className="col-md-3">
                            <select className="form-select input_btn border border-grey-1" aria-label="Campo" 
                            value={filtro.campo}
                            onChange={(e) => handleFiltroChange(index, 'campo', e.target.value )} >
                                <option value="TITULO">Título</option>
                                <option value="AUTORES">Autor</option>
                                <option value="ASESOR">Asesor</option>
                                <option value="FECHA_PUBLICACION">Fecha</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <select className="form-select input_btn border border-grey-1" aria-label="Condicion"
                            value={filtro.condicion}
                            onChange={(e) => handleFiltroChange(index, 'condicion', e.target.value )}>
                                <option value="CONTAINT">Contiene</option>
                                <option value="NOT_CONTAINT">No contiene</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <div className="input-group mb-3">
                                <input type="text" className="form-control input_btn border border-grey-1" 
                                placeholder="Ingresar su búsqueda" 
                                value={filtro.valor}
                                onChange={(e) => handleFiltroChange(index, 'valor', e.target.value )}
                               />

                                <button className="btn button_page_filters btn-outline-secondary" 
                                onClick={agregarFiltro}   type="button">
                                    <i class="bi bi-plus-circle"></i>
                                </button>
                                <button className="btn button_page_filters btn-outline-secondary" 
                                onClick={() => eliminarFiltro(index)} disabled={filtrosAvanzados.length === 1} 
                                 type="button">
                                    <i className="bi bi-dash-circle"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                </div>
                <div className="col-md-3">
                    <button className="btn button_page_filter btn-grey border" onClick={restaurarElementos}>Restaurar</button>
                    <button className="btn button_page_filter btn-grey border" onClick={(e)=> aplicarFiltros(e)}>Aplicar</button>
                </div>
            </div>
            )}

             {/* Resultados de listado para documentos */}

            <div className="container mt-5">
            <div className="row">
            <div className='col-6'>
                <p>
                    Mostrando items {currentPage * limit + 1 }-
                    {Math.min((currentPage + 1 ) * limit, totalDocuments)} de {totalDocuments}
                </p>
                </div>
                <div className="col-6">
                    <div className="d-flex justify-content-end">
                    <button 
                    className="btn button_page_filters border border-grey-1"
                    type="button"
                    id="dropdownMenuButton" 
                    data-bs-toggle="dropdown" 
                    >
                      <FaCog/>
                    </button>

                    {/* Contenido del Dropdown */ }
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <li class="dropdown-header">Opciones de clasificación:</li>
                        <li>
                            <button className={`dropdown-item ${orden === 'relevancia' ? 'active' : ''}`} 
                                onClick={() => handleOrdenChange('relevancia')}>
                                Relevancia
                            </button>
                        </li>
                        <li>
                            <button className={`dropdown-item ${orden === 'titulo_asc' ? 'active' : ''}`} 
                                onClick={() => handleOrdenChange('titulo_asc')}>
                                Título Asc
                            </button>
                        </li>
                        <li>
                             <button className={`dropdown-item ${orden === 'titulo_desc' ? 'active' : ''}`} 
                                onClick={() => handleOrdenChange('titulo_desc')}>
                                Título Desc
                             </button>
                        </li>
                        <li>
                            <button className={`dropdown-item ${orden === 'fecha_asc' ? 'active' : ''}`} 
                                onClick={() => handleOrdenChange('fecha_asc')}>
                                Fecha Asc
                            </button>
                        </li>
                        <li>
                             <button className={`dropdown-item ${orden === 'fecha_desc' ? 'active' : ''}`} 
                                onClick={() => handleOrdenChange('fecha_desc')}>
                                Fecha Desc
                             </button>
                        </li>
                        <li>
                            <hr class="dropdown-divider"/>
                        </li>
                        <li class="dropdown-header">Resultados por página:</li>
                        <li>
                            <button className={`dropdown-item ${limit === 5 ? 'active' : ''}`} 
                               onClick={() => handleLimitChange(5)}>
                                5 
                            </button>
                        </li>
                        <li>
                            <button className={`dropdown-item ${limit === 10 ? 'active' : ''}`} 
                               onClick={() => handleLimitChange(10)}>
                                10 
                            </button>
                        </li>
                        <li>
                            <button className={`dropdown-item ${limit === 20 ? 'active' : ''}`} 
                               onClick={() => handleLimitChange(20)}>
                                20 
                            </button>
                        </li>
                    </ul>
                    </div>

                </div>
                    {loading ? (
                        Array(10).fill().map((_, index) => <DocumentSkeleton key={index} />)
                    ) : (
                        ordenarDocumentos(documentos, orden).map((documento, index) => (
                            <div className="row" key={index}>
                                <div className="col-md-3 mt-4">
                                    <Link to={`/detalle/${documento.id}`}>
                                        {documento.thumbnail_link ? (
                                            <img
                                                className="imgdocumento"
                                                src={documento.thumbnail_link || doctesis}
                                                alt={`${documento.titulo}`}
                                                width={"240px"}
                                                height={"240px"}
                                            />
                                        ) : (
                                            <img
                                                className="imgdocumento"
                                                src={doctesis}
                                                alt={`${documento.titulo}`}
                                                width={"240px"}
                                                height={"240px"}
                                            />
                                        )}
                                    </Link>
                                </div>
                                <div className="col-md-9 mt-4">
                                    <Link to={`/detalle/${documento.id}`} className='documento_title_inicio'><strong>{documento.titulo}</strong></Link>
                                    <p>{documento.autores} (Instituto de Educación Superior Privado Tecsup, {format(new Date(documento.fecha_publicacion), 'yyyy-MM-dd')})</p>
                                    <p className="texto-resumen text-justify"
                                    dangerouslySetInnerHTML={{
                                        __html: highlightMatch(documento.resumen, resumen),
                                    }}>
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <nav aria-label="Page navigation">
                    <ul className="pagination">
                        <li className="page-item">
                            <button 
                                className="page-link " 
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 0}>
                                 <FaChevronCircleLeft/>
                            </button>
                        </li>

                        {Array.from({ length: Math.ceil(totalDocuments / limit ) }, (_, index ) => (
                            <li 
                            className={`page-item ${index === currentPage ? 'active' : ''}`}
                            key={index}>
                                <button 
                                    class="page-link"
                                    onClick={() => handlePageChange(index)}
                                    disabled={index === currentPage}>
                                        { index + 1 }
                                </button>
                            </li>
                        ))}
                        
                        <li className="page-item">
                            <button 
                                className="page-link" 
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={(currentPage + 1 ) * limit >= totalDocuments}>
                                    <FaChevronCircleRight/>
                            </button>
                        </li>
                    </ul>
                </nav>
                <hr/>
            </div>
        </section>
    )
}