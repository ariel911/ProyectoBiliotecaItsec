import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';

import './carrera.css';

const Carrera = () => {
  const [nombre, setNombre] = useState('');
  const [carreras, setCarreras] = useState([]);
  const [bajas, setBajas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentCarrera, setCurrentCarrera] = useState(null);

  useEffect(() => {
    handleGetCarreras();
    handleGetBajas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/carrera', { nombre, estado: 1 });
      setNombre('');
      swal({
        title: "Carrera agregada!",
        icon: "success",
        button: "Ok",
      });
      handleGetCarreras();
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetCarreras = async () => {
    const res = await axios.get('http://localhost:8000/api/carrera');
    setCarreras(res.data.data.carrera);
  };

  const handleGetBajas = async () => {
    const res = await axios.get('http://localhost:8000/api/carrera?estado=0');
    setBajas(res.data.data.carrera);
  };

  const handleDeleteCarrera = async (id) => {
    await axios({
      url: `http://localhost:8000/api/carrera/baja/${id}`,
      method: "PUT",
      data: {
        estado: 0,
      }


    }).then((response) => {
      // Accede a la respuesta de la API
      console.log("Respuesta de la API:", response.data);
    });
    swal({
      title: "Usuario dado de baja !",
      /* text: "Por favor, completa todos los campos requeridos", */
      icon: "success",
      button: "Ok",
    });
  };

  const handleSearch = (e) => {
    setBusqueda(e.target.value);
  };

  const openEditModal = (carrera) => {
    setCurrentCarrera(carrera);
    setNombre(carrera.nombre);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/carrera/${currentCarrera.id}`, { nombre });
      swal({
        title: "Carrera actualizada!",
        icon: "success",
        button: "Ok",
      });
      setEditModalOpen(false);
      handleGetCarreras();
    } catch (error) {
      console.error(error);
    }
  };

  const carrerasFiltradas = carreras.filter((carrera) =>
    carrera.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="carrera mt-4">
      <h1 className="tituloCarrera">Carreras</h1>
      <ul className="nav nav-tabs" role="tablist">
        <li className="nav-item">
          <a className="nav-link active" data-bs-toggle="tab" href="#agregar" role="tab">Agregar Carrera</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-bs-toggle="tab" href="#listar" role="tab">Lista de Carreras</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-bs-toggle="tab" href="#bajas" role="tab">Lista de Bajas</a>
        </li>
      </ul>

      <div className="tab-content">
        {/* Tab Agregar Carrera */}
        <div className="tab-pane fade show active nuevaCarrera" id="agregar" role="tabpanel">
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre de la Carrera</label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Agregar</button>
          </form>
        </div>

        {/* Tab Lista de Carreras */}
        <div className="tab-pane fade" id="listar" role="tabpanel">
          <div className="mt-4">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Buscar carrera..."
              value={busqueda}
              onChange={handleSearch}
            />
            <div className="table-responsive tablaCarrera">
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Nº</th>
                    <th>Carrera</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {carrerasFiltradas.map((carrera, index) => (
                    <tr key={carrera.id}>
                      <td>{index + 1}</td>
                      <td>{carrera.nombre}</td>
                      <td>{carrera.estado === 1 ? 'Activo' : 'Inactivo'}</td>
                      <td>
                        <button
                          className="btn btn-primary me-2"
                          onClick={() => openEditModal(carrera)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteCarrera(carrera.id)}
                        >
                          Eliminar
                        </button>
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
            <div className="table-responsive tablaCarrera">
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Nº</th>
                    <th>Carrera</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {bajas.map((carrera, index) => (
                    <tr key={carrera.id}>
                      <td>{index + 1}</td>
                      <td>{carrera.nombre}</td>
                      <td>{carrera.estado === 0 ? 'Inactivo' : 'Activo'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Editar Carrera */}
      {editModalOpen && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Carrera</h5>
                <button type="button" className="btn-close" onClick={() => setEditModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-3">
                    <label htmlFor="editNombre" className="form-label">Nombre de la Carrera</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editNombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrera;
