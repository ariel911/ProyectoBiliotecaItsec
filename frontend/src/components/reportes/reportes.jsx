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
                (estados.activos && reserva.estado === 1) ||
                (estados.inactivos && reserva.estado === 0) ||
                (estados.eliminados && reserva.estado === 2)
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
            { header: 'Formato', key: 'formato', width: 15 },
            { header: 'Tipo de Documento', key: 'tipo_doc', width: 20 },
            { header: 'Autor(es)', key: 'autores', width: 30 }
        ];

        // Agregar datos
        filteredDocs.forEach((doc,index) => {
            worksheet.addRow({
                id: index+1,
                titulo: doc.titulo,
                cantidad: doc.cantidad,
                anio_edicion: new Date(doc.anio_edicion).toLocaleDateString(),
                ubicacion: doc.ubicacion,
                descripcion: doc.descripcion,
                estado: doc.estado === 1 ? 'Activo' : doc.estado === 0 ? 'Inactivo' : 'Eliminado',
                codigo: doc.codigo,
                area: doc.area.nombre,
                carrera: doc.carrera?.nombre,
                formato: doc.formato.nombre,
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

        filteredPrestamos.forEach((prestamo,index) => {
            worksheet.addRow({
                id: index+1,
                usuario: prestamo.usuario.nombre,
                documento: prestamo.documento.titulo,
                garantia: prestamo.garantia,
                fecha_prestamo: prestamo.fecha_prestamo.slice(0, 10),
                fecha_devolucion: prestamo.fecha_devolucion.slice(0, 10),
                estado: prestamo.estado === 1 ? "Activo" : "Inactivo",
                correo_persona: prestamo.persona.correo
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

        data.forEach((reserva,index) => {
            worksheet.addRow({
                id: index+1,
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
        const matchesCarrera = selectedCarrera
            ? persona.persona_carreras.some(
                (carrera) => carrera.carrera.nombre === selectedCarrera
            )
            : true;
        const matchesTipoPersona = selectedTipoPersona
            ? tipoPersonas.some(
                (tipo) => tipo.nombre == selectedTipoPersona
            )
            : true;

        return matchesCarrera && matchesTipoPersona;
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



        filteredPersonas.forEach((persona, index)=> {
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
        <div class="reportes">
            <h2 class="text-center mb-4">Reportes</h2>
            <ul class="nav nav-tabs mb-4" role="tablist">
                <li class="nav-item">
                    <a class="nav-link active" data-bs-toggle="tab" href="#documentos" role="tab">Documentos</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-bs-toggle="tab" href="#prestamos" role="tab">Préstamos</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-bs-toggle="tab" href="#reservas" role="tab">Reservas</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" data-bs-toggle="tab" href="#personas" role="tab">Personas</a>
                </li>
            </ul>


            <div class="tab-content border p-4 rounded">
                <div class="tab-pane show active" id="documentos" role="tabpanel">
                    <div class="mb-3">
                        <label class="form-check-label me-3">
                            <input type="checkbox" class="form-check-input" name="activos" checked={estados.activos} onChange={handleEstadoChange} /> Activos
                        </label>
                        <label class="form-check-label me-3">
                            <input type="checkbox" class="form-check-input" name="inactivos" checked={estados.inactivos} onChange={handleEstadoChange} /> Inactivos
                        </label>
                        <label class="form-check-label">
                            <input type="checkbox" class="form-check-input" name="eliminados" checked={estados.eliminados} onChange={handleEstadoChange} /> Eliminados
                        </label>
                    </div>

                    <div class="mb-3">
                        <label class="form-label me-2">Carrera:</label>
                        <select class="form-select w-auto d-inline" value={carrera} onChange={handleCarreraChange}>
                            <option value="">Todas</option>
                            <option value="Sistemas Informaticos">Sistemas Informáticos</option>
                            <option value="Mercadotecnia">Mercadotecnia</option>
                            <option value="Contaduría General">Contaduría General</option>
                            <option value="Secretariado Ejecutivo">Secretariado Ejecutivo</option>
                            <option value="Turismo">Turismo</option>
                            <option value="Sin carrera">Sin carrera</option>
                        </select>
                    </div>

                    <button class="btn btn-primary mb-3" onClick={exportToExcel}>Descargar Excel</button>
                    <div className="table-responsive tablaPrestamos">
                        <table class="table table-bordered">
                            <thead class="table-dark">
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Título</th>
                                    <th scope="col">Cantidad</th>
                                    <th scope="col">Año de Edición</th>
                                    <th scope="col">Ubicación</th>
                                    <th scope="col">Descripción</th>
                                    <th scope="col">Estado</th>
                                    <th scope="col">Código</th>
                                    <th scope="col">Área</th>
                                    <th scope="col">Carrera</th>
                                    <th scope="col">Formato</th>
                                    <th scope="col">Tipo de Documento</th>
                                    <th scope="col">Autor(es)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDocs.map(doc => (
                                    <tr key={doc.id}>
                                        <td>{doc.id}</td>
                                        <td>{doc.titulo}</td>
                                        <td>{doc.cantidad}</td>
                                        <td>{new Date(doc.anio_edicion).toLocaleDateString()}</td>
                                        <td>{doc.ubicacion}</td>
                                        <td>{doc.descripcion}</td>
                                        <td>{doc.estado === 1 ? 'Activo' : doc.estado === 0 ? 'Inactivo' : 'Eliminado'}</td>
                                        <td>{doc.codigo}</td>
                                        <td>{doc?.area?.nombre}</td>
                                        <td>{doc?.carrera?.nombre}</td>
                                        <td>{doc?.formato?.nombre}</td>
                                        <td>{doc.tipo_doc.nombre}</td>
                                        <td>{doc.documento_autors.map(da => da.autor.nombre).join(', ')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>


                <div class="tab-pane fade" id="prestamos" role="tabpanel">
                    <div class="d-flex align-items-center mb-3">
                        <label class="me-3">
                            Estado:
                            <select name="estado" class="form-select w-auto d-inline ms-2" value={estado} onChange={handleFilterChange}>
                                <option value="todos">Todos</option>
                                <option value="activos">Activos</option>
                                <option value="inactivos">Inactivos</option>
                                <option value="Eliminados">Eliminados</option>
                            </select>
                        </label>

                        <label class="me-3">
                            Mes:
                            <select name="mes" class="form-select w-auto d-inline ms-2" value={mes} onChange={handleFilterChange}>
                                <option value="">Todos</option>
                                <option value="1">Enero</option>
                                <option value="2">Febrero</option>
                                <option value="3">Marzo</option>
                                <option value="4">Abril</option>
                                <option value="5">Mayo</option>
                                <option value="6">Junio</option>
                                <option value="7">Julio</option>
                                <option value="8">Agosto</option>
                                <option value="9">Septiembre</option>
                                <option value="10">Octubre</option>
                                <option value="11">Noviembre</option>
                                <option value="12">Diciembre</option>
                            </select>
                        </label>

                        <label>
                            Año:
                            <input type="number" class="form-control w-auto d-inline ms-2" name="anio" value={anio} onChange={handleFilterChange} placeholder="Ej. 2024" />
                        </label>
                    </div>

                    <button class="btn btn-primary" onClick={handleExportExcel}>Exportar a Excel</button>
                    <div className="table-responsive tablaPrestamos">
                        <table class="table table-striped table-bordered">
                            <thead class="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Documento</th>
                                    <th>Prestatario</th>
                                    <th>Fecha Prestamo</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPrestamo.map(prestamo => (
                                    <tr key={prestamo.id}>
                                        <td>{prestamo.id}</td>
                                        <td>{prestamo?.documento?.titulo}</td>
                                        <td>{prestamo?.persona?.nombre}</td>
                                        <td>{prestamo.fecha_prestamo.slice(0, 10)}</td>
                                        <td>{prestamo?.estado === 1 ? 'Activo' : prestamo.estado === 0 ? 'Inactivo' : 'Eliminado'}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="tab-pane fade" id="reservas" role="tabpanel">
                    <div class="mb-3">
                        <input type="checkbox" class="form-check-input me-2" checked={estadosR.activos} onChange={() => setEstadosR({ ...estadosR, activos: !estadosR.activos })} /> Activas
                        <input type="checkbox" class="form-check-input ms-4 me-2" checked={estadosR.inactivos} onChange={() => setEstadosR({ ...estadosR, inactivos: !estadosR.inactivos })} /> Inactivas
                        <input type="checkbox" class="form-check-input ms-4 me-2" checked={estadosR.eliminados} onChange={() => setEstadosR({ ...estadosR, eliminados: !estadosR.eliminados })} /> Eliminadas
                    </div>

                    <div class="d-flex align-items-center mb-3">
                        <label class="me-3">Mes:</label>
                        <select class="form-select w-auto d-inline ms-2" value={mesR} onChange={(e) => setMesR(e.target.value)}>
                            <option value="">Todos</option>
                            <option value="1">Enero</option>
                            <option value="2">Febrero</option>
                            <option value="3">Marzo</option>
                            <option value="4">Abril</option>
                            <option value="5">Mayo</option>
                            <option value="6">Junio</option>
                            <option value="7">Julio</option>
                            <option value="8">Agosto</option>
                            <option value="9">Septiembre</option>
                            <option value="10">Octubre</option>
                            <option value="11">Noviembre</option>
                            <option value="12">Diciembre</option>
                        </select>

                        <label class="me-3 ms-4">Año:</label>
                        <input type="number" class="form-control w-auto d-inline ms-2" value={anioR} onChange={(e) => setAnioR(e.target.value)} placeholder="Ingrese el año" />
                    </div>

                    <button class="btn btn-primary" onClick={downloadReporte}>Descargar Reporte</button>
                    <div className="table-responsive tablaPrestamos">
                        <table class="table table-striped table-bordered">
                            <thead class="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Documento</th>
                                    <th>Prestatario</th>
                                    <th>Fecha Prestamo</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReservas.map(reserva => (
                                    <tr key={reserva.id}>
                                        <td>{reserva.id}</td>
                                        <td>{reserva?.documento?.titulo}</td>
                                        <td>{reserva?.persona?.nombre}</td>
                                        <td>{reserva?.fecha_reserva.slice(0, 10)}</td>
                                        <td>{reserva?.estado === 1 ? 'Activo' : reserva.estado === 0 ? 'Inactivo' : 'Eliminado'}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="tab-pane fade" id="personas" role="tabpanel">

                    <div className="filters">
                        <label>Carrera:</label>
                        <select
                            value={selectedCarrera}
                            onChange={(e) => setSelectedCarrera(e.target.value)}
                            className="form-select"
                        >
                            <option value="">Todas</option>
                            <option value="Sistemas Informaticos">Sistemas Informáticos</option>
                            <option value="Mercadotecnia">Mercadotecnia</option>
                            <option value="Contaduría General">Contaduría General</option>
                            <option value="Secretariado Ejecutivo">Secretariado Ejecutivo</option>
                            <option value="Turismo">Turismo</option>
                            <option value="Sin carrera">Sin carrera</option>
                            {/* Agrega más opciones de carreras si es necesario */}
                        </select>

                    </div>

                    <button onClick={exportPersonasToExcel} className="btn btn-primary mt-3">
                        Descargar Excel
                    </button>
                    <div className="table-responsive tablaPrestamos">
                        <table class="table table-striped table-bordered">
                            <thead class="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th>CI</th>
                                    <th>Celular</th>
                                    <th>Estado</th>
                                    <th>Carrera</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPersonas?.map((persona,index) => (
                                    <tr key={persona.id}>
                                         <td>{index + 1}</td> 
                                        <td>{persona.nombre}</td>
                                        <td>{persona.correo}</td>
                                        <td>{persona.ci}</td>
                                        <td>{persona.celular}</td>
                                        <td>{persona.estado === 1 ? "Activo" : "Inactivo"}</td>

                                        <td>
                                            {persona.persona_carreras.map((persona_carreras) => persona_carreras.carrera.nombre).join(", ")}
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
