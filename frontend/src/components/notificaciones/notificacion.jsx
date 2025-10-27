import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Notificaciones = () => {
    const [notificaciones, setNotificaciones] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            const triggerEl = document.querySelector(`a[href="${location.hash}"]`);
            if (triggerEl) {
                const tab = new bootstrap.Tab(triggerEl);
                tab.show();
            }
        }
    }, [location]);
    // ============================
    // Obtener datos desde las APIs
    // ============================
    const handleGetPrestamos = async () => {
        const res = await axios.get("http://localhost:8000/api/prestamo");
        return res.data.data.prestamos || [];
    };

    const handleGetReservas = async () => {
        const res = await axios.get("http://localhost:8000/reservas/reserva");
        return res.data.data.reserva || [];
    };

    const handleGetSanciones = async () => {
        const res = await axios.get("http://localhost:8000/api/sancion");
        return res.data.data.sancion || [];
    };

    // ============================
    // Generar notificaciones
    // ============================
    const generarNotificaciones = async () => {
        const [prestamos, reservas, sanciones] = await Promise.all([
            handleGetPrestamos(),
            handleGetReservas(),
            handleGetSanciones(),
        ]);

        const nuevas = [];

        // 🔔 Reservas nuevas (ejemplo: las que aún no se aprobaron)
        reservas.forEach((r) => {
            if (r.estado === 1) {
                nuevas.push({
                    tipo: "reserva",
                    mensaje: `Nueva reserva: ${r.documento?.titulo || "Documento"} de ${r.persona?.nombre}`,
                    ruta: "home/prestamo#reservas",
                    color: "primary",
                });
            }
        });

        // ⚠️ Préstamos vencidos (fecha de devolución anterior a hoy)
        const hoy = new Date();
        prestamos.forEach((p) => {
            if (new Date(p.fecha_devolucion) < hoy && p.estado === 1) {
                nuevas.push({
                    tipo: "prestamo",
                    mensaje: `Préstamo vencido: ${p.documento?.titulo || "Documento"} (${p.persona?.nombre})`,
                    ruta: "home/prestamo",
                    color: "warning",
                });
            }
        });

        // 🔓 Sanciones terminadas (fecha_fin < hoy)
        sanciones.forEach((s) => {
            if (new Date(s.fecha_fin) < hoy && s.estado === 1) {
                nuevas.push({
                    tipo: "sancion",
                    mensaje: `Sanción finalizada: ${s.persona?.nombre}`,
                    ruta: "home/sancion",
                    color: "success",
                });
            }
        });

        setNotificaciones(nuevas);

    };


    useEffect(() => {
        generarNotificaciones();
        const interval = setInterval(generarNotificaciones, 5000); // cada 1 min

        return () => clearInterval(interval);
    }, []);

    // ============================
    // Acciones de botones
    // ============================
    const handleRedireccionar = (ruta) => {
        setShowModal(false);
        window.location.href = ruta; // redirige
    };

    const handleMarcarLeido = (index) => {
        setNotificaciones((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <>
            {/* 🔔 ICONO DE NOTIFICACIONES */}
            <div
                className="position-relative me-3"
                style={{ cursor: "pointer" }}
                onClick={() => setShowModal(true)}
            >
                <i className="bi bi-bell fs-4 text-light"></i>
                {notificaciones.length > 0 && (
                    <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        style={{ fontSize: "0.7rem" }}
                    >
                        {notificaciones.length}
                    </span>
                )}
            </div>

            {/* MODAL DE NOTIFICACIONES */}
            <div
                className={`modal fade ${showModal ? "show d-block" : ""}`}
                tabIndex="-1"
                style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content shadow-lg">
                        <div className="modal-header bg-dark text-white">
                            <h5 className="modal-title">
                                <i className="bi bi-bell-fill me-2"></i> Notificaciones
                            </h5>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={() => setShowModal(false)}
                            ></button>
                        </div>
                        <div className="modal-body">

                            {notificaciones.length === 0 ? (
                                <p className="text-center text-muted">No hay notificaciones nuevas 🎉</p>
                            ) : (
                                <ul className="list-group">
                                    {notificaciones.map((n, i) => (
                                        <li
                                            key={i}
                                            className={`list-group-item border-start border-4 border-${n.color} d-flex justify-content-between align-items-center`}
                                        >

                                            <div>
                                                <span className={`badge bg-${n.color} me-2`}>
                                                    {n.tipo.toUpperCase()}
                                                </span>
                                                {n.mensaje}

                                            </div>
                                            <Link className="btn btn-sm btn-outline-secondary" to={n.ruta}>
                                                <i className="bi bi-arrow-right"></i>
                                            </Link>
                                            {/* <div>

                                                <button
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={() => handleMarcarLeido(i)}
                                                >
                                                    <i className="bi bi-check2"></i>
                                                </button>
                                            </div> */}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowModal(false)}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Notificaciones;
