import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import "./sancion_historial.css";

const SancionHistorial = () => {
  const [motivo, setMotivo] = useState("");
  const [fecha, setFecha] = useState("");
  const [estado, setEstado] = useState(1);
  const [historial, setHistorial] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    handleGetHistorial();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!motivo || !fecha) {
      swal("Error", "Por favor completa todos los campos", "error");
      return;
    }

    try {
      if (editId) {
        // Editar registro existente
        await axios.put(`http://localhost:8000/api/sancion_historial/${editId}`, {
          motivo_levantamiento: motivo,
          fecha_levantamiento: fecha,
          estado,
        });
        swal("Actualizado", "El historial fue actualizado correctamente", "success");
      } else {
        // Crear nuevo registro
        await axios.post("http://localhost:8000/api/sancion_historial", {
          motivo_levantamiento: motivo,
          fecha_levantamiento: fecha,
          estado,
        });
        swal("Agregado", "El historial fue agregado correctamente", "success");
      }

      setMotivo("");
      setFecha("");
      setEstado(1);
      setEditId(null);
      handleGetHistorial();
    } catch (error) {
      console.error(error);
      swal("Error", "Hubo un problema al guardar", "error");
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
    <div className="sancionHistorial mt-4">
      <h1 className="titulo">Historial de Sanciones</h1>

      {/* Pestañas de navegación */}
      <ul className="nav nav-tabs" role="tablist">
        <li className="nav-item">
          <a
            className="nav-link active"
            data-bs-toggle="tab"
            href="#agregar"
            role="tab"
          >
            {editId ? "Editar Historial" : "Agregar Historial"}
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            data-bs-toggle="tab"
            href="#listar"
            role="tab"
          >
            Lista de Historial
          </a>
        </li>
      </ul>

      <div className="tab-content">
        {/* Tab Agregar */}
        <div
          className="tab-pane fade show active nuevoHistorial"
          id="agregar"
          role="tabpanel"
        >
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-3">
              <label className="form-label">Motivo</label>
              <input
                type="text"
                className="form-control"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Fecha levantamiento</label>
              <input
                type="date"
                className="form-control"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Estado</label>
              <select
                className="form-select"
                value={estado}
                onChange={(e) => setEstado(Number(e.target.value))}
              >
                <option value={1}>Activo</option>
                <option value={0}>Inactivo</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary">
              {editId ? "Actualizar" : "Agregar"}
            </button>
          </form>
        </div>

        {/* Tab Lista */}
        <div className="tab-pane fade" id="listar" role="tabpanel">
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
                    <th>Motivo</th>
                    <th>Fecha Levantamiento</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {historialFiltrado?.map((h, index) => (
                    <tr key={h.id}>
                      <td>{index + 1}</td>
                      <td>{h.motivo_levantamiento}</td>
                      <td>{h.fecha_levantamiento}</td>
                      <td>{h.estado === 1 ? "Activo" : "Inactivo"}</td>
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
      </div>
    </div>
  );
};

export default SancionHistorial;
