import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

export default function ListDocumentos() {

    const navigate = useNavigate();

    const [documento, setDocumento] = useState([]);
    const [recuperadoDocumento, setRecuperadoDocumento] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    

    // Constante que permite pasar como parametro el id para el udpate del documento
    const handleEdit = (id) => {
        navigate(`/editarDocumento/${id}`);
    }

    // Constante que permite pasar como parametro el id para eliminar del documento
    const handleDeleteDocumento = (id) => {
        navigate(`/deleteDocumento/${id}`);
    }


    // Segunda forma de recoger data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/documentos');
                const data = await response.json();
                setDocumento(data);
                console.log(data);
                setRecuperadoDocumento(true);
                setSearchResults(data);
            } catch (error) {
                console.error('Error fectching data:', error);
            }
        };
        fetchData();
    }, []);


    // Funcionalidad que permite la busqueda de documentos
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        const results = documento.filter(documento => {
            const titulo = documento.titulo ? documento.titulo.toLowerCase() : '';
            const autores = documento.autores ? documento.autores.toLowerCase() : '';
            const resumen = documento.resumen ? documento.resumen.toLowerCase() : '';
            const asesor = documento.asesor ? documento.asesor.toLowerCase() : '';
            const categoria = documento.categoria ? documento.categoria.toLowerCase() : '';
            const tema = documento.tema ? documento.tema.toLowerCase() : '';
            
            return (
                titulo.includes(event.target.value.toLowerCase()) ||
                autores.includes(event.target.value.toLowerCase()) ||
                resumen.includes(event.target.value.toLowerCase()) ||
                asesor.includes(event.target.value.toLowerCase()) ||
                categoria.includes(event.target.value.toLowerCase()) ||
                tema.includes(event.target.value.toLowerCase())
            );
        });
        setSearchResults(results);
    }

/*
    // Funcionalida que permite eliminar un documento por su ID
    const handleDelete = async (id) => {

        Swal.fire({
            title: 'Estás seguro?',
            text: '!No podrás revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`http://localhost:8080/api/documentos/${id}`);
        
                    const response = await axios.get('http://localhost:8080/api/documentos');
        
                    setSearchResults(response.data);

                    handleSearch( { target: { value: searchTerm } })
                    navigate('/listadoDocumento');
                    Swal.fire(
                        '!Eliminado!',
                        'El documento ha sido eliminado correctamente.',
                        'success'
                    );
                } catch (error) {
                    console.log("Error al eliminar el documento: ", error);
                } 
            }
        })
    }

    const handleEliminar = async (id) => {

        Swal.fire({
            title: 'Estás seguro?',
            text: '!No podrás revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`http://localhost:8080/api/documentos/${id}`, {
                        method: 'DELETE',
                    });
        
                    if (response.ok) {
                        navigate('/listadoDocumento');
                        setSearchResults(searchResults.filter((documento) => documento.id !== id));
                        console.log(searchResults);

                        handleSearch( { target: { value: searchTerm } })
                        Swal.fire(
                            '!Eliminado!',
                            'El documento ha sido eliminado correctamente.',
                            'success'
                        );
                    } else {
                        console.error('Error deleting documento:', response.statusText);
                    }
                } catch (error) {
                    console.error('Error deleting document:', error);
                }
            }
        })
    }
*/
    const mostrarTabla = () => {
        console.log("Renderiazando tabla...");
        return (
        <table className="table table-striped table-bordered text-center">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>TÍTULO</th>
                            <th>AUTORES</th>
                            <th>RESUMEN</th>
                            <th>AÑO PUBLICADO</th>
                            <th>ASESOR</th>
                            <th>CATEGORÍA</th>
                            <th>TEMA</th>
                            <th>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        { searchResults.map(doc => (
                                <tr key={doc.id}>
                                    <td>{doc.id}</td>
                                    <td>{doc.titulo}</td>
                                    <td>{doc.autores}</td>
                                    <td>{doc.resumen}</td>
                                    <td>{doc.anioPublicacion}</td>
                                    <td>{doc.asesor}</td>
                                    <td>{doc.categoria}</td>
                                    <td>{doc.tema}</td>
                                    <td>
                                        <button 
                                        onClick={() => handleDeleteDocumento(doc.id)} 
                                        className="btn btn-sm btn-danger me-2">
                                            <i class="bi bi-archive-fill"></i>
                                        </button>
                                        <button
                                        onClick={() => handleEdit(doc.id)} 
                                        className="btn btn-sm btn-info">
                                            <i class="bi bi-pencil-square"></i>
                                        </button>
                                    </td>
                                </tr>
                        ))}
                    </tbody>
                </table>
    )
    }
    return (
        <section>
            <div className="container p-3">
                <h2>Listado de documentos</h2>
                <hr/>
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Búsqueda de documento"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            <div className="d-flex justify-content-start align-items-center">
                
                <div>
                    <Link to={'/createDocumento'} className="btn btn-gray border">Nuevo Documento</Link>
                </div>
            </div>
            <div className="mt-3">
            {recuperadoDocumento ? (
                mostrarTabla()
            ) : (
                <div className="text-center mt-4">Recuperando datos...</div>
            )}
            </div>
            </div>
        </section>
    )
}
