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
    const [fechaRegistro, setFechaRegistro] = useState('');


    const [selectedOption, setSelectedOption] = useState('');
    //const [autores, setAutores] = useState('');
    //buscador
    const [searchText, setSearchText] = useState('');
    const [searchResults, setSearchResults] = useState([]); // Almacena los resultados de la búsqueda

    const [searchTerm, setSearchTerm] = useState('');
    const [formatos, setFormatos] = useState([]);
    const [areas, setAreas] = useState([]);
    const [todosAutores, setTodosAutores] = useState([]);
    const [tiposDocumento, setTiposDocumento] = useState([]);
    const [documentos, setDocumentos] = useState([]);

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
            document.getElementById('fecha_registro2').value = selecteDocument?.anio_edicion || '';
            document.getElementById('descripcion2').value = selecteDocument?.descripcion || '';
            document.getElementById('ubicacion2').value = selecteDocument?.ubicacion || '';
            document.getElementById('codigo2').value = selecteDocument?.codigo || '';
            document.getElementById('cantidad2').value = selecteDocument?.cantidad || '';
            document.getElementById('carrera2').value = selecteDocument?.carrera?.id || null;
            document.getElementById('tipodoc2').value = selecteDocument?.tipo_doc?.id || null;
   /*          document.getElementById('format2').value = selecteDocument?.formato?.id || null; */
            document.getElementById('are2').value = selecteDocument?.area?.id || null;
        }
        handleGetDocuments();

    }, [selecteDocument]);

    useEffect(() => {
        // Obtener la lista de documentoes al cargar el componente

        handleGetDocuments();
        fetchTiposDocumento();
        getCarreras();
        getFormatos();
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
                anio_edicion: document.getElementById('fecha_registro2').value,
                descripcion: document.getElementById('descripcion2').value,
                ubicacion: document.getElementById('ubicacion2').value,
                Codigo: document.getElementById('codigo2').value,
                estado: 1,
                areaId: document.getElementById('are2').value,
                formatoId: 1,
                carreraId: document.getElementById('carrera2').value,
                tipoDocId: document.getElementById('tipodoc2').value,


            },
        }).then((response) => {
            // Accede a la respuesta de la API
            console.log("Respuesta de la API:", response.data);
        });


        // Update the user in the local state
        swal({
            title: "documento Editado!",
            /* text: "Por favor, completa todos los campos requeridos", */
            icon: "success",
            button: "Ok",
        });
        handleGetDocuments();
        setSelecteDocument(null);

    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        const selectedOptionIds = selectedOption.map((option) => option.value);
        console.log('imagen name:', imagen.name)
        console.log('imagen:', imagen)


        // Realizar la solicitud para agregar el usuario
        try {
            const response = await axios.post(
                'http://localhost:8000/api/documento',
                {
                    titulo: titulo,
                    cantidad: cantidad,
                    imagen: '../../assets/' + `${imagen.name}`,
                    anio_edicion: fechaRegistro,
                    descripcion: descripcion,
                    ubicacion: ubicacion,
                    Codigo: codigo,
                    estado: 1,
                    areaId: are,
                    formatoId: 1,
                    carreraId: carr,
                    tipoDocId: tipodoc,
                    autores: selectedOptionIds
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
            setFechaRegistro('');
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
    const getFormatos = async () => {
        const res = await axios.get('http://localhost:8000/api/formato',
        );

        setFormatos(res.data.data.formato);
    };
    const getArea = async () => {
        const res = await axios.get('http://localhost:8000/api/area',
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
        this.field('formato')
        this.field('carrera')


        documentos?.map((document, ind) =>
            this.add({
                "id": document.id,
                "title": document.titulo,
                "descripcion": document.descripcion,
                "autores": document?.documento_autors[0]?.autor?.nombre,
                "tipo_doc": document?.tipo_doc?.nombre,
                "area": document?.area?.nombre,
                "formato": document?.formato?.nombre,
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
        <div className='proyecto'>
            <h1 className='tituloProyecto'>Documentos Académicos</h1>
            <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item">
                    <a className="nav-link active" data-bs-toggle="tab" href="#agregar" role="tab">Agregar Documentos</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="tab" href="#listar" role="tab">Lista de Documentos</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="tab" href="#bajas" role="tab">Lista de Bajas</a>
                </li>
            </ul>


            {/* Contenido de las pestañas */}
            <div className="tab-content">
                {/* Pestaña Agregar Rol */}
                <div className={`tab-pane fade nuevoProyecto  show active `} id='agregar'>
                    <form>
                        <div className='row '>
                            <div className="mb-3 col">
                                <label htmlFor="titulo" className="form-label">Titulo</label>
                                <input type="text" className="form-control" id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
                            </div>

                            <div className="mb-3 col">
                                <label htmlFor="descripcion" className="form-label">Descripcion</label>
                                <input type="text" className="form-control" id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required />
                            </div>
                            <div className="mb-3 col">
                                <label htmlFor="ubicacion" className="form-label">Ubicacion</label>
                                <input type="text" className="form-control" id="ubicacion" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} required />
                            </div>
                            <div className="mb-3 col">
                                <label htmlFor="codigo" className="form-label">Codigo</label>
                                <input type="text" className="form-control" id="codigo" value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
                            </div>
                            <div className='mb-3 col '>
                                <label htmlFor="descripcion" className="form-label">Autor</label>
                                <Select
                                    options={filteredOptions}
                                    onChange={handleSelectChange}
                                    isSearchable
                                    isMulti
                                    placeholder="Selecciona Autores"
                                    value={selectedOption}
                                />
                            </div>
                        </div>

                        <div className='row '>
                            <div className="mb-3 col">
                                <label htmlFor="cantidad" className="form-label">Cantidad</label>
                                <input type="number" className="form-control" id="cantidad" value={cantidad} onChange={(e) => setCantidad(e.target.value)} required />
                            </div>
                            {/*                             <div className='mb-3 col'>
                                <label htmlFor="recipient-name">Fecha de registro</label>
                                <input type="datetime-local" className="form-control" value={fechaRegistro} onChange={(e) => setFechaRegistro(e.target.value)} required />
                            </div> */}


                            <div className="mb-3 col  ">
                                <label htmlFor="carrera" className="form-label">Carrera</label>
                                <select className="form-select" id="carrera" aria-label="Default select example" value={carr} onChange={(e) => setCarr(e.target.value)}>

                                    <option value="" hidden selected>Seleccione Carrera</option>
                                    {carreras.map((carrera) =>
                                        <option key={carrera.id} value={carrera.id}>{carrera.nombre}</option>
                                    )}
                                </select>
                            </div>
                         {/*    <div className="mb-3 col">
                                <label htmlFor="format" className="form-label">Formato</label>
                                <select className="form-control form-select" id="format" aria-label="Default select example" value={format} onChange={(e) => setFormat(e.target.value)}>

                                    <option hidden selected>Selecciona Formato</option>
                                    {formatos.map((tipo) =>
                                        <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                                    )}
                                </select>
                            </div> */}

                        </div>
                        <div className='row '>
                            <div className="mb-3 col">
                                <label htmlFor="tipodoc" className="form-label">Tipo documento</label>
                                <select className="form-control form-select" id="tipodoc" aria-label="Default select example" value={tipodoc} onChange={(e) => setTipodoc(e.target.value)}>

                                    <option hidden selected>Tipo de documento</option>
                                    {tiposDocumento.map((tipo) => tipo.nombre !== 'Libro' && (

                                        <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                                    ))}
                                </select>
                            </div>



                            <div className="mb-3 col">
                                <label htmlFor="are" className="form-label">Area</label>
                                <select className="form-control form-select" id="are" aria-label="Default select example" value={are} onChange={(e) => setAre(e.target.value)}>

                                    <option hidden selected>Selecciona Area</option>
                                    {areas.map((area) =>
                                        <option key={area.id} value={area.id}>{area.nombre}</option>
                                    )}
                                </select>
                            </div>
                            <div
                                {...getRootProps()}
                                style={{
                                    border: '2px dashed #007bff',
                                    padding: '0px',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    color: isDragActive ? '#007bff' : '#aaa',
                                }}
                                className='mt-3 col-6'
                            >
                                <input {...getInputProps()} />
                                {isDragActive ? (
                                    <p >Suelta la imagen aquí...</p>
                                ) : (
                                    <p style={{
                                        fontSize: '15px',
                                        marginTop: '20px'
                                    }}>Arrastra y suelta una imagen.</p>
                                )}
                                {imagen && <p>Imagen seleccionada: {imagen.name}</p>}
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary booton" onClick={handleSubmit}>Agregar</button>


                    </form>
                </div>

                {/* bajas */}
                <div className={`tab-pane fade tablaProyecto`} id='bajas'>
                    <div className=" table-responsive mt-3 tablaBajas">
                        <table className="table table-fixed">
                            <thead className="table-dark sticky-top">
                                <tr>
                                    <th scope="col">Nº</th>
                                    <th scope="col">titulo</th>
                                    <th scope="col">autores</th>
                                    <th scope="col ">Cantidad</th>
                                    <th scope="col">area</th>
                                    <th scope="col">Formato</th>
                                    <th scope="col">Accion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchResults.map((documento, index) => (documento.estado == 0 && documento.tipo_doc.nombre !== 'Libro') && (
                                    <tr key={documento.id}>
                                        <td>{index + 1}</td>
                                        <td>{documento.titulo}</td>
                                        <td>{`${documento.documento_autors[0]?.autor?.nombre}  ${documento.documento_autors[1] ? ", " + documento.documento_autors[1]?.autor?.nombre : ' '}`}</td>
                                        <td>{documento.cantidad}</td>
                                        <td>{documento?.area?.nombre}</td>
                                        <td>{documento?.formato?.nombre}</td>
                                        <td>
                                            <button className='btn btn-danger boton' onClick={() => handleDarReintegrar(documento.id)}>Reintegrar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>


                {/* editar DOCUMENTO */}
                <div className='modal fade modalcont modalEdit' id="modalEditDocumento" taindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog ">
                        <div className="modal-content modaldoc">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel"> Editar Documento </h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
                            </div>
                            <div className="modal-body modalEdit">
                                <form>

                                    <div className='row '>
                                        <div className="mb-3 col">
                                            <label htmlFor="titulo2" className="form-label">Título</label>
                                            <input type="text" className="form-control" id="titulo2" defaultValue={selecteDocument?.titulo} required />
                                        </div>

                                        <div className="mb-3 col">
                                            <label htmlFor="descripcion" className="form-label">Descripción</label>
                                            <input type="text" className="form-control" id="descripcion2" defaultValue={selecteDocument?.descripcion} required />
                                        </div>

                                    </div>
                                    <div className='row'>
                                        <div className="mb-3 col">
                                            <label htmlFor="ubicacion" className="form-label">Ubicación</label>
                                            <input type="text" className="form-control" id="ubicacion2" defaultValue={selecteDocument?.ubicacion} required />
                                        </div>
                                        <div className="mb-3 col">
                                            <label htmlFor="codigo" className="form-label">Código</label>
                                            <input type="text" className="form-control" id="codigo2" defaultValue={selecteDocument?.codigo} required />
                                        </div>

                                    </div>
                                    <div className='row '>
                                        <div className="mb-3 col">
                                            <label htmlFor="cantidad2" className="form-label">Cantidad</label>
                                            <input type="number" className="form-control" id="cantidad2" defaultValue={selecteDocument?.cantidad} required />
                                        </div>
                                        <div className='mb-3 col'>
                                            <label htmlFor="autor" className="form-label">Autor(es)</label>
                                            <input type="text" className="form-control" id="autor" value={`${selecteDocument?.documento_autors[0]?.autor?.nombre ? selecteDocument?.documento_autors[0]?.autor?.nombre : ''}, ${selecteDocument?.documento_autors[1]?.autor?.nombre ? selecteDocument?.documento_autors[1]?.autor?.nombre : ''}`} disabled />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='mb-3 col'>
                                            <label htmlFor="fecha_registro" className="form-label">Fecha de registro</label>
                                            <input type="datetime-local" className=" form-control" id='fecha_registro2' defaultValue={selecteDocument?.anio_edicion} required />
                                        </div>
                                        <div className="mb-3 col  ">
                                            
                                            <label htmlFor="carrera2" className="form-label">Carrera</label>

                                            <select className="form-control" id="carrera2" aria-label="Default select example" defaultValue={selecteDocument?.carrera?.id} >
                                                <option hidden selected>Seleccione Carrera</option>
                                                {carreras.map((carrera) =>
                                                    <option key={carrera.id} value={carrera.id}>{carrera.nombre}</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                    <div className='row '>
                                        <div className="mb-3 col">
                                            <label htmlFor="tipodoc" className="form-label">Tipo documento</label>
                                            <select className="form-control" id="tipodoc2" aria-label="Default select example" defaultValue={selecteDocument?.tipo_doc?.id} >

                                                <option hidden selected>Tipo de documento</option>
                                                {tiposDocumento.map((tipo) => tipo.nombre !== 'Libro' && (

                                                    <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                                                ))}
                                            </select>
                                        </div>
                                       {/*  <div className="mb-3 col">
                                            <label htmlFor="format" className="form-label">Formato</label>
                                            <select className="form-control" id="format2" aria-label="Default select example" defaultValue={selecteDocument?.formato?.id} >

                                                <option hidden selected>Selecciona Formato</option>
                                                {formatos.map((tipo) =>
                                                    <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                                                )}
                                            </select>
                                        </div> */}
                                        <div className="mb-3 col">
                                            <label htmlFor="are" className="form-label">Area</label>
                                            <select className="form-control" id="are2" aria-label="Default select example" defaultValue={selecteDocument?.area?.id} >

                                                <option hidden selected>Selecciona Area</option>
                                                {areas.map((area) =>
                                                    <option key={area.id} value={area.id}>{area.nombre}</option>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary booton" onClick={handleEdit} data-bs-dismiss="modal">Editar</button>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>

                {/* para mostrar Documentos */}
                <div className="tab-pane fade " id="listar" role="tabpanel">
                    <div className="mt-4">
                        <input type="text" className="form-control mb-3" placeholder="Buscar por título, carrera, área" value={searchText} onChange={handleChange} />
                        <div className='tablaProyecto'>
                            <div className="table-responsive tablaBajas">
                                <table className="table table-fixed">
                                    <thead className="table-dark sticky-top">
                                        <tr>
                                            <th scope="col">Nº</th>
                                            <th scope="col">titulo</th>
                                            <th scope="col">autores</th>
                                            <th scope="col ">Cantidad</th>
                                            <th scope="col ">Carrera</th>
                                            <th scope="col">area</th>
                                            <th scope="col">Formato</th>
                                            <th scope="col">Accion</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {searchResults.map((documento, index) => (documento.estado == 1 && documento.tipo_doc.nombre !== 'Libro') && (

                                            <tr key={documento.id}>

                                                <td>{index + 1}</td>
                                                <td>{documento.titulo}</td>
                                                <td>{`${documento.documento_autors[0]?.autor?.nombre}  ${documento.documento_autors[1] ? ", " + documento.documento_autors[1]?.autor?.nombre : ' '}`}</td>
                                                <td>{documento.cantidad}</td>
                                                <td>{documento?.carrera?.nombre}</td>
                                                <td>{documento?.area?.nombre}</td>
                                                <td>{documento?.formato?.nombre}</td>
                                                <td>
                                                    <button className='btn btn-primary my-1 mx-1' data-bs-toggle="modal" data-bs-target="#modalEditDocumento" data-bs-whatever="@mdo" onClick={() => handleEditDocument(documento)}>Editar</button>
                                                    <button className='btn btn-danger boton' onClick={() => handleDarBaja(documento.id)}>Baja</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>);

};

export default documento;
