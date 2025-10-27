import React, { useEffect, useState } from 'react';
import axios from 'axios';
/* import ExcelJS from '       '; */
import { saveAs } from 'file-saver';
import './reportes.css'
import ExcelJS from "exceljs";

const ReporteDocumentos = () => {
    const [documentos, setDocumentos] = useState([]);
    const [filteredDocs, setFilteredDocs] = useState([]);
    const [estados, setEstados] = useState({
        activos: true,
        inactivos: false,
        eliminados: false
    });
    const [prestamos, setPrestamos] = useState([]);
    const [estado, setEstado] = useState("todos"); // 'todos', 'activos', 'inactivos'
    const [mes, setMes] = useState("");
    const [anio, setAnio] = useState("");
    const [carrera, setCarrera] = useState("");
    const [filteredReservas, setFilteredReservas] = useState([]);
    const [sfilteredPrestamos, setFilteredPrestamos] = useState([]);
    const [estadosR, setEstadosR] = useState({ activos: true, inactivos: true, eliminados: false });
    const [mesR, setMesR] = useState('');
    const [anioR, setAnioR] = useState('');
    const [reservas, setReservas] = useState([]);
    const [estudiantes, setEstudiantes] = useState([]);
    const [tipoPersonas, settipoPersonas] = useState([]);
    const [selectedCarrera, setSelectedCarrera] = useState("");
    const [selectedTipoPersona, setSelectedTipoPersona] = useState("");
    const [selectedEstadoPersona, setSelectedEstadoPersona] = useState("todos");

    useEffect(() => {
        handleGetDocuments();
        handleGetPrestamos();
        handleGetEstudiantes();
        handleGetTipoPersonas();
        handleGetReservas();
    }, []);
    useEffect(() => {
        const filtered = reservas.filter(reserva => {
            const fechaReserva = new Date(reserva.fecha_reserva);
            const reservaMes = fechaReserva.getMonth() + 1;
            const reservaAnio = fechaReserva.getFullYear();

            // Verificar si la reserva coincide con los estados seleccionados
            const estadoMatch = (
                (estadosR.activos && reserva.estado === 1) ||
                (estadosR.inactivos && reserva.estado === 0) ||
                (estadosR.eliminados && reserva.estado === 2)
            );

            // Verificar si la reserva coincide con el mes y el año seleccionados
            const mesMatch = mesR ? parseInt(mesR) === reservaMes : true;
            const anioMatch = anioR ? parseInt(anioR) === reservaAnio : true;

            return estadoMatch && mesMatch && anioMatch;
        });

        setFilteredReservas(filtered);
    }, [reservas, estadosR, mesR, anioR]);


    useEffect(() => {
        const filtered = documentos.filter(doc => {
            const estadoMatch = (
                (estados.activos && doc.estado === 1) ||
                (estados.inactivos && doc.estado === 0) ||
                (estados.eliminados && doc.estado === 2)
            );
            const carreraMatch = carrera ? doc?.carrera?.nombre == carrera : true;
            return estadoMatch && carreraMatch;
        });
        setFilteredDocs(filtered);
    }, [documentos, estados, carrera]);
    // Función para obtener estudiantes
    const handleGetEstudiantes = async () => {
        const res = await axios.get("http://localhost:8000/api/persona");
        setEstudiantes(res.data.data.personas);
    };

    // Función para obtener tipos de persona
    const handleGetTipoPersonas = async () => {
        const res = await axios.get("http://localhost:8000/api/tipo_persona");
        settipoPersonas(res.data.data.tipo_persona);
    };

    // Obtener documentos desde la API
    const handleGetDocuments = async () => {
        const res = await axios.get('http://localhost:8000/api/documento');
        setDocumentos(res.data.data.documentos);
    };
    const handleGetPrestamos = async () => {
        const res = await axios.get('http://localhost:8000/api/prestamo');
        setPrestamos(res.data.data.prestamos);
    };
    const handleGetReservas = async () => {
        try {
            const res = await axios({
                url: 'http://localhost:8000/reservas/reserva',
                method: 'GET',
            });
            setReservas(res.data.data.reserva);
        } catch (error) {
            console.error('Error al obtener reservas:', error);
        }
    };

    // Manejar cambios en los checkboxes de estado
    const handleEstadoChange = (e) => {
        const { name, checked } = e.target;
        setEstados(prev => ({ ...prev, [name]: checked }));
    };
    // Manejar cambios en el filtro de carrera
    const handleCarreraChange = (e) => {
        setCarrera(e.target.value);
    };
    // Función para exportar a Excel con ExcelJS
    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Documentos");
        // Agregar encabezados
        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Título', key: 'titulo', width: 30 },
            { header: 'Cantidad', key: 'cantidad', width: 10 },
            { header: 'Año de Edición', key: 'anio_edicion', width: 15 },
            { header: 'Ubicación', key: 'ubicacion', width: 20 },
            { header: 'Descripción', key: 'descripcion', width: 30 },
            { header: 'Estado', key: 'estado', width: 15 },
            { header: 'Código', key: 'codigo', width: 15 },
            { header: 'Área', key: 'area', width: 20 },
            { header: 'Carrera', key: 'carrera', width: 20 },
            { header: 'Tipo de Documento', key: 'tipo_doc', width: 20 },
            { header: 'Autor(es)', key: 'autores', width: 30 }
        ];
        // Agregar datos
        filteredDocs.forEach((doc, index) => {
            worksheet.addRow({
                id: index + 1,
                titulo: doc.titulo,
                cantidad: doc.cantidad,
                anio_edicion: new Date(doc.anio_edicion).toLocaleDateString(),
                ubicacion: doc.ubicacion,
                descripcion: doc.descripcion,
                estado: doc.estado === 1 ? 'Activo' : doc.estado === 0 ? 'Inactivo' : 'Eliminado',
                codigo: doc.codigo,
                area: doc.area.nombre,
                carrera: doc.carrera?.nombre,

                tipo_doc: doc.tipo_doc.nombre,
                autores: doc.documento_autors.map(da => da.autor.nombre).join(', ')
            });
        });
        // Estilos para el encabezado
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFFE0B2' } // Color de fondo
            };
        });
        // Generar y guardar el archivo Excel
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, "ReporteDocumentos.xlsx");
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        if (name === "estado") setEstado(value);
        if (name === "mes") setMes(value);
        if (name === "anio") setAnio(value);
    };

    const filterPrestamos = () => {
        return prestamos.filter(prestamo => {
            const prestamoFecha = new Date(prestamo.fecha_prestamo);
            const prestamoAnio = prestamoFecha.getFullYear();
            const prestamoMes = prestamoFecha.getMonth() + 1;
            const estadoMatch = estado === "todos" ||
                (estado === "activos" && prestamo.estado === 1) ||
                (estado === "inactivos" && prestamo.estado === 0) ||
                (estado === "eliminados" && prestamo.estado === 2);
            const mesMatch = mes ? parseInt(mes) === prestamoMes : true;
            const anioMatch = anio ? parseInt(anio) === prestamoAnio : true;

            return estadoMatch && mesMatch && anioMatch;
        });
    };
    const filteredPrestamo = filterPrestamos();
    const handleExportExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Reporte de Préstamos");
        worksheet.columns = [
            { header: "ID", key: "id", width: 10 },
            { header: "Usuario", key: "usuario", width: 20 },
            { header: "Documento", key: "documento", width: 30 },
            { header: "Garantía", key: "garantia", width: 15 },
            { header: "Fecha Préstamo", key: "fecha_prestamo", width: 20 },
            { header: "Fecha Devolución", key: "fecha_devolucion", width: 20 },
            { header: "Estado", key: "estado", width: 15 },
            { header: "Correo Persona", key: "correo_persona", width: 25 }
        ];
        const filteredPrestamos = filterPrestamos();

        filteredPrestamos.forEach((prestamo, index) => {
            worksheet.addRow({
                id: index + 1,
                usuario: prestamo.usuario?.nombre || "Sin usuario",
                documento: prestamo.documento?.titulo || "Sin documento",
                garantia: prestamo.garantia || "",
                fecha_prestamo: prestamo?.fecha_prestamo ? prestamo.fecha_prestamo.slice(0, 10) : "",
                fecha_devolucion: prestamo?.fecha_devolucion ? prestamo.fecha_devolucion.slice(0, 10) : "",
                estado: prestamo.estado === 1 ? "Activo" : prestamo.estado === 0 ? "Inactivo" : "Eliminado",
                correo_persona: prestamo.persona?.correo || "Sin correo",
            });
        });


        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Reporte_Prestamos.xlsx";
        link.click();
    };
    // Función para exportar los datos a Excel usando ExcelJS
    const downloadReporte = () => {
        let fileName = 'Reservas';
        if (estadosR.activos) fileName += '_Activas';
        if (estadosR.inactivos) fileName += '_Inactivas';
        if (estadosR.eliminados) fileName += '_Eliminadas';
        if (mesR) fileName += `_Mes_${mesR}`;
        if (anioR) fileName += `_Año_${anioR}`;
        exportToExcelReservas(filteredReservas, fileName);
    };
    const exportToExcelReservas = async (data, fileName) => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reservas');

        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Fecha Reserva', key: 'fecha_reserva', width: 20 },
            { header: 'Fecha Validez', key: 'fecha_validez', width: 20 },
            { header: 'Estado', key: 'estado', width: 10 },
            { header: 'Documento', key: 'documento', width: 30 },
            { header: 'Persona', key: 'persona', width: 25 },
        ];
        data.forEach((reserva, index) => {
            worksheet.addRow({
                id: index + 1,
                fecha_reserva: reserva.fecha_reserva,
                fecha_validez: reserva.fecha_validez,
                estado: reserva.estado === 1 ? 'Activa' : reserva.estado === 0 ? 'Inactiva' : 'Eliminada',
                documento: reserva.documento.titulo,
                persona: reserva.persona.nombre,
            });
        });
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).eachCell(cell => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCCCCCC' } };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `${fileName}.xlsx`);
    };
    //personas
    // Filtra los estudiantes según los filtros seleccionados
    const filteredPersonas = estudiantes?.filter((persona) => {
        // Normalizar estado del registro (asegura número)
        const estadoNum = persona.estado != null ? parseInt(persona.estado, 10) : null;

        // ---- CARRERA ----
        // Si selectedCarrera viene como id (numérico) o como nombre, lo manejamos.
        const selectedCarreraNormalized = selectedCarrera != null
            ? String(selectedCarrera).trim().toLowerCase()
            : null;

        const personaCarreras = Array.isArray(persona.persona_carreras)
            ? persona.persona_carreras
            : [];

        const matchesCarrera = selectedCarreraNormalized
            ? personaCarreras.some((c) => {
                // proteger la ruta y normalizar nombre e id
                const nombre = c?.carrera?.nombre ? String(c.carrera.nombre).trim().toLowerCase() : "";
                const id = c?.carrera?.id != null ? String(c.carrera.id) : "";
                return nombre === selectedCarreraNormalized || id === selectedCarreraNormalized;
            })
            : true;

        // ---- TIPO DE PERSONA ----
        const selectedTipoNormalized = selectedTipoPersona != null ? String(selectedTipoPersona).trim().toLowerCase() : "todos";
        const personaTipo = persona.tipo_persona?.nombre ? String(persona.tipo_persona.nombre).trim().toLowerCase() : "";
        const matchesTipoPersona = selectedTipoNormalized === "todos"
            ? true
            : personaTipo === selectedTipoNormalized;

        // ---- ESTADO ----
        // Acepta "todos", "activos", "inactivos", "eliminados"
        const selectedEstadoNormalized = selectedEstadoPersona != null ? String(selectedEstadoPersona).trim().toLowerCase() : "todos";
        let matchesEstado;
        if (selectedEstadoNormalized === "todos") {
            matchesEstado = true;
        } else if (selectedEstadoNormalized === "activos") {
            matchesEstado = estadoNum === 1;
        } else if (selectedEstadoNormalized === "inactivos") {
            matchesEstado = estadoNum === 0;
        } else if (selectedEstadoNormalized === "eliminados") {
            matchesEstado = estadoNum === 2;
        } else {
            // fallback por si el usuario pasa "1" / "0" / "2" directamente
            const maybeEstado = parseInt(selectedEstadoNormalized, 10);
            matchesEstado = !Number.isNaN(maybeEstado) ? estadoNum === maybeEstado : true;
        }

        return matchesCarrera && matchesTipoPersona && matchesEstado;
    });

    const exportPersonasToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Reporte de Personas");

        worksheet.columns = [
            { header: "ID", key: "id", width: 10 },
            { header: "Persona", key: "persona", width: 20 },
            { header: "Correo", key: "correo", width: 30 },
            { header: "Ci", key: "ci", width: 15 },
            { header: "Celular", key: "celular", width: 20 },
            { header: "Carrera", key: "carrera", width: 20 },
            { header: "Estado", key: "estado", width: 15 },
        ];

        filteredPersonas.forEach((persona, index) => {
            worksheet.addRow({
                id: index + 1,
                persona: persona.nombre,
                correo: persona.correo,
                ci: persona.ci,
                celular: persona.celular,
                carrera: persona.persona_carreras.map((persona_carreras) => persona_carreras.carrera.nombre).join(", "),
                estado: persona.estado === 1 ? "Activo" : "Inactivo",
            });
        });
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).eachCell(cell => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFCCCCCC' } };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "Reporte_MiembrosInsti.xlsx";
        link.click();
    };
    return (
        <div className="reportes container ">
            <h2 className="text-center mb-4 fw-bold text-primary">📊 Panel de Reportes</h2>

            <ul className="nav nav-tabs justify-content mb-4" role="tablist">
                <li className="nav-item">
                    <a className="nav-link active fw-semibold" data-bs-toggle="tab" href="#documentos" role="tab">
                        Documentos
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link fw-semibold" data-bs-toggle="tab" href="#prestamos" role="tab">
                        Préstamos
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link fw-semibold" data-bs-toggle="tab" href="#reservas" role="tab">
                        Reservas
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link fw-semibold" data-bs-toggle="tab" href="#personas" role="tab">
                        Personas
                    </a>
                </li>
            </ul>

            <div className="tab-content border rounded p-4 shadow-sm bg-white">
                {/* -------------------- DOCUMENTOS -------------------- */}
                <div className="tab-pane show active" id="documentos" role="tabpanel">
                    <div className="row mb-3 align-items-center">
                        <div className="col-md-6">
                            <label className="form-check-label me-3">
                                <input
                                    type="checkbox"
                                    className="form-check-input me-1"
                                    name="activos"
                                    checked={estados.activos}
                                    onChange={handleEstadoChange}
                                />
                                Activos
                            </label>
                            <label className="form-check-label me-3">
                                <input
                                    type="checkbox"
                                    className="form-check-input me-1"
                                    name="inactivos"
                                    checked={estados.inactivos}
                                    onChange={handleEstadoChange}
                                />
                                Inactivos
                            </label>
                            <label className="form-check-label">
                                <input
                                    type="checkbox"
                                    className="form-check-input me-1"
                                    name="eliminados"
                                    checked={estados.eliminados}
                                    onChange={handleEstadoChange}
                                />
                                Eliminados
                            </label>
                        </div>

                        <div className="col-md-6 text-md-end mt-3 mt-md-0">
                            <label className="form-label me-2 fw-semibold">Carrera:</label>
                            <select
                                className="form-select d-inline-block w-auto"
                                value={carrera}
                                onChange={handleCarreraChange}
                            >
                                <option value="">Todas</option>
                                <option value="Sistemas Informaticos">Sistemas Informáticos</option>
                                <option value="Mercadotecnia">Mercadotecnia</option>
                                <option value="Contaduría General">Contaduría General</option>
                                <option value="Secretariado Ejecutivo">Secretariado Ejecutivo</option>
                                <option value="Turismo">Turismo</option>
                                <option value="Sin carrera">Sin carrera</option>
                            </select>
                        </div>
                    </div>

                    <div className="text-end mb-3">
                        <button className="btn btn-success shadow-sm" onClick={exportToExcel}>
                            📥 Descargar Excel
                        </button>
                    </div>

                    <div className="table-responsive tablaPrestamos">
                        <table className="table table-striped table-hover align-middle">
                            <thead className="table-primary text-center">
                                <tr>
                                    <th>ID</th>
                                    <th>Título</th>
                                    <th>Cantidad</th>
                                    <th>Año de Edición</th>
                                    <th>Ubicación</th>
                                    <th>Descripción</th>
                                    <th>Estado</th>
                                    <th>Código</th>
                                    <th>Área</th>
                                    <th>Carrera</th>
                                    <th>Formato</th>
                                    <th>Tipo</th>
                                    <th>Autor(es)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDocs.map((doc) => (
                                    <tr key={doc.id}>
                                        <td>{doc.id}</td>
                                        <td>{doc.titulo}</td>
                                        <td>{doc.cantidad}</td>
                                        <td>{new Date(doc.anio_edicion).toLocaleDateString()}</td>
                                        <td>{doc.ubicacion}</td>
                                        <td>{doc.descripcion}</td>
                                        <td>
                                            <span
                                                className={`badge ${doc.estado === 1
                                                    ? "bg-success"
                                                    : doc.estado === 0
                                                        ? "bg-warning text-dark"
                                                        : "bg-danger"
                                                    }`}
                                            >
                                                {doc.estado === 1
                                                    ? "Activo"
                                                    : doc.estado === 0
                                                        ? "Inactivo"
                                                        : "Eliminado"}
                                            </span>
                                        </td>
                                        <td>{doc.codigo}</td>
                                        <td>{doc?.area?.nombre}</td>
                                        <td>{doc?.carrera?.nombre}</td>
                                        <td>{doc?.formato?.nombre}</td>
                                        <td>{doc.tipo_doc.nombre}</td>
                                        <td>{doc.documento_autors.map((da) => da.autor.nombre).join(", ")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* -------------------- PRESTAMOS -------------------- */}
                <div className="tab-pane fade" id="prestamos" role="tabpanel">
                    <div className="row g-3 align-items-center mb-3">
                        <div className="col-md-4">
                            <label className="fw-semibold">Estado:</label>
                            <select
                                name="estado"
                                className="form-select mt-1"
                                value={estado}
                                onChange={handleFilterChange}
                            >
                                <option value="todos">Todos</option>
                                <option value="activos">Activos</option>
                                <option value="inactivos">Inactivos</option>
                                <option value="Eliminados">Eliminados</option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="fw-semibold">Mes:</label>
                            <select
                                name="mes"
                                className="form-select mt-1"
                                value={mes}
                                onChange={handleFilterChange}
                            >
                                <option value="">Todos</option>
                                {[...Array(12)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {new Date(0, i).toLocaleString("es", { month: "long" })}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="fw-semibold">Año:</label>
                            <input
                                type="number"
                                className="form-control mt-1"
                                name="anio"
                                value={anio}
                                onChange={handleFilterChange}
                                placeholder="Ej. 2024"
                            />
                        </div>
                    </div>

                    <div className="text-end mb-3">
                        <button className="btn btn-success shadow-sm" onClick={handleExportExcel}>
                            📘 Exportar a Excel
                        </button>
                    </div>

                    <div className="table-responsive tablaPrestamos">
                        <table className="table table-hover table-bordered align-middle">
                            <thead className="table-primary text-center">
                                <tr>
                                    <th>ID</th>
                                    <th>Documento</th>
                                    <th>Prestatario</th>
                                    <th>Fecha Préstamo</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPrestamo.map((prestamo) => (
                                    <tr key={prestamo.id}>
                                        <td>{prestamo.id}</td>
                                        <td>{prestamo?.documento?.titulo}</td>
                                        <td>{prestamo?.persona?.nombre}</td>
                                        <td>{prestamo.fecha_prestamo.slice(0, 10)}</td>
                                        <td>
                                            <span
                                                className={`badge ${prestamo.estado === 1
                                                    ? "bg-success"
                                                    : prestamo.estado === 0
                                                        ? "bg-warning text-dark"
                                                        : "bg-danger"
                                                    }`}
                                            >
                                                {prestamo.estado === 1
                                                    ? "Activo"
                                                    : prestamo.estado === 0
                                                        ? "Inactivo"
                                                        : "Eliminado"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* -------------------- RESERVAS -------------------- */}
                <div className="tab-pane fade" id="reservas" role="tabpanel">
                    <div className="d-flex flex-wrap align-items-center mb-3">
                        <label className="me-3">
                            <input
                                type="checkbox"
                                className="form-check-input me-1"
                                checked={estadosR.activos}
                                onChange={() => setEstadosR({ ...estadosR, activos: !estadosR.activos })}
                            />
                            Activas
                        </label>
                        <label className="me-3">
                            <input
                                type="checkbox"
                                className="form-check-input me-1"
                                checked={estadosR.inactivos}
                                onChange={() => setEstadosR({ ...estadosR, inactivos: !estadosR.inactivos })}
                            />
                            Inactivas
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                className="form-check-input me-1"
                                checked={estadosR.eliminados}
                                onChange={() => setEstadosR({ ...estadosR, eliminados: !estadosR.eliminados })}
                            />
                            Eliminadas
                        </label>
                    </div>

                    <div className="row g-3 mb-3 align-items-center">
                        <div className="col-md-6">
                            <label className="fw-semibold">Mes:</label>
                            <select
                                className="form-select mt-1"
                                value={mesR}
                                onChange={(e) => setMesR(e.target.value)}
                            >
                                <option value="">Todos</option>
                                {[...Array(12)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {new Date(0, i).toLocaleString("es", { month: "long" })}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="fw-semibold">Año:</label>
                            <input
                                type="number"
                                className="form-control mt-1"
                                value={anioR}
                                onChange={(e) => setAnioR(e.target.value)}
                                placeholder="Ingrese el año"
                            />
                        </div>
                    </div>

                    <div className="text-end mb-3">
                        <button className="btn btn-success shadow-sm" onClick={downloadReporte}>
                            📗 Descargar Reporte
                        </button>
                    </div>

                    <div className="table-responsive tablaPrestamos">
                        <table className="table table-hover table-bordered align-middle">
                            <thead className="table-primary text-center">
                                <tr>
                                    <th>ID</th>
                                    <th>Documento</th>
                                    <th>Prestatario</th>
                                    <th>Fecha Reserva</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReservas.map((reserva) => (
                                    <tr key={reserva.id}>
                                        <td>{reserva.id}</td>
                                        <td>{reserva?.documento?.titulo}</td>
                                        <td>{reserva?.persona?.nombre}</td>
                                        <td>{reserva?.fecha_reserva.slice(0, 10)}</td>
                                        <td>
                                            <span
                                                className={`badge ${reserva.estado === 1
                                                    ? "bg-success"
                                                    : reserva.estado === 0
                                                        ? "bg-warning text-dark"
                                                        : "bg-danger"
                                                    }`}
                                            >
                                                {reserva.estado === 1
                                                    ? "Activo"
                                                    : reserva.estado === 0
                                                        ? "Inactivo"
                                                        : "Eliminado"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* -------------------- PERSONAS -------------------- */}
                <div className="tab-pane fade" id="personas" role="tabpanel">
                    <div className="mb-3 row">
                        <div className='col-3'>
                            <label className="fw-semibold me-2">Carrera:</label>
                            <select
                                value={selectedCarrera}
                                onChange={(e) => setSelectedCarrera(e.target.value)}
                                className="form-select w-auto d-inline"
                            >
                                <option value="">Todas</option>
                                <option value="Sistemas Informaticos">Sistemas Informáticos</option>
                                <option value="Mercadotecnia">Mercadotecnia</option>
                                <option value="Contaduría General">Contaduría General</option>
                                <option value="Secretariado Ejecutivo">Secretariado Ejecutivo</option>
                                <option value="Turismo">Turismo</option>
                                <option value="Sin carrera">Sin carrera</option>
                            </select>
                        </div>
                        <div className='col-3'>
                            <label className="fw-semibold me-2">Tipo Persona:</label>
                            <select
                                className="form-select w-auto d-inline"
                                value={selectedTipoPersona}
                                onChange={(e) => setSelectedTipoPersona(e.target.value)}
                            >
                                <option value="todos">Todos los tipos</option>
                                <option value="Estudiante">Estudiante</option>
                                <option value="Docente">Docente</option>
                                <option value="Administrativo">Administrativo</option>
                            </select>
                        </div>
                        <div className="col-2">
                            <label className="fw-semibold me-2">Estado:</label>
                            <select
                                className="form-select w-auto d-inline"
                                value={selectedEstadoPersona}
                                onChange={(e) => setSelectedEstadoPersona(e.target.value)}
                            >
                                <option value="todos">Todos</option>
                                <option value="activos">Activos</option>
                                <option value="inactivos">Inactivos</option>
                            </select>

                        </div>
                        <div className='col-4 mt-4'>
                            <div className="text-end">
                                <button onClick={exportPersonasToExcel} className="btn btn-success shadow-sm">
                                    📋 Descargar Excel
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive tablaPrestamos">
                        <table className="table table-hover table-bordered align-middle">
                            <thead className="table-primary text-center">
                                <tr>
                                    <th>#</th>
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th>CI</th>
                                    <th>Celular</th>
                                    <th>Estado</th>
                                    <th>Carrera</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPersonas?.map((persona, index) => (
                                    <tr key={persona.id}>
                                        <td>{index + 1}</td>
                                        <td>{persona.nombre}</td>
                                        <td>{persona.correo}</td>
                                        <td>{persona.ci}</td>
                                        <td>{persona.celular}</td>
                                        <td>
                                            <span
                                                className={`badge ${persona.estado === 1 ? "bg-success" : "bg-secondary"
                                                    }`}
                                            >
                                                {persona.estado === 1 ? "Activo" : "Inactivo"}
                                            </span>
                                        </td>
                                        <td>
                                            {persona.persona_carreras
                                                .map((pc) => pc.carrera.nombre)
                                                .join(", ")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>


    );
};

export default ReporteDocumentos;
