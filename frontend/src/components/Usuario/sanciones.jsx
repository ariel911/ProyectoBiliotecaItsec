

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import SancionHistorial from "../Usuario/sancion_historial";
import "./sanciones.css"

const ListarLectores = ({ busqueda, setBusqueda, initialVar }) => {
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

  useEffect(() => {

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

      // 2️⃣ Quitar sanción de la persona
      const sancionResponse = await axios.get(`http://localhost:8000/api/sancion?personaId=${selectedPersona.id}`);
      const sancion = sancionResponse.data; // Aquí te devuelve la sanción vinculada a esa persona

      if (sancion && sancion.id) {
        await axios.put(
          `http://localhost:8000/api/sancion/${sancion.id}`,
          { estado: 0 } // o sancionId: null, según tu lógica
        );

      }
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


  const usuariosFiltrados = estudiantes?.filter(
    (estudiante) => estudiante.sancion?.id

  )
  const sancionarEstudiante = (user) => {
    /*    document.getElementById('sanci').defaultValue = ''; */
    console.log("id2:", user)
    setSelectedUserSancion(user.id);


  };
  const handleSancionarLector = async () => {
    try {
      // Envía la solicitud de sanción al servidor
      console.log("el iddd:", selectedUserSancion)
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

      // Reinicia los datos de la sanción y el estudiante seleccionado
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



      // Muestra un mensaje de éxito
    } catch (error) {
      // Maneja cualquier error
      console.error(error);
      alert('Error al sancionar al lector');
    }
  };
  const handleSancionar = async () => {
    await axios({
      url: `http://localhost:8000/api/persona/sancionar/${selectedUserSancion}`,
      method: "PUT",
      data: {
        sancionId: sanci,

      },
    }).then((response) => {
      swal({
        title: "Sancion aplicado correctamente!",

        icon: "success",
        button: "Ok",
      });
      // Accede a la respuesta de la API
      console.log("Respuesta de la API:", response.data);
    });
    setSanci(0)
    setSelectedUserSancion('');
    handleGetUsers();
  }

  const quitarSancion = async (document) => {
    // Restablecer los campos del formulario
    await axios({
      url: `http://localhost:8000/api/persona/sancionar/${document}`,
      method: "PUT",

      data: {
        sancionId: null,

      },
    }).then((response) => {
      // Accede a la respuesta de la API
      console.log("Respuesta de la API:", response.data);
    });
    handleGetUsers();
  }
  return (
    <div className='sanciones'>
      {/* moldal para sancionar lector */}
      <h1 className="tituloSancion">Sancion</h1>
      <ul className="nav nav-tabs" role="tablist">
        {/*         <li className="nav-item">
          <a className="nav-link active" data-bs-toggle="tab" href="#agregar" role="tab">Agregar Sancion</a>
        </li> */}
        <li className="nav-item">
          <a className="nav-link active" data-bs-toggle="tab" href="#listar" role="tab">Sancionar</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-bs-toggle="tab" href="#sancionados" role="tab">Sancionados</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-bs-toggle="tab" href="#historial" role="tab">Historial Sancionados</a>
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
              <h1 className="modal-title fs-5" id="modalCrearSancionLabel">Crear Sanción</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                {/* Tipo de sanción */}
                <div className="mb-3">
                  <label htmlFor="tipoSancion" className="form-label">Tipo de Sanción</label>
                  <input
                    type="text"
                    className="form-control"
                    id="tipoSancion"
                    value={sancionData.tipo_sancion}
                    onChange={(e) => setSancionData({ ...sancionData, tipo_sancion: e.target.value })}
                    placeholder="Ej: Multa, Suspensión..."
                  />
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

                {/* Estado */}
                {/*    
                <div className="mb-3">
                  <label htmlFor="estado" className="form-label">Estado</label>
                  <select
                    className="form-control"
                    id="estado"
                    value={sancionData.estado}
                    onChange={(e) => setSancionData({ ...sancionData, estado: e.target.value })}
                  >
                    <option value="" hidden>Seleccione estado</option>
                    <option value="1">Activo</option>
                    <option value="0">Inactivo</option>
                  </select>
                </div> */}
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
        {/* Pestaña Agregar Rol */}
        {/* <div className={`tab-pane fade nuevaSancion  show active `} id='agregar'>
          <form onSubmit={handleSancionarLector} >
            <div className="mb-3">
              <label htmlFor="recipient-name" className="col-form-label">Nombre Sancion:</label>

              <input type="text" className="form-control" id="nombre_sancion" name="nombre_sancion" value={sancionData.nombre_sancion} onChange={e => setSancionData({ ...sancionData, nombre_sancion: e.target.value })} required />
            </div>
            <div className="mb-3">
              <label htmlFor="recipient-name" className="col-form-label">Dias inhabilitados:</label>
              <input type="number" className="form-control" id="dias_inhabilitados" name="dias_inhabilitados" value={sancionData.dias_inhabilitados} onChange={e => setSancionData({ ...sancionData, dias_inhabilitados: parseInt(e.target.value) })} required />
            </div>


            <button type="submit" className="btn btn-primary" >Guardar</button>
          </form>
        </div> */}


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
                {estudiantes?.map((estudiante, index) => (
                  <tr key={estudiante.id}>
                    <td>{index + 1}</td>
                    <td>{estudiante.nombre}</td>
                    <td>{estudiante.correo}</td>
                    <td>{estudiante.celular}</td>
                    <td>{estudiante.ci}</td>

                    <td>

                      <button className='btn btn-secondary boton' data-bs-toggle="modal" data-bs-target="#modalCrearSancion" data-bs-whatever="@mdo" onClick={(e) => sancionarEstudiante(estudiante)}>Sancionar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                {sanciones?.map((sancion, index) => (
                  <tr key={sancion.id}>
                    <td>{index + 1}</td>
                    {console.log(sancion)}
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
                      }
                      >
                        Quitar sanción
                      </button>
                      {/* <button className='btn btn-secondary boton' onClick={(e) => quitarSancion(sancion.id)}>Quitar Sancion</button> */}

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/*        <div className={`tab-pane fade `} id='historial'>
          <SancionHistorial />
        </div> */}
      </div>

    </div>
  );
};

export default ListarLectores;