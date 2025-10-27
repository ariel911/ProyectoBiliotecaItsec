import { useState } from 'react';
import NavBar2 from '../../components/navBar/NavBar2';
import Notificacion from '../../components/notificaciones/notificacion';
import ImgPerfil from '../../components/imgPerfil/imgPerfil';
import './Home.css';
import logo from "../../assets/logo2.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Outlet } from 'react-router-dom'; // 👈 importante importar esto

const Home = () => {
  const nombre = localStorage.getItem('nombre');
  const rol = localStorage.getItem('Rol');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className='layout-principal'>
      {/* 🔵 Barra Superior */}
      <div className="barraSup d-flex align-items-center justify-content-between px-4">
        <div className="d-flex align-items-center">
          <button className="btn btn-outline-light d-lg-none me-3" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} />
          </button>
          <img src={logo} alt="Logo Biblioteca" className="logo" />
        </div>
        <div className="d-flex align-items-center perfil-container">
          <div className='NotiPrestamos'>
            <Notificacion />
          </div>
          <ImgPerfil />
          <div className="nombres">
            <p className="span1">{rol}</p>
            <p className="span2 ">{nombre}</p>
          </div>
        </div>
      </div>

      {/* 🧭 Menú lateral */}
      <div className={`navegacion ${sidebarOpen ? 'open' : ''}`}>
        <NavBar2
          brand={[
            'Inicio',
            'Usuarios',
            'Prestamos',
            'Documentos',
            'Formato Docs',
            'Áreas y autores',
          ]}
        />
      </div>

      {/* 📄 Contenido principal */}
      <div className="contenido flex-grow-1 p-4 contenido-principal animate__animated animate__fadeInUp">
        <Outlet /> {/* 👈 Aquí se renderizan tus componentes dinámicos */}
      </div>
    </div>
  );
};

export default Home;
