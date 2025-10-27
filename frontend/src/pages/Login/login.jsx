
import './login.css';
import { useState } from 'react';
import axios from 'axios';
import img from '../../assets/itsec.png'
import { useNavigate } from 'react-router-dom'
import ErrorMessage from '../../components/error/error'; // Adjust the path accordingly
function Login({ addToken, addUsuario }) {

  const navigate = useNavigate()

  const [datos, setDatos] = useState({
    correo: "",
    clave: " "
  });

  const [token, setToken] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    let newDatos = { ...datos, [name]: value };
    setDatos(newDatos);
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (!e.target.checkValidity()) {
        console.log("no enviar");
      } else {
        const res = await axios({
          url: "http://localhost:8000/auth/login",
          method: 'POST',
          data: datos
        });

        setToken(res.data.data.token);
        addToken(res.data.data.token);
        addUsuario(res.data.data.usuario);

        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("nombre", res.data.data.usuario.nombre);
        localStorage.setItem("id", res.data.data.usuario.id);
        localStorage.setItem("Rol", res.data.data.usuario.rol.nombre_rol);
        if (res.data.data.usuario.estado == 1) {
          navigate("/homeInicio");
        }else{
          setError("Acceso inválido. usuario Sancionado");
        }
      }
    } catch (error) {
      setError("Acceso inválido. Por favor, inténtelo otra vez.");
      // Handle the error as needed, e.g., show an error message to the user
    }
  }

  return (
    <div className='contenedor'>
      <div className="login">
        <div className='w-20 imagen'>
          <img
            src={img}
            className='img-fluid px-5 py-2 '
            alt='some value'
          />
        </div>

        <h1 className="text-center">Bienvenidos al Sistema</h1>

        {error && <ErrorMessage message={error} />}
        <form className="needs-validation" onSubmit={handleSubmit}>
          <div className="form-group was-validated">
            <label className="form-label" htmlFor="email">Correo</label>
            <input className="form-control" type="email" name='correo' onChange={handleInputChange} value={datos.correo} id="email" required></input>
            <div className="invalid-feedback">
              Please enter your email address
            </div>
          </div>
          <div className="form-group was-validated">
            <label className="form-label" htmlFor="clave">Contraseña</label>
            <input className="form-control" type="password" onChange={handleInputChange} name='clave' value={datos.clave} id="clave" required></input>
            <div className="invalid-feedback">
              Please enter your password
            </div>
          </div>

          <div className='d-flex justify-content-between'>
            {/* <input className="btn btn-outline-primary w-30" type="submit" value="Register"></input> */}
            <input className="btn btn-primary w-30 px-4 py-1 botonLogin" type="submit" value="ACCEDER"></input>

          </div>
          <div className="form-group form-check mt-3">
            <input className="form-check-input" type="checkbox" id="check"></input>
            <label className="form-check-label" htmlFor="check">Remember me</label>

          </div>

        </form>



      </div>
    </div>
  );
}

export default Login;