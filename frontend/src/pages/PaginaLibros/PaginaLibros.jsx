import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import swal from "sweetalert";
import lunr from "lunr";
import "./PaginaLibros.css";
import logo from "../../assets/logo2.png";
import imagenCircular from "../../assets/imgCirular.webp";
import { useNavigate } from "react-router-dom";

const PaginaLibros = () => {
    const [documentos, setDocumentos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDocumento, setSelectedDocumento] = useState(null);
    const [modalType, setModalType] = useState(null); // "detalle" o "reserva"
    const [fecha_reserva, setFecha_reserva] = useState("");
    const [fecha_validez, setFecha_validez] = useState("");
    const [reservas, setReservas] = useState([]);
    const nombrePersona = localStorage.getItem("nombrePersona");
    const personaId = localStorage.getItem("idPersona");
    const [estudiantes, setEstudiantes] = useState([]);
    const [estudianteActual, setEstudianteActual] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const id = localStorage.getItem("idPersona");
    const navigate = useNavigate();
    useEffect(() => {
        fetchDocumentos();
        obtenerReservas()
        const getCurrentDateTime = (daysToAdd = 0) => {
            const now = new Date();
            now.setDate(now.getDate() + daysToAdd);
            return now.toISOString().slice(0, 16);
        };
        setFecha_reserva(getCurrentDateTime());
        setFecha_validez(getCurrentDateTime(1));
    }, []);

    const handleGetEstudiantes = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/persona");
            const list = res.data.data.personas || [];
            setEstudiantes(list);

            const estudiante = list.find((e) => e.id.toString() === id.toString());
            if (estudiante) setEstudianteActual(estudiante);
        } catch (err) {
            console.error("Error cargando estudiantes", err);
        }
    };

    // 🔹 Abrir modal para editar
    const handleEditar = () => {
        if (!estudianteActual) {
            alert("No se encontró el estudiante actual.");
            return;
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    // 🔹 Cambiar valores en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEstudianteActual((prev) => ({ ...prev, [name]: value }));
    };

    // 🔹 Actualizar estudiante (PUT con axios)
    const handleUpdateEstudiante = async () => {
        if (!estudianteActual || !estudianteActual.id) {
            alert("No hay estudiante seleccionado para actualizar.");
            return;
        }

        try {
            setSaving(true);

            const url = `http://localhost:8000/api/persona/${estudianteActual.id}`;
            const body = {
                nombre: estudianteActual.nombre,
                clave: estudianteActual.clave?.toString(),
                correo: estudianteActual.correo,
                ci: estudianteActual.ci,
                celular: estudianteActual.celular,
            };

            // 🔹 Enviar actualización con axios.put
            const res = await axios.put(url, body);

            if (res.status === 200 || res.status === 201) {
                alert("✅ Datos actualizados correctamente.");
                await handleGetEstudiantes();
                setModalOpen(false);
            } else {
                alert("⚠️ No se pudo actualizar. Revisa la consola.");
                console.warn("Respuesta inesperada:", res);
            }
        } catch (error) {
            console.error("Error al actualizar estudiante:", error);
            alert("❌ Error al actualizar los datos. Revisa la consola.");
        } finally {
            setSaving(false);
        }
    };

    // 🔹 Cargar datos al montar
    useEffect(() => {
        handleGetEstudiantes();
    }, []);

    // 🔹 Cerrar sesión

    const obtenerReservas = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/reservas/reserva`);
            setReservas(response.data.data.reserva);
        } catch (error) {
            console.error("Error al cargar reservas:", error);
        }
    };
    const fetchDocumentos = async () => {
        try {
            const { data } = await axios.get("http://localhost:8000/api/documento");
            setDocumentos(data.data.documentos);
        } catch (error) {
            console.error("Error al obtener documentos:", error);
        }
    };

    // 🧠 Índice de búsqueda con lunr (solo se recalcula si cambian los documentos)
    const searchIndex = useMemo(() => {
        if (documentos.length === 0) return null;
        return lunr(function () {
            this.ref("id");
            this.field("titulo");
            this.field("descripcion");
            this.field("autor");
            this.field("tipo_doc");
            this.field("area");

            documentos.forEach((doc) => {
                this.add({
                    id: doc.id,
                    titulo: doc.titulo || "",
                    descripcion: doc.descripcion || "",
                    autor: doc.documento_autors?.[0]?.autor?.nombre || "",
                    tipo_doc: doc.tipo_doc?.nombre || "",
                    area: doc.area?.nombre || "",
                    carrera: doc.carrera?.nombre || "",
                });
            });
        });
    }, [documentos]);

    // 🔍 Búsqueda en tiempo real con coincidencias parciales
    const filteredResults = useMemo(() => {
        if (!searchTerm.trim() || !searchIndex) return documentos;

        try {
            // Permite coincidencias parciales al escribir
            const query = `*${searchTerm.toLowerCase()}*`;
            const results = searchIndex.search(query);

            return results
                .map((r) => documentos.find((d) => d.id === parseInt(r.ref)))
                .filter(Boolean);
        } catch (error) {
            // Si el término no es válido, se muestra todo
            return documentos;
        }
    }, [searchTerm, documentos, searchIndex]);

    // 📚 Filtrar por tipo de documento 
    const filtrarPorTipo = (tipo) =>
        filteredResults.filter((doc) => doc.tipo_doc?.nombre === tipo);

    const handleReserva = async () => {
        try {
            if (selectedDocumento.cantidad <= 0) {
                swal("Ya no hay ejemplares disponibles", "", "error");
                return;
            }

            // 🔹 Obtener todas las reservas
            const { data } = await axios.get("http://localhost:8000/reservas/reserva");

            // 🔹 Filtrar solo las activas del estudiante actual
            const reservasActivas = data.data.reserva.find(
                (reserva) => parseInt(reserva.persona.id) === parseInt(personaId) && reserva.estado === 1
            );

            // 🔹 Validar máximo 2 reservas activas
            if (reservasActivas) {
                swal("Límite alcanzado", "Solo puedes tener hasta 1 reserva activa 📚", "warning");
                return;
            }

            // 🔹 Crear reserva si pasa validación
            await axios.post("http://localhost:8000/reservas/reserva", {
                fecha_reserva,
                fecha_validez,
                estado: 1,
                personaId,
                documentoId: selectedDocumento.id,
            });

            swal("¡Reserva exitosa!", "Tu documento ha sido reservado.", "success");
            fetchDocumentos();
            obtenerReservas();

            setModalType(null);
        } catch (error) {
            console.error(error);
            swal("Error al reservar el documento", "", "error");
        }
    };
    // Cerrar sesión
    const handleLogOut = () => {
        localStorage.removeItem("nombrePersona");
        localStorage.removeItem("idPersona");
        navigate("/login_biblioteca");
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
                    obtenerReservas();
                    fetchDocumentos();

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
    const Modal = () => {
        if (!selectedDocumento || !modalType) return null;

        return (
            <div className="modal fade show" style={{ display: "block" }}>
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                        {/* Header */}
                        <div className="modal-header bg-primary text-white">
                            <h5 className="modal-title fw-semibold">
                                {modalType === "detalle"
                                    ? selectedDocumento.titulo
                                    : `Reservar: ${selectedDocumento.titulo}`}
                            </h5>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={() => setModalType(null)}
                            ></button>
                        </div>

                        {/* Body */}
                        <div className="modal-body">
                            {modalType === "detalle" ? (
                                <div className="row g-4">
                                    {/* Imagen */}
                                    <div className="col-md-5 d-flex justify-content-center align-items-start">
                                        <img
                                            src={selectedDocumento.imagen}
                                            alt={selectedDocumento.titulo}
                                            className="img-fluid rounded-3 shadow-sm"
                                            style={{
                                                width: "90%",
                                                height: "300px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </div>

                                    {/* Datos */}
                                    <div className="col-md-7">
                                        <h5 className="fw-bold text-primary mb-2">
                                            {selectedDocumento.titulo}
                                        </h5>

                                        <p className="text-muted">{selectedDocumento.descripcion || "Sin descripción"}</p>

                                        <p>
                                            <strong>📅 Año de edición:</strong>{" "}
                                            {selectedDocumento?.anio?.slice(0, 10) || "Sin especificar"}
                                        </p>

                                        <p>
                                            <strong>📦 Cantidad:</strong>{" "}
                                            {selectedDocumento.cantidad}
                                        </p>

                                        <p>
                                            <strong>📚 Área:</strong>{" "}
                                            {selectedDocumento.area?.nombre || "No asignada"}
                                        </p>

                                        {/* Autores */}
                                        {selectedDocumento.documento_autors &&
                                            selectedDocumento.documento_autors.length > 0 && (
                                                <p>
                                                    <strong>✍️ Autor(es):</strong>{" "}
                                                    {selectedDocumento.documento_autors
                                                        .map((a) => a.autor?.nombre)
                                                        .filter(Boolean)
                                                        .join(", ")}
                                                </p>
                                            )}

                                        {/* Carrera solo si NO es libro */}
                                        {selectedDocumento.tipo_doc?.nombre !== "libro" && (
                                            <p>
                                                <strong>🎓 Carrera:</strong>{" "}
                                                {selectedDocumento.carrera?.nombre || "N/A"}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                // 🟢 Modal de Reserva
                                <form>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Nombre</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={nombrePersona}
                                            readOnly
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Cantidad Disponible</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={selectedDocumento.cantidad}
                                            disabled
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Fecha de reserva</label>
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            value={fecha_reserva}
                                            readOnly
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-semibold">Validez de reserva</label>
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            value={fecha_validez}
                                            readOnly
                                        />
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setModalType(null)}>
                                Cerrar
                            </button>
                            {modalType === "reserva" && (
                                <button className="btn btn-primary" onClick={handleReserva}>
                                    Confirmar Reserva
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

        );
    };

    const TarjetaDocumento = ({ documento }) => (
        <div className="card m-2 position-relative" style={{ width: "230px", height: "370px" }}>
            {/* Imagen del documento */}
            {documento.tipo_doc.nombre === "Libro" ? (
                <img
                    src={documento.imagen}
                    alt={documento.titulo}
                    style={{ height: "240px", width: "100%", objectFit: "cover", opacity: documento.estado === 0 ? 0.5 : 1 }}
                />
            ) : <img
                src={documento.imagen}
                alt={documento.titulo}
                style={{ height: "220px", width: "100%", objectFit: "cover", opacity: documento.estado === 0 ? 0.5 : 1 }}
            />
            }
            {/* 🟥 Etiqueta de “Agotado” */}
            {documento.estado === 0 && (
                <div
                    className="position-absolute top-0 start-0 w-100 bg-danger text-white text-center fw-bold py-1"
                    style={{ fontSize: "0.9rem" }}
                >
                    🚫 Agotado
                </div>
            )}

            <div className="card-body d-flex flex-column justify-content-between">
                <h6 className="card-title text-center">{documento.titulo}</h6>
                <div className="d-flex justify-content-between">
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={() => {
                            setSelectedDocumento(documento);
                            setModalType("reserva");
                        }}
                        disabled={documento.estado === 0} // 🔹 Deshabilitar si está agotado
                    >
                        Reservar
                    </button>
                    <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => {
                            setSelectedDocumento(documento);
                            setModalType("detalle");
                        }}
                    >
                        Detalles
                    </button>
                </div>
            </div>
        </div>
    );


    return (
        <div className="contenedor3">
            {/* NAV SUPERIOR */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm px-4">
                <div className="container-fluid">
                    <div className="d-flex align-items-center">
                        <img src={logo} className="logo7 me-2" alt="logo" height="45" />
                        <h4 className="text-white mb-0">Biblioteca ITSEC</h4>
                    </div>

                    <div className="dropdown">
                        <img
                            src={estudianteActual?.imagen || imagenCircular}
                            className="rounded-circle"
                            alt="perfil"
                            width="45"
                            height="45"
                            data-bs-toggle="dropdown"
                            role="button"
                        />
                        <ul className="dropdown-menu dropdown-menu-end shadow">
                            <li>
                                <button className="dropdown-item" onClick={handleEditar}>
                                    ✏️ Editar perfil
                                </button>
                            </li>
                            <li>
                                <button
                                    className="nav-link text-start btn text-danger p-3"
                                    onClick={handleLogOut}
                                >
                                    Cerrar sesión
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* CONTENIDO PRINCIPAL */}
            <div className="container my-4">
                <h2 className="text-center fw-bold mb-4 tituloLi">
                    Documentos de la Biblioteca
                </h2>

                {/* PESTAÑAS */}
                <ul className="nav nav-tabs justify-content-center" id="docTabs">
                    <li className="nav-item">
                        <a
                            className="nav-link active"
                            data-bs-toggle="tab"
                            href="#libros"
                        >
                            📚 Libros
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="tab" href="#proyectos">
                            🎓 Documentos Académicos
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" data-bs-toggle="tab" href="#reservas">
                            📅 Mis Reservas
                        </a>
                    </li>

                </ul>

                {/* BARRA DE BÚSQUEDA */}
                <div className="mt-3 mb-4">
                    <input
                        type="text"
                        className="form-control form-control-lg shadow-sm"
                        placeholder="🔍 Buscar por título, autor o área..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* CONTENIDO DE LAS PESTAÑAS */}
                <div className="tab-content mt-4">
                    {/* Libros */}
                    <div className="tab-pane fade show active" id="libros">
                        <div className="row g-4">
                            {filtrarPorTipo("Libro").map((doc) => (
                                <div key={doc.id} className="col-md-4 col-lg-3">
                                    <TarjetaDocumento documento={doc} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Proyectos de grado */}
                    <div className="tab-pane fade" id="proyectos">
                        <div className="row g-4">
                            {filtrarPorTipo("Proyecto")
                                .concat(filtrarPorTipo("Tesis"))
                                .map((doc) => (
                                    <div key={doc.id} className="col-md-4 col-lg-3">
                                        <TarjetaDocumento documento={doc} />
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>


            {/* NUEVA PESTAÑA: MIS RESERVAS */}
            <div className="tab-pane fade" id="reservas">
                <div className="row g-3">
                    {reservas && reservas.length > 0 ? (
                        reservas
                            // 🔹 Filtrar solo las reservas del usuario logeado
                            .filter((reserva) => reserva.persona?.id == personaId)
                            // 🔹 Ordenar: activas primero
                            .sort((a, b) => b.estado - a.estado)
                            .map((reserva) => (
                                <div key={reserva.id} className="col-md-6 col-lg-3">
                                    <div
                                        className={`card shadow-sm border-0 p-3 m-2 h-100 w-100 transition ${reserva.estado === 1
                                            ? "bg-primary bg-opacity-10 border border-primary"
                                            : "bg-white border border-2 border-light text-muted"
                                            }`}
                                    >
                                        <h5 className="fw-bold mb-2">
                                            📘 {reserva.documento?.titulo || "Sin título"}
                                        </h5>

                                        <p className="mb-1">
                                            <strong>Autor:</strong>{" "}
                                            {`${reserva.documento.documento_autors[0]?.autor?.nombre || ''}${reserva.documento.documento_autors[1] ? ', ' + reserva.documento.documento_autors[1]?.autor?.nombre : ''}`}
                                        </p>

                                        <p className="mb-1">
                                            <strong>Fecha reserva:</strong>{" "}
                                            {new Date(reserva.fecha_reserva).toLocaleDateString()}
                                        </p>

                                        <p className="mb-2">
                                            <strong>Estado:</strong>{" "}
                                            {reserva.estado === 1 ? (
                                                <span className="text-success fw-semibold">
                                                    Activa ✅
                                                </span>
                                            ) : (
                                                <span className="text-secondary fw-semibold">
                                                    Finalizada 🕓
                                                </span>
                                            )}
                                        </p>

                                        {/* 🔹 Botón para cancelar reservas activas */}
                                        {reserva.estado === 1 && (
                                            <button
                                                className="btn btn-outline-danger btn-sm mt-2 fw-semibold w-100"
                                                onClick={() => handleCancelarReserva(reserva)}
                                            >
                                                ❌ Cancelar reserva
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                    ) : (
                        <p className="text-center text-muted mt-4">
                            No tienes reservas registradas.
                        </p>
                    )}
                </div>
            </div>



            <Modal />
            {/* Modal de edición */}
            {/* 🔹 Modal para editar datos */}
            {modalOpen && estudianteActual && (
                <div
                    className="modal fade show"
                    style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Editar Datos</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCloseModal}
                                ></button>
                            </div>

                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Nombre</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={estudianteActual.nombre || ""}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Clave</label>
                                    <input
                                        type="text"
                                        name="clave"
                                        value={estudianteActual.clave || ""}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Correo</label>
                                    <input
                                        type="email"
                                        name="correo"
                                        value={estudianteActual.correo || ""}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">CI</label>
                                    <input
                                        type="text"
                                        name="ci"
                                        value={estudianteActual.ci || ""}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Celular</label>
                                    <input
                                        type="text"
                                        name="celular"
                                        value={estudianteActual.celular || ""}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCloseModal}
                                    disabled={saving}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleUpdateEstudiante}
                                    disabled={saving}
                                >
                                    {saving ? "Guardando..." : "Guardar cambios"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div >

    );
};

export default PaginaLibros;
