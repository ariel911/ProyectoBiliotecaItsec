import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import Select from "react-select";
import "./rol.css";
import { useDropzone } from 'react-dropzone';

const UsuarioRol = () => {
  // ---------- USUARIOS ----------
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [nombre2, setNombre2] = useState("");
  const [ci2, setCi2] = useState("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [user_name, setUserName] = useState("");
  const [rolUsuario, setRolUsuario] = useState(0);
  const [busquedaActivos, setBusquedaActivos] = useState("");
  const [busquedaBajasUsuarios, setBusquedaBajasUsuarios] = useState("");
  const [imagen, setImagen] = useState(null);
  const [roles, setRoles] = useState([]);

  // ---------- ROLES ----------
  const [rol, setRol] = useState([]);
  const [nombre_rol, setNombreRol] = useState("");
  const [menus, setMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingRol, setEditingRol] = useState(null);
  const [editNombreRol, setEditNombreRol] = useState("");
  const [editSelectedMenu, setEditSelectedMenu] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [busquedaBajasRoles, setBusquedaBajasRoles] = useState("");
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setImagen(acceptedFiles[0]); // Guarda el archivo en el estado
      }
    },
  });

  useEffect(() => {
    handleGetUsers();
    handleGetRoles();
    handleGetMenus();

  }, []);

  // ---------------- USUARIOS ----------------
  useEffect(() => {

    if (selectedUser) {
      document.getElementById("nombre2").value = selectedUser.nombre || "";
      document.getElementById("correo2").value = selectedUser.correo || "";
      document.getElementById("clave2").value = selectedUser.clave || "";
      document.getElementById("user_name2").value = selectedUser.user_name || "";
      document.getElementById("ci2").value = selectedUser.ci || "";
    }
  }, [selectedUser]);

  const handleGetUsers = async () => {
    const res = await axios.get("http://localhost:8000/api/usuarios");
    setUsuarios(res.data.data.usuarios);
  };

  const handleGetRoles = async () => {
    const res = await axios.get("http://localhost:8000/api/rol");
    setRoles(res.data.data.rol);
    setRol(res.data.data.rol);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
  };

  const handleDarBajaUsuario = async (id) => {
    await axios.put(`http://localhost:8000/api/usuarios/baja/${id}`, {
      estado: 0,
    });
    swal({ title: "Usuario dado de baja", icon: "warning", button: "Ok" });
    handleGetUsers();
  };

  const handleDarReintegrarUsuario = async (id) => {
    await axios.put(`http://localhost:8000/api/usuarios/baja/${id}`, {
      estado: 1,
    });
    swal({ title: "Usuario Reintegrado", icon: "success", button: "Ok" });
    handleGetUsers();
  };

  const handleDarEliminarUsuario = async (id) => {
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
      user_name: document.getElementById("user_name2").value,
      ci: document.getElementById("ci2").value,
    });
    swal({ title: "Usuario Actualizado", icon: "success", button: "Ok" });
    setSelectedUser(null);
    handleGetUsers();
  };

  const handleSubmitUser = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:8000/api/usuarios", {
      nombre: nombre2,
      correo,
      ci: ci2,
      clave,
      imagen: '../../assets/' + `${imagen.name}`,
      user_name,
      estado: 1,
      rolId: rolUsuario,
    });
    swal({ title: "Usuario Agregado", icon: "success", button: "Ok" });
    setNombre2("");
    setImagen(null);
    setCi2("");
    setCorreo("");
    setClave("");
    setUserName("");
    setRolUsuario(0);
    handleGetUsers();
  };

  // filtros
  const qAct = (busquedaActivos || "").trim().toLowerCase();
  const qBajU = (busquedaBajasUsuarios || "").trim().toLowerCase();
  const qBajR = (busquedaBajasRoles || "").trim().toLowerCase();

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
      (String(u.nombre || "").toLowerCase().includes(qBajU) ||
        String(u.correo || "").toLowerCase().includes(qBajU) ||
        String(u?.rol?.nombre_rol || "").toLowerCase().includes(qBajU))
  );

  // ---------------- ROLES ----------------
  const handleGetMenus = async () => {
    const res = await axios.get("http://localhost:8000/api/menu");
    setMenus(res.data.data.menu);
  };

  const handleChange = (selectedOption) => {
    setSelectedMenu(selectedOption);
  };

  const roleOptions = menus?.map((menu) => ({
    value: menu.id,
    label: menu.nombre_menu,
  }));

  const handleSubmitRol = async (e) => {
    e.preventDefault();
    const selectedOptionIds = selectedMenu?.map((option) => option.value);

    if (!nombre_rol) {
      swal({
        title: "Error al Agregar Cargo!",
        text: "Por favor, completa todos los campos requeridos",
        icon: "error",
        button: "Ok",
      });
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await axios.post("http://localhost:8000/api/rol", {
        nombre_rol,
        menus: selectedOptionIds,
        estado: 1,
      });

      setNombreRol("");
      setSelectedMenu([]);
      swal({ title: "Cargo agregado!", icon: "success", button: "Ok" });
      handleGetRoles();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDarBajaRol = async (cargo) => {
    await axios.put(`http://localhost:8000/api/rol/baja/${cargo.id}`, {
      estado: 0,
    });
    swal({ title: `Cargo ${cargo.nombre_rol} dado de baja`, icon: "success", button: "Ok" });
    handleGetRoles();
  };

  const handleDarReintegrarRol = async (cargo) => {
    await axios.put(`http://localhost:8000/api/rol/baja/${cargo.id}`, {
      estado: 1,
    });
    swal({ title: `Cargo ${cargo.nombre_rol} reintegrado`, icon: "success", button: "Ok" });
    handleGetRoles();
  };

  const handleDarEliminarRol = async (cargo) => {
    await axios.put(`http://localhost:8000/api/rol/baja/${cargo.id}`, {
      estado: 3,
    });
    swal({ title: `Cargo ${cargo.nombre_rol} eliminado`, icon: "success", button: "Ok" });
    handleGetRoles();
  };

  const handleEditClickRol = (rol) => {
    setEditingRol(rol);
    setEditNombreRol(rol.nombre_rol);
    setEditSelectedMenu(
      rol.menu_rols.map((menuRol) => ({
        value: menuRol.menu.id,
        label: menuRol.menu.nombre_menu,
      }))
    );
  };

  const handleEditSubmitRol = async (e) => {
    e.preventDefault();
    const selectedOptionIds = editSelectedMenu.map((option) => option.value);

    if (!editNombreRol) {
      swal({
        title: "Error al Editar Cargo!",
        text: "Por favor, completa todos los campos requeridos",
        icon: "error",
        button: "Ok",
      });
      return;
    }

    await axios.put(`http://localhost:8000/api/rol/${editingRol.id}`, {
      nombre_rol: editNombreRol,
      menus: selectedOptionIds,
      estado: editingRol.estado,
    });

    swal({ title: "Cargo editado!", icon: "success", button: "Ok" });
    handleGetRoles();
    setEditingRol(null);
    setEditNombreRol("");
    setEditSelectedMenu([]);
  };

  const rolesActivos = rol.filter(
    (r) =>
      r.estado === 1 &&
      r.nombre_rol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rolesBaja = rol.filter(
    (r) =>
      r.estado === 0 &&
      r.nombre_rol.toLowerCase().includes(qBajR)
  );

  return (
    <div className="container mt-4">
      <h1 className="tituloProyecto text-center mb-4 fw-bold text-primary">📋 Gestión Usuarios y Cargos</h1>

      <ul className="nav nav-tabs" id="tabs" role="tablist">
        <li className="nav-item">
          <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#usuarios">
            👤 Usuarios
          </button>
        </li>
        <li className="nav-item">
          <button className="nav-link" data-bs-toggle="tab" data-bs-target="#roles">
            🛡️ Cargos
          </button>
        </li>
        <li className="nav-item">
          <button className="nav-link" data-bs-toggle="tab" data-bs-target="#bajas">
            🗑️ Bajas
          </button>
        </li>
      </ul>

      <div className="tab-content mt-3">
        {/* ---------------- USUARIOS ---------------- */}
        <div className="tab-pane fade show active" id="usuarios">
          <div className="card shadow-sm p-4 mb-4">
            <form onSubmit={handleSubmitUser}>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nombre2}
                    onChange={(e) => setNombre2(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Ci</label>
                  <input
                    type="text"
                    className="form-control"
                    value={ci2}
                    onChange={(e) => setCi2(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-4 mb-3">
                  <label className="form-label">Correo</label>
                  <input
                    type="email"
                    className="form-control"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                  />
                </div>

              </div>
              <div className="row">
                <div className="col-md-3 mb-3">
                  <label className="form-label">Rol</label>
                  <select
                    className="form-select"
                    value={rolUsuario}
                    onChange={(e) => setRolUsuario(Number(e.target.value))}
                    required
                  >
                    <option value={0}>Seleccione...</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.nombre_rol}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Usuario de Acceso</label>
                  <input
                    type="text"
                    className="form-control"
                    value={user_name}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Clave</label>
                  <input
                    type="password"
                    className="form-control"
                    value={clave}
                    onChange={(e) => setClave(e.target.value)}
                    required
                  />
                </div>
                <div
                  {...getRootProps()}
                  className={`col-md-3 border border-2 border-dashed rounded-3 py-4 text-center ${isDragActive ? "border-primary text-primary" : "border-secondary text-muted"}`}
                  style={{ cursor: 'pointer' }}
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p><i className="bi bi-upload me-2"></i> Suelta la imagen aquí...</p>
                  ) : (
                    <p><i className="bi bi-image me-2"></i> Arrastra o selecciona una imagen</p>
                  )}
                  {imagen && <p className="text-success mt-2"><i className="bi bi-check-circle me-1"></i>{imagen.name}</p>}
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Guardar Usuario</button>
            </form>

            <hr />
            <input
              type="text"
              placeholder="🔍 Buscar usuarios activos..."
              className="form-control mb-2 w-50"
              value={busquedaActivos}
              onChange={(e) => setBusquedaActivos(e.target.value)}
            />

            <div className="table-responsive" style={{ maxHeight: "300px", overflowY: "auto" }}>
              <table className="table table-hover table-striped align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosActivos.map((u, i) => (
                    <tr key={u.id}>
                      <td>{i + 1}</td>
                      <td>{u.nombre}</td>
                      <td>{u.correo}</td>
                      <td>{u.rol?.nombre_rol}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          data-bs-toggle="modal"
                          data-bs-target="#modalEditUser"
                          onClick={() => handleEditUser(u)}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDarBajaUsuario(u.id)}
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

        {/* ---------------- ROLES ---------------- */}
        <div className="tab-pane fade" id="roles">
          <div className="card shadow-sm p-4 mb-4">
            <form onSubmit={handleSubmitRol}>
              <div className="row">
                <div className="col-md-6 mb-3 mt-3">
                  <label className="form-label">Nombre del Cargo</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nombre_rol}
                    onChange={(e) => setNombreRol(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-6 mb-5 mt-3">
                  <label className="form-label">Accesos</label>
                  <Select
                    value={selectedMenu}
                    onChange={handleChange}
                    options={roleOptions}
                    placeholder="Seleccione..."
                    isMulti
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary mt-2 mb-5">
                {isSubmitting ? "Guardando..." : "Guardar Cargo"}
              </button>

              <hr />
              <input
                type="text"
                placeholder="🔍 Buscar roles activos..."
                className="form-control mb-2 w-50 mt-5 mb-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <div className="table-responsive mt-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
                <table className="table table-hover align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Nombre</th>
                      <th>Accesos</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rolesActivos.map((r, i) => (
                      <tr key={r.id}>
                        <td>{i + 1}</td>
                        <td>{r.nombre_rol}</td>
                        <td>
                          {r.menu_rols.length
                            ? r.menu_rols.map((m) => m.menu.nombre_menu).join(", ")
                            : "Sin accesos"}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary me-2"
                            data-bs-toggle="modal"
                            data-bs-target="#modalEditRol"
                            onClick={() => handleEditClickRol(r)}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDarBajaRol(r)}
                          >
                            <i className="bi bi-person-dash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </form>
          </div>
        </div>

        {/* ---------------- BAJAS UNIFICADAS ---------------- */}
        <div className="tab-pane fade" id="bajas">
          <div className="card shadow-sm p-4 mb-4">
            <h5>Usuarios Inactivos</h5>
            <input
              type="text"
              placeholder="🔍 Buscar usuarios inactivos..."
              className="form-control mb-2 w-50"
              value={busquedaBajasUsuarios}
              onChange={(e) => setBusquedaBajasUsuarios(e.target.value)}
            />
            <div className="table-responsive" style={{ maxHeight: "200px", overflowY: "auto" }}>
              <table className="table table-hover table-striped align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosBaja.map((u, i) => (
                    <tr key={u.id}>
                      <td>{i + 1}</td>
                      <td>{u.nombre}</td>
                      <td>{u.correo}</td>
                      <td>{u.rol?.nombre_rol}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() => handleDarReintegrarUsuario(u.id)}
                        >
                          <i className="bi bi-arrow-clockwise"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDarEliminarUsuario(u.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <hr />
            <h5>Cargos Inactivos</h5>
            <input
              type="text"
              placeholder="🔍 Buscar cargos inactivos..."
              className="form-control mb-2 w-50"
              value={busquedaBajasRoles}
              onChange={(e) => setBusquedaBajasRoles(e.target.value)}
            />
            <div className="table-responsive" style={{ maxHeight: "200px", overflowY: "auto" }}>
              <table className="table table-hover table-striped align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Accesos</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {rolesBaja.map((r, i) => (
                    <tr key={r.id}>
                      <td>{i + 1}</td>
                      <td>{r.nombre_rol}</td>
                      <td>
                        {r.menu_rols.length
                          ? r.menu_rols.map((m) => m.menu.nombre_menu).join(", ")
                          : "Sin accesos"}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() => handleDarReintegrarRol(r)}
                        >
                          <i className="bi bi-arrow-clockwise"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDarEliminarRol(r)}
                        >
                          <i className="bi bi-trash"></i>
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

      {/* ---------- MODALES ---------- */}
      <div className="modal fade" id="modalEditUser" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Editar Usuario</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdateUser}>
                <div className="row">
                  <div className="mb-3 col">
                    <label className="form-label">Nombre</label>
                    <input type="text" className="form-control" id="nombre2" required />
                  </div>
                  <div className="mb-3 col">
                    <label className="form-label">Ci</label>
                    <input type="text" className="form-control" id="ci2" required />
                  </div>

                </div>
                <div className="row">
                  <div className="mb-3 col">
                    <label className="form-label">Correo</label>
                    <input type="email" className="form-control" id="correo2" required />
                  </div>
                  <div className="mb-3 col">
                    <label className="form-label">Usuario de Acceso</label>
                    <input type="text" className="form-control" id="user_name2" required />
                  </div>
                  <div className="mb-3 col">
                    <label className="form-label">Clave</label>
                    <input type="password" className="form-control" id="clave2" required />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                    Cerrar
                  </button>
                  <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="modalEditRol" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Editar Cargo</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleEditSubmitRol}>
                <div className="mb-3">
                  <label className="form-label">Nombre Cargo</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editNombreRol}
                    onChange={(e) => setEditNombreRol(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Accesos</label>
                  <Select
                    value={editSelectedMenu}
                    onChange={setEditSelectedMenu}
                    options={roleOptions}
                    isMulti
                  />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                    Cerrar
                  </button>
                  <button type="submit" className="btn btn-primary">Guardar cambios</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsuarioRol;
