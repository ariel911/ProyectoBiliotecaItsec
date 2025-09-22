import React, { useState } from 'react';
import axios from 'axios';
import img from '../../assets/itsec.png'
import './PaginaLibros.css'
import {useNavigate} from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('');
  const [ci, setCi] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get("http://localhost:8000/api/persona");
      const personas = res.data.data.personas;

      const persona = personas.find(p => p.correo === email && p.ci.toString() === ci);

      if (persona) {
        setIsLoggedIn(true);
        setError('');
       
        localStorage.setItem("nombrePersona", persona.nombre);
        localStorage.setItem("idPersona", persona.id);
        navigate("/PaginaLibro");
      } else {
        setError('Correo o CI incorrectos');
      }
    } catch (err) {
      console.error(err);
      setError('Hubo un error al conectar con el servidor');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginLibros">
      <div className="card p-4" style={{ width: '24rem' }}>
        <div className="text-center">
          <img
            src={img}
            alt="Logo"
            className="mb-4"
            style={{ width: '50%', borderRadius: '50%' }}
          />
        </div>
        {isLoggedIn ? (
          <h2 className="text-center">¡Bienvenido {email}!</h2>
        ) : (
          <form onSubmit={handleLogin}>
            <h2 className="text-center mb-4">Iniciar Sesión</h2>
            <div className="form-group mb-3">
              <label>Usuario:</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Contraseña:</label>
              <input
                type="password"
                className="form-control"
                value={ci}
                onChange={(e) => setCi(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-danger">{error}</p>}
            <button type="submit" className="btn btn-primary w-100">Ingresar</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
