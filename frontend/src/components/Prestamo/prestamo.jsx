
import './ListarPrestamos.css'
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import lunr from 'lunr';
import Select from 'react-select';


const prestamo = () => {
    const token = localStorage.getItem('token');
    const [selectedUser, setSelectedUser] = useState(null);
    const [prestamoData, setPrestamoData] = useState({
        fecha_prestamo: " ",
        fecha_devolver: " ",
        observaciones: " ",
        garantia: " ",
        estado: '',
    });
    const [sancionData, setSancionData] = useState({
        tipo_sancion: '',
        descripcion: '',
        fecha_inicio: '',
        fecha_fin: '',
        estado: '',
    });
    const [searchResults, setSearchResults] = useState([]); // Almacena los resultados de la búsqueda
    const [searchText, setSearchText] = useState('');
    const [documentos, setdocumentos] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [estudiantes, setEstudiantes] = useState([]);
    const [prestamos, setPrestamos] = useState([]);
    const [selectedPrestamo, setSelectedPrestamo] = useState(null);

    const [reservas, setReservas] = useState([]);
    const [devoluciones, setDevoluciones] = useState([]);
    const id = localStorage.getItem('id');

    const [fechaDevuelta, setFechaDevuelta] = useState({
        fecha_devuelta: ''
    });

    const [fecha_prestamo, setFecha_prestamo] = useState('');

    const [estadoDocumento, setEstadoDocumento] = useState('');

    const [pres, setPres] = useState(null);
    //upadte const update
    useEffect(() => {
        handleGetUsers();
        handleGetReservas();
        handleEstudiantes();
        handleGetPrestamos();
        handleGetDevoluciones();
        document.getElementById('nombreEstudiante').defaultValue = selectedOption.nombre || '';
        const hoy = new Date().toISOString().split("T")[0];
        setFechaDevuelta((prev) => ({ ...prev, fecha_devuelta: hoy }));


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
        setFecha_prestamo(getCurrentDateTime())


    }, []);

    const sedHandleUsuario = (usuario) => {
        setSelectedUser(usuario);

    }
    const handleGetUsers = async () => {
        const res = await axios({
            url: "http://localhost:8000/api/documento",
            method: "GET",
            /*   headers: {
                  Authorization: `Bearer ${token}`,
              }, */
        });

        setdocumentos(res.data.data.documentos);
        setSearchResults(res.data.data.documentos)
    };


    const handleEstudiantes = async () => {


        const res = await axios({
            url: "http://localhost:8000/api/persona",
            method: "GET",
            /* headers: {
                Authorization: `Bearer ${token}`,
            }, */
        });

        setEstudiantes(res.data.data.personas);

    };


    const handlePrestamoR = async () => {
        if (selectedOption['sancion'] == null) {
            try {
                // Buscar la primera reserva activa de la persona seleccionada
                console.log(reservas)
                const reservaPersona = reservas.find(
                    reserva => reserva.persona.id === selectedOption['value'] && reserva.estado === 1
                );

                // Si hay una reserva activa, darla de baja
                if (reservaPersona) {
                    await axios({
                        url: `http://localhost:8000/reservas/reserva/baja/${reservaPersona.id}`,
                        method: "PUT",
                        data: { estado: 0 }
                    });
                }

                // Configurar los datos del préstamo
                const lendingData = {
                    fecha_prestamo: fecha_prestamo,
                    fecha_devolucion: prestamoData.fecha_devolver,
                    observaciones: prestamoData.observaciones,
                    garantia: prestamoData.garantia,
                    usuarioId: id,
                    estado: 1,
                    personaId: selectedOption['value'],
                    documentoId: selectedUser.id,
                };

                // Enviar la solicitud de préstamo
                await axios({
                    url: 'http://localhost:8000/api/prestamo/PrestamoR',
                    method: 'POST',
                    data: lendingData,
                });

                // Limpiar los datos y actualizar el estado de la aplicación

                setPrestamoData({
                    fecha_devolver: '',
                    observaciones: ''
                });
                setSelectedUser(null);
                setSelectedOption('');
                handleGetReservas();
                handleGetPrestamos();
                handleGetUsers();

                swal({
                    title: "Documento prestado con Exito!",
                    icon: "success",
                    button: "Ok",
                });
            } catch (error) {
                console.error(error);
                swal({
                    title: "Error al prestar Documento!",
                    icon: "error",
                    button: "Ok",
                });
            }
        } else {
            swal({
                title: "Error al prestar ",
                text: "El Estudiante se encuentra sancionado!",
                icon: "error",
                button: "Ok",
            });
        }
    };
    const handlePrestamo = async () => {
        if (selectedOption['sancion'] == null) {
            try {
                if (selectedUser.cantidad > 0) {
                    const lendingData = {
                        fecha_prestamo: fecha_prestamo,
                        fecha_devolucion: prestamoData.fecha_devolver,
                        observaciones: prestamoData.observaciones,
                        usuarioId: id,
                        garantia: prestamoData.garantia,
                        estado: 1,
                        personaId: selectedOption['value'],
                        documentoId: selectedUser.id,
                    };
                    // Send the lending request to the server
                    console.log(lendingData)
                    await axios({
                        url: 'http://localhost:8000/api/prestamo',
                        method: 'POST',

                        data: lendingData,
                    });
                    setPrestamoData({
                        fecha_devolver: '',
                        observaciones: '',
                        garantia: ''
                    });
                    setSelectedUser(null);
                    setSelectedOption('');
                    handleGetPrestamos();
                    handleGetUsers();

                    swal({
                        title: "Documento prestado con Exito!",

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
                    title: "Error al prestar Documento!",
                    icon: "error",
                    button: "Ok",
                });
            }
        } else {
            swal({
                title: "Error al prestar ",
                text: "El Estudiante se encuentra sancionado!",
                icon: "error",
                button: "Ok",
            });
        }
    };

    //react select y su buscador
    const options = estudiantes?.map((autor) => ({
        value: autor.id,
        label: autor.ci,
        nombre: autor.nombre,
        sancion: autor.sancion
    }));
    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption)
    };
    const filteredOptions = options?.filter((autor) =>
        (autor.label + "").includes(selectedOption)
    );



    function generarClaveUnica() {
        const caracteres = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const longitud = 8;
        let clave = '';

        for (let i = 0; i < longitud; i++) {
            const indice = Math.floor(Math.random() * caracteres.length);
            clave += caracteres.charAt(indice);
        }

        return clave;
    }

    //buscador
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

    //prestamos
    const handleGetPrestamos = async () => {
        const res = await axios({
            url: 'http://localhost:8000/api/prestamo',
            method: 'GET',

        });
        setPrestamos(res.data.data.prestamos);
    };
    const handleGetReservas = async () => {
        const res = await axios({
            url: 'http://localhost:8000/reservas/reserva',
            method: 'GET',

        });
        setReservas(res.data.data.reserva);
    };


    const handleGetDevoluciones = async () => {
        const res = await axios({
            url: "http://localhost:8000/api/devolucion",
            method: "GET",

        });
        setDevoluciones(res.data.data.devolucion);
    };


    const hadlePrestamo = (prest) => {
        setEstadoDocumento('');
        setPres(prest)

    }
    const handlePostDevolucion = async () => {

        const nuevoDevolucion = {
            nombrePersona: pres.persona.nombre,
            titulo: pres.documento.titulo,
            prestamo: pres.id,
            fecha_devuelta: fechaDevuelta,
            estadoLibro: estadoDocumento
        };
        await axios({
            url: `http://localhost:8000/api/devolucion`,
            method: 'POST',
            data: nuevoDevolucion,

        });
        await axios({
            url: `http://localhost:8000/api/prestamo/baja/${pres.id}`,
            method: 'PUT',
            data: {
                estado: 0
            }
        });

        const nuevosPrestamos = prestamos.filter((prestamo) => prestamo.id !== pres.id);
        setPrestamos(nuevosPrestamos);
        setEstadoDocumento('');
        handleGetDevoluciones();
        handleGetPrestamos();
        swal({
            title: "devolucion con exito!",
            /*   text: "Por favor, completa todos los campos requeridos", */
            icon: "success",
            button: "Ok",
        });



    };

    const handleSancionarPrestamo = async () => {
        try {
            if (!selectedPrestamo.id || !sancionData.tipo_sancion || !sancionData.descripcion) {
                swal({
                    title: "Faltan datos",
                    text: "Completa todos los campos antes de sancionar.",
                    icon: "warning",
                    button: "Ok",
                });
                return;
            }

            await axios.post("http://localhost:8000/api/sancion", {
                prestamoId: selectedPrestamo.id, // 👈 ahora también enviamos el préstamo
                personaId: selectedPrestamo.persona.id,
                tipo_sancion: sancionData.tipo_sancion,
                descripcion: sancionData.descripcion,
                fecha_inicio: sancionData.fecha_inicio,
                fecha_fin: sancionData.fecha_fin,
                estado: '1',
            });

            // Actualiza las listas
            handleGetUsers();
            // Limpia el formulario
            setSancionData({
                tipo_sancion: '',
                descripcion: '',
                fecha_inicio: '',
                fecha_fin: '',
                estado: '',
            });
            setSelectedPrestamo(null);
            swal({
                title: "¡Sanción al préstamo registrada!",
                icon: "success",
                button: "Ok",
            });
        } catch (error) {
            console.error(error);
            swal({
                title: "Error",
                text: "No se pudo sancionar el préstamo. Inténtalo de nuevo.",
                icon: "error",
                button: "Ok",
            });
        }
    };

    return (
        <div className='prestamos'>
            {/*modal prestamo} */}
            <h1 className='tituloPrestamos'>Prestamos</h1>
            <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item">
                    <a className="nav-link active" data-bs-toggle="tab" href="#prestar" role="tab">Prestar</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="tab" href="#historial" role="tab">Prestamos</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="tab" href="#devolver" role="tab">Devueltos</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" data-bs-toggle="tab" href="#reservas" role="tab">Reservas</a>
                </li>
            </ul>

            {/* aqui empieza modal de prestamos que se tiene */}
            <div className="tab-content" id="myTabContent"  >
                <div className="tab-pane fade" id="devolver" role="tabpanel">
                    <div className="tablaPrestamos table-responsive">
                        <table className="table table-fixed">
                            <thead className="table-dark ">
                                <tr>
                                    <th scope="col">Nº</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col ">Documento</th>
                                    <th scope="col">Fecha devuelta</th>
                                    <th scope="col">Estado Libro</th>
                                </tr>
                            </thead>
                            <tbody>
                                {devoluciones.map((devolucion, index) => (
                                    <tr key={devolucion.id}>
                                        <td>{index + 1}</td>
                                        <td>{devolucion.nombrePersona}</td>
                                        <td>{devolucion.titulo}</td>
                                        <td>{devolucion?.fecha_devuelta?.slice(0, 10)}</td>
                                        <td>{devolucion?.estadoLibro}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="modal fade" id="modalCrearSancionPrestamo" tabIndex="-1" aria-labelledby="modalCrearSancionPrestamoLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="modalCrearSancionPrestamoLabel">Sanción a Préstamo</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    {/* Tipo de sanción */}
                                    <div className="mb-3">
                                        <label htmlFor="tipoSancionPrestamo" className="form-label">Tipo de Sanción</label>
                                        <select
                                            className="form-select"
                                            id="tipoSancionPrestamo"
                                            value={sancionData.tipo_sancion}
                                            onChange={(e) => setSancionData({ ...sancionData, tipo_sancion: e.target.value })}
                                        >
                                            <option value="">Seleccione una opción</option>
                                            <option value="Retraso en devolución">Retraso en devolución</option>
                                            <option value="Daño al material prestado">Daño al material prestado</option>
                                            <option value="Pérdida del material">Pérdida del material</option>
                                            <option value="Otro">Otro</option>
                                        </select>
                                    </div>

                                    {/* Descripción */}
                                    <div className="mb-3">
                                        <label htmlFor="descripcionPrestamo" className="form-label">Descripción</label>
                                        <textarea
                                            className="form-control"
                                            id="descripcionPrestamo"
                                            rows="3"
                                            value={sancionData.descripcion}
                                            onChange={(e) => setSancionData({ ...sancionData, descripcion: e.target.value })}
                                            placeholder="Detalles de la sanción..."
                                        ></textarea>
                                    </div>

                                    {/* Fecha inicio */}
                                    <div className="mb-3">
                                        <label htmlFor="fechaInicioPrestamo" className="form-label">Fecha de Inicio</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="fechaInicioPrestamo"
                                            value={sancionData.fecha_inicio}
                                            onChange={(e) => setSancionData({ ...sancionData, fecha_inicio: e.target.value })}
                                        />
                                    </div>

                                    {/* Fecha fin */}
                                    <div className="mb-3">
                                        <label htmlFor="fechaFinPrestamo" className="form-label">Fecha de Fin</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="fechaFinPrestamo"
                                            value={sancionData.fecha_fin}
                                            onChange={(e) => setSancionData({ ...sancionData, fecha_fin: e.target.value })}
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    onClick={() => handleSancionarPrestamo()}
                                    data-bs-dismiss="modal"
                                >
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* aqui empieza modal prestamo reservas*/}
                <div className={`modal fade`} id="modalPrestamoReservas" taindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Nuevo Prestamo</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
                            </div>
                            <div className="modal-body">
                                <form >
                                    <div className="mb-3">
                                        <label htmlFor="recipient-name" className="col-form-label">Prestamo Fecha:</label>
                                        <input type="datetime-local" className="form-control" id="fecha_prestamo" name="fecha_prestamo" min="2023-05-00" max="2028-0-0" value={fecha_prestamo}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="recipient-name" className="col-form-label">Devolver Fecha:</label>
                                        <input type="datetime-local" className="form-control" id="fecha_devolver" name="fecha_devolver" min="2023-05-00" max="2028-0-0" value={prestamoData.fecha_devolver}
                                            onChange={(e) =>
                                                setPrestamoData({ ...prestamoData, fecha_devolver: e.target.value })
                                            } />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="recipient-name" className="col-form-label">Observaciones:</label>
                                        <input type="text" className="form-control" id="observaciones" name="observaciones" value={prestamoData.observaciones}
                                            onChange={(e) =>
                                                setPrestamoData({ ...prestamoData, observaciones: e.target.value })
                                            } />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="recipient-name" className="col-form-label">Garantia:</label>
                                        <input type="text" className="form-control" id="garantia" name="garantia" value={prestamoData.garantia}
                                            onChange={(e) =>
                                                setPrestamoData({ ...prestamoData, garantia: e.target.value })
                                            } />
                                    </div>
                                    <div className='mb-3 col selectAutores'>
                                        <label htmlFor="recipient-name" className="col-form-label">Buscar por Ci de estudiante:</label>
                                        <Select
                                            options={filteredOptions}
                                            onChange={handleSelectChange}
                                            isSearchable
                                            placeholder="Selecciona Estudiante"
                                            value={selectedOption}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <input type="nombreEstudiante" className="form-control" id="nombreEstudiante" defaultValue={selectedOption?.nombre} disabled />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                <button type="submit" className="btn btn-primary" onClick={handlePrestamoR} data-bs-dismiss="modal">Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* aqui empieza modal prestamo */}
                <div className={`modal fade`} id="modalPrestamo" taindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Nuevo Prestamo</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
                            </div>
                            <div className="modal-body">
                                <form >
                                    <div className="mb-3">
                                        <label htmlFor="recipient-name" className="col-form-label">Prestamo Fecha:</label>
                                        <input type="datetime-local" className="form-control" id="fecha_prestamo" name="fecha_prestamo" min="2023-05-00" max="2028-0-0" value={fecha_prestamo}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="recipient-name" className="col-form-label">Devolver Fecha:</label>
                                        <input type="datetime-local" className="form-control" id="fecha_devolver" name="fecha_devolver" min="2023-05-00" max="2028-0-0" value={prestamoData.fecha_devolver}
                                            onChange={(e) =>
                                                setPrestamoData({ ...prestamoData, fecha_devolver: e.target.value })
                                            } />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="recipient-name" className="col-form-label">Observaciones:</label>
                                        <input type="text" className="form-control" id="observaciones" name="observaciones" value={prestamoData.observaciones}
                                            onChange={(e) =>
                                                setPrestamoData({ ...prestamoData, observaciones: e.target.value })
                                            } />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="recipient-name" className="col-form-label">Garantia:</label>
                                        <input type="text" className="form-control" id="garantia" name="garantia" value={prestamoData.garantia}
                                            onChange={(e) =>
                                                setPrestamoData({ ...prestamoData, garantia: e.target.value })
                                            } />
                                    </div>
                                    <div className='mb-3 col selectAutores'>
                                        <label htmlFor="recipient-name" className="col-form-label">Buscar por Ci de estudiante:</label>
                                        <Select
                                            options={filteredOptions}
                                            onChange={handleSelectChange}
                                            isSearchable
                                            placeholder="Selecciona Estudiante"
                                            value={selectedOption}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <input type="nombreEstudiante" className="form-control" id="nombreEstudiante" defaultValue={selectedOption?.nombre} disabled />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                <button type="submit" className="btn btn-primary" onClick={handlePrestamo} data-bs-dismiss="modal">Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/*   reservas */}
                <div className="tab-pane fade  " id="reservas" role="tabpanel">
                    <div className="mt-4">
                        <input type="text" className="form-control mb-3" placeholder="Buscar por título, carrera, área" value={searchText} onChange={handleChange} />

                        <div className="table-responsive tablaPrestamos">
                            <table className="table table-bordered">
                                <thead className="table-dark">
                                    <tr>
                                        <th scope="col">Nº</th>
                                        <th scope="col ">Titulo</th>
                                        <th scope="col">Persona</th>
                                        <th scope="col">fecha reserva </th>
                                        <th scope="col">fecha validez</th>
                                        <th scope="col">Accion</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservas.map((reserva, ind) => reserva.estado === 1 && (
                                        <tr key={generarClaveUnica()}>
                                            <td>{ind + 1}</td>
                                            <td>{reserva?.documento.titulo}</td>
                                            <td>{reserva?.persona.nombre}</td>
                                            <td>{reserva?.fecha_reserva.slice(0, 10)}</td>
                                            <td>{reserva?.fecha_validez.slice(0, 10)}</td>
                                            <td>
                                                <button className='btn btn-secondary boton' data-bs-toggle="modal" data-bs-target="#modalPrestamoReservas" data-bs-whatever="@mdo" onClick={() => sedHandleUsuario(reserva.documento)}>Prestar</button>
                                                <button className='btn btn-danger boton' data-bs-toggle="modal" data-bs-target="#modalPrestamoReservas" data-bs-whatever="@mdo" onClick={() => sedHandleUsuario(reserva.documento)}>Cancelar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {/* devolucion */}
                <div className={`modal fade`} id="modalDevolucion" taindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">

                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Devolución</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
                            </div>
                            <div className="modal-body">
                                <form >
                                    <div className="mb-3">
                                        <label htmlFor="recipient-name" className="col-form-label">fecha devolución:</label>
                                        <input type="date" className="form-control" id="fecha_devuelta" name="fecha_devuelta" value={fechaDevuelta.fecha_devuelta}
                                            onChange={(e) => setFechaDevuelta({ ...fechaDevuelta, fecha_devuelta: e.target.value })} />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="recipient-name" className="col-form-label">Estado Documento:</label>
                                        <input type="text" className="form-control" id="estadoDocumento" name="estadoDocumento" value={pres?.estadoDocumento} onChange={(e) =>
                                            setEstadoDocumento(e.target.value)

                                        } required />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                <button type="submit" className="btn btn-primary" onClick={handlePostDevolucion} data-bs-dismiss="modal">Guardar</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* prestamos */}
                <div className="tab-pane fade" id="historial" role="tabpanel">
                    <div className="tablaPrestamos table-responsive">
                        <table className="table table-fixed">
                            <thead className="table-dark sticky-top">
                                <tr>
                                    <th scope="col">Nº</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Prestamo Fecha</th>
                                    <th scope="col">Devolver Fecha</th>
                                    <th scope="col">Documento</th>
                                    <th scope="col">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prestamos.map((prestamo, index) => prestamo.estado === 1 && (
                                    <tr key={prestamo.id}>
                                        <td>{index + 1}</td>
                                        <td>{`${prestamo?.persona?.nombre}`}</td>
                                        <td>{prestamo?.fecha_prestamo?.slice(0, 10)}</td>
                                        <td>{prestamo?.fecha_devolucion?.slice(0, 10)}</td>
                                        <td>{prestamo?.documento?.titulo}</td>
                                        <td>
                                            <button className="btn btn-danger boton" data-bs-toggle="modal" data-bs-target="#modalDevolucion" data-bs-whatever="@mdo" onClick={() => hadlePrestamo(prestamo)}>
                                                Devolver
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-warning btn-sm"
                                                data-bs-toggle="modal"
                                                data-bs-target="#modalCrearSancionPrestamo"
                                                onClick={() => setSelectedPrestamo(prestamo)} // guardas el id del préstamo seleccionado
                                            >Sancionar Préstamo
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/*   prestar */}
                <div className="tab-pane fade show active " id="prestar" role="tabpanel">
                    <div className="mt-4">
                        <input type="text" className="form-control mb-3" placeholder="Buscar por título, carrera, área" value={searchText} onChange={handleChange} />

                        <div className="table-responsive tablaPrestamos">
                            <table className="table table-bordered">
                                <thead className="table-dark">
                                    <tr>
                                        <th scope="col">Nº</th>
                                        <th scope="col ">Titulo</th>
                                        <th scope="col">Autores</th>
                                        <th scope="col">Cantidad </th>
                                        <th scope="col">Tipo Documento</th>
                                        <th scope="col">Area</th>
                                        <th scope="col">Formato</th>
                                        <th scope="col">Accion</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {searchResults.map((documento, ind) => (
                                        <tr key={generarClaveUnica()}>
                                            <td>{ind + 1}</td>
                                            <td>{documento.titulo}</td>
                                            <td>{`${documento.documento_autors[0]?.autor?.nombre}  ${documento.documento_autors[1] ? ", " + documento.documento_autors[1]?.autor?.nombre : ' '}`}</td>
                                            <td>{documento?.cantidad}</td>
                                            <td>{documento?.tipo_doc?.nombre}</td>
                                            <td>{documento?.area?.nombre}</td>
                                            <td>{documento?.formato?.nombre}</td>
                                            <td>
                                                <button className='btn btn-secondary boton' data-bs-toggle="modal" data-bs-target="#modalPrestamo" data-bs-whatever="@mdo" onClick={() => sedHandleUsuario(documento)}>Prestar</button>
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
    );
};

export default prestamo;