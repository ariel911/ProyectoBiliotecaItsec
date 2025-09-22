import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import './area.css';

const Area = () => {
  const [nombre, setNombre] = useState('');
  const [area, setArea] = useState([]);
  const [bajas, setBajas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [selectedArea, setSelectedArea] = useState(null);

  useEffect(() => {
    handleGetAreas();
    handleGetBajas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/area', { nombre, estado: 1 });
      setNombre('');
      swal({
        title: "Área agregada!",
        icon: "success",
        button: "Ok",
      });
      handleGetAreas();
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetAreas = async () => {
    const res = await axios.get('http://localhost:8000/api/area');
    setArea(res.data.data.area);
  };

  const handleGetBajas = async () => {
    const res = await axios.get('http://localhost:8000/api/area?estado=0');
    setBajas(res.data.data.area);
  };

  const handleDeleteArea = async (id) => {
    await axios.delete(`http://localhost:8000/api/area/${id}`);
    setArea(area.filter((a) => a.id !== id));
    setBajas(bajas.filter((a) => a.id !== id));
  };

  const handleSearch = (e) => {
    setBusqueda(e.target.value);
  };

  const handleEditArea = (area) => {
    setSelectedArea(area);
    setNombre(area.nombre);
  };

  const handleUpdateArea = async () => {
    try {
      await axios.put(`http://localhost:8000/api/area/${selectedArea.id}`, { nombre });
      swal({
        title: "Área actualizada!",
        icon: "success",
        button: "Ok",
      });
      setSelectedArea(null);
      setNombre('');
      handleGetAreas();
      handleGetBajas();
    } catch (error) {
      console.error(error);
    }
  };

  const areasFiltradas = area.filter((a) => a.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div className="area mt-4">
      <h1 className="tituloArea">Áreas</h1>
      <ul className="nav nav-tabs" role="tablist">
        <li className="nav-item">
          <a className="nav-link active" data-bs-toggle="tab" href="#agregar" role="tab">Agregar Área</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-bs-toggle="tab" href="#listar" role="tab">Lista de Áreas</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-bs-toggle="tab" href="#bajas" role="tab">Lista de Bajas</a>
        </li>
      </ul>

      <div className="tab-content">
        {/* Tab Agregar Área */}
        <div className="tab-pane fade show active nuevaArea" id="agregar" role="tabpanel">
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre del Área</label>
              <input type="text" className="form-control" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary">Agregar</button>
          </form>
        </div>

        {/* Tab Lista de Áreas */}
        <div className="tab-pane fade" id="listar" role="tabpanel">
          <div className="mt-4">
            <input type="text" className="form-control mb-3" placeholder="Buscar área..." value={busqueda} onChange={handleSearch} />
            <div className="table-responsive tablaArea">
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Nº</th>
                    <th>Área</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {areasFiltradas.map((area, index) => (
                    <tr key={area.id}>
                      <td>{index + 1}</td>
                      <td>{area.nombre}</td>
                      <td>{area.estado === 1 ? 'Activo' : 'Inactivo'}</td>
                      <td>
                        <button className="btn btn-warning me-2" onClick={() => handleEditArea(area)}>Editar</button>
                        <button className="btn btn-danger" onClick={() => handleDeleteArea(area.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tab Lista de Bajas */}
        <div className="tab-pane fade" id="bajas" role="tabpanel">
          <div className="mt-4">
            <div className="table-responsive tablaArea">
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Nº</th>
                    <th>Área</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {bajas.map((area, index) => (
                    <tr key={area.id}>
                      <td>{index + 1}</td>
                      <td>{area.nombre}</td>
                      <td>{area.estado === 0 ? 'Inactivo' : 'Activo'}</td>
                      <td>
                        <button className="btn btn-danger" onClick={() => handleDeleteArea(area.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edición */}
      {selectedArea && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Área</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedArea(null)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="nombreEdit" className="form-label">Nombre del Área</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombreEdit"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedArea(null)}>Cancelar</button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateArea}>Guardar Cambios</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Area;
