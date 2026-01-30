import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import Select from 'react-select';
import lunr from 'lunr';
import { useDropzone } from 'react-dropzone';
import "./documento.css"
const documento = () => {
    /* const token = localStorage.getItem('token'); */
    const [carr, setCarr] = useState(0);
    const [format, setFormat] = useState(0);
    const [tipodoc, setTipodoc] = useState(0);
    const [are, setAre] = useState(0);
    const [imagen, setImagen] = useState(null);
    const [titulo, setTitulo] = useState('');
    const [cantidad, setCantidad] = useState(0);
    const [descripcion, setDescripcion] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [codigo, setCodigo] = useState('');
    const [gestion, setGestion] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const idUsuario = localStorage.getItem('id');
    const [estudiantes, setEstudiantes] = useState([]);
    //const [autores, setAutores] = useState('');
    //buscador
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]); // Almacena los resultados de la búsqueda
    const [searchTerm, setSearchTerm] = useState('');
    const [areas, setAreas] = useState([]);
    const [todosAutores, setTodosAutores] = useState([]);
    const [tiposDocumento, setTiposDocumento] = useState([]);
    const [documentos, setDocumentos] = useState([]);
    const [selectedDocumento, setSelectedDocumento] = useState(null);
    const [carreras, setCarreras] = useState([]);
    const [selecteDocument, setSelecteDocument] = useState(null);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: 'image/*',
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                setImagen(acceptedFiles[0]); // Guarda el archivo en el estado
            }
        },
    });
    useEffect(() => {
        // Obtener la lista de documentoes al cargar el componente
        if (selecteDocument) {
            document.getElementById('titulo2').value = selecteDocument?.titulo || '';
            document.getElementById('descripcion2').value = selecteDocument?.descripcion || '';
            document.getElementById('ubicacion2').value = selecteDocument?.ubicacion || '';
            document.getElementById('codigo2').value = selecteDocument?.codigo || '';
            document.getElementById('cantidad2').value = selecteDocument?.cantidad || '';
            /*        document.getElementById('area2').value = selecteDocument?.area?.id || null; */
        }
        handleGetDocuments();

    }, [selecteDocument]);

    useEffect(() => {
        // Obtener la lista de documentoes al cargar el componente
        handleGetDocuments();
        fetchTiposDocumento();
        handleGetEstudiantes();
        getCarreras();

        /*     getArea(); */
        getAutores();

    }, []);
    const handleGetEstudiantes = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/persona');
            const list = res.data.data.personas || [];
            setEstudiantes(list);
        } catch (err) {
            console.error('Error cargando estudiantes', err);
        }
    };

    const handleDarReintegrar = async (document) => {
        // Restablecer los campos del formulario
        await axios({
            url: `http://localhost:8000/api/documento/baja/${document}`,
            method: "PUT",
            data: {
                estado: 1,

            },
        }).then((response) => {
            // Accede a la respuesta de la API
            console.log("Respuesta de la API:", response.data);
        });
        swal({
            title: "documento reintegrado!",
            /* text: "Por favor, completa todos los campos requeridos", */
            icon: "success",
            button: "Ok",
        });
        handleGetDocuments();
    }
    const handleDarBaja = async (document) => {
        await axios({
            url: `http://localhost:8000/api/documento/baja/${document}`,
            method: "PUT",
            data: {
                estado: 0,
            },
        }).then((response) => {
            // Accede a la respuesta de la API
            console.log("Respuesta de la API:", response.data);
        });
        handleGetDocuments();
        swal({
            title: "documento dado de baja!",
            /* text: "Por favor, completa todos los campos requeridos", */
            icon: "success",
            button: "Ok",
        });
    }
    const handleEdit = async (e) => {
        e.preventDefault();
        await axios({
            url: `http://localhost:8000/api/documento/${selecteDocument.id}`,
            method: "PUT",
            data: {
                titulo: document.getElementById('titulo2').value,
                cantidad: document.getElementById('cantidad2').value,
                descripcion: document.getElementById('descripcion2').value,
                ubicacion: document.getElementById('ubicacion2').value,
                Codigo: document.getElementById('codigo2').value,
                estado: 1,
                /*          areaId: document.getElementById('area2').value, // ✅ aquí el área */
            },
        });

        swal({
            title: "Documento editado!",
            icon: "success",
            button: "Ok",
        });
        handleGetDocuments();
        setSelecteDocument(null);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const selectedOptionIds = selectedOption.map((option) => option.value);
        // Realizar la solicitud para agregar el usuario
        try {
            const response = await axios.post(
                'http://localhost:8000/api/documento',
                {
                    titulo: titulo,
                    cantidad: cantidad,
                    imagen: '../../assets/' + `${imagen.name}`,
                    anio: gestion || null,
                    descripcion: descripcion,
                    ubicacion: ubicacion || null,
                    Codigo: codigo,
                    estado: 1,
                    /*         areaId: are || null, */
                    carreraId: carr || null,
                    tipoDocId: tipodoc,
                    usuarioId: idUsuario,
                    personas: selectedOptionIds
                },
            ).then((response) => {
                // Accede a la respuesta de la API
                console.log("Respuesta de la API:", response.data);
            });
            setImagen(null);
            setCarr(0);
            setFormat(0);
            setTipodoc(0);
            setAre(0);
            setTitulo('');
            setCantidad(0);
            setDescripcion('');
            setUbicacion('');
            setCodigo('');
            setGestion('');
            setSelectedOption('');
            swal({
                title: "documento Agregado!",
                /* text: "Por favor, completa todos los campos requeridos", */
                icon: "success",
                button: "Ok",
            });
            handleGetDocuments();
            // Opcional: Mostrar una notificación o mensaje de éxito
        } catch (error) {
            // Opcional: Mostrar una notificación o mensaje de error
        }
    };
    const fetchTiposDocumento = async () => {
        const res = await axios.get('http://localhost:8000/api/tipo_doc',

        );
        setTiposDocumento(res.data.data.tipo_doc);
    };
    const handleGetDocuments = async () => {
        const res = await axios.get('http://localhost:8000/api/documento',
        );
        setDocumentos(res.data.data.documentos);
        setSearchResults(res.data.data.documentos)
    };
    const getCarreras = async () => {
        const res = await axios.get('http://localhost:8000/api/carrera',
        );
        setCarreras(res.data.data.carrera);
    };

    /*     const getArea = async () => {
            const res = await axios.get('http://localhost:8000/api/area',
            );
            setAreas(res.data.data.area);
        }; */
    const getAutores = async () => {
        const res = await axios.get('http://localhost:8000/api/autor',
        );
        setTodosAutores(res.data.data.autores);
    };
    const options = estudiantes.map(est => ({
        value: est.id,
        label: `${est.nombre} - CI: ${est.ci}`,
        ci: est.ci
    }));
    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption)
    };
    const filteredOptions = options.filter((estudiante) =>
        estudiante.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        estudiante.ci.toString().includes(searchTerm)
    );
    //busqueda
    var idx = lunr(function () {
        this.field('id')
        this.field('title')
        this.field('descripcion')
        this.field('autores')
        this.field('tipo_doc')
        this.field('carrera')
        documentos?.map((document, ind) =>
            this.add({
                "id": document.id,
                "title": document.titulo,
                "descripcion": document.descripcion,
                "autores": document?.documento_autors[0]?.autor?.nombre,
                "tipo_doc": document?.tipo_doc?.nombre,
                "carrera": document?.carrera?.nombre,
            })
        );
    })


    const encontrado = [];

    const handleChange = (event) => {
        const text = event.target.value;
        setSearchText(text);
        // Realiza la búsqueda en función del texto ingresado (puedes usar una función de búsqueda o llamar a una API aquí)
        // Por ahora, simplemente vamos a simular algunos resultados de búsqueda
        const results = simulateSearch(text);
        setSearchResults(results);
    };

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

    const handleEditDocument = (document) => {
        setSelecteDocument(document);
    };
    return (
        <div className="proyecto container py-4">
            <h1 className="tituloProyecto text-center mb-4 text-primary fw-bold">
                📚 Documentos Académicos
            </h1>
            {/* NAV TABS */}
            <ul className="nav nav-tabs shadow-sm rounded overflow-hidden">
                <li className="nav-item">
                    <a className="nav-link active fw-semibold" data-bs-toggle="tab" href="#agregar" role="tab">
                        ➕ Agregar Documentos
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link fw-semibold" data-bs-toggle="tab" href="#listar" role="tab">
                        📄 Lista de Documentos
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link fw-semibold" data-bs-toggle="tab" href="#bajas" role="tab">
                        🗃️ Lista de Bajas
                    </a>
                </li>
            </ul>

            {/* CONTENIDO DE PESTAÑAS */}
            <div className="tab-content p-4 bg-light rounded-bottom shadow-sm">
                {/* 🟢 AGREGAR DOCUMENTOS */}
                <div className="tab-pane fade show active" id="agregar">
                    <form className="p-3 bg-white rounded shadow-sm border">
                        <div className="row g-3">
                            <div className="col-md-3">
                                <label htmlFor="titulo" className="form-label fw-semibold">Título</label>
                                <input type="text" className="form-control" id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                            </div>

                            <div className="col-md-3">
                                <label htmlFor="descripcion" className="form-label fw-semibold">Descripción</label>
                                <input type="text" className="form-control" id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
                            </div>

                            <div className="col-md-3">
                                <label htmlFor="ubicacion" className="form-label fw-semibold">Ubicación Física</label>
                                <input type="text" className="form-control" id="ubicacion" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} required />
                            </div>

                            <div className="col-md-3">
                                <label htmlFor="codigo" className="form-label fw-semibold">Código</label>
                                <input type="text" className="form-control" id="codigo" value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="gestion" className="form-label fw-semibold">Gestion</label>
                                <input type="text" className="form-control" id="gestion" value={gestion} onChange={(e) => setGestion(e.target.value)} required />
                            </div>

                            <div className="col-md-6">
                                <label htmlFor="descripcion" className="form-label fw-semibold">Autor(es)</label>
                                <Select
                                    options={filteredOptions}
                                    onChange={handleSelectChange}
                                    isSearchable
                                    isMulti
                                    placeholder="Selecciona Autores"
                                    value={selectedOption}
                                />
                            </div>

                            <div className="col-md-3">
                                <label htmlFor="tipodoc" className="form-label fw-semibold">Tipo documento</label>
                                <select className="form-select" id="tipodoc" value={tipodoc} onChange={(e) => setTipodoc(e.target.value)}>
                                    <option hidden>Tipo de documento</option>
                                    {tiposDocumento.map((tipo) => tipo.nombre !== 'Libro' && (
                                        <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-2">
                                <label htmlFor="cantidad" className="form-label fw-semibold">Cantidad</label>
                                <input type="number" className="form-control" id="cantidad" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
                            </div>
                            <div className="col-md-3">
                                <label htmlFor="carrera" className="form-label fw-semibold">Carrera</label>
                                <select className="form-select" id="carrera" value={carr} onChange={(e) => setCarr(e.target.value)}>
                                    <option value="" hidden>Seleccione Carrera</option>
                                    {carreras.map((carrera) => (
                                        <option key={carrera.id} value={carrera.id}>{carrera.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            {/*        <div className="col-md-3">
                                <label htmlFor="are" className="form-label fw-semibold">Área</label>
                                <select className="form-select" id="are" value={are} onChange={(e) => setAre(e.target.value)}>
                                    <option hidden>Selecciona Área</option>
                                    {areas.map((area) => (
                                        <option key={area.id} value={area.id}>{area.nombre}</option>
                                    ))}
                                </select>
                            </div> */}

                            <div className="col-md-6">
                                <div
                                    {...getRootProps()}
                                    className="border border-2 border-primary rounded p-4 text-center bg-light"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <input {...getInputProps()} />
                                    <p className="text-muted mb-1">
                                        {isDragActive ? '📂 Suelta la imagen aquí...' : '📸 Arrastra y suelta una imagen'}
                                    </p>
                                    {imagen && <p className="fw-semibold small text-success mt-2">Imagen seleccionada: {imagen.name}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="text-end mt-4">
                            <button type="submit" className="btn btn-primary px-4" onClick={handleSubmit}>
                                <i className="bi bi-plus-circle me-2"></i>Agregar Documento
                            </button>
                        </div>
                    </form>
                </div>

                {/* 🟡 LISTA DE DOCUMENTOS */}
                <div className="tab-pane fade" id="listar">
                    <div className="mt-3">
                        <input type="text" className="form-control mb-3" placeholder="🔍 Buscar por título, carrera o área..." value={searchText} onChange={handleChange} />
                        <div className="table-responsive border rounded shadow-sm" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                            <table className="table table-hover align-middle text-center">
                                <thead className="table-dark sticky-top">
                                    <tr>
                                        <th>#</th>
                                        <th>Título</th>
                                        <th>Descripción</th>
                                        <th>Autores</th>
                                        <th>Cantidad</th>
                                        <th>Carrera</th>
                                        {/* <th>Área</th> */}
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchResults.map((documento, index) => (
                                        (documento.estado == 1 && documento.tipo_doc.nombre !== 'Libro') && (
                                            <tr key={documento.id}>
                                                <td>{index + 1}</td>
                                                <td>{documento.titulo}</td>
                                                <td>{documento.descripcion}</td>
                                 

                                              {  <td>{`${documento.documento_personas[0]?.persona?.nombre || ''}${documento.documento_personas[1] ? ', ' + documento.documento_personas[1]?.persona?.nombre : ''}`}</td> }
                                                <td>{documento.cantidad}</td>
                                                <td>{documento?.carrera?.nombre}</td>
                                                {/*           <td>{documento?.area?.nombre}</td> */}

                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            className="btn btn-sm btn-primary"
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#modalEditDocumento"
                                                            onClick={() => handleEditDocument(documento)}
                                                        >
                                                            <i className="bi bi-pencil-square"></i>
                                                        </button>

                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => handleDarBaja(documento.id)}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>

                                                        <button
                                                            className="btn btn-sm btn-outline-secondary"
                                                            title="Ver detalles"
                                                            onClick={() => {
                                                                setSelectedDocumento(documento);
                                                                const modal = new bootstrap.Modal(
                                                                    document.getElementById("modalDetalleDocumento")
                                                                );
                                                                modal.show();
                                                            }}
                                                        >
                                                            <i className="bi bi-eye"></i>
                                                        </button>
                                                    </div>
                                                </td>

                                            </tr>
                                        )
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* 🔴 LISTA DE BAJAS */}
                <div className="tab-pane fade" id="bajas">
                    <div className="table-responsive border rounded shadow-sm mt-3" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                        <table className="table table-hover align-middle text-center">
                            <thead className="table-dark sticky-top">
                                <tr>
                                    <th>#</th>
                                    <th>Título</th>
                                    <th>Autores</th>
                                    <th>Cantidad</th>
                                    {/*          <th>Área</th> */}
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchResults.map((documento, index) => (
                                    documento.estado == 0 && documento.tipo_doc.nombre !== 'Libro' && (
                                        <tr key={documento.id}>
                                            <td>{index + 1}</td>
                                            <td>{documento.titulo}</td>
                                            <td>{`${documento.documento_autors[0]?.autor?.nombre || ''}${documento.documento_autors[1] ? ', ' + documento.documento_autors[1]?.autor?.nombre : ''}`}</td>
                                            <td>{documento.cantidad}</td>
                                            {/*   <td>{documento?.area?.nombre}</td> */}
                                            <td>
                                                <button className="btn btn-success btn-sm" onClick={() => handleDarReintegrar(documento.id)}>
                                                    <i className="bi bi-arrow-clockwise me-1"></i>Reintegrar
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* MODAL Editar Documento */}
            <div className="modal fade" id="modalEditDocumento" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg rounded-3">
                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title fw-semibold">
                                <i className="bi bi-pencil-square me-2"></i> Editar Documento
                            </h5>
                            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">

                            <form> <div className='row '>
                                <div className="mb-3 col">
                                    <label htmlFor="titulo2" className="form-label">Titulo</label>
                                    <input type="text" className="form-control" id="titulo2" defaultValue={selecteDocument?.titulo} required /> </div>
                                <div className="mb-3 col">
                                    <label htmlFor="descripcion" className="form-label">Descripcion</label>
                                    <input type="text" className="form-control" id="descripcion2" defaultValue={selecteDocument?.descripcion} required /> </div>
                                <div className='mb-3 col selectAutores'>
                                    <label htmlFor="autor" className="form-label">Autor</label>
                                    <input type="text" className="form-control" id="autor" value={`${selecteDocument?.documento_autors[0]?.autor?.nombre ? selecteDocument?.documento_autors[0]?.autor?.nombre : ''}, ${selecteDocument?.documento_autors[1]?.autor?.nombre ? selecteDocument?.documento_autors[1]?.autor?.nombre : ''}`} disabled />
                                </div>
                            </div>
                                <div className='row '>
                                    <div className="mb-3 col">
                                        <label htmlFor="cantidad2" className="form-label">Cantidad</label>
                                        <input type="number" className="form-control" id="cantidad2" defaultValue={selecteDocument?.cantidad} required />
                                    </div>
                                    <div className="mb-3 col">
                                        <label htmlFor="codigo" className="form-label">Codigo</label>
                                        <input type="text" className="form-control" id="codigo2" defaultValue={selecteDocument?.codigo} required />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='mb-3 col '>
                                        <div className="mb-3 col"> <label htmlFor="ubicacion" className="form-label">Ubicacion</label>
                                            <input type="text" className="form-control" id="ubicacion2" defaultValue={selecteDocument?.ubicacion} required />
                                        </div>
                                    </div>
                                    {/*       <div className="mb-3 col">
                                        <label htmlFor="area2" className="form-label">Área</label>
                                        <select className="form-select" id="area2" required>
                                            <option value="">Seleccione un área</option>
                                            {areas.map((area) => (
                                                <option key={area.id} value={area.id}>
                                                    {area.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div> */}
                                </div>
                                <button type="submit" className="btn btn-primary booton" onClick={handleEdit} data-bs-dismiss="modal">Editar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* modal para detalles */}
            <div
                className="modal fade"
                id="modalDetalleDocumento"
                tabIndex="-1"
                aria-labelledby="modalDetalleDocumentoLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                        {/* Header */}
                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title fw-semibold" id="modalDetalleDocumentoLabel">
                                <i className="bi bi-book me-2"></i> Detalles del Documento
                            </h5>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>

                        {/* Body */}
                        <div className="modal-body">
                            {selectedDocumento ? (
                                <div className="row g-4">
                                    {/* Imagen */}
                                    <div className="col-md-5 d-flex justify-content-center">
                                        <img
                                            src={selectedDocumento.imagen}
                                            alt={selectedDocumento.titulo}
                                            className="img-fluid rounded-3 shadow-sm"
                                            style={{
                                                width: "100%",
                                                height: "260px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </div>

                                    {/* Datos */}
                                    <div className="col-md-7">
                                        <h4 className="fw-bold text-primary mb-2">
                                            {selectedDocumento.titulo}
                                        </h4>

                                        <p className="text-muted">
                                            {selectedDocumento.descripcion || "Sin descripción disponible."}
                                        </p>

                                        <p>
                                            <strong>📅Gestion:</strong>{" "}
                                            {selectedDocumento.anio || "Sin especificar"}
                                        </p>

                                        <p>
                                            <strong>📦 Cantidad:</strong>{" "}
                                            {selectedDocumento.cantidad}
                                        </p>

                                        {/*     <p>
                                            <strong>📚 Área:</strong>{" "}
                                            {selectedDocumento.area?.nombre || "No asignada"}
                                        </p> */}

                                        {selectedDocumento.documento_autors?.length > 0 && (
                                            <p>
                                                <strong>✍️ Autor(es):</strong>{" "}
                                                {selectedDocumento.documento_autors
                                                    .map((a) => a.autor?.nombre)
                                                    .filter(Boolean)
                                                    .join(", ")}
                                            </p>
                                        )}

                                        {/* Mostrar carrera solo si NO es libro */}
                                        {selectedDocumento.tipo_doc?.nombre !== "libro" && (
                                            <p>
                                                <strong>🎓 Carrera:</strong>{" "}
                                                {selectedDocumento.carrera?.nombre || "N/A"}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center text-muted">Cargando datos...</p>
                            )}
                        </div>
                        {/* Footer */}
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default documento;
