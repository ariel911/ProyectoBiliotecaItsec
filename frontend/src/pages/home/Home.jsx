import { useState, useEffect } from 'react';
import NavBar2 from '../../components/navBar/NavBar2';
import ImgPerfil from '../../components/imgPerfil/imgPerfil';
import './Home.css'
import logo from "../../assets/logo2.png";


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faBookOpenReader } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom';
const Home = ({ usuario }) => {
  const token = localStorage.getItem('token');
  const nombre = localStorage.getItem('nombre');
  const rol = localStorage.getItem('Rol');
 

  return (

    <>

      <div className='barraSup'>

        <img src={logo} className='logo' />
        <div className='imgPerfil'>
          <ImgPerfil />
          <div className='nombres'>
            <p className='span1'>{nombre}</p>
            <p className='span2'>{rol}</p>
          </div>


        </div>
      </div>
      <div className='navegacion navbar' >
        <Link to={'/homeInicio'}>
          <div className='mibiblio'>
            <FontAwesomeIcon className='iconobiblio' icon={faBookOpenReader} style={{ "--fa-primary-color": "#ffffff", "--fa-secondary-color": "#b0b0b0", }} />
            <h3>BIBLIOTECA</h3>
          </div>
        </Link>



        <nav className='men'>

          <NavBar2 brand={['Inicio', 'Usuarios', 'Prestamos', 'Documentos', 'Formato Docs', 'Carrera', 'Área', 'Tipo Documento']} />

        </nav>
      </div>

      {/* <Entrada/> */}


      {/* <button >Cerrar Sesion</button> */}
      {/* <Perfil /> */}

    </>


  )
}

export default Home
