
import './ListarPrestamos.css'
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import lunr from 'lunr';
import Select from 'react-select';

const prestamo = () => {
    const token = localStorage.getItem('token');
    const [selectedUser, setSelectedUser] = useState(null);
    const [sanciones, setSanciones] = useState([]);
    const [quitarData, setQuitarData] = useState({
        motivo_levantamiento: "",
        fecha_levantamiento: new Date().toISOString().split("T")[0],
        estado: "1",
    });

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
        // Detectar cuando se muestra una nueva pestaña de Bootstrap
        const tabs = document.querySelectorAll('#prestamoTabs a[data-bs-toggle="tab"]');

        const handleTabChange = (event) => {
            const target = event.target.getAttribute("href"); // Ej: "#reservas"

            if (target === "#reservas") {
                handleGetReservas(); // 🔄 Actualizar reservas al entrar a la pestaña
            }
        };

        tabs.forEach((tab) => {
            tab.addEventListener("shown.bs.tab", handleTabChange);
        });

        // Limpieza al desmontar el componente
        return () => {
            tabs.forEach((tab) => {
                tab.removeEventListener("shown.bs.tab", handleTabChange);
            });
        };
    }, []);
    useEffect(() => {
        handleGetUsers();
        handleGetReservas();
        handleEstudiantes();
        handleGetPrestamos();
        handleGetDevoluciones();
        getSanciones();
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

                const reservaPersona = reservas.find(
                    reserva => reserva.persona.id === selectedUser.persona.id && reserva.estado === 1
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
                    personaId: selectedUser.persona.id,
                    documentoId: selectedUser.documento.id,
                };
                // Enviar la solicitud de préstamo
                await axios({
                    url: 'http://localhost:8000/api/prestamo/PrestamoR',
                    method: 'POST',
                    data: lendingData,
                });
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
    const handleCancelarReserva = async (reserva) => {
        swal({
            title: "¿Cancelar reserva?",
            text: `¿Estás seguro de cancelar la reserva del libro "${reserva.documento.titulo}"?`,
            icon: "warning",
            buttons: ["No", "Sí, cancelar"],
            dangerMode: true,
        }).then(async (willCancel) => {
            if (willCancel) {
                try {
                    // Petición al backend para dar de baja la reserva
                    await axios({
                        url: `http://localhost:8000/reservas/reserva/cancelar/${reserva.id}`,
                        method: "PUT",
                        data: { estado: 0 },
                    });

                    // Refrescar datos
                    handleGetReservas();
                    handleGetUsers();

                    swal({
                        title: "Reserva cancelada",
                        text: "La reserva fue cancelada correctamente y el libro ha sido actualizado.",
                        icon: "success",
                        button: "Ok",
                    });
                } catch (error) {
                    console.error(error);
                    swal({
                        title: "Error",
                        text: "No se pudo cancelar la reserva.",
                        icon: "error",
                        button: "Ok",
                    });
                }
            }
        });
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

    // Genera las opciones
    const options = estudiantes?.filter((estudiante) => estudiante.estado === 1).map((estudiante) => ({
        value: estudiante.id,
        label: estudiante.ci,
        nombre: estudiante.nombre,
        sancion: estudiante.sancion,
        estado: estudiante.estado,
    }));

    // Maneja el cambio de selección
    const handleSelectChange = (option) => {
        setSelectedOption(option);
    };

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
        const results = simulateSearch(text);

        setSearchResults(results);
    };

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
            nombrePersona: pres.persona?.nombre,
            titulo: pres.documento?.titulo,
            prestamo: pres.id,
            fecha_devuelta: fechaDevuelta?.fecha_devuelta,
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
        handleGetUsers();
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
            handleGetPrestamos();
            getSanciones();
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
    const confirmarQuitarSancion = async () => {

        try {
            await axios.post("http://localhost:8000/api/sancion_historial", {
                ...quitarData,
                sancionId: selectedUser.id,
                personaId: selectedUser.persona.id,
                prestamoId: selectedUser.prestamo.id,
            });
            if (selectedUser.prestamo.id && selectedUser.prestamo.documento.id) {
                await axios.put(
                    `http://localhost:8000/api/documento/actualizarDoc/${selectedUser.prestamo.documento.id}`
                );
            }
            await axios.put(`http://localhost:8000/api/persona/baja/${selectedUser.persona.id}`, { estado: 1 });
            swal("✅ Sanción levantada con éxito", "", "success");
            getSanciones();
            handleGetUsers();
        } catch (err) {
            console.error(err);
            swal("❌ Error al levantar sanción", "", "error");
        }
    };
    const getSanciones = async () => {
        const res = await axios.get("http://localhost:8000/api/sancion");
        setSanciones(res.data.data.sancion);
    };
    const abrirModalQuitar = (sancion) => {
        setSelectedUser(sancion);
        setQuitarData({
            motivo_levantamiento: "",
            fecha_levantamiento: new Date().toISOString().split("T")[0],
            estado: "1",
        });
        new window.bootstrap.Modal(
            document.getElementById("modalQuitarSancion")
        ).show();
    };

    return <div className="container-fluid prestamos mt-4">
        <h2 className="text-center mb-4 fw-bold text-primary">📚 Gestión de Préstamos</h2>

        {/* NAV TABS */}
        <ul className="nav nav-tabs justify-content" id="prestamoTabs" role="tablist">
            <li className="nav-item">
                <a className="nav-link active fw-semibold" data-bs-toggle="tab" href="#prestar" role="tab">Prestar</a>
            </li>
            <li className="nav-item">
                <a className="nav-link fw-semibold" data-bs-toggle="tab" href="#historial" role="tab">Préstamos</a>
            </li>
            <li className="nav-item">
                <a className="nav-link fw-semibold" data-bs-toggle="tab" href="#reservas" role="tab">Reservas</a>
            </li>
            <li className="nav-item">
                <a className="nav-link fw-semibold" data-bs-toggle="tab" href="#devolver" role="tab">Devueltos</a>
            </li>
            <li className="nav-item">
                <a className="nav-link fw-semibold" data-bs-toggle="tab" href="#Sancionados" role="tab">Sancionados</a>
            </li>
        </ul>

        {/* CONTENIDO DE LAS PESTAÑAS */}
        <div className="tab-content p-3 border border-top-0 bg-light rounded-bottom shadow-sm" id="myTabContent">

            {/* TAB - PRESTAR */}
            <div className="tab-pane fade show active" id="prestar" role="tabpanel">
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control shadow-sm"
                        placeholder="🔍 Buscar por título, área o tipo..."
                        value={searchText}
                        onChange={handleChange}
                    />
                </div>
                <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    <table className="table table-hover align-middle text-center">
                        <thead className="table-dark sticky-top">
                            <tr>
                                <th>#</th>
                                <th>Título</th>
                                <th>Autores</th>
                                <th>Cantidad</th>
                                <th>Tipo</th>
                                <th>Área</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchResults.map((doc, i) => (
                                <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td>{doc.titulo}</td>
                                    <td>
                                        {doc.documento_autors.map((a, idx) => (
                                            <span key={idx}>
                                                {a.autor?.nombre}
                                                {idx < doc.documento_autors.length - 1 ? ", " : ""}
                                            </span>
                                        ))}
                                    </td>
                                    <td>{doc.cantidad}</td>
                                    <td>{doc.tipo_doc?.nombre}</td>
                                    <td>{doc.area?.nombre}</td>
                                    <td>
                                        <button
                                            className="btn btn-outline-primary btn-sm"
                                            data-bs-toggle="modal"
                                            data-bs-target="#modalPrestamo"
                                            onClick={() => sedHandleUsuario(doc)}>
                                            Prestar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* TAB - PRESTAMOS */}
            <div className="tab-pane fade" id="historial" role="tabpanel">
                <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    <table className="table table-hover text-center align-middle">
                        <thead className="table-dark sticky-top">
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Fecha Préstamo</th>
                                <th>Fecha Devolver</th>
                                <th>Documento</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prestamos.map((p, i) => {
                                const fechaDevolucion = new Date(p.fecha_devolucion);
                                const hoy = new Date();
                                const vencido = fechaDevolucion < hoy && p.estado === 1;

                                return (
                                    p.estado === 1 && (
                                        <tr key={p.id} className={vencido ? "table-danger" : ""}>
                                            <td>{i + 1}</td>
                                            <td>{p.persona?.nombre}</td>
                                            <td>{p.fecha_prestamo?.slice(0, 10)}</td>
                                            <td className={vencido ? "fw-bold text-danger" : ""}>
                                                {p.fecha_devolucion?.slice(0, 10)}
                                                {vencido && <i className="bi bi-exclamation-triangle-fill ms-2 text-danger"></i>}
                                            </td>
                                            <td>{p.documento?.titulo}</td>
                                            <td className="d-flex justify-content-center gap-2">
                                                <button
                                                    className="btn btn-outline-success btn-sm"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#modalDevolucion"
                                                    onClick={() => hadlePrestamo(p)}
                                                >
                                                    Devolver
                                                </button>
                                                <button
                                                    className="btn btn-outline-warning btn-sm"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#modalCrearSancionPrestamo"
                                                    onClick={() => setSelectedPrestamo(p)}
                                                >
                                                    Sancionar
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                );
                            })}
                        </tbody>

                    </table>
                </div>
            </div>

            {/* TAB - RESERVAS */}
            <div className="tab-pane fade" id="reservas" role="tabpanel">
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control shadow-sm"
                        placeholder="🔍 Buscar reserva por título o persona..."
                        value={searchText}
                        onChange={handleChange}
                    />
                </div>
                <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    <table className="table table-hover text-center align-middle">
                        <thead className="table-dark sticky-top">
                            <tr>
                                <th>#</th>
                                <th>Título</th>
                                <th>Persona</th>
                                <th>Fecha Reserva</th>
                                <th>Validez</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservas.map((r, i) => r.estado === 1 && (() => {
                                const fechaValidez = new Date(r.fecha_validez);
                                const hoy = new Date();
                                const vencida = fechaValidez < hoy;

                                return (
                                    <tr key={r.id} className={vencida ? "table-danger" : ""}>
                                        <td>{i + 1}</td>
                                        <td>{r.documento?.titulo}</td>
                                        <td>{r.persona?.nombre}</td>
                                        <td>{r.fecha_reserva?.slice(0, 10)}</td>
                                        <td className={vencida ? "fw-bold text-danger" : ""}>
                                            {r.fecha_validez?.slice(0, 10)}
                                            {vencida && <i className="bi bi-exclamation-triangle-fill ms-2 text-danger"></i>}
                                        </td>
                                        <td className="d-flex justify-content-center gap-2">
                                            <button
                                                className="btn btn-outline-primary btn-sm"
                                                data-bs-toggle="modal"
                                                data-bs-target="#modalPrestamoReservas"
                                                onClick={() => sedHandleUsuario(r)}
                                            >
                                                Prestar
                                            </button>
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                onClick={() => handleCancelarReserva(r)}
                                            >
                                                Cancelar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })())}
                        </tbody>


                    </table>
                </div>
            </div>

            {/* TAB - DEVUELTOS */}
            <div className="tab-pane fade" id="devolver" role="tabpanel">
                <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    <table className="table table-striped text-center align-middle">
                        <thead className="table-dark sticky-top">
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Documento</th>
                                <th>Fecha Devuelta</th>
                                <th>Estado Libro</th>
                            </tr>
                        </thead>
                        <tbody>
                            {devoluciones.map((d, i) => (
                                <tr key={d.id}>
                                    <td>{i + 1}</td>
                                    <td>{d.nombrePersona}</td>
                                    <td>{d.titulo}</td>
                                    <td>{d.fecha_devuelta?.slice(0, 10)}</td>
                                    <td>{d.estadoLibro}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* TAB - SANCIONADOS */}
            <div className="tab-pane fade" id="Sancionados" role="tabpanel">

                <div className="table-responsive" style={{ maxHeight: '540px', overflowY: 'auto' }}>

                    <table className="table table-hover align-middle">
                        <thead className="table-dark sticky-top">
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>Sanción</th>
                                <th>Descripción</th>
                                <th>Fecha Finalización</th>
                                <th>Celular</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sanciones
                                ?.filter((s) => s.estado == 1)
                                .map((s, i) => (
                                    <tr key={s.id}>
                                        <td>{i + 1}</td>
                                        <td>{s.persona?.nombre}</td>
                                        <td>{s.tipo_sancion}</td>
                                        <td>{s.descripcion}</td>
                                        <td>{s.fecha_fin?.slice(0, 10)}</td>
                                        <td>{s.persona?.celular}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-warning"
                                                onClick={() => abrirModalQuitar(s)}
                                            >
                                                <i className="bi bi-x-circle me-1"></i>
                                                Quitar sanción
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>

                </div>

            </div>

            {/* ------------------- MODAL PRESTAMO ------------------- */}
            <div className="modal fade" id="modalPrestamo" tabIndex="-1" aria-labelledby="modalPrestamoLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalPrestamoLabel">Nuevo Préstamo</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Fecha Préstamo</label>
                                    <input type="datetime-local" className="form-control" value={fecha_prestamo} readOnly />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Fecha Devolver</label>
                                    <input type="datetime-local" className="form-control" value={prestamoData.fecha_devolver}
                                        onChange={e => setPrestamoData({ ...prestamoData, fecha_devolver: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Observaciones</label>
                                    <input type="text" className="form-control" value={prestamoData.observaciones}
                                        onChange={e => setPrestamoData({ ...prestamoData, observaciones: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Garantía</label>
                                    <input type="text" className="form-control" value={prestamoData.garantia}
                                        onChange={e => setPrestamoData({ ...prestamoData, garantia: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Buscar Estudiante por CI o Nombre</label>
                                    <Select
                                        options={options}
                                        onChange={handleSelectChange}
                                        isSearchable
                                        placeholder="Selecciona un estudiante"
                                        value={selectedOption}
                                        getOptionLabel={(option) => `${option.label} - ${option.nombre}`} // CI + nombre
                                        getOptionValue={(option) => option.value}
                                        styles={{
                                            menu: (provided) => ({ ...provided, zIndex: 9999 }), // evita problemas con modales
                                        }}
                                    />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" className="btn btn-primary" onClick={handlePrestamo} data-bs-dismiss="modal">Guardar</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* MODAL QUITAR SANCION */}
            <div className="modal fade" id="modalQuitarSancion" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow">
                        <div className="modal-header bg-warning text-dark">
                            <h5 className="modal-title">
                                <i className="bi bi-x-circle-fill me-2"></i> Quitar sanción
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Motivo del levantamiento</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={quitarData.motivo_levantamiento}
                                    onChange={(e) =>
                                        setQuitarData({
                                            ...quitarData,
                                            motivo_levantamiento: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Fecha</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={quitarData.fecha_levantamiento}
                                    onChange={(e) =>
                                        setQuitarData({
                                            ...quitarData,
                                            fecha_levantamiento: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn btn-success"
                                onClick={confirmarQuitarSancion}
                                data-bs-dismiss="modal"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ------------------- MODAL PRESTAMO RESERVAS ------------------- */}
            <div className="modal fade" id="modalPrestamoReservas" tabIndex="-1" aria-labelledby="modalPrestamoReservasLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalPrestamoReservasLabel">Nuevo Préstamo desde Reserva</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Fecha Préstamo</label>
                                    <input type="datetime-local" className="form-control" value={fecha_prestamo} readOnly />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Fecha Devolver</label>
                                    <input type="datetime-local" className="form-control" value={prestamoData.fecha_devolver}
                                        onChange={e => setPrestamoData({ ...prestamoData, fecha_devolver: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Observaciones</label>
                                    <input type="text" className="form-control" value={prestamoData.observaciones}
                                        onChange={e => setPrestamoData({ ...prestamoData, observaciones: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Garantía</label>
                                    <input type="text" className="form-control" value={prestamoData.garantia}
                                        onChange={e => setPrestamoData({ ...prestamoData, garantia: e.target.value })} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" className="btn btn-primary" onClick={handlePrestamoR} data-bs-dismiss="modal">Guardar</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ------------------- MODAL DEVOLUCION ------------------- */}
            <div className="modal fade" id="modalDevolucion" tabIndex="-1" aria-labelledby="modalDevolucionLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalDevolucionLabel">Devolución</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Fecha Devolución</label>
                                    <input type="date" className="form-control" value={fechaDevuelta.fecha_devuelta}
                                        onChange={e => setFechaDevuelta({ ...fechaDevuelta, fecha_devuelta: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Estado Documento</label>
                                    <input type="text" className="form-control" value={estadoDocumento} onChange={e => setEstadoDocumento(e.target.value)} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" className="btn btn-primary" onClick={handlePostDevolucion} data-bs-dismiss="modal">Guardar</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ------------------- MODAL SANCIONAR PRESTAMO ------------------- */}
            <div className="modal fade" id="modalCrearSancionPrestamo" tabIndex="-1" aria-labelledby="modalCrearSancionPrestamoLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="modalCrearSancionPrestamoLabel">Sancionar Préstamo</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Tipo Sanción</label>
                                    <select className="form-select" value={sancionData.tipo_sancion}
                                        onChange={e => setSancionData({ ...sancionData, tipo_sancion: e.target.value })}>
                                        <option value="">Seleccione una opción</option>
                                        <option value="Retraso en devolución">Retraso en devolución</option>
                                        <option value="Daño al material prestado">Daño al material prestado</option>
                                        <option value="Pérdida del material">Pérdida del material</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Descripción</label>
                                    <textarea className="form-control" rows="3" value={sancionData.descripcion}
                                        onChange={e => setSancionData({ ...sancionData, descripcion: e.target.value })}></textarea>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Fecha Inicio</label>
                                    <input type="date" className="form-control" value={sancionData.fecha_inicio}
                                        onChange={e => setSancionData({ ...sancionData, fecha_inicio: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Fecha Fin</label>
                                    <input type="date" className="form-control" value={sancionData.fecha_fin}
                                        onChange={e => setSancionData({ ...sancionData, fecha_fin: e.target.value })} />
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" className="btn btn-primary" onClick={handleSancionarPrestamo} data-bs-dismiss="modal">Guardar</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>


};

export default prestamo;