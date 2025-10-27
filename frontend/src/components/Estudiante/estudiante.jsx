import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import swal from 'sweetalert';
import lunr from 'lunr';
import './estudiante.css'

const Estudiante = ({ handleAddUser }) => {
  // ---- estados del formulario manual ----
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [ci, setCi] = useState('');
  const [celular, setCelular] = useState('');
  const [carre, setCarre] = useState('');
  const [tipo, setTipo] = useState('');

  // ---- catálogos y listas ----
  const [carreras, setCarreras] = useState([]);
  const [tipoPersonas, setTipoPersonas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);

  // ---- Excel ----
  const [excelEstudiantes, setExcelEstudiantes] = useState([]);
  const [personaId, setPersonaId] = useState('');

  // ---- búsqueda ----
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // ---- edición ----
  const [selectedUser, setSelectedUser] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [editCorreo, setEditCorreo] = useState('');
  const [editCi, setEditCi] = useState('');
  const [editCelular, setEditCelular] = useState('');

  // ============================ USE EFFECT ==============================
  useEffect(() => {
    handleGetCarreras();
    handleGetTipoPersonas();
    handleGetEstudiantes();
    // eslint-disable-next-line
  }, []);

  // ============================ CARGAS INICIALES ==============================
  const handleGetCarreras = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/carrera');
      setCarreras(res.data.data.carrera || []);
    } catch (err) {
      console.error('Error cargando carreras', err);
    }
  };

  const handleGetTipoPersonas = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/tipo_persona');
      setTipoPersonas(res.data.data.tipo_persona || []);
    } catch (err) {
      console.error('Error cargando tipo persona', err);
    }
  };

  const handleGetEstudiantes = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/persona');
      const list = res.data.data.personas || [];
      setEstudiantes(list);
      setSearchResults(list);
    } catch (err) {
      console.error('Error cargando estudiantes', err);
    }
  };

  // ============================ FORMULARIO MANUAL ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/persona', {
        nombre,
        correo,
        ci,
        celular,
        estado: 1,
        carreras: [carre],
        tipoPersonaId: tipo,
      });
      setNombre('');
      setCorreo('');
      setCi('');
      setCelular('');
      setCarre('');
      setTipo('');
      await handleGetEstudiantes();
      swal('Éxito', 'Estudiante agregado con éxito', 'success');
    } catch (error) {
      console.error('Error agregando estudiante', error);
      swal('Error', 'Hubo un error al agregar el estudiante', 'error');
    }
  };

  // ============================ CARGAR DESDE EXCEL ==============================
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheet];
      const json = XLSX.utils.sheet_to_json(worksheet);
      setExcelEstudiantes(json);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleGuardarExcel = async () => {
    try {
      if (!personaId) {
        swal('Error', 'Debes seleccionar un tipo de persona', 'error');
        return;
      }
      const estudiantesConDatos = excelEstudiantes.map((est) => {
        const carreraEncontrada = carreras.find(
          (c) => c.nombre.toLowerCase() === (est.carrera || '').toString().toLowerCase()
        );
        return {
          ...est,
          estado: '1',
          tipoPersonaId: parseInt(personaId),
          carreras: carreraEncontrada ? [carreraEncontrada.id.toString()] : null,
        };
      });

      // eliminar campos sobrantes si existen
      estudiantesConDatos.forEach((obj) => {
        delete obj.Nro;
        delete obj.carrera;
      });

      await Promise.all(
        estudiantesConDatos.map((est) => axios.post('http://localhost:8000/api/persona', est))
      );

      swal('Éxito', 'Estudiantes cargados correctamente ✅', 'success');
      setExcelEstudiantes([]);
      await handleGetEstudiantes();
    } catch (error) {
      console.error(error);
      swal('Error', 'Hubo un error al guardar los estudiantes ❌', 'error');
    }
  };

  // ============================ BUSCADOR (lunr) ==============================
  // build index each render (para listas medianas funciona bien)
  const idx = lunr(function () {
    this.ref('id');
    this.field('nombre');
    this.field('correo');
    this.field('ci');
    this.field('celular');
    estudiantes?.forEach((doc) =>
      this.add({
        id: doc.id,
        nombre: doc.nombre,
        correo: doc.correo,
        ci: doc.ci,
        celular: doc.celular,
      })
    );
  });

  const handleChange = (e) => {
    const text = e.target.value;
    setSearchText(text);
    if (!text) {
      setSearchResults(estudiantes);
      return;
    }
    try {
      const res = idx.search(text);
      const encontrados = res
        .map((r) => estudiantes.find((est) => est.id === parseInt(r.ref)))
        .filter(Boolean);
      setSearchResults(encontrados.length ? encontrados : estudiantes);
    } catch (err) {
      setSearchResults(estudiantes);
    }
  };

  // ============================ EDICIÓN ==============================
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditNombre(user.nombre || '');
    setEditCorreo(user.correo || '');
    setEditCi(user.ci || '');
    setEditCelular(user.celular || '');
    // El modal se abre vía data-bs-toggle en el botón, aquí sólo seteamos los valores
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    try {
      await axios.put(`http://localhost:8000/api/persona/${selectedUser.id}`, {
        nombre: editNombre,
        correo: editCorreo,
        ci: editCi,
        celular: editCelular,
      });
      swal('Éxito', 'Estudiante actualizado', 'success');
      setSelectedUser(null);
      // refrescar lista y limpiar búsqueda
      await handleGetEstudiantes();
      setSearchText('');
    } catch (error) {
      console.error('Error al actualizar', error);
      swal('Error', 'No se pudo actualizar el estudiante', 'error');
    }
  };

  // ============================ BAJA / REINTEGRAR ==============================
  const handleDarBaja = async (id) => {
    try {
      await axios.put(`http://localhost:8000/api/persona/baja/${id}`, { estado: 0 });
      swal('Ok', 'Estudiante dado de baja', 'success');
      await handleGetEstudiantes();
    } catch (error) {
      console.error('Error al dar de baja', error);
      swal('Error', 'No se pudo dar de baja', 'error');
    }
  };

  const handleReintegrar = async (id) => {
    try {
      await axios.put(`http://localhost:8000/api/persona/baja/${id}`, { estado: 1 });
      swal('Ok', 'Estudiante reintegrado', 'success');
      await handleGetEstudiantes();
    } catch (error) {
      console.error('Error al reintegrar', error);
      swal('Error', 'No se pudo reintegrar', 'error');
    }
  };

  // ============================ RENDER ==============================
  return (
    <div className="container mt-4 estudiante"> 
      <h2 className="text-center mb-4 fw-bold text-primary"> 👥 Gestión de Miembros</h2>

      <ul className="nav nav-tabs" id="tabEstudiantes" role="tablist">
        <li className="nav-item" role="presentation">
          <button className="nav-link active" id="manual-tab" data-bs-toggle="tab" data-bs-target="#manual" type="button" role="tab">
            ➕ Registro Manual
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" id="excel-tab" data-bs-toggle="tab" data-bs-target="#excel" type="button" role="tab">
            📁 Cargar desde Excel
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" id="lista-tab" data-bs-toggle="tab" data-bs-target="#lista" type="button" role="tab">
            📋 Lista de Estudiantes
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button className="nav-link" id="lista-tab" data-bs-toggle="tab" data-bs-target="#listabajas" type="button" role="tab">
            🗑️ Bajas
          </button>
        </li>
      </ul>

      <div className="tab-content mt-4" id="tabEstudiantesContent">
        {/* ===== TAB: AGREGAR MANUAL ===== */}
        <div className="tab-pane fade show active" id="manual" role="tabpanel">
          <div className="card shadow-sm p-4 mb-4">
            <h5 className="fw-bold text-secondary mb-3">Agregar Nuevo Estudiante</h5>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Nombre</label>
                  <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Correo</label>
                  <input type="email" className="form-control" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
                </div>
                <div className="col-md-2">
                  <label className="form-label">CI</label>
                  <input type="text" className="form-control" value={ci} onChange={(e) => setCi(e.target.value)} required />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Celular</label>
                  <input type="text" className="form-control" value={celular} onChange={(e) => setCelular(e.target.value)} required />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Carrera</label>
                  <select className="form-select" value={carre} onChange={(e) => setCarre(e.target.value)} required>
                    <option value="">Seleccione carrera</option>
                    {carreras.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Tipo de Persona</label>
                  <select className="form-select" value={tipo} onChange={(e) => setTipo(e.target.value)} required>
                    <option value="">Seleccione tipo</option>
                    {tipoPersonas.map((tp) => (
                      <option key={tp.id} value={tp.id}>{tp.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-end mt-4">
                <button type="submit" className="btn btn-primary px-4">Guardar Estudiante</button>
              </div>
            </form>
          </div>
        </div>

        {/* ===== TAB: CARGAR EXCEL ===== */}
        <div className="tab-pane fade" id="excel" role="tabpanel">
          <div className="card shadow-sm p-4 mb-4">
            <h5 className="fw-bold text-secondary mb-3">Carga Masiva desde Excel</h5>

            <div className="row g-3 align-items-end">
              <div className="col-md-6">
                <label className="form-label">Archivo Excel</label>
                <input type="file" className="form-control" accept=".xlsx, .xls" onChange={handleFileUpload} />
              </div>
              <div className="col-md-4">
                <label className="form-label">Tipo de Persona</label>
                <select className="form-select" value={personaId} onChange={(e) => setPersonaId(e.target.value)}>
                  <option value="">Seleccione tipo</option>
                  {tipoPersonas.map((tp) => (
                    <option key={tp.id} value={tp.id}>{tp.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-2 text-end">
                <button className="btn btn-success w-100" onClick={handleGuardarExcel}>Guardar en BD</button>
              </div>
            </div>

            <div className="table-responsive mt-4" style={{ maxHeight: '360px', overflowY: 'auto' }}>
              <table className="table table-striped table-hover">
                <thead className="table-dark position-sticky top-0">
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>CI</th>
                    <th>Celular</th>
                    <th>Carrera</th>
                  </tr>
                </thead>
                <tbody>
                  {excelEstudiantes.map((est, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{est.nombre}</td>
                      <td>{est.correo}</td>
                      <td>{est.ci}</td>
                      <td>{est.celular}</td>
                      <td>{est.carrera}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ===== TAB: LISTA ===== */}
        <div className="tab-pane fade" id="lista" role="tabpanel" >
          <div className="card shadow-sm p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-secondary mb-0">Lista de Estudiantes</h5>
              <input
                type="text"
                className="form-control w-25"
                placeholder="Buscar..."
                value={searchText}
                onChange={handleChange}
              />
            </div>

            {/* tabla con scroll */}
            <div className="table-responsive" style={{ maxHeight: '540px', overflowY: 'auto' }}>
              <table className="table table-hover">
                <thead className="table-dark position-sticky top-0">
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>CI</th>
                    <th>Celular</th>
                    <th>Carrera</th>
                    <th>Tipo</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((est, i) => est.estado==1 && (
                    <tr key={est.id}>
                      <td>{i + 1}</td>
                      <td>{est.nombre}</td>
                      <td>{est.correo}</td>
                      <td>{est.ci}</td>
                      <td>{est.celular}</td>
                      <td>{est.persona_carreras?.[0]?.carrera?.nombre || '-'}</td>
                      <td>{est.tipo_persona?.nombre || '-'}</td>
                      <td>
                        {/* EDITAR: abre modal y setea datos (modal se muestra con data-bs-toggle) */}
                        <div className="d-flex justify-content-start gap-2">
                          {/* EDITAR */}
                          <button
                            className="btn btn-sm btn-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#modalEdit"
                            onClick={() => handleEditUser(est)}
                          >
                            <i className="bi bi-pencil-square me-1"></i> Editar
                          </button>

                          {/* BAJA */}
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              swal({
                                title: 'Dar de baja',
                                text: '¿Estás seguro que quieres dar de baja a este estudiante?',
                                icon: 'warning',
                                buttons: ['No', 'Sí'],
                                dangerMode: true,
                              }).then((willDelete) => {
                                if (willDelete) handleDarBaja(est.id);
                              })
                            }
                          >
                            <i className="bi bi-trash3 me-1"></i> Baja
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* TAB: BAJAS (mostramos en otra vista si lo deseas) */}
        <div className="tab-pane fade" id="listabajas" role="tabpanel">
          <div className="card shadow-sm p-4 mb-4">
            <div className="">
              <h5 className="fw-bold text-secondary mb-3">Estudiantes dados de baja</h5>
              <div className="table-responsive" style={{ maxHeight: '240px', overflowY: 'auto' }}>
                <table className="table table-striped">
                  <thead className="table-dark position-sticky top-0">
                    <tr>
                      <th>#</th>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Carrera</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estudiantes
                      .filter((e) => e.estado === 0)
                      .map((est, idx) => (
                        <tr key={est.id}>
                          <td>{idx + 1}</td>
                          <td>{est.nombre}</td>
                          <td>{est.correo}</td>
                          <td>{est.persona_carreras?.[0]?.carrera?.nombre || '-'}</td>
                          <td>
                            <button className="btn btn-sm btn-success" onClick={() => handleReintegrar(est.id)}>
                              Reintegrar
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

      {/* ===== MODAL EDICIÓN ===== */}
      <div className="modal fade" id="modalEdit" tabIndex="-1" aria-labelledby="modalEditLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalEditLabel">Editar Estudiante</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => { e.preventDefault(); handleUpdateUser(); }} id="formEdit">
                <div className="mb-3">
                  <label className="form-label">Nombre</label>
                  <input type="text" className="form-control" value={editNombre} onChange={(e) => setEditNombre(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Correo</label>
                  <input type="email" className="form-control" value={editCorreo} onChange={(e) => setEditCorreo(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">CI</label>
                  <input type="text" className="form-control" value={editCi} onChange={(e) => setEditCi(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Celular</label>
                  <input type="text" className="form-control" value={editCelular} onChange={(e) => setEditCelular(e.target.value)} required />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleUpdateUser}>Guardar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Estudiante;
