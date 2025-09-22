import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import "./formato.css";

const Formato = () => {
  const [nombre, setNombre] = useState('');
  const [formatos, setFormatos] = useState([]);
  const [bajas, setBajas] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    handleGetFormatos();
    handleGetBajas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre) {
      swal({
        title: "Error al Agregar Formato!",
        text: "Por favor, completa todos los campos requeridos",
        icon: "error",
        button: "Ok",
      });
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/formato', {
        nombre,
        estado: 1,
      });

      setNombre('');
      swal({
        title: "Formato Agregado!",
        icon: "success",
        button: "Ok",
      });

      handleGetFormatos();
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetFormatos = async () => {
    const res = await axios.get("http://localhost:8000/api/formato");
    setFormatos(res.data.data.formato);
  };

  const handleGetBajas = async () => {
    const res = await axios.get("http://localhost:8000/api/formato?estado=0");
    setBajas(res.data.data.formato);
  };

  const handleDeleteFormato = async (id) => {
    await axios.delete(`http://localhost:8000/api/formato/${id}`);
    setFormatos(formatos.filter((formato) => formato.id !== id));
  };

  const handleSearch = (e) => {
    setBusqueda(e.target.value);
  };

  const formatosFiltrados = formatos.filter((formato) => formato.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div className="formato mt-4">
      <h1 className="tituloFormato">Formatos de Documento</h1>
      
      {/* Pestañas de navegación */}
      <ul className="nav nav-tabs" role="tablist">
        <li className="nav-item">
          <a className="nav-link active" data-bs-toggle="tab" href="#agregar" role="tab">Agregar Formato</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-bs-toggle="tab" href="#listar" role="tab">Lista de Formatos</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-bs-toggle="tab" href="#bajas" role="tab">Lista de Formatos Inactivos</a>
        </li>
      </ul>

      <div className="tab-content">
        {/* Tab Agregar Formato */}
        <div className="tab-pane fade show active nuevoFormato" id="agregar" role="tabpanel">
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre Formato</label>
              <input type="text" className="form-control" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary">Agregar</button>
          </form>
        </div>

        {/* Tab Lista de Formatos */}
        <div className="tab-pane fade" id="listar" role="tabpanel">
          <div className="mt-4">
            <input type="text" className="form-control mb-3" placeholder="Buscar formato..." value={busqueda} onChange={handleSearch} />
            <div className="table-responsive tablaFormato">
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Nº</th>
                    <th>Formato</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {formatosFiltrados.map((formato, index) => (
                    <tr key={formato.id}>
                      <td>{index + 1}</td>
                      <td>{formato.nombre}</td>
                      <td>{formato.estado === 1 ? 'Activo' : 'Inactivo'}</td>
                      <td>
                        <button className="btn btn-danger" onClick={() => handleDeleteFormato(formato.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tab Lista de Formatos Inactivos */}
        <div className="tab-pane fade" id="bajas" role="tabpanel">
          <div className="mt-4">
            <div className="table-responsive tablaFormato">
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Nº</th>
                    <th>Formato</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {bajas.map((formato, index) => formato.estado==0 && (
                    <tr key={formato.id}>
                      <td>{index + 1}</td>
                      <td>{formato.nombre}</td>
                      <td>{formato.estado === 0 ? 'Inactivo' : 'Activo'}</td>
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

export default Formato;
