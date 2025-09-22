import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import "./tipo_doc.css"

const TipoDoc = () => {
  const [nombre, setNombre] = useState('');
  const [tipoDocs, setTipoDocs] = useState([]);
  const [bajas, setBajas] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    handleGetTipoDocs();
    handleGetBajas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre) {
      swal({
        title: "Error al Agregar tipo_doc!",
        text: "Por favor, completa todos los campos requeridos",
        icon: "error",
        button: "Ok",
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/tipo_doc', {
        nombre,
        estado: 1
      });

      setNombre('');
      swal({
        title: "Tipo_doc Agregado!",
        icon: "success",
        button: "Ok",
      });
      handleGetTipoDocs();
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetTipoDocs = async () => {
    const res = await axios.get("http://localhost:8000/api/tipo_doc");
    setTipoDocs(res.data.data.tipo_doc);
  };

  const handleGetBajas = async () => {
    const res = await axios.get("http://localhost:8000/api/tipo_doc?estado=0");
    setBajas(res.data.data.tipo_doc);
  };

  const handleDeleteTipoDoc = async (id) => {
    await axios.delete(`http://localhost:8000/api/tipo_doc/${id}`);
    setTipoDocs(tipoDocs.filter((doc) => doc.id !== id));
  };

  const handleSearch = (e) => {
    setBusqueda(e.target.value);
  };

  const tipoDocsFiltrados = tipoDocs.filter((doc) => doc.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div className="tipoDoc mt-4">
      <h1 className="tituloCarrera">Tipo de Documento</h1>
      <ul className="nav nav-tabs" role="tablist">
        <li className="nav-item">
          <a className="nav-link active" data-bs-toggle="tab" href="#agregar" role="tab">Agregar Tipo_doc</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-bs-toggle="tab" href="#listar" role="tab">Lista de Tipo_doc</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-bs-toggle="tab" href="#bajas" role="tab">Lista de Bajas</a>
        </li>
      </ul>

      <div className="tab-content">
        {/* Tab Agregar Tipo_doc */}
        <div className="tab-pane fade show active nuevaTipoDoc" id="agregar" role="tabpanel">
          <form onSubmit={handleSubmit} className='mt-4'>
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">Tipo Documento</label>
              <input type="text" className="form-control" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary">Agregar</button>
          </form>
        </div>

        {/* Tab Lista de Tipo_doc */}
        <div className="tab-pane fade" id="listar" role="tabpanel">
          <div className="mt-4">
            <input type="text" className="form-control mb-3" placeholder="Buscar tipo_doc..." value={busqueda} onChange={handleSearch} />
            <div className="table-responsive tablaTipoDoc">
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Nº</th>
                    <th>Documento</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {tipoDocsFiltrados.map((doc, index) => (
                    <tr key={doc.id}>
                      <td>{index + 1}</td>
                      <td>{doc.nombre}</td>
                      <td>{doc.estado === 1 ? 'Activo' : 'Inactivo'}</td>
                      <td>
                        <button className="btn btn-danger" onClick={() => handleDeleteTipoDoc(doc.id)}>Eliminar</button>
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
            <div className="table-responsive tablaTipoDoc">
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Nº</th>
                    <th>Documento</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {bajas.map((doc, index) => (
                    <tr key={doc.id}>
                      <td>{index + 1}</td>
                      <td>{doc.nombre}</td>
                      <td>{doc.estado === 0 ? 'Inactivo' : 'Activo'}</td>
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

export default TipoDoc;
