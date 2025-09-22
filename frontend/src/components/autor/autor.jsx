import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import "./autor.css";

const Autor = () => {
  const [nombre, setNombre] = useState('');
  const [autors, setautors] = useState([]);
  const [bajas, setBajas] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    handleGetautors();
    handleGetBajas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre) {
      swal({
        title: "Error al Agregar autor!",
        text: "Por favor, completa todos los campos requeridos",
        icon: "error",
        button: "Ok",
      });
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/autor', {
        nombre,
        estado: 1,
      });

      setNombre('');
      swal({
        title: "autor Agregado!",
        icon: "success",
        button: "Ok",
      });

      handleGetautors();
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetautors = async () => {
    const res = await axios.get("http://localhost:8000/api/autor");
    setautors(res.data.data.autores);
  };

  const handleGetBajas = async () => {
    const res = await axios.get("http://localhost:8000/api/autor/estado=0");
    setBajas(res.data.data.autor);
  };

  const handleDeleteautor = async (id) => {
    await axios.delete(`http://localhost:8000/api/autor/${id}`);
    setautors(autors.filter((autor) => autor.id !== id));
  };

  const handleSearch = (e) => {
    setBusqueda(e.target.value);
  };

  const autorsFiltrados = autors?.filter((autor) => autor?.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div className="autor mt-4">
      <h1 className="tituloAutor">Autores</h1>
      
      {/* Pestañas de navegación */}
      <ul className="nav nav-tabs" role="tablist">
        <li className="nav-item">
          <a className="nav-link active" data-bs-toggle="tab" href="#agregar" role="tab">Agregar autor</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-bs-toggle="tab" href="#listar" role="tab">Lista de autores</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-bs-toggle="tab" href="#bajas" role="tab">Lista de autores Inactivos</a>
        </li>
      </ul>

      <div className="tab-content">
        {/* Tab Agregar autor */}
        <div className="tab-pane fade show active nuevoAutor" id="agregar" role="tabpanel">
          <form onSubmit={handleSubmit} className="mt-4">
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Nombre autor</label>
              <input type="text" className="form-control" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary">Agregar</button>
          </form>
        </div>

        {/* Tab Lista de autors */}
        <div className="tab-pane fade" id="listar" role="tabpanel">
          <div className="mt-4">
            <input type="text" className="form-control mb-3" placeholder="Buscar autor..." value={busqueda} onChange={handleSearch} />
            <div className="table-responsive tablaAutor">
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Nº</th>
                    <th>autor</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {autorsFiltrados?.map((autor, index) => (
                    <tr key={autor.id}>
                      <td>{index + 1}</td>
                      <td>{autor?.nombre}</td>
                      <td>{autor?.estado === 1 ? 'Activo' : 'Inactivo'}</td>
                      <td>
                        <button className="btn btn-danger" onClick={() => handleDeleteautor(autor.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tab Lista de autors Inactivos */}
        <div className="tab-pane fade" id="bajas" role="tabpanel">
          <div className="mt-4">
            <div className="table-responsive tablaAutor">
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Nº</th>
                    <th>autor</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {bajas.map((autor, index) => (
                    <tr key={autor.id}>
                      <td>{index + 1}</td>
                      <td>{autor.nombre}</td>
                      <td>{autor.estado === 0 ? 'Inactivo' : 'Activo'}</td>
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

export default Autor;
