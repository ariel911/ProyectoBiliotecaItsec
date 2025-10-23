import { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import './rol.css'

const Sanciones = () => {
  const [sancionData, setSancionData] = useState({
    tipo_sancion: "",
    descripcion: "",
    fecha_inicio: "",
    fecha_fin: "",
  });
  const [estudiantes, setEstudiantes] = useState([]);
  const [sanciones, setSanciones] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [busquedaEstudiante, setBusquedaEstudiante] = useState("");
  const [busquedaSancionado, setBusquedaSancionado] = useState("");
  const [busquedaHistorial, setBusquedaHistorial] = useState("");
  const [sancionado, setSancionado] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [quitarData, setQuitarData] = useState({
    motivo_levantamiento: "",
    fecha_levantamiento: new Date().toISOString().split("T")[0],
    estado: "1",
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    await Promise.all([getEstudiantes(), getSanciones(), getHistorial()]);
  };

  const getEstudiantes = async () => {
    const res = await axios.get("http://localhost:8000/api/persona");
    setEstudiantes(res.data.data.personas);
  };

  const getSanciones = async () => {
    const res = await axios.get("http://localhost:8000/api/sancion");
    setSanciones(res.data.data.sancion);
  };

  const getHistorial = async () => {
    const res = await axios.get("http://localhost:8000/api/sancion_historial");
    setHistorial(res.data.data.sancion_historial);
  };

  const sancionarEstudiante = (user) => {
    setSelectedUser(user);
    setSancionado(`${user.nombre} (CI: ${user.ci})`);
  };

  const handleSancionar = async () => {
    if (!selectedUser) return;
    try {
      await axios.post("http://localhost:8000/api/sancion", {
        personaId: selectedUser.id,
        tipo_sancion: sancionData.tipo_sancion,
        descripcion: sancionData.descripcion,
        fecha_inicio: sancionData.fecha_inicio,
        fecha_fin: sancionData.fecha_fin,
        estado: "1",
      });
      swal("✅ Sanción registrada correctamente", "", "success");
      cargarDatos();
    } catch (err) {
      console.error(err);
      swal("❌ Error al registrar sanción", "", "error");
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

  const confirmarQuitarSancion = async () => {
    try {
      await axios.post("http://localhost:8000/api/sancion_historial", {
        ...quitarData,
        sancionId: selectedUser.id,
        personaId: selectedUser.persona.id,
        prestamoId: null,
      });
      swal("✅ Sanción levantada con éxito", "", "success");
      cargarDatos();
    } catch (err) {
      console.error(err);
      swal("❌ Error al levantar sanción", "", "error");
    }
  };

  // 🔎 Filtros
  const qEst = (busquedaEstudiante || "").trim().toLowerCase();
  const qSanc = (busquedaSancionado || "").trim().toLowerCase();
  const qHist = (busquedaHistorial || "").trim().toLowerCase();
  const estudiantesFiltrados = estudiantes.filter((e) => {
    // convertir a string y normalizar
    const nombre = String(e.nombre || "").toLowerCase();
    const ci = String(e.ci ?? "").toLowerCase();
    const correo = String(e.correo || "").toLowerCase();

    if (!qEst) return true; // si no hay query, mostrar todo
    return (
      nombre.includes(qEst) ||
      ci.includes(qEst) ||
      correo.includes(qEst)
    );
  });
  // Filtrado sancionados (tabla "Sancionados")
  const sancionesFiltradas = sanciones.filter((s) => {
    const nombre = String(s.persona?.nombre || "").toLowerCase();
    const ci = String(s.persona?.ci ?? "").toLowerCase();
    const correo = String(s.persona?.correo || "").toLowerCase();

    if (!qSanc) return true;
    return (
      nombre.includes(qSanc) ||
      ci.includes(qSanc) ||
      correo.includes(qSanc)
    );
  });
  // Filtrado historial
  const historialFiltrado = historial.filter((h) => {
    const nombre = String(h.sancion?.persona?.nombre || "").toLowerCase();
    const motivo = String(h.motivo_levantamiento || "").toLowerCase();

    if (!qHist) return true;
    return (
      nombre.includes(qHist) ||
      motivo.includes(qHist)
    );
  });

  return (
    <div className="container py-4 sancion">
      <h2 className="text-center mb-4 fw-bold">Gestión de Sanciones</h2>
      {/* Tabs */}
      <ul className="nav nav-tabs" role="tablist">
        <li className="nav-item">
          <a className="nav-link active" data-bs-toggle="tab" href="#tab1">
            <i className="bi bi-person-x-fill me-1"></i> Sancionar
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-bs-toggle="tab" href="#tab2">
            <i className="bi bi-people-fill me-1"></i> Sancionados
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-bs-toggle="tab" href="#tab3">
            <i className="bi bi-clock-history me-1"></i> Historial
          </a>
        </li>
      </ul>

      <div className="tab-content mt-3">
        {/* TAB 1 - SANCIONAR */}


        <div className="tab-pane fade show active" id="tab1">
          <div className="card shadow-sm p-4 mb-4">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Buscar estudiante por nombre, CI o correo..."
              value={busquedaEstudiante}
              onChange={(e) => setBusquedaEstudiante(e.target.value)}
            />
            <div className="table-responsive" style={{ maxHeight: "400px" }}>
              <table className="table table-hover align-middle">
                <thead className="table-dark sticky-top">
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>CI</th>
                    <th>Celular</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantesFiltrados
                    ?.filter((e) => e.estado == 1)
                    .map((e, i) => (
                      <tr key={e.id}>
                        <td>{i + 1}</td>
                        <td>{e.nombre}</td>
                        <td>{e.correo}</td>
                        <td>{e.ci}</td>
                        <td>{e.celular}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-secondary"
                            data-bs-toggle="modal"
                            data-bs-target="#modalSancionar"
                            onClick={() => sancionarEstudiante(e)}
                          >
                            <i className="bi bi-exclamation-circle me-1"></i>
                            Sancionar
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* TAB 2 - SANCIONADOS */}
        <div className="tab-pane fade" id="tab2">
          <div className="card shadow-sm p-4 mb-4">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Buscar sancionado por nombre, CI o correo..."
              value={busquedaSancionado}
              onChange={(e) => setBusquedaSancionado(e.target.value)}
            />
            <div className="table-responsive" style={{ maxHeight: '540px', overflowY: 'auto' }}>
              <table className="table table-hover align-middle">
                <thead className="table-dark sticky-top">
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Sanción</th>
                    <th>Descripción</th>
                    <th>CI</th>
                    <th>Celular</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {sancionesFiltradas
                    ?.filter((s) => s.estado == 1)
                    .map((s, i) => (
                      <tr key={s.id}>
                        <td>{i + 1}</td>
                        <td>{s.persona?.nombre}</td>
                        <td>{s.tipo_sancion}</td>
                        <td>{s.descripcion}</td>
                        <td>{s.persona?.ci}</td>
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
        </div>

        {/* TAB 3 - HISTORIAL */}

        <div className="tab-pane fade" id="tab3">
          <div className="card shadow-sm p-4 mb-4">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Buscar por nombre o motivo..."
              value={busquedaHistorial}
              onChange={(e) => setBusquedaHistorial(e.target.value)}
            />
            <div className="table-responsive" style={{ maxHeight: "400px" }}>
              <table className="table table-striped align-middle">
                <thead className="table-dark sticky-top">
                  <tr>
                    <th>#</th>
                    <th>Sanción</th>
                    <th>Sancionado</th>
                    <th>Motivo</th>
                    <th>Fecha Levantamiento</th>
                  </tr>
                </thead>
                <tbody>
                  {historialFiltrado.map((h, i) => (
                    <tr key={h.id}>
                      <td>{i + 1}</td>
                      <td>{h.sancion?.tipo_sancion}</td>
                      <td>{h.sancion?.persona?.nombre}</td>
                      <td>{h.motivo_levantamiento}</td>
                      <td>{h.fecha_levantamiento?.slice(0, 10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>


      {/* MODAL SANCIONAR */}
      <div
        className="modal fade"
        id="modalSancionar"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">
                <i className="bi bi-person-dash-fill me-2"></i> Sancionar
                Estudiante
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <p className="fw-semibold">{sancionado}</p>
              <div className="mb-3">
                <label className="form-label">Tipo de sanción</label>
                <select
                  className="form-select"
                  value={sancionData.tipo_sancion}
                  onChange={(e) =>
                    setSancionData({
                      ...sancionData,
                      tipo_sancion: e.target.value,
                    })
                  }
                >
                  <option value="">Seleccionar...</option>
                  <option value="Tomar fotos a proyectos">
                    Tomar fotos a proyectos
                  </option>
                  <option value="Manipular documento sin permiso">
                    Manipular documento sin permiso
                  </option>
                  <option value="Bulla excesiva">Bulla excesiva</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={sancionData.descripcion}
                  onChange={(e) =>
                    setSancionData({
                      ...sancionData,
                      descripcion: e.target.value,
                    })
                  }
                ></textarea>
              </div>
              <div className="row">
                <div className="col">
                  <label className="form-label">Inicio</label>
                  <input
                    type="date"
                    className="form-control"
                    value={sancionData.fecha_inicio}
                    onChange={(e) =>
                      setSancionData({
                        ...sancionData,
                        fecha_inicio: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="col">
                  <label className="form-label">Fin</label>
                  <input
                    type="date"
                    className="form-control"
                    value={sancionData.fecha_fin}
                    onChange={(e) =>
                      setSancionData({
                        ...sancionData,
                        fecha_fin: e.target.value,
                      })
                    }
                  />
                </div>
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
                className="btn btn-primary"
                onClick={handleSancionar}
                data-bs-dismiss="modal"
              >
                Guardar
              </button>
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
    </div>
  );
};

export default Sanciones;
