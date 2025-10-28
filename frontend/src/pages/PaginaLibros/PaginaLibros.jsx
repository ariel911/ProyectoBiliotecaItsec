import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import swal from "sweetalert";
import lunr from "lunr";
import "./PaginaLibros.css";
import logo from "../../assets/logo2.png";
import imagenCircular from "../../assets/imgCirular.webp";

const PaginaLibros = () => {
    const [documentos, setDocumentos] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDocumento, setSelectedDocumento] = useState(null);
    const [modalType, setModalType] = useState(null); // "detalle" o "reserva"
    const [fecha_reserva, setFecha_reserva] = useState("");
    const [fecha_validez, setFecha_validez] = useState("");

    const nombrePersona = localStorage.getItem("nombrePersona");
    const personaId = localStorage.getItem("idPersona");

    useEffect(() => {
        fetchDocumentos();
        const getCurrentDateTime = (daysToAdd = 0) => {
            const now = new Date();
            now.setDate(now.getDate() + daysToAdd);
            return now.toISOString().slice(0, 16);
        };
        setFecha_reserva(getCurrentDateTime());
        setFecha_validez(getCurrentDateTime(1));
    }, []);

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
                    formato: doc.formato?.nombre || "",
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
            const reservasActivas = data.data.reserva.filter(
                (reserva) => parseInt(reserva.persona.id) === parseInt(personaId) && reserva.estado === 1
            );

            // 🔹 Validar máximo 2 reservas activas
            if (reservasActivas.length >= 2) {
                swal("Límite alcanzado", "Solo puedes tener hasta 2 reservas activas 📚", "warning");
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
            setModalType(null);
        } catch (error) {
            console.error(error);
            swal("Error al reservar el documento", "", "error");
        }
    };


    const Modal = () => {
        if (!selectedDocumento || !modalType) return null;

        return (
            <div className="modal fade show" style={{ display: "block" }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {modalType === "detalle"
                                    ? selectedDocumento.titulo
                                    : `Reservar: ${selectedDocumento.titulo}`}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setModalType(null)}
                            ></button>
                        </div>

                        <div className="modal-body">
                            {modalType === "detalle" ? (
                                <>
                                    <p>
                                        <strong>Descripción:</strong>{" "}
                                        {selectedDocumento.descripcion || "Sin descripción"}
                                    </p>
                                    <p>
                                        <strong>Autor(es):</strong>{" "}
                                        {selectedDocumento.documento_autors
                                            .map((a) => a.autor?.nombre)
                                            .join(", ")}
                                    </p>
                                    <p>
                                        <strong>Carrera:</strong>{" "}
                                        {selectedDocumento.carrera?.nombre || "N/A"}
                                    </p>
                                    <p>
                                        <strong>Cantidad:</strong> {selectedDocumento.cantidad}
                                    </p>
                                </>
                            ) : (
                                <form>
                                    <div className="mb-3">
                                        <label>Nombre</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={nombrePersona}
                                            readOnly
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label>Cantidad Disponible</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={selectedDocumento.cantidad}
                                            disabled
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label>Fecha de reserva</label>
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            value={fecha_reserva}
                                            readOnly
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label>Validez de reserva</label>
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

                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setModalType(null)}
                            >
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
        <div className="card m-2 position-relative" style={{ width: "240px", height: "400px" }}>
            {/* Imagen del documento */}
            <img
                src={documento.imagen}
                alt={documento.titulo}
                style={{ height: "280px", width: "100%", objectFit: "cover", opacity: documento.estado === 0 ? 0.5 : 1 }}
            />

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
                            src={imagenCircular}
                            className="rounded-circle"
                            alt="perfil"
                            width="45"
                            height="45"
                            data-bs-toggle="dropdown"
                            role="button"
                        />
                        <ul className="dropdown-menu dropdown-menu-end shadow">
                            <li>
                                <a href="/config" className="dropdown-item">
                                    ⚙️ Configuración
                                </a>
                            </li>
                            <li>
                                <a href="/ac" className="dropdown-item text-danger">
                                    🔒 Cerrar sesión
                                </a>
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

            <Modal />
        </div>
    );
};

export default PaginaLibros;
