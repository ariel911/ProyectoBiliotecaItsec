import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import "./sanciones.css"

const ListarLectores = () => {
  const token = localStorage.getItem('token');
  const [selectedUser, setSelectedUser] = useState(null);
  const [sancionData, setSancionData] = useState({
    tipo_sancion: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    estado: '',
  });
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [quitarData, setQuitarData] = useState({
    motivo_levantamiento: "",
    fecha_levantamiento: new Date().toISOString().split("T")[0],
    estado: "1", // 👈 ahora estado 1
  });
  const [estudiantes, setestudiantes] = useState([]);
  const [sanciones, setSanciones] = useState([]);
  const [sanci, setSanci] = useState(0);
  const [selectedUserSancion, setSelectedUserSancion] = useState('');

  const [historial, setHistorial] = useState([]);
  const [busqueda, setBusqueda] = useState("");




  useEffect(() => {
    handleGetHistorial();
    handleGetUsers();
    handleGetUsersSancionados();
  }, [selectedUser]);


  // Abrir modal
  const abrirModalQuitar = (persona) => {
    setSelectedPersona(persona);
    setQuitarData({
      motivo_levantamiento: "",
      fecha_levantamiento: new Date().toISOString().split("T")[0],
      estado: "1", // 👈 se mantiene en 1
    });

    const modal = new window.bootstrap.Modal(
      document.getElementById("modalQuitarSancion")
    );
    modal.show();
  };

  // Confirmar quitar sanción
  const confirmarQuitarSancion = async () => {
    try {
      // 1️⃣ Guardar en sancion_historial
      await axios.post("http://localhost:8000/api/sancion_historial", {
        ...quitarData,
        sancionId: selectedPersona.sancionId, // si tienes relación sancion_historial → sancion
        personaId: selectedPersona.id,
        prestamoId: null        // si tienes relación sancion_historial → persona
      });


      swal("Éxito", "La sanción fue levantada y registrada en historial ✅", "success");

      handleGetUsers(); // refresca listado de personas
      // handleGetHistorial(); // si tienes tabla de historial
    } catch (error) {
      console.error(error);
      swal("Error", "No se pudo quitar la sanción ❌", "error");
    }
  };


  //lectores sancionados
  const handleGetUsersSancionados = async () => {
    const res = await axios({
      url: "http://localhost:8000/api/sancion/",
      method: "GET",
      /*       headers: {
              Authorization: `Bearer ${token}`,
            }, */
    });
    setSanciones(res.data.data.sancion);
  };

  const handleGetUsers = async () => {
    const res = await axios({
      url: "http://localhost:8000/api/persona",
      method: "GET",
      /*       headers: {
              Authorization: `Bearer ${token}`,
            }, */
    });
    setestudiantes(res.data.data.personas);

  };
  const sancionarEstudiante = (user) => {
    setSelectedUserSancion(user.id);


  };
  const handleSancionarLector = async () => {
    try {

      await axios({
        url: `http://localhost:8000/api/sancion`,
        method: 'POST',
        /*           headers: {
                    Authorization: `Bearer ${token}`,
                  }, */
        data: {
          personaId: selectedUserSancion,
          tipo_sancion: sancionData.tipo_sancion,
          descripcion: sancionData.descripcion,
          fecha_inicio: sancionData.fecha_inicio,
          fecha_fin: sancionData.fecha_fin,
          estado: '1',
        },
      });

      // Actualiza la lista de estudiantes sancionados
      handleGetUsersSancionados();
      handleGetUsers();
      setSancionData({
        tipo_sancion: '',
        descripcion: '',
        fecha_inicio: '',
        fecha_fin: '',
        estado: '',
      });
      swal({
        title: "Sancion agregado correctamente!",
        icon: "success",
        button: "Ok",
      });
      setSelectedUser(null);
    } catch (error) {
      // Maneja cualquier error
      console.error(error);
      alert('Error al sancionar al lector');
    }
  };

  const handleGetHistorial = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/sancion_historial");
      setHistorial(res.data.data.sancion_historial);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (item) => {
    setMotivo(item.motivo_levantamiento);
    setFecha(item.fecha_levantamiento);
    setEstado(item.estado);
    setEditId(item.id);
  };

  const handleSearch = (e) => {
    setBusqueda(e.target.value);
  };

  const historialFiltrado = historial?.filter((h) =>
    h.motivo_levantamiento?.toLowerCase().includes(busqueda.toLowerCase())
  );
  return (
    <div className='sanciones'>
      {/* moldal para sancionar lector */}
      <h1 className="tituloSancion">Sancion</h1>
      <ul className="nav nav-tabs" role="tablist">
        <li className="nav-item">
          <a className="nav-link active" data-bs-toggle="tab" href="#listar" role="tab">Sancionar</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-bs-toggle="tab" href="#sancionados" role="tab">Sancionados</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-bs-toggle="tab" href="#listarhistorial" role="tab">Historial Sancionados</a>
        </li>
      </ul>
      {/* modal para quitar sancion */}
      <div className="modal fade" id="modalQuitarSancion" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Quitar sanción</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Motivo levantamiento</label>
                <input
                  type="text"
                  className="form-control"
                  value={quitarData.motivo_levantamiento}
                  onChange={(e) =>
                    setQuitarData({ ...quitarData, motivo_levantamiento: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Fecha levantamiento</label>
                <input
                  type="date"
                  className="form-control"
                  value={quitarData.fecha_levantamiento}
                  onChange={(e) =>
                    setQuitarData({ ...quitarData, fecha_levantamiento: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancelar
              </button>
              <button type="button" className="btn btn-success" onClick={confirmarQuitarSancion}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="modalCrearSancion" tabIndex="-1" aria-labelledby="modalCrearSancionLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="modalCrearSancionLabel">Sancion a Estudiante</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                {/* Tipo de sanción */}
                <div className="mb-3">
                  <label htmlFor="tipoSancion" className="form-label">Tipo de Sanción</label>
                  <select
                    className="form-select"
                    id="tipoSancion"
                    value={sancionData.tipo_sancion}
                    onChange={(e) => setSancionData({ ...sancionData, tipo_sancion: e.target.value })}>
                    <option value="">Seleccione una opción</option>
                    <option value="Tomar fotos a proyectos">Tomar fotos a proyectos</option>
                    <option value="Manipular documento sin permiso">Manipular documento sin permiso</option>
                    <option value="Impresión de documentos no permitidos">Impresión de documentos no permitidos</option>
                    <option value="No respetar el orden del lugar">No respetar el orden del lugar</option>
                    <option value="Bulla excesiva">Bulla excesiva</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                {/* Descripción */}
                <div className="mb-3">
                  <label htmlFor="descripcion" className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    id="descripcion"
                    rows="3"
                    value={sancionData.descripcion}
                    onChange={(e) => setSancionData({ ...sancionData, descripcion: e.target.value })}
                    placeholder="Detalles de la sanción..."
                  ></textarea>
                </div>

                {/* Fecha inicio */}
                <div className="mb-3">
                  <label htmlFor="fechaInicio" className="form-label">Fecha de Inicio</label>
                  <input
                    type="date"
                    className="form-control"
                    id="fechaInicio"
                    value={sancionData.fecha_inicio}
                    onChange={(e) => setSancionData({ ...sancionData, fecha_inicio: e.target.value })}
                  />
                </div>

                {/* Fecha fin */}
                <div className="mb-3">
                  <label htmlFor="fechaFin" className="form-label">Fecha de Fin</label>
                  <input
                    type="date"
                    className="form-control"
                    id="fechaFin"
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
                onClick={handleSancionarLector}
                data-bs-dismiss="modal"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* modal para agregar nueva sancion */}
      <div className="tab-content">
        {/* tabla */}
        <div className={`tab-pane fade show active`} id='listar'>
          <div className="tablaSanciones table-responsive mt-3">
            <table className="table table-fixed">
              <thead className="table-dark sticky-top">
                <tr>
                  <th scope="col">Nº</th>
                  <th scope="col">Nombre</th>
                  <th scope="col ">Correo</th>
                  <th scope="col">celular</th>
                  <th scope="col">Carnet CI</th>
                  <th scope="col">Accion</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes
                  ?.filter(estudiante => estudiante.estado == 1)
                  .map((estudiante, index) => (
                    <tr key={estudiante.id}>
                      <td>{index + 1}</td>
                      <td>{estudiante.nombre}</td>
                      <td>{estudiante.correo}</td>
                      <td>{estudiante.celular}</td>
                      <td>{estudiante.ci}</td>
                      <td>
                        <button
                          className='btn btn-secondary boton'
                          data-bs-toggle="modal"
                          data-bs-target="#modalCrearSancion"
                          onClick={() => sancionarEstudiante(estudiante)}
                        >
                          Sancionar
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>

            </table>
          </div>
        </div>

        {/*historial sancion */}
        <div className="tab-pane fade" id="listarhistorial" role="tabpanel">
          <div className="mt-4">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Buscar por motivo..."
              value={busqueda}
              onChange={handleSearch}
            />
            <div className="table-responsive tablaHistorial">
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Nº</th>
                    <th>Sancion</th>
                    <th>Sancionado</th>
                    <th>Correo</th>
                    <th>Levantamiento</th>
                    <th>Fecha Levantamiento</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {historialFiltrado?.map((h, index) => h.estado == 1 && (
                    <tr key={h.id}>
                      <td>{index + 1}</td>
                      <td>{h.sancion?.tipo_sancion}</td>
                      <td>{h.sancion?.persona.nombre}</td>
                      <td>{h.sancion?.persona.correo}</td>
                      <td>{h.motivo_levantamiento}</td>
                      <td>{h.fecha_levantamiento.slice(0, 10)}</td>
                      <td>
                        <button
                          className="btn btn-warning me-2"
                          onClick={() => handleEdit(h)}
                        >
                          Editar
                        </button>
                        {/* Si quieres eliminar físicamente, agrega un delete aquí */}
                      </td>
                    </tr>
                  ))}
                  {historialFiltrado.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No hay registros
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* ver sancionados */}
        <div className={`tab-pane fade `} id='sancionados'>
          <div className="tablaSanciones table-responsive mt-3">
            <table className="table table-fixed">
              <thead className="table-dark sticky-top">
                <tr>
                  <th scope="col">Nº</th>
                  <th scope="col">Nombre</th>
                  <th scope="col ">Correo</th>
                  <th scope="col">celular</th>
                  <th scope="col">Carnet CI</th>
                  <th scope="col">Accion</th>
                </tr>
              </thead>
              <tbody>
                {sanciones?.map((sancion, index) => sancion.estado == 1 && (
                  <tr key={sancion.id}>
                    <td>{index + 1}</td>
                    <td>{sancion?.persona?.nombre}</td>
                    <td>{sancion?.persona?.correo}</td>
                    <td>{sancion?.persona?.celular}</td>
                    <td>{sancion?.persona?.ci}</td>
                    <td>
                      <button className="btn btn-warning" onClick={() =>
                        abrirModalQuitar({
                          id: sancion.persona.id,
                          nombre: sancion.persona.nombre,
                          sancionId: sancion.id, // 👈 se manda también el id de sanción
                        })
                      }>Quitar sanción</button>
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

export default ListarLectores;