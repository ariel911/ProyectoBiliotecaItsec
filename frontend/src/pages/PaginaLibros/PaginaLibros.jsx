import axios from 'axios';
import './PaginaLibros.css'

import imagenCircular from '../../assets/imgCirular.webp'
import React, { useState, useEffect } from 'react';
import lunr from 'lunr';


import logo from "../../assets/logo2.png";

const PaginaLibros = () => {
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]); // Almacena los resultados de la búsqueda
    const [documentos, setDocumentos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDocumento2, setSelectedDocumento2] = useState(null);
    const [show, setShow] = useState(false); // Estado para controlar la visibilidad del modal
    const [selectedDocumento, setSelectedDocumento] = useState(null);

    const [fecha_reserva, setFecha_reserva] = useState(null);
    const [fecha_validez, setFecha_validez] = useState(null);
    const nombrePersona = localStorage.getItem('nombrePersona');
    const personaId = localStorage.getItem('idPersona');
    useEffect(() => {
        handleGetDocuments();
        const getCurrentDateTime = (daysToAdd = 0) => {
            const now = new Date();
            now.setDate(now.getDate() + daysToAdd); // Agregar los días necesarios
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day}T${hours}:${minutes}`;
        };
        // Establece la fecha actual en `fecha_reserva`
        setFecha_reserva(getCurrentDateTime());

        // Establece la fecha de validez un día después en `fecha_validez`
        setFecha_validez(getCurrentDateTime(1));
    }, []);
    const handleGetDocuments = async () => {
        const res = await axios.get('http://localhost:8000/api/documento',
            {
                /* headers: {
                  Authorization: `Bearer ${token}`
                } */
            }
        );

        setDocumentos(res.data.data.documentos);
        setSearchResults(res.data.data.documentos)
    };
    console.log('doc:',documentos)
    var idx = lunr(function () {
        this.field('id')
        this.field('title')
        this.field('descripcion')
        this.field('autores')
        this.field('tipo_doc')
        this.field('area')
        this.field('formato')
        this.field('carrera')


        documentos?.map((document, ind) =>
            this.add({
                "id": document.id,
                "title": document?.titulo,
                "descripcion": document?.descripcion,
                "autores": document?.documento_autors[0]?.autor?.nombre,
                "tipo_doc": document?.tipo_doc?.nombre,
                "area": document?.area?.nombre,
                "formato": document?.formato?.nombre,
                "carrera": document?.carrera?.nombre,
            })
        );
    })


    const encontrado = [];

    const handleReserva = async () => {

        try {
            if (selectedDocumento2.cantidad > 0) {

                // Send the lending request to the server
                await axios({
                    url: 'http://localhost:8000/reservas/reserva',
                    method: 'POST',

                    data: {
                        fecha_reserva: fecha_reserva,
                        fecha_validez: fecha_validez,
                        estado: 1,
                        personaId: personaId,
                        documentoId: selectedDocumento2.id,
                    }
                });
                setFecha_reserva(null)
                setFecha_validez(null)
                setShow(false);

                swal({
                    title: "Documento reservado con Exito!",
                    icon: "success",
                    button: "Ok",
                });
            } else {
                swal({
                    title: "Ya no se tiene Ejemplares!",
                    text: "La cantidad de ejemplares que se tiene es 0",
                    icon: "error",
                    button: "Ok",
                });
            }
        } catch (error) {

            console.error(error);
            swal({
                title: "Error al reservar Documento!",
                icon: "error",
                button: "Ok",
            });
        }
    };


    const handleChange = (event) => {
        const text = event.target.value;
        setSearchText(text);

        // Realiza la búsqueda en función del texto ingresado (puedes usar una función de búsqueda o llamar a una API aquí)
        // Por ahora, simplemente vamos a simular algunos resultados de búsqueda
        const results = simulateSearch(text);

        setSearchResults(results);
    };
    const handleLogOut = () => {
        localStorage.removeItem("datos1");
    }
    // Función de simulación de búsqueda (puedes reemplazarla con tu lógica de búsqueda real)
    const simulateSearch = (text) => {
        // Simulación de búsqueda en base al texto ingresado
        const aqui = idx.search(text)
        for (let clave of aqui) {
            const objetoEncontrado = documentos.find(objeto => objeto.id == clave.ref);
            if (objetoEncontrado) {
                encontrado.push(objetoEncontrado);
            }
        }
        return encontrado;
    };
    const filteredResults = searchResults.filter(documento =>
        documento.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        documento?.documento_autors[0]?.autor?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        documento?.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        documento?.carrera?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        documento?.area?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const handleShow = (documento) => {
        setSelectedDocumento(documento);
        /*       setSelectedDocumento2(documento); */
        setShow(true);
    };
    const handleShow2 = (documento) => {
        setSelectedDocumento2(documento);
        /*       setSelectedDocumento2(documento); */
        setShow(true);
    };
    // Función para cerrar el modal
    const handleClose = () => {
        setShow(false);
        setSelectedDocumento(null); // Limpiar el documento seleccionado
        /*         setSelectedDocumento2(null); // Limpiar el documento seleccionado */
    };
    return (
        <div className='contenedor3'>
            <nav className='nav2'>
                <img src={logo} className='logo7' />
                <div>
                    <div className='elementoLink'>
                        <div  >
                            <img src={imagenCircular} className='imagenCircular4' alt='hi' />
                        </div>
                        <div className='flex'>
                            <ul className={`submenuPerfil `} id="subMenu">
                                <li className='perfilLink' >
                                    <a type='submit' className='buttonLogout'>Configuracion</a>
                                </li>
                                <li className='perfilLink'>
                                    <a type='button' href='/ac' className='buttonLogout' >Cerrar Sesion</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="buscaPagina">
                <h1 className='tituloLi'>Documentos de la Biblioteca</h1>
                <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active" data-bs-toggle="tab" href="#libros" role="tab">Libros</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="tab" href="#proyectos" role="tab">Proyectos de grado</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="tab" href="#Documento Academico" role="tab">Documento Academico</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="tab" href="#otros" role="tab">Otros</a>
                    </li>
                </ul>

                <input type="text" className="form-control BuscarPaginaLibros " placeholder="Buscar por título, autor o área..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />

                <div className='tab-content'>
                    <div className="busca5 tab-pane fade show active " role="tabpanel" id='libros'>
                        {/* Cuadro de scroll para las tarjetas */}
                        <div className="d-flex  flex-wrap  librosTarjetas" style={{ overflowY: 'scroll' }} >
                            {filteredResults.map((documento) => documento.tipo_doc.nombre == 'Libro' && (
                                <div className="card mb-3 " key={documento.id} style={{ height: '400px', width: '240px', margin: '10px' }}>
                                    {/* Imagen del documento */}
                                    <div style={{ height: '280px', width: '237.5px'  }} >
                                        <img
                                            src={documento.imagen} // Aquí utilizamos la ruta del documento
                                            alt={documento.titulo}
                                            style={{ height: '280px', width: '100%', objectFit: 'fill' ,margin:'auto'}} // Ajuste del tamaño de la imagen
                                            className="card-img-top"
                                        />
                                    </div>
                                    <div className="card-body d-flex justify-content-around flex-column">
                                        <h5 className="card-title">{documento.titulo}</h5>
                                        {/* Botones de Reservar y Ver detalles */}
                                        <div className="d-flex justify-content-between">
                                            <button className="btn btn-primary" onClick={() => handleShow2(documento)}>
                                                Reservar
                                            </button>
                                            <button className="btn btn-secondary" onClick={() => handleShow(documento)}>
                                                Ver detalles
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Documento Academico */}
                    <div className="busca5 tab-pane fade " role="tabpanel" id='proyectos'>
                        <div className="d-flex flex-wrap librosTarjetas" style={{ overflowY: 'scroll' }} >
                            {filteredResults.map((documento) => documento.tipo_doc.nombre == 'Documento Academico' && (
                                <div className="card mb-3" key={documento.id} style={{ height: '400px', width: '240px', margin: '10px' }}>
                                    {/* Imagen del documento */}
                                    <div style={{ height: '280px', width: '237.5px' }} >
                                        <img
                                            src={documento.imagen} // Aquí utilizamos la ruta del documento
                                            alt={documento.titulo}
                                            style={{ height: '280px', width: '100%', objectFit: 'fill' }} // Ajuste del tamaño de la imagen
                                            className="card-img-top"
                                        />
                                    </div>
                                    <div className="card-body d-flex justify-content-around flex-column">
                                        <h5 className="card-title">{documento.titulo}</h5>
                                        {/* Botones de Reservar y Ver detalles */}
                                        <div className="d-flex justify-content-between">
                                            <button className="btn btn-primary" onClick={() => handleShow2(documento)}>
                                                Reservar
                                            </button>
                                            <button className="btn btn-secondary" onClick={() => handleShow(documento)}>
                                                Ver detalles
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="busca5 tab-pane fade" role="tabpanel" id='Documento Academico'>
                        <div className="d-flex flex-wrap  librosTarjetas" style={{ overflowY: 'scroll' }} >
                            {filteredResults.map((documento) => documento.tipo_doc.nombre == 'documento academico' && (
                                <div className="card mb-3" key={documento.id} style={{ height: '400px', width: '250px', margin: '10px' }}>
                                    {/* Imagen del documento */}
                                    <img
                                        src={documento.imagen} // Aquí utilizamos la ruta del documento
                                        alt={documento.titulo}
                                        style={{ height: '300px', objectFit: 'cover', width: '100%' }} // Ajuste del tamaño de la imagen
                                        className="card-img-top"
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{documento.titulo}</h5>
                                        {/* Botones de Reservar y Ver detalles */}
                                        <div className="d-flex justify-content-between">
                                            <button className="btn btn-primary" onClick={() => handleShow2(documento)}>
                                                Reservar
                                            </button>
                                            <button className="btn btn-secondary" onClick={() => handleShow(documento)}>
                                                Ver detalles
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Modal para mostrar detalles */}
                    {selectedDocumento && (
                        <div
                            className={`modal fade ${show ? 'show' : ''}`}
                            tabIndex="-1"
                            role="dialog"
                            style={{ display: show ? 'block' : 'none', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                        >
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">{selectedDocumento.titulo}</h5>
                                        <button
                                            type="button"
                                            className="close"
                                            onClick={handleClose} // No necesitas usar `this` aquí
                                            aria-label="Close"
                                        >
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <p>
                                            <strong>Formato:</strong> {selectedDocumento?.titulo}

                                        </p>
                                        <p>
                                            <strong>Formato:</strong> {selectedDocumento?.descripcion}

                                        </p>
                                        <p>
                                            <strong>Autor(es):</strong>{' '}
                                            {selectedDocumento.documento_autors
                                                .map((autor) => autor.autor.nombre)
                                                .join(', ')}
                                        </p>
                                        <p>
                                            <strong>Formato:</strong> {selectedDocumento?.formato?.nombre}

                                        </p>
                                        <p>
                                            <strong>Cantidad:</strong> {selectedDocumento?.cantidad}

                                        </p>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={handleClose} // No necesitas usar `this` aquí
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Modal para mostrar el formulario de reserva */}
                    {selectedDocumento2 && (
                        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Reservar: {selectedDocumento2.titulo}</h5>
                                        <button
                                            type="button"
                                            className="close"
                                            onClick={() => setSelectedDocumento2(null)}
                                        >
                                            <span>&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="form-group">
                                                <label>Nombre</label>
                                                <input type="text" className="form-control" value={nombrePersona} />
                                            </div>
                                            <div className="form-group">
                                                <label>Fecha de reserva</label>
                                                <input type="datetime-local" className="form-control" value={fecha_reserva?.slice(0, 16)} />
                                            </div>
                                            <div className="form-group">
                                                <label>fecha validez</label>
                                                <input type="datetime-local" className="form-control" value={fecha_validez?.slice(0, 16)}></input>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={() => setSelectedDocumento2(null)}
                                        >
                                            Cerrar
                                        </button>
                                        <button type="submit" className="btn btn-primary" onClick={handleReserva}>Confirmar Reserva</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                </div>
            </div>
        </div>

    )
}

export default PaginaLibros
