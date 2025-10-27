import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import Select from 'react-select';
import lunr from 'lunr';
import { useDropzone } from 'react-dropzone';
import "./documento.css"
const libro = () => {

    const [are, setAre] = useState(0);
    const [codigo, setCodigo] = useState('');
    const [titulo, setTitulo] = useState('');
    const [cantidad, setCantidad] = useState(0);
    const [descripcion, setDescripcion] = useState('');
    const [fechaRegistro, setFechaRegistro] = useState('');
    const [ubicacion, setUbicacion] = useState('');
    const [imagen, setImagen] = useState(null);
    const [selectedOption, setSelectedOption] = useState('');
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]); // Almacena los resultados de la búsqueda
    const [searchTerm, setSearchTerm] = useState('');
    const [areas, setAreas] = useState([]);
    const [todosAutores, setTodosAutores] = useState([]);
    const [documentos, setDocumentos] = useState([]);


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
            document.getElementById('cantidad2').value = selecteDocument?.cantidad || '';
            document.getElementById('ubicacion2').value = selecteDocument?.ubicacion || '';
            document.getElementById('codigo2').value = selecteDocument?.codigo || '';
            document.getElementById('are2').value = selecteDocument?.area?.id || null;
        }
        handleGetDocuments();

    }, [selecteDocument]);
    useEffect(() => {
        // Obtener la lista de documentoes al cargar el componente
        handleGetDocuments();
        getArea();
        getAutores();

    }, []);
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
        swal({
            title: "documento dado de Baja!",
            /* text: "Por favor, completa todos los campos requeridos", */
            icon: "success",
            button: "Ok",
        });
        handleGetDocuments();
    }
    const handleEdit = async (e) => {
        // Make the API request to update the user
        e.preventDefault();
        await axios({
            url: `http://localhost:8000/api/documento/${selecteDocument.id}`,
            method: "PUT",
            data: {
                titulo: document.getElementById('titulo2').value,
                cantidad: document.getElementById('cantidad2').value,
                descripcion: document.getElementById('descripcion2').value,
                Codigo: document.getElementById('codigo2').value,
                estado: 1,
                ubicacion: document.getElementById('ubicacion2').value,
                areaId: document.getElementById('are2').value,
            },
        }).then((response) => {
            // Accede a la respuesta de la API
            console.log("Respuesta de la API:", response.data);
        });
        swal({
            title: "Libro Editado!",
            icon: "success",
            button: "Ok",
        });
        handleGetDocuments();
        setSelecteDocument(null);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const selectedOptionIds = selectedOption.map((option) => option.value);
        try {
            const response = await axios.post(
                'http://localhost:8000/api/documento',
                {
                    titulo: titulo,
                    cantidad: cantidad,
                    anio_edicion: fechaRegistro,
                    descripcion: descripcion,
                    imagen: '../../assets/' + `${imagen.name}`,
                    estado: 1,
                    ubicacion: ubicacion,
                    Codigo: codigo,
                    areaId: are,
                    carreraId: null,
                    tipoDocId: 2,
                    autores: selectedOptionIds
                },

            ).then((response) => {
                // Accede a la respuesta de la API
                console.log("Respuesta de la API:", response.data);
            });
            setImagen(null);
            setUbicacion('');
            setCodigo('');
            setAre(0);
            setTitulo('');
            setCantidad(0);
            setDescripcion('');
            setFechaRegistro('');
            setSelectedOption('');

            swal({
                title: "Libro Agregado!",
                /* text: "Por favor, completa todos los campos requeridos", */
                icon: "success",
                button: "Ok",
            });
            handleGetDocuments();
        } catch (error) {
            // Opcional: Mostrar una notificación o mensaje de error
        }
    };

    const handleGetDocuments = async () => {
        const res = await axios.get('http://localhost:8000/api/documento',

        );
        setDocumentos(res.data.data.documentos);
        setSearchResults(res.data.data.documentos)
    };

    const getArea = async () => {
        const res = await axios.get('http://localhost:8000/api/area',
            {
                /*     headers: {
                      Authorization: `Bearer ${token}`
                    } */
            }
        );

        setAreas(res.data.data.area);
    };
    const getAutores = async () => {
        const res = await axios.get('http://localhost:8000/api/autor',
        );
        setTodosAutores(res.data.data.autores);
    };

    const options = todosAutores.map((autor) => ({
        value: autor.id,
        label: autor.nombre,
    }));
    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption)
    };
    const filteredOptions = options.filter((autor) =>
        autor.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    //busqueda
    var idx = lunr(function () {
        this.field('id')
        this.field('title')
        this.field('descripcion')
        this.field('autores')
        this.field('tipo_doc')
        this.field('area')
        this.field('carrera')


        documentos?.map((document, ind) =>
            this.add({
                "id": document.id,
                "title": document.titulo,
                "descripcion": document.descripcion,
                "autores": document?.documento_autors[0]?.autor?.nombre,
                "tipo_doc": document?.tipo_doc?.nombre,
                "area": document?.area?.nombre,
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
    return <div className="proyecto container-fluid py-4">
        <h1 className="tituloProyecto text-center mb-4 fw-bold text-primary">
            📚 Gestión de Libros
        </h1>

        {/* Nav Tabs */}
        <ul className="nav nav-tabs shadow-sm rounded overflow-hidden">
            <li className="nav-item">
                <a className="nav-link active fw-semibold" data-bs-toggle="tab" href="#agregar" role="tab">
                    ➕ Agregar Libro
                </a>
            </li>
            <li className="nav-item">
                <a className="nav-link fw-semibold" data-bs-toggle="tab" href="#listar" role="tab">
                    📄 Lista de Libros
                </a>
            </li>
            <li className="nav-item">
                <a className="nav-link fw-semibold" data-bs-toggle="tab" href="#bajas" role="tab">
                    🗃️ Lista de Bajas
                </a>
            </li>
        </ul>

        {/* Contenido de pestañas */}
        <div className="tab-content">

            {/* Pestaña Agregar */}
            <div className="tab-pane fade show active" id="agregar">
                <div className="card shadow-sm border-0 rounded-3">
                    <div className="card-body">

                        <form onSubmit={handleSubmit}>
                            <div className="row g-3">
                                <div className="col-md-3">
                                    <label className="form-label fw-semibold">Título</label>
                                    <input type="text" className="form-control" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fw-semibold">Descripción</label>
                                    <input type="text" className="form-control" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fw-semibold">Código</label>
                                    <input type="text" className="form-control" value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fw-semibold">Ubicación</label>
                                    <input type="text" className="form-control" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} required />
                                </div>

                                <div className="col-md-3">
                                    <label className="form-label fw-semibold">Cantidad</label>
                                    <input type="number" className="form-control" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fw-semibold">Año de Edición</label>
                                    <input type="datetime-local" className="form-control" value={fechaRegistro} onChange={(e) => setFechaRegistro(e.target.value)} required />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Autor(es)</label>
                                    <Select
                                        options={filteredOptions}
                                        onChange={handleSelectChange}
                                        isSearchable
                                        isMulti
                                        placeholder="Selecciona Autor(es)"
                                        value={selectedOption}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold">Área</label>
                                    <select className="form-select" value={are} onChange={(e) => setAre(e.target.value)} required>
                                        <option hidden>Selecciona un área</option>
                                        {areas.map((area) => (
                                            <option key={area.id} value={area.id}>{area.nombre}</option>
                                        ))}
                                    </select>
                                </div>

                                <div
                                    {...getRootProps()}
                                    className={`col-md-6 border border-2 border-dashed rounded-3 py-4 text-center ${isDragActive ? "border-primary text-primary" : "border-secondary text-muted"}`}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <input {...getInputProps()} />
                                    {isDragActive ? (
                                        <p><i className="bi bi-upload me-2"></i> Suelta la imagen aquí...</p>
                                    ) : (
                                        <p><i className="bi bi-image me-2"></i> Arrastra o selecciona una imagen</p>
                                    )}
                                    {imagen && <p className="text-success mt-2"><i className="bi bi-check-circle me-1"></i>{imagen.name}</p>}
                                </div>
                            </div>

                            <div className="text-end mt-4">
                                <button type="submit" className="btn btn-primary px-4">
                                    <i className="bi bi-save me-1"></i> Guardar Libro
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Pestaña Lista de Libros */}
            <div className="tab-pane fade" id="listar">
                <div className="card shadow-sm border-0 rounded-3">
                    <div className="mt-4 p-4">
                        <input type="text" className="form-control mb-3 shadow-sm" placeholder="Buscar por título, autor o área..." value={searchText} onChange={handleChange} />
                        <div className="table-responsive" style={{ maxHeight: "500px", overflowY: "auto" }}>
                            <table className="table table-hover align-middle">
                                <thead className="table-dark sticky-top">
                                    <tr>
                                        <th>#</th>
                                        <th>Título</th>
                                        <th>Autor(es)</th>
                                        <th>Cantidad</th>
                                        <th>Área</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchResults.map((documento, index) => (documento.estado === 1 && documento.tipo_doc.nombre === 'Libro' && (
                                        <tr key={documento.id}>
                                            <td>{index + 1}</td>
                                            <td>{documento.titulo}</td>
                                            <td>{`${documento.documento_autors[0]?.autor?.nombre || ''}${documento.documento_autors[1] ? ', ' + documento.documento_autors[1]?.autor?.nombre : ''}`}</td>
                                            <td>{documento.cantidad}</td>
                                            <td>{documento?.area?.nombre}</td>
                                            <td>
                                                <div className="btn-group">
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
                                                        <i className="bi bi-trash3"></i>
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
            </div>

            {/* Pestaña Lista de Bajas */}
            <div className="tab-pane fade" id="bajas">
                <div className="card shadow-sm border-0 rounded-3">
                    <div className="table-responsive mt-4" style={{ maxHeight: "500px", overflowY: "auto" }}>
                        <table className="table table-hover align-middle">
                            <thead className="table-dark sticky-top">
                                <tr>
                                    <th>#</th>
                                    <th>Título</th>
                                    <th>Autor(es)</th>
                                    <th>Cantidad</th>
                                    <th>Área</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchResults.map((documento, index) => (
                                    documento.tipo_doc?.nombre === 'Libro' && documento.estado === 0 && (
                                        <tr key={documento.id}>
                                            <td>{index + 1}</td>
                                            <td>{documento.titulo}</td>
                                            <td>{`${documento.documento_autors[0]?.autor?.nombre || ''}${documento.documento_autors[1] ? ', ' + documento.documento_autors[1]?.autor?.nombre : ''}`}</td>
                                            <td>{documento.cantidad}</td>
                                            <td>{documento?.area?.nombre}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-success"
                                                    onClick={() => handleDarReintegrar(documento.id)}
                                                >
                                                    <i className="bi bi-arrow-repeat me-1"></i> Reintegrar
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
        </div>

        {/* MODAL Editar Documento (sin tocar lógica) */}
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
                        {/* Tu formulario de edición original sin cambios de lógica */}
                        <form> <div className='row '>
                            <div className="mb-3 col">
                                <label htmlFor="titulo2" className="form-label">Titulo</label>
                                <input type="text" className="form-control" id="titulo2" defaultValue={selecteDocument?.titulo} required /> </div>
                            <div className="mb-3 col">
                                <label htmlFor="descripcion" className="form-label">Descripcion</label>
                                <input type="text" className="form-control" id="descripcion2" defaultValue={selecteDocument?.descripcion} required /> </div>
                            <div className='mb-3 col selectAutores'>
                                <label htmlFor="autor" className="form-label">Autor</label>
                                <input type="text" className="form-control" id="autor" value={`${selecteDocument?.documento_autors[0]?.autor?.nombre ? selecteDocument?.documento_autors[0]?.autor?.nombre : ''}, ${selecteDocument?.documento_autors[1]?.autor?.nombre ? selecteDocument?.documento_autors[1]?.autor?.nombre : ''}`} disabled /> </div>
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
                            </div> <div className='row '>
                                <div className="mb-3 col">
                                    <label htmlFor="ubicacion" className="form-label">Ubicacion</label>
                                    <input type="text" className="form-control" id="ubicacion2" defaultValue={selecteDocument?.ubicacion} required />
                                </div>
                                <div className="mb-3 col"> <label htmlFor="are" className="form-label">Area</label>
                                    <select className="form-control form-select" id="are2" aria-label="Default select example" defaultValue={selecteDocument?.area?.id} >
                                        <option hidden>Selecciona Area</option>
                                        {areas.map((area) => <option key={area.id} value={area.id}>{area.nombre}</option>)}
                                    </select>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary booton" onClick={handleEdit} data-bs-dismiss="modal">Editar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>


};

export default libro;
