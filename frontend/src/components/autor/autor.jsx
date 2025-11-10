import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./autor.css";

const GestionBiblioteca = () => {
  // ======== ÁREA ========
  const [nombreArea, setNombreArea] = useState("");
  const [areas, setAreas] = useState([]);
  const [bajasArea, setBajasArea] = useState([]);
  const [busquedaArea, setBusquedaArea] = useState("");
  const [selectedArea, setSelectedArea] = useState(null);

  useEffect(() => {
    getAreas();
    getBajasArea();
    getAutores();
/*     getBajasAutores(); */
  }, []);

  const getAreas = async () => {
    const res = await axios.get("http://localhost:8000/api/area");
    setAreas(res.data.data.area);
  };

  const getBajasArea = async () => {
    const res = await axios.get("http://localhost:8000/api/area?estado=0");
    setBajasArea(res.data.data.area);
  };

  const handleSubmitArea = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/area", { nombre: nombreArea, estado: 1 });
      swal("✅ Área agregada con éxito", "", "success");
      setNombreArea("");
      getAreas();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditArea = (area) => {
    setSelectedArea(area);
    setNombreArea(area.nombre);
  };

  const handleUpdateArea = async () => {
    try {
      await axios.put(`http://localhost:8000/api/area/${selectedArea.id}`, { nombre: nombreArea });
      swal("✅ Área actualizada", "", "success");
      setSelectedArea(null);
      setNombreArea("");
      getAreas();
      getBajasArea();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteArea = async (id) => {
    await axios.delete(`http://localhost:8000/api/area/${id}`);
    swal("🗑️ Eliminado correctamente", "", "success");
    getAreas();
    getBajasArea();
  };

  const filteredAreas = areas.filter((a) =>
    a.nombre?.toLowerCase().includes(busquedaArea.toLowerCase())
  );

  // ======== AUTORES ========
  const [nombreAutor, setNombreAutor] = useState("");
  const [autores, setAutores] = useState([]);
  const [bajasAutores, setBajasAutores] = useState([]);
  const [busquedaAutor, setBusquedaAutor] = useState("");

  const getAutores = async () => {
    const res = await axios.get("http://localhost:8000/api/autor");
    setAutores(res.data.data.autores);
  };

/*   const getBajasAutores = async () => {
    const res = await axios.get("http://localhost:8000/api/autor/estado=0");
    setBajasAutores(res.data.data.autor);
  }; */

  const handleSubmitAutor = async (e) => {
    e.preventDefault();
    if (!nombreAutor) {
      swal("⚠️ Campo vacío", "Por favor, completa el nombre del autor", "warning");
      return;
    }
    await axios.post("http://localhost:8000/api/autor", { nombre: nombreAutor, estado: 1 });
    swal("✅ Autor agregado con éxito", "", "success");
    setNombreAutor("");
    getAutores();
  };

  const handleDeleteAutor = async (id) => {
    await axios.delete(`http://localhost:8000/api/autor/${id}`);
    swal("🗑️ Autor eliminado", "", "success");
    getAutores();
  };

  const autoresFiltrados = autores.filter((a) =>
    a.nombre?.toLowerCase().includes(busquedaAutor.toLowerCase())
  );

  return (
    <div className="container mt-4 gestion">
      
      <h1 className="tituloProyecto text-center mb-4 fw-bold text-primary">
       ⚙️ Gestión de Áreas y Autores
      </h1>

      <ul className="nav nav-tabs justify-content" role="tablist">
        <li className="nav-item">
          <a className="nav-link active" data-bs-toggle="tab" href="#areas" role="tab">
            <i className="bi bi-diagram-3 me-1"></i>Áreas
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-bs-toggle="tab" href="#autores" role="tab">
            <i className="bi bi-person-lines-fill me-1"></i>Autores
          </a>
        </li>
      </ul>

      <div className="tab-content ">
        {/* ======== TAB ÁREAS ======== */}
        <div className="tab-pane fade show active" id="areas" role="tabpanel">
          <div className="card shadow-lg rounded-0">
          {/*   <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0"><i className="bi bi-diagram-3 me-2"></i>Gestión de Áreas</h5>
            </div> */}
            <div className="card-body">
              <form onSubmit={handleSubmitArea} className="mb-2">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre del área"
                    value={nombreArea}
                    onChange={(e) => setNombreArea(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-success">
                    <i className="bi bi-plus-circle me-1"></i>Agregar
                  </button>
                </div>
              </form>

              <input
                type="text"
                className="form-control mb-3"
                placeholder="Buscar área..."
                value={busquedaArea}
                onChange={(e) => setBusquedaArea(e.target.value)}
              />

              <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
                <table className="table table-hover align-middle text-center">
                  <thead className="table-dark sticky-top">
                    <tr>
                      <th>#</th>
                      <th>Nombre</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAreas.map((a, i) => (
                      <tr key={a.id}>
                        <td>{i + 1}</td>
                        <td>{a.nombre}</td>
                        <td>
                          <span className={`badge ${a.estado ? "bg-success" : "bg-danger"}`}>
                            {a.estado ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm me-2"
                            onClick={() => handleEditArea(a)}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteArea(a.id)}
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

          {/* MODAL EDITAR */}
          {selectedArea && (
            <div className="modal show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header bg-primary text-white">
                    <h5 className="modal-title">
                      <i className="bi bi-pencil-square me-2"></i>Editar Área
                    </h5>
                    <button type="button" className="btn-close" onClick={() => setSelectedArea(null)}></button>
                  </div>
                  <div className="modal-body">
                    <input
                      type="text"
                      className="form-control"
                      value={nombreArea}
                      onChange={(e) => setNombreArea(e.target.value)}
                    />
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={() => setSelectedArea(null)}>
                      Cancelar
                    </button>
                    <button className="btn btn-primary" onClick={handleUpdateArea}>
                      Guardar Cambios
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ======== TAB AUTORES ======== */}
        <div className="tab-pane fade" id="autores" role="tabpanel">
          <div className="card shadow-lg border-0 rounded-0">
         {/*    <div className="card-header bg-success text-white">
              <h5 className="mb-0"><i className="bi bi-person-lines-fill me-2"></i>Gestión de Autores</h5>
            </div> */}
            <div className="card-body">
              <form onSubmit={handleSubmitAutor} className="mb-2">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre del autor"
                    value={nombreAutor}
                    onChange={(e) => setNombreAutor(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-success">
                    <i className="bi bi-plus-circle me-1"></i>Agregar
                  </button>
                </div>
              </form>

              <input
                type="text"
                className="form-control mb-3"
                placeholder="Buscar autor..."
                value={busquedaAutor}
                onChange={(e) => setBusquedaAutor(e.target.value)}
              />

              <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
                <table className="table table-hover text-center align-middle">
                  <thead className="table-dark sticky-top">
                    <tr>
                      <th>#</th>
                      <th>Nombre</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {autoresFiltrados.map((autor, i) => (
                      <tr key={autor.id}>
                        <td>{i + 1}</td>
                        <td>{autor.nombre}</td>
                        <td>
                          <span className={`badge ${autor.estado ? "bg-success" : "bg-danger"}`}>
                            {autor.estado ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeleteAutor(autor.id)}
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
      </div>
    </div>
  );
};

export default GestionBiblioteca;
