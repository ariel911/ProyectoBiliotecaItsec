
import './ListarPrestamos.css'
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import lunr from 'lunr';
import Select from 'react-select';

const prestamo = () => {
    const token = localStorage.getItem('token');
    const [selectedUser, setSelectedUser] = useState(null);
    const [sanciones, setSanciones] = useState([]);
    const idUsuario = localStorage.getItem('id');
    const [quitarData, setQuitarData] = useState({
        motivo_levantamiento: "",
        fecha_levantamiento: new Date().toISOString().split("T")[0],
        estado: "1",
    });

    const [prestamoData, setPrestamoData] = useState({
        fecha_prestamo: " ",
        fecha_devolver: " ",
        observaciones: " ",
        persona: "",
        garantia: " ",
        tipo_prestamo: " ",
        estado: '',
    });
    const [sancionData, setSancionData] = useState({
        tipo_sancion: '',
        descripcion: '',
        fecha_inicio: new Date().toISOString().split("T")[0], // 📅 Fecha de hoy en formato YYYY-MM-DD
        fecha_fin: '',
        estado: '',
    });
    const [searchResultsDocuments, setSearchResultsDocuments] = useState([]); // Almacena los resultados de la búsqueda
    const [searchResultsReservas, setSearchResultsReservas] = useState([]); // Almacena los resultados de la búsqueda
    const [searchResultsPrestamos, setSearchResultsPrestamos] = useState([]); // Almacena los resultados de la búsqueda
    const [searchTextDocuments, setSearchTextDocuments] = useState('');
    const [searchTextPrestamos, setSearchTextPrestamos] = useState('');
    const [searchTextReservas, setSearchTextReservas] = useState('');
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
    const [modalVisible, setModalVisible] = useState(false);
    const [prestamoSeleccionado, setPrestamoSeleccionado] = useState(null);
    const [fechaFin, setFechaFin] = useState("");
    //upadte const update
    const getSanciones = async () => {
        const res = await axios.get("http://localhost:8000/api/sancion");
        setSanciones(res.data.data.sancion);
    };
    //prestamos

    const handleGetPrestamos = async () => {
        const res = await axios({
            url: 'http://localhost:8000/api/prestamo',
            method: 'GET',
        });
        setPrestamos(res.data.data.prestamos);
        setSearchResultsPrestamos(res.data.data.prestamos)
    };
    const handleGetUsers = async () => {
        const res = await axios({
            url: "http://localhost:8000/api/documento",
            method: "GET",
        });

        setdocumentos(res.data.data.documentos);
        setSearchResultsDocuments(res.data.data.documentos)
    };

    const handleEstudiantes = async () => {
        const res = await axios({
            url: "http://localhost:8000/api/persona",
            method: "GET",
        });
        setEstudiantes(res.data.data.personas);
    };
    const handleGetReservas = async () => {
        const res = await axios({
            url: 'http://localhost:8000/reservas/reserva',
            method: 'GET',
        });
        setReservas(res.data.data.reserva);
        setSearchResultsReservas(res.data.data.reserva);
    };
    const handleGetDevoluciones = async () => {
        const res = await axios({
            url: "http://localhost:8000/api/devolucion",
            method: "GET",
        });
        setDevoluciones(res.data.data.devolucion);
    };
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

    useEffect(() => {
        // Escucha el evento de cambio de pestaña
        const handleTabChange = (event) => {
            const targetId = event.target.getAttribute("href");

            switch (targetId) {
                case "#prestar":
                    handleGetUsers();
                    break;
                case "#historial":
                    handleGetPrestamos();
                    break;
                case "#reservas":
                    handleGetReservas();
                    break;
                case "#devolver":
                    handleGetDevoluciones();
                    break;
                case "#Sancionados":
                    getSanciones();
                    break;
                default:
                    break;
            }
        };

        // Agregar listener al evento Bootstrap
        const tabs = document.querySelectorAll('a[data-bs-toggle="tab"]');
        tabs.forEach(tab => tab.addEventListener("shown.bs.tab", handleTabChange));

        // Limpieza al desmontar
        return () => {
            tabs.forEach(tab => tab.removeEventListener("shown.bs.tab", handleTabChange));
        };
    }, [handleGetPrestamos, handleGetReservas, handleGetDevoluciones, getSanciones, handleGetUsers]);

    const handlePrestamoR = async () => {
        if (selectedOption['sancion'] == null) {
            try {
                // Buscar la primera reserva activa de la persona seleccionada
                const prestamoActivo = prestamos.find(
                    (p) => p.persona?.id == selectedOption['value'] && p.estado == 1
                );
                if (prestamoActivo) {
                    swal({
                        title: "Préstamo no permitido",
                        text: "La persona ya tiene un préstamo activo.",
                        icon: "warning",
                        button: "Ok",
                    });
                    return; // 🚫 Evita continuar con el préstamo
                }
                // Si hay una reserva activa, darla de baja

                if (selectedUser) {
                    await axios({
                        url: `http://localhost:8000/reservas/reserva/baja/${selectedUser.id}`,
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
                    tipo_prestamo: prestamoData.tipo_prestamo,
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
                // 🔍 Verificar si la persona ya tiene un préstamo activo
                const prestamoActivo = prestamos.find(
                    (p) => p.persona?.id == selectedOption['value'] && p.estado == 1
                );

                if (prestamoActivo) {
                    swal({
                        title: "Préstamo no permitido",
                        text: "La persona ya tiene un préstamo activo.",
                        icon: "warning",
                        button: "Ok",
                    });
                    return; // 🚫 Evita continuar con el préstamo
                }

                // 🔍 Verificar cantidad disponible
                if (selectedUser.cantidad > 0) {
                    const lendingData = {
                        fecha_prestamo: fecha_prestamo,
                        fecha_devolucion: prestamoData.fecha_devolver,
                        observaciones: prestamoData.observaciones,
                        usuarioId: id,
                        garantia: prestamoData.garantia,
                        tipo_prestamo: prestamoData.tipo_prestamo,
                        estado: 1,
                        personaId: selectedOption['value'],
                        documentoId: selectedUser.id,
                    };

                    await axios.post('http://localhost:8000/api/prestamo', lendingData);

                    setPrestamoData({
                        fecha_devolver: '',
                        observaciones: '',
                        garantia: '',
                        tipo_prestamo: '',
                    });
                    setSelectedUser(null);
                    setSelectedOption('');
                    handleGetPrestamos();
                    handleGetUsers();

                    swal({
                        title: "Documento prestado con éxito!",
                        icon: "success",
                        button: "Ok",
                    });
                } else {
                    swal({
                        title: "Ya no se tiene ejemplares!",
                        text: "La cantidad disponible es 0.",
                        icon: "error",
                        button: "Ok",
                    });
                }
            } catch (error) {
                console.error(error);
                swal({
                    title: "Error al prestar documento!",
                    icon: "error",
                    button: "Ok",
                });
            }
        } else {
            swal({
                title: "Error al prestar",
                text: "El estudiante se encuentra sancionado!",
                icon: "error",
                button: "Ok",
            });
        }
    };

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
    //buscador
    const idx = useMemo(() => {
        if (!documentos || documentos.length === 0) return null;
        return lunr(function () {
            this.ref("id");
            this.field("title");
            this.field("descripcion");
            this.field("autores");
            this.field("tipo_doc");
            this.field("area");
            this.field("carrera");

            documentos.forEach((document) => {
                this.add({
                    id: document.id,
                    title: document.titulo || "",
                    descripcion: document.descripcion || "",
                    autores: document.documento_autors?.[0]?.autor?.nombre || "",
                    tipo_doc: document.tipo_doc?.nombre || "",
                    area: document.area?.nombre || "",
                    carrera: document.carrera?.nombre || "",
                });
            });
        });
    }, [documentos]);

    const idx3 = useMemo(() => {
        if (!reservas || reservas.length === 0) return null;
        return lunr(function () {
            this.ref("id");
            this.field("titulo");
            this.field("nombre");
            this.field("ci");
            reservas.forEach((r) => {
                this.add({
                    id: r.id,
                    titulo: r.documento?.titulo || "",
                    nombre: r.persona?.nombre || "",
                    ci: r.persona?.ci || "",
                });
            });
        });
    }, [reservas]);
    const idx2 = useMemo(() => {
        if (!prestamos || prestamos.length === 0) return null;
        return lunr(function () {
            this.ref("id");
            this.field("titulo");
            this.field("nombre");
            this.field("ci");
            this.field("fecha");
            prestamos.forEach((p) => {
                this.add({
                    id: p.id,
                    titulo: p.documento?.titulo || "",
                    nombre: p.persona?.nombre || "",
                    ci: p.persona?.ci || "",
                    fecha: p.fecha_prestamo || "",
                });
            });
        });
    }, [prestamos]);
    const handleChangeDocumentos = (event) => {
        const text = event.target.value;
        setSearchTextDocuments(text);

        if (!idx || text.trim() === "") {
            setSearchResultsDocuments(documentos);
            return;
        }

        try {
            const results = idx.search(`*${text}*`);
            const encontrados = results
                .map((r) => documentos.find((doc) => doc.id == r.ref))
                .filter(Boolean);

            setSearchResultsDocuments(encontrados);
        } catch (error) {
            console.error("Error en búsqueda Lunr (documentos):", error);
            setSearchResultsDocuments([]);
        }
    };
    const handleChangePrestamos = (event) => {
        const text = event.target.value;
        setSearchTextPrestamos(text);

        if (!idx2 || text.trim() === "") {
            setSearchResultsPrestamos(prestamos);
            return;
        }
        try {
            const results = idx2.search(`*${text}*`);
            const encontrados = results
                .map((r) => prestamos.find((p) => p.id == r.ref))
                .filter(Boolean);
            setSearchResultsPrestamos(encontrados);
        } catch (error) {
            console.error("Error en búsqueda Lunr (prestamos):", error);
            setSearchResultsPrestamos([]);
        }
    };
    const handleChangeReservas = (event) => {
        const text = event.target.value;
        setSearchTextReservas(text);

        if (!idx3 || text.trim() === "") {
            setSearchResultsReservas(reservas);
            return;
        }

        try {
            const results = idx3.search(`*${text}*`);
            const encontrados = results
                .map((r) => reservas.find((res) => res.id == r.ref))
                .filter(Boolean);
            setSearchResultsReservas(encontrados);
        } catch (error) {
            console.error("Error en búsqueda Lunr (reservas):", error);
            setSearchResultsReservas([]);
        }
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
                usuarioId: idUsuario,
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
    // Función para actualizar solo la fecha fin
    const handleOpenModal = (prestamo) => {
        setPrestamoSeleccionado(prestamo);

        setFechaFin(prestamo.fecha_devolucion || "");
        setModalVisible(true);
    };

    // 🔹 Cerrar modal
    const handleCloseModal = () => {
        setModalVisible(false);
        setPrestamoSeleccionado(null);
    };

    // 🔹 Ampliar préstamo (solo actualizar fecha_fin)
    const handleAmpliar = async (prestamo) => {
        if (!fechaFin) {
            alert("⚠️ Debes seleccionar una nueva fecha de fin.");
            return;
        }

        if (fechaFin <= prestamo.fecha_prestamo) {
            swal("❌ La nueva fecha debe ser posterior a la fecha de inicio.", "", "error");
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:8000/api/prestamo/ampliar/${prestamo.id}`,
                { fecha_devolucion: fechaFin }
            );

            if (response.data.success) {
                swal({
                    title: "¡Fecha ampliada correctamente!",
                    icon: "success",
                    button: "Ok",
                });
                handleGetPrestamos()
                handleGetUsers();
                handleCloseModal();
            }
        } catch (error) {
            console.error(error);
            alert("❌ Error al ampliar el préstamo");
        }
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
                        placeholder="🔍 Buscar por título, autor, área o tipo..."
                        value={searchTextDocuments}
                        onChange={handleChangeDocumentos}
                    />
                </div>
                <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
                    <table className="table table-hover align-middle text-center">
                        <thead className="table-dark sticky-top">
                            <tr>
                                <th>#</th>
                                <th>Título</th>
                                <th>Descripción</th>
                                <th>Autores</th>
                                <th>Cantidad</th>
                                <th>Tipo</th>
                                <th>Área</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchResultsDocuments?.map((doc, i) => (
                                <tr
                                    key={i}
                                    className={
                                        doc.estado === 0 || doc.cantidad === 0
                                            ? "table-danger" // 🔴 Rojo si está inactivo o sin stock
                                            : ""
                                    }
                                >
                                    <td>{i + 1}</td>
                                    <td>{doc.titulo}</td>
                                    <td>{doc.descripcion}</td>
                                    <td>
                                        {doc?.documento_autors?.map((a, idx) => (
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
                                            onClick={() => sedHandleUsuario(doc)}
                                            disabled={doc.estado === 0 || doc.cantidad === 0} // 🔒 Desactiva si no se puede prestar
                                        >
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
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control shadow-sm"
                        placeholder="🔍 Buscar préstamo por título, nombre o CI..."
                        value={searchTextPrestamos}
                        onChange={handleChangePrestamos}
                    />
                </div>
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
                            {searchResultsPrestamos?.filter((d) => d.estado == 1).map((p, i) => {
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
                                                <button
                                                    className="btn btn-warning btn-sm"
                                                    onClick={() => handleOpenModal(p)}
                                                >
                                                    ✏️ Ampliar
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
                        placeholder="🔍 Buscar reserva por título, persona o CI..."
                        value={searchTextReservas}
                        onChange={handleChangeReservas}
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
                            {searchResultsReservas?.filter((d) => d.estado == 1).map((r, i) => {
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
                            })}
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
                                <div className='row'>
                                    <div className="mb-3 col">
                                        <label className="form-label">Fecha Préstamo</label>
                                        <input type="datetime-local" className="form-control" value={fecha_prestamo} readOnly />
                                    </div>
                                    <div className="mb-3 col">
                                        <label className="form-label">Fecha Devolver</label>
                                        <input type="datetime-local" className="form-control" value={prestamoData.fecha_devolver}
                                            onChange={e => setPrestamoData({ ...prestamoData, fecha_devolver: e.target.value })} />
                                    </div>
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
                                    <label className="form-label">Tipo Prestamo</label>
                                    <input type="text" className="form-control" value={prestamoData.tipo_prestamo}
                                        onChange={e => setPrestamoData({ ...prestamoData, tipo_prestamo: e.target.value })} />
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
                                <div className='row'>
                                    <div className="mb-3 col">
                                        <label className="form-label">Nombre</label>
                                        <input type="text" className="form-control" value={selectedUser?.persona?.nombre} readOnly />
                                    </div>
                                    <div className="mb-3 col">
                                        <label className="form-label">Ci</label>
                                        <input type="text" className="form-control" value={selectedUser?.persona?.ci} readOnly />
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className="mb-3 col">
                                        <label className="form-label">Fecha Préstamo</label>
                                        <input type="datetime-local" className="form-control" value={fecha_prestamo} readOnly />
                                    </div>
                                    <div className="mb-3 col">
                                        <label className="form-label">Fecha Devolver</label>
                                        <input type="datetime-local" className="form-control" value={prestamoData.fecha_devolver}
                                            onChange={e => setPrestamoData({ ...prestamoData, fecha_devolver: e.target.value })} />
                                    </div>
                                </div>


                                <div className="mb-3">
                                    <label className="form-label">Observaciones</label>
                                    <input type="text" className="form-control" value={prestamoData.observaciones}
                                        onChange={e => setPrestamoData({ ...prestamoData, observaciones: e.target.value })} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Garantía</label>
                                    <input type="text" className="form-control" value={prestamoData.tipo_prestamo}
                                        onChange={e => setPrestamoData({ ...prestamoData, tipo_prestamo: e.target.value })} />
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
                                {/*  <div className="mb-3">
                                    <label className="form-label">Documento</label>
                                    <input type="date" className="form-control" value={pres.documento?.titulo} readOnly />
                                </div> */}
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
                                <div className='row'>
                                    <div className="mb-3 col">
                                        <label className="form-label">Fecha Inicio</label>
                                        <input type="date" className="form-control" value={sancionData.fecha_inicio}
                                            onChange={e => setSancionData({ ...sancionData, fecha_inicio: e.target.value })} />
                                    </div>
                                    <div className="mb-3 col">
                                        <label className="form-label">Fecha Fin</label>
                                        <input type="date" className="form-control" value={sancionData.fecha_fin}
                                            onChange={e => setSancionData({ ...sancionData, fecha_fin: e.target.value })} />
                                    </div>
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

        {/* Modal Fecha ampliar */}
        {/* Modal para ampliar préstamo */}
        {modalVisible && prestamoSeleccionado && (
            <div
                className="modal fade show"
                style={{ display: "block", backgroundColor: "rgba(0,0,0,0.4)" }}
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content shadow">
                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title fw-bold">📘 Ampliar Préstamo</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={handleCloseModal}
                            ></button>
                        </div>

                        <div className="modal-body">
                            {/* Estudiante */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">👤 Estudiante</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={prestamoSeleccionado.persona?.nombre || ""}
                                    readOnly
                                />
                            </div>

                            {/* Documento */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">📚 Documento</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={prestamoSeleccionado.documento?.titulo || ""}
                                    readOnly
                                />
                            </div>

                            {/* Fecha inicio */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">📅 Fecha de inicio</label>
                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    value={
                                        prestamoSeleccionado?.fecha_prestamo
                                            ? new Date(prestamoSeleccionado.fecha_prestamo)
                                                .toISOString()
                                                .slice(0, 16) // ✅ formato "YYYY-MM-DDTHH:MM"
                                            : ""
                                    }
                                    readOnly
                                />
                            </div>

                            {/* Nueva fecha fin */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">📅 Nueva fecha de fin</label>
                                <input
                                    type="datetime-local"
                                    className="form-control"
                                    value={fechaFin}
                                    onChange={(e) => setFechaFin(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={handleCloseModal}>
                                Cancelar
                            </button>
                            <button
                                className="btn btn-success"
                                onClick={() => handleAmpliar(prestamoSeleccionado)}
                            >
                                💾 Guardar cambios
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>


};

export default prestamo;