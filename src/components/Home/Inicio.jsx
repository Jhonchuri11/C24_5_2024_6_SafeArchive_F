import '../../style/Inicio.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import doctesis from '../../assets/images/doc_tesis.png';
import React, { useState } from "react";
import { Link } from 'react-router-dom';

export default function Inicio() {
    // Definiendo variables para el funcionamiento de muestra de filtros
    const [mostrarFiltros, setMostrarFiltros] = useState(false);


    const cambioEstado = () => {
        setMostrarFiltros(!mostrarFiltros);
    };


    // Funcionalidad para agregar nuevo elemento
    const agregarElemento = () => {
        // Primero clonamos el primer elemento y agregamos lo nuevo como clon al contenedor
        var contenedor = document.getElementById("contenedor");
        var elementoOriginal = contenedor.querySelectorAll('.elemento');
        var nuevoElemento = elementoOriginal[0].cloneNode(true);

        // Limpiamos el input de nuevo elemento
        var inputs = nuevoElemento.querySelectorAll('input');
        inputs.forEach( input => {
            input.value = '';
        });

        // Eliminamos el atributo id del nuevo elemento
        nuevoElemento.removeAttribute('id');

        // Agregamos el nuevo elemento
        contenedor.appendChild(nuevoElemento);
    };

    // Funcionalidad para eliminar elemento
    const eliminarElemento = () => {
        var contenedor = document.getElementById("contenedor");
        var elementos = contenedor.querySelectorAll('.elemento');

        if (elementos.length > 0 ) {

            if (elementos.length > 1 ) {
                contenedor.removeChild(elementos[elementos.length - 1]);

            } else {
                var inputs = elementos[0].querySelectorAll('input');
                inputs.forEach(input => {
                input.value = '';
            });
            }
        }
    };

    const restaurarElementos = () => {
        var contenedor = document.getElementById("contenedor");
        var elementos = contenedor.querySelectorAll('.elemento');
    
        // Eliminar todos los elementos, excepto el primero
        for (let i = elementos.length - 1; i > 0; i--) {
            contenedor.removeChild(elementos[i]);
        }
    
        // Limpiar los inputs del primer elemento
        var inputs = elementos[0].querySelectorAll('input');
        inputs.forEach(input => {
            input.value = '';
        });
    };

    return (
        <section>
            <div className="container p-2">
                <h2>Buscar</h2>
                <hr/>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <select name="" id="" className="form-select" aria-label="Default select example">
                            <option selected>Todos</option>
                            <option value="1">1. Proyectos Integradores</option>
                            <option value="2">2. Pretesis</option>
                            <option value="3">3. Tesis</option>
                        </select>
                    </div>
                    <div className="col-md-8 primero">
                        <div className="input-group mb-3">
                            <input type="text" class="form-control controlador" placeholder="Ingresar su búsqueda"/>
                            <a href="#" class="btn btn-outline-secondary" type="button">
                                <i className="bi bi-search"></i>
                            </a>
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
                    <div className="row elemento">
                        <div className="col-md-3">
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
                                <button class="btn btn-outline-secondary" onClick={agregarElemento}   type="button">
                                    <i class="bi bi-plus-circle"></i>
                                </button>
                                <button class="btn btn-outline-secondary" onClick={eliminarElemento}  type="button">
                                    <i class="bi bi-dash-circle"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                  
                </div>
                <div class="col-md-3">
                    <button className='btn btn-grey border' onClick={restaurarElementos}>Restaurar</button>
                    <button class="btn btn-grey border">Aplicar</button>
                </div>
            </div>
            )}
            <div className="container mt-3">
                <p>Mostrando items 1-2 de 200</p>
                <div className="row">
                    <div className="col-md-3 mt-4">
                        <img className="imgdocumento" src={doctesis} width={"240px"} height={"240px"}/>
                    </div>
                    <div className="col-md-9 mt-4">
                        <Link to='/detalle' className='documento'>La implementación de un proceso con estructura monitoria en el Perú como vía idónea para garantizar la autonomía, el derecho a la igualdad y no discriminación de las personas con discapacidad </Link>
                        <p>Ancalle Gonzáles, Celene Lorenza; Bendezú Medina, Samuel Hernán (Pontificia Universidad Católica del Perú, 2017-02-15)</p>
                        <p class="text-justify">José de Saramago, escritor luso, Premio Nobel de Literatura, en su célebre novela “Ensayo sobre la ceguera” (1995), nos narra la historia de una fulminante epidemia, que surge de manera inopinada en una ciudad sin nombre, ...</p>
                    </div>
                    <div className="col-md-3 mt-4">
                        <img className="imgdocumento" src={doctesis} width={"240px"} height={"240px"}/>
                    </div>
                    <div className="col-md-9 mt-4">
                    <Link to='/detalle' className='documento'>La implementación de un proceso con estructura monitoria en el Perú como vía idónea para garantizar la autonomía, el derecho a la igualdad y no discriminación de las personas con discapacidad </Link>
                        <Link to='/detalle' className='documento'>Segundo</Link>
                        <p>Ancalle Gonzáles, Celene Lorenza; Bendezú Medina, Samuel Hernán (Pontificia Universidad Católica del Perú, 2017-02-15)</p>
                        <p class="text-justify">José de Saramago, escritor luso, Premio Nobel de Literatura, en su célebre novela “Ensayo sobre la ceguera” (1995), nos narra la historia de una fulminante epidemia, que surge de manera inopinada en una ciudad sin nombre, ...</p>
                    </div>
                </div>
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