import React, { useState, useEffect } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import './estudiante.css'

import lunr from 'lunr';

const Estudiante = ({ handleAddUser }) => {

  const token = localStorage.getItem('token');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [ci, setCi] = useState('');
  const [celular, setCelular] = useState('');
  const [carreras, setCarreras] = useState([]); // Valor inicial del rol
  const [tipo, setTipo] = useState([]); // Valor inicial del rol
  const [tipoPersonas, settipoPersonas] = useState([]); // Valor inicial del rol
  const [carre, setCarre] = useState(0); // Valor inicial del rol

  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]); // Almacena los resultados de la búsqueda
  useEffect(() => {
    // Obtener la lista de carreras al cargar el componente
    handleGetCarreras();
    handleGetEstudiantes();
    handleGetTipoPersonas()
  }, []);
  useEffect(() => {
    handleGetEstudiantes();

  }, []);
  useEffect(() => {
    if (selectedUser) {
      document.getElementById('nombre2').value = selectedUser.nombre || '';
      document.getElementById('correo2').value = selectedUser.correo || '';
      document.getElementById('ci2').value = selectedUser.ci || 0;
      document.getElementById('celular2').value = selectedUser.celular || 0;
    }
    handleGetEstudiantes();
    /* handleGetSanciones();
 */


  }, [selectedUser]);


  const handleGetCarreras = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/carrera', {
        /*         headers: {
                  Authorization: `Bearer ${token}`
                } */
      });

      setCarreras(response.data.data.carrera);

    } catch (error) {
      // Opcional: Mostrar una notificación o mensaje de error
    }

  };
  const handleGetTipoPersonas = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/tipo_persona', {
      });

      settipoPersonas(response.data.data.tipo_persona);

    } catch (error) {

    }

  };
  const handleSubmit = async (e) => {
    e.preventDefault();


    // Realizar la solicitud para agregar el usuario
    try {
      const response = await axios.post(
        'http://localhost:8000/api/persona',
        {
          nombre,
          correo,
          ci,
          celular,
          estado: 1,
          carreras: [carre],
          tipoPersonaId: tipo
        },
        {
          /*      headers: {
                 Authorization: `Bearer ${token}`
               } */
        }
      );

      // Limpiar los campos del formulario
      setNombre('');
      setCorreo('');
      setCi('');
      setCelular('');
      setCarre(0);
      setTipo(0);
      handleGetEstudiantes();
      // Llamar a la función del padre para actualizar la lista de usuarios
      swal({
        title: "Estudiante Agregado!",
        /* text: "Por favor, completa todos los campos requeridos", */
        icon: "success",
        button: "Ok",
      });
      handleAddUser(response.data);

      // Opcional: Mostrar una notificación o mensaje de éxito
    } catch (error) {
      // Opcional: Mostrar una notificación o mensaje de error
    }
  };

  //para mostrar estudiantes
  const handleGetEstudiantes = async () => {
    const res = await axios({
      url: "http://localhost:8000/api/persona",
      method: "GET",
      /*       headers: {
              Authorization: `Bearer ${token}`,
            }, */
    });
    setEstudiantes(res.data.data.personas);
    setSearchResults(res.data.data.personas)

  };

  //editar estudiante
  //editar
  const handleEditUser = (user) => {
    document.getElementById('nombre2').defaultValue = '';
    document.getElementById('correo2').defaultValue = '';
    document.getElementById('ci2').defaultValue = 0;
    document.getElementById('celular2').defaultValue = 0;

    setSelectedUser(user);


  };
  //buscar Prestamo


  const handleUpdateUser = async (e) => {
    // Make the API request to update the user
    e.preventDefault();
    // Restablecer los campos del formulario

    await axios({
      url: `http://localhost:8000/api/persona/${selectedUser.id}`,
      method: "PUT",
      /*   headers: {
          Authorization: `Bearer ${token}`,
        }, */
      data: {
        nombre: document.getElementById('nombre2').value,
        correo: document.getElementById('correo2').value,
        ci: document.getElementById('ci2').value,
        celular: document.getElementById('celular2').value,
      },
    });

    // Update the user in the local state
    const updatedUsuarios = estudiantes?.map((usuario) =>
      usuario.id === selectedUser.id ? { ...usuario, ...selectedUser } : usuario
    );

    setEstudiantes(updatedUsuarios);
    setSelectedUser(null);

  };

  //buscador
  var idx = lunr(function () {
    this.field('id')
    this.field('nombre')
    this.field('correo')
    this.field('celular')
    this.field('ci')



    estudiantes?.map((document, ind) =>
      this.add({
        "id": document.id,
        "nombre": document?.nombre,
        "correo": document?.correo,
        "celular": document?.celular,
        "ci": document?.ci,

      })
    );
  })

console.log("est:",estudiantes)
  const encontrado = [];




  const handleChange = (event) => {
    const text = event.target.value;
    setSearchText(text);

    // Realiza la búsqueda en función del texto ingresado (puedes usar una función de búsqueda o llamar a una API aquí)
    // Por ahora, simplemente vamos a simular algunos resultados de búsqueda
    const results = simulateSearch(text);

    setSearchResults(results);
  };

  // Función de simulación de búsqueda (puedes reemplazarla con tu lógica de búsqueda real)
  const simulateSearch = (text) => {
    // Simulación de búsqueda en base al texto ingresado
    const aqui = idx.search(text)
    for (let clave of aqui) {
      const objetoEncontrado = estudiantes?.find(objeto => objeto.id == clave.ref);
      if (objetoEncontrado) {
        encontrado.push(objetoEncontrado);
      }
    }
    return encontrado;
  };

  const handleDarBaja = async (id) => {

    // Restablecer los campos del formulario
    await axios({
      url: `http://localhost:8000/api/persona/baja/${id}`,
      method: "PUT",
      /*           headers: {
                  Authorization: `Bearer ${token}`,
                }, */
      data: {
        estado: 0,

      },
    }).then((response) => {
      // Accede a la respuesta de la API
      console.log("Respuesta de la API:", response.data);
    });
    handleGetEstudiantes();
  }
  const handleReintegrar = async (id) => {

    // Restablecer los campos del formulario
    await axios({
      url: `http://localhost:8000/api/persona/baja/${id}`,
      method: "PUT",
      /*           headers: {
                  Authorization: `Bearer ${token}`,
                }, */
      data: {
        estado: 1,

      },
    }).then((response) => {
      // Accede a la respuesta de la API
      console.log("Respuesta de la API:", response.data);
    });
    handleGetEstudiantes();
  }
  return (
    <div className='estudiante'>
      <h1 className='estudianteh1'>Miembros Instituto</h1>
      <ul className="nav nav-tabs" role="tablist">
        <li className="nav-item">
          <a className="nav-link active" data-bs-toggle="tab" href="#agregar" role="tab">Agregar</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-bs-toggle="tab" href="#listar" role="tab">Lista</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-bs-toggle="tab" href="#bajas" role="tab">Bajas</a>
        </li>
      </ul>

      <div className="tab-content">
        <div className='NuevoEstudiante tab-pane fade show active' id='agregar'>
          <form onSubmit={handleSubmit}>
            <div className='row '>
              <div className="mb-3 col-3">
                <label htmlFor="nombre" className="form-label">Nombre</label>
                <input type="text" className="form-control" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
              <div className="mb-3 col-3">
                <label htmlFor="correo" className="form-label">Correo</label>
                <input type="email" className="form-control" id="correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
              </div>
              <div className="mb-3 col-3">
                <label htmlFor="ci" className="form-label">CI</label>
                <input type="text" className="form-control" id="ci" value={ci} onChange={(e) => setCi(e.target.value)} required />
              </div>
              <div className="mb-3 col-3">
                <label htmlFor="celular" className="form-label">Celular</label>
                <input type="text" className="form-control" id="celular" value={celular} onChange={(e) => setCelular(e.target.value)} required />
              </div>
              <div className="mb-3 col-3">
                <label htmlFor="carrera" className="form-label">Carrera</label>
                <select className="form-control" id="carrera" value={carre} onChange={(e) => setCarre(e.target.value)}>
                  <option value="" hidden selected>Seleccione Carrera</option>
                  {carreras?.map((carrera) =>
                    <option key={carrera.id} value={carrera.id}>{carrera.nombre}</option>
                  )}
                </select>
              </div>

              <div className="mb-3 col-3">
                <label htmlFor="tipo" className="form-label">T. persona</label>
                <select className="form-control" id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
                  <option value="" hidden selected>Seleccione tipo</option>
                  {tipoPersonas?.map((tipo) =>
                    <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                  )}
                </select>
              </div>
{/* 
              <div className='mb-3 col '>
                <label htmlFor="descripcion" className="form-label"></label>
                <Select
                  options={filteredOptions}
                  onChange={handleSelectChange}
                  isSearchable
                  isMulti
                  placeholder="Selecciona Autores"
                  value={selectedOption}
                />
              </div> */}

            </div>

            <button type="submit" className="btn btn-primary bootonEstudiante">Agregar</button>
          </form>
        </div>
        {/* editar estudiante */}
        <div className={`modal fade`} id="modalEdit" taindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Editar Estudiante</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
              </div>
              <div className="modal-body">
                <form >
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">Nombre:</label>

                    <input type="text" className="form-control" id="nombre2" name="nombre2" defaultValue={selectedUser?.nombre} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">Correo:</label>
                    <input type="text" className="form-control" id="correo2" name="correo2" defaultValue={selectedUser?.correo} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">CI:</label>
                    <input type="number" className="form-control" id="ci2" name="ci2" defaultValue={selectedUser?.ci} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="recipient-name" className="col-form-label">celular:</label>
                    <input type="number" className="form-control" id="celular2" name="celular2" defaultValue={selectedUser?.celular} required />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="submit" className="btn btn-primary" onClick={handleUpdateUser} data-bs-dismiss="modal">Guardar</button>
              </div>
            </div>
          </div>
        </div>
        {/* para mostrar estudiantes */}

        <div className={`tab-pane fade `} id='listar'>
          <input type="text" className="form-control mb-3 mt-3" placeholder="Buscar formato..." value={searchText} onChange={handleChange} />

          <div className="table-responsive tablaEstudiante">
            <table className="table table-fixed">
              <thead className="table-dark sticky-top">
                <tr>
                  <th scope="col">Nº</th>
                  <th scope="col">Nombre</th>
                  <th scope="col ">Correo</th>
                  <th scope="col ">Carrera</th>
                  <th scope="col">Celular</th>
                  <th scope="col">Carnet CI</th>
                  <th scope="col">Accion</th>
                </tr>
              </thead>
              <tbody>
                {searchResults?.map((estudiante, index) => estudiante.estado == 1 && (

                  <tr key={estudiante.id}>
                    <td>{index + 1}</td>
                    <td>{estudiante.nombre}</td>
                    <td>{estudiante.correo}</td>
               {/*      <td>{estudiante.persona.carrera.nombre}</td> */}
               <td>{estudiante.persona_carreras[0]?.carrera.nombre}</td>
                    <td>{estudiante.celular}</td>
                    <td>{estudiante.ci}</td>

                    <td>
                      <button className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#modalEdit" data-bs-whatever="@mdo" onClick={() => handleEditUser(estudiante)}>Editar</button>
                      <button className='btn btn-danger botonEstudiante' data-bs-target="#modalBajas" data-bs-whatever="@mdo" onClick={() => handleDarBaja(estudiante.id)}>Baja</button>
                      {/*  <button className='btn btn-secondary boton' data-bs-toggle="modal" data-bs-target="#modalSancion" data-bs-whatever="@mdo" >Sancionar</button> */} {/* onClick={() => setLectorSancionado(usuario)} */}

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>



        <div className={`tab-pane fade `} id='bajas'>
          <div className="table-responsive tablaEstudiante">
            <table className="table table-fixed">
              <thead className="table-dark sticky-top">
                <tr>
                  <th scope="col">Nº</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Correo</th>
                  <th scope="col">Carrera</th>
                  <th scope="col ">Rol</th>
                  <th scope="col ">Accion</th>


                </tr>
              </thead>
              <tbody>
                {estudiantes?.map((estudiante, index) => estudiante.estado == 0 && (
                  <tr key={estudiante.id}>
                    <td>{index + 1}</td>
                    <td>{estudiante.nombre}</td>
                    <td>{estudiante.correo}</td>
                    <td>{estudiante.persona_carreras[0]?.carrera.nombre}</td>
                    <td>{estudiante?.rol?.nombre_rol}</td>
                    <td>
                      <button className='btn btn-danger boton' onClick={() => handleReintegrar(estudiante.id)}>Reintegrar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Estudiante;
