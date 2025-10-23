import "./rol.css";
import { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";

const Usuario = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState(0);
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [busquedaActivos, setBusquedaActivos] = useState("");
  const [busquedaBajas, setBusquedaBajas] = useState("");

  useEffect(() => {
    handleGetUsers();
    handleGetRoles();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      document.getElementById("nombre2").value = selectedUser.nombre || "";
      document.getElementById("correo2").value = selectedUser.correo || "";
      document.getElementById("clave2").value = selectedUser.clave || "";
    }
  }, [selectedUser]);

  const handleGetUsers = async () => {
    const res = await axios.get("http://localhost:8000/api/usuarios");
    setUsuarios(res.data.data.usuarios);
  };

  const handleGetRoles = async () => {
    const res = await axios.get("http://localhost:8000/api/rol");
    setRoles(res.data.data.rol);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
  };

  const handleDarBaja = async (id) => {
    await axios.put(`http://localhost:8000/api/usuarios/baja/${id}`, {
      estado: 0,
    });
    swal({ title: "Usuario dado de baja", icon: "warning", button: "Ok" });
    handleGetUsers();
  };

  const handleDarReintegrar = async (id) => {
    await axios.put(`http://localhost:8000/api/usuarios/baja/${id}`, {
      estado: 1,
    });
    swal({ title: "Usuario Reintegrado", icon: "success", button: "Ok" });
    handleGetUsers();
  };

  const handleDarEliminar = async (id) => {
    await axios.put(`http://localhost:8000/api/usuarios/baja/${id}`, {
      estado: 3,
    });
    swal({ title: "Usuario Eliminado", icon: "success", button: "Ok" });
    handleGetUsers();
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:8000/api/usuarios/${selectedUser.id}`, {
      nombre: document.getElementById("nombre2").value,
      correo: document.getElementById("correo2").value,
      clave: document.getElementById("clave2").value,
    });
    swal({ title: "Usuario Actualizado", icon: "success", button: "Ok" });
    setSelectedUser(null);
    handleGetUsers();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:8000/api/usuarios", {
      nombre,
      correo,
      clave,
      estado: 1,
      rolId: rol,
    });
    swal({ title: "Usuario Agregado", icon: "success", button: "Ok" });
    setNombre("");
    setCorreo("");
    setClave("");
    setRol(0);
    handleGetUsers();
  };

  // 🔍 FILTROS (con protección)
  const qAct = (busquedaActivos || "").trim().toLowerCase();
  const qBaj = (busquedaBajas || "").trim().toLowerCase();

  const usuariosActivos = usuarios.filter(
    (u) =>
      u.estado === 1 &&
      (String(u.nombre || "").toLowerCase().includes(qAct) ||
        String(u.correo || "").toLowerCase().includes(qAct) ||
        String(u?.rol?.nombre_rol || "").toLowerCase().includes(qAct))
  );

  const usuariosBaja = usuarios.filter(
    (u) =>
      u.estado === 0 &&
      (String(u.nombre || "").toLowerCase().includes(qBaj) ||
        String(u.correo || "").toLowerCase().includes(qBaj) ||
        String(u?.rol?.nombre_rol || "").toLowerCase().includes(qBaj))
  );


  return (
    <div className="usuario container mt-4">

      <h2 className="text-center mb-4 fw-bold">👥 Usuarios del Sistema</h2>

      <ul className="nav nav-tabs" role="tablist">
        <li className="nav-item">
          <a className="nav-link active" data-bs-toggle="tab" href="#agregar">
            ➕ Agregar Usuario
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-bs-toggle="tab" href="#listar">
            📋 Lista de Usuarios
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-bs-toggle="tab" href="#bajas">
            ⚠️ Bajas
          </a>
        </li>
      </ul>

      <div className="tab-content">
        {/* AGREGAR */}

        <div className="tab-pane fade show active mt-3" id="agregar">
          <div className="card shadow-sm p-4 mb-4">
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Correo</label>
                <input
                  type="email"
                  className="form-control"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Clave</label>
                <input
                  type="text"
                  className="form-control"
                  value={clave}
                  onChange={(e) => setClave(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Rol</label>
                <select
                  className="form-select"
                  value={rol}
                  onChange={(e) => setRol(e.target.value)}
                  required
                >
                  <option value="">Seleccione Rol</option>
                  {roles
                    .filter((r) => r.estado === 1)
                    .map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nombre_rol}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col-12 text-center">
                <button className="btn btn-primary px-5">Agregar</button>
              </div>
            </form>
          </div>
        </div>

        {/* MODAL EDITAR */}
        <div
          className="modal fade"
          id="modalEdit"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title">Editar Usuario</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <label className="form-label">Nombre</label>
                  <input id="nombre2" className="form-control mb-2" />
                  <label className="form-label">Correo</label>
                  <input id="correo2" className="form-control mb-2" />
                  <label className="form-label">Clave</label>
                  <input id="clave2" className="form-control" />
                </form>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cerrar
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleUpdateUser}
                  data-bs-dismiss="modal"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* TABLA LISTAR */}
        <div className="tab-pane fade mt-3" id="listar">
          <div className="card shadow-sm p-4 mb-4">
            <div className="mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="🔍 Buscar usuario..."
                value={busquedaActivos}
                onChange={(e) => setBusquedaActivos(e.target.value)}
              />
            </div>
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              <table className="table table-hover table-striped align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosActivos.map((u, i) => (
                    <tr key={u.id}>
                      <td>{i + 1}</td>
                      <td>{u.nombre}</td>
                      <td>{u.correo}</td>
                      <td>{u?.rol?.nombre_rol}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#modalEdit"
                          onClick={() => handleEditUser(u)}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDarBaja(u.id)}
                        >
                          <i className="bi bi-person-dash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* TABLA BAJAS */}
        <div className="tab-pane fade mt-3" id="bajas">
          <div className="card shadow-sm p-4 mb-4">
            <div className="mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="🔍 Buscar baja..."
                value={busquedaBajas}
                onChange={(e) => setBusquedaBajas(e.target.value)}
              />
            </div>
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
              <table className="table table-hover table-striped align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosBaja.map((u, i) => (
                    <tr key={u.id}>
                      <td>{i + 1}</td>
                      <td>{u.nombre}</td>
                      <td>{u.correo}</td>
                      <td>{u?.rol?.nombre_rol}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() => handleDarReintegrar(u.id)}
                        >
                          <i className="bi bi-person-check"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDarEliminar(u.id)}
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Usuario;
