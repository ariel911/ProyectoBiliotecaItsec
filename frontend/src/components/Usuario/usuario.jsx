

import "./usuario.css"
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';



const Usuario = () => {
  const token = localStorage.getItem('token');
  const [selectedUser, setSelectedUser] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [prestamos, setPrestamos] = useState([]);
  const [roles, setRoles] = useState([]);
  /*   const setBusquedaCallback = useCallback(setBusqueda, []); */

  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState(0);
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');


  useEffect(() => {
    handleGetUsers();
    handleGetPrestamos();
    handleGetRoles();

  }, []);


  useEffect(() => {
    if (selectedUser) {
      document.getElementById('nombre2').value = selectedUser.nombre || '';
      document.getElementById('correo2').value = selectedUser.correo || '';
      document.getElementById('clave2').value = selectedUser.clave || '';
    }
    handleGetUsers();

  }, [selectedUser]);

  //actualizar todo eso

  const handleGetPrestamos = async () => {
    const res = await axios({
      url: "http://localhost:8000/api/prestamo",
      method: "GET",
    });
    setPrestamos(res.data.data.prestamos);
  };

  const handleGetUsers = async () => {
    const res = await axios({
      url: "http://localhost:8000/api/usuarios",
      method: "GET",
    });
    setUsuarios(res.data.data.usuarios);
  };
  const handleGetRoles = async () => {
    const res = await axios({
      url: "http://localhost:8000/api/rol",
      method: "GET",
    });
    setRoles(res.data.data.rol);
  };

  //editar
  const handleEditUser = (user) => {
    document.getElementById('nombre2').defaultValue = '';
    document.getElementById('correo2').defaultValue = '';
    document.getElementById('clave2').defaultValue = '';

    setSelectedUser(user);

  };
  const handleDarReintegrar = async (id) => {
    await axios({
      url: `http://localhost:8000/api/usuarios/baja/${id}`,
      method: "PUT",
      data: {
        estado: 1,

      },
    }).then((response) => {
      // Accede a la respuesta de la API
      console.log("Respuesta de la API:", response.data);
    });
    handleGetUsers();
    swal({
      title: "Usuario Reintegrado!",
      /* text: "Por favor, completa todos los campos requeridos", */
      icon: "success",
      button: "Ok",
    });
  }
  const handleDarEliminar = async (id) => {
    try {
      await axios({
        url: `http://localhost:8000/api/usuarios/baja/${id}`,
        method: "PUT",

        data: { estado: 3 }
      }).then((response) => {
        // Accede a la respuesta de la API
        console.log("Respuesta de la API:", response.data);
      });
      handleGetUsers();
      swal({
        title: `Usuario Eliminado`,
        icon: "success",
        button: "Ok",
      });
    } catch (error) {
      console.error(error);
    }
  };
  const handleDarBaja = async (id) => {

    // Restablecer los campos del formulario
    await axios({
      url: `http://localhost:8000/api/usuarios/baja/${id}`,
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
    handleGetUsers();
  }
  const handleUpdateUser = async (e) => {

    e.preventDefault();

    await axios({
      url: `http://localhost:8000/api/usuarios/${selectedUser.id}`,
      method: "PUT",
      /*         headers: {
                Authorization: `Bearer ${token}`,
              }, */
      data: {
        nombre: document.getElementById('nombre2').value,
        correo: document.getElementById('correo2').value,
        clave: document.getElementById('clave2').value,
      },

    });
    swal({
      title: "Usuario Actualizado !",
      /* text: "Por favor, completa todos los campos requeridos", */
      icon: "success",
      button: "Ok",
    });
    // Update the user in the local state
    const updatedUsuarios = usuarios.map((usuario) =>
      usuario.id === selectedUser.id ? { ...usuario, ...selectedUser } : usuario
    );

    setUsuarios(updatedUsuarios);
    // Close the modal
    setSelectedUser(null);

  };
  const handleSubmit = async (e) => {
    e.preventDefault();


    // Realizar la solicitud para agregar el usuario
    try {
      const response = await axios.post(
        'http://localhost:8000/api/usuarios',
        {
          nombre,
          correo,
          clave,
          estado: 1,
          rolId: rol
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
      setClave('');
      setRol(0);
      handleGetUsers();
      // Llamar a la función del padre para actualizar la lista de usuarios
      swal({
        title: "Usuario Agregado!",
        /* text: "Por favor, completa todos los campos requeridos", */
        icon: "success",
        button: "Ok",
      });

      // Opcional: Mostrar una notificación o mensaje de éxito
    } catch (error) {
      // Opcional: Mostrar una notificación o mensaje de error
    }
  };

  return (
    <div className="usuario">
      <h1 className="titu4">Usuarios del Sistema</h1>
      <ul className="nav nav-tabs" role="tablist">
        <li className="nav-item">
          <a className="nav-link active" data-bs-toggle="tab" href="#agregar" role="tab">Agregar Usuario</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-bs-toggle="tab" href="#listar" role="tab">Lista de Usuarios</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" data-bs-toggle="tab" href="#bajas" role="tab">Lista de Bajas</a>
        </li>
      </ul>

      {/* ver mas */}
      <div className="tab-content">
        <div className="tab-pane fade show active NuevoUsuario" id="agregar" role="tabpanel" >
          <form onSubmit={handleSubmit}>
            <div className='row'>
              <div className="mb-3 col">
                <label htmlFor="nombre" className="form-label">Nombre</label>
                <input type="text" className="form-control" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
              <div className="mb-3 col">
                <label htmlFor="correo" className="form-label">Correo</label>
                <input type="email" className="form-control" id="correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
              </div>
              <div className="mb-3 col">
                <label htmlFor="clave" className="form-label">Password</label>
                <input type="text" className="form-control" id="clave" value={clave} onChange={(e) => setClave(e.target.value)} required />
              </div>
              <div className="mb-3 col selecc">
                <label htmlFor="rol" className="form-label">Rol</label>
                <select className="form-control" id="rol" value={rol} onChange={(e) => setRol(e.target.value)}>
                  <option value="" hidden selected>Seleccione Rol</option>
                  {roles.map((rol) => rol.estado == 1 && (
                    <option key={rol.id} value={rol.id}>{rol.nombre_rol}</option>
                  )

                  )}
                </select>
              </div>

            </div>

            <button type="submit" className="btn btn-primary botonUsuario">Agregar</button>
          </form>

        </div>


        {/* editar */}
        <div className={`modal fade`} id="modalEdit" taindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Editar Lector</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
              </div>
              <div className="modal-body">
                <form >
                  <div className="mb-3">
                    <label htmlFor="nombre" className="col-form-label">Nombre:</label>

                    <input type="text" className="form-control" id="nombre2" name="nombre" defaultValue={selectedUser?.nombre} required />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="correo" className="col-form-label">Correo:</label>
                    <input type="text" className="form-control" id="correo2" name="correo" defaultValue={selectedUser?.correo} required />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="clave" className="col-form-label">Clave:</label>
                    <input type="text" className="form-control" id="clave2" name="clave" defaultValue={selectedUser?.clave} required />
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

        <div className="tab-pane fade " id="listar" role="tabpanel">
          <div className="table table-responsive tablaUsuario">
            <table className="table table-fixed">
              <thead className="table-dark">
                <tr>
                  <th scope="col">Nº</th>
                  <th scope="col">Nombre</th>
                  <th scope="col ">Correo</th>
                  <th scope="col">Cargo</th>
                  <th scope="col">Accion</th>
                </tr>
              </thead>
              <tbody>
                {usuarios?.map((usuario, index) => usuario.estado == 1 && (
                  <tr key={usuario.id}>
                    <td>{index + 1}</td>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.correo}</td>
                    <td>{usuario?.rol?.nombre_rol}</td>
                    <td><button className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#modalEdit" data-bs-whatever="@mdo" onClick={() => handleEditUser(usuario)}>Editar</button>
                      <button className='btn btn-danger boton' onClick={() => handleDarBaja(usuario.id)}>Baja</button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* bajas de usuarios */}
        <div className="tab-pane fade  tablaUsuario" id="bajas" role="tabpanel">
          <table className="table table-fixed">
            <thead className="table-dark sticky-top">
              <tr>
                <th scope="col">Nº</th>
                <th scope="col">Nombre</th>
                <th scope="col">Correo</th>
                <th scope="col ">Rol</th>
                <th scope="col ">Accion</th>
              </tr>
            </thead>
            <tbody>
              {usuarios?.map((usuario, index) => usuario.estado == 0 && (
                <tr key={usuario.id}>
                  <td>{index + 1}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.correo}</td>
                  <td>{usuario?.rol?.nombre_rol}</td>
                  <td>
                    <button className='btn btn-success boton' onClick={() => handleDarReintegrar(usuario.id)}>Reintegrar</button>
                    <button className='btn btn-danger boton' onClick={() => handleDarEliminar(usuario.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>

  );
};

export default Usuario;