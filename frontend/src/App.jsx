import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react';
import Home from './pages/home/Home';
import Entrada from './components/Entrada/Entrada';
import Rol from './components/Usuario/rol';
import Estudiante from './components/Estudiante/estudiante';
import Carrera from './components/Documento/carrera'
import Formato from './components/Documento/formato'
import Area from './components/Documento/area'
import Sancion from './components/Usuario/sanciones'
import Usuario from './components/Usuario/usuario'
import Documento from './components/Documento/documento'
import Reportes from './components/reportes/reportes'
import Libro from './components/Documento/libro'
import Prestamo from './components/Prestamo/prestamo'
import Autor from './components/autor/autor'
import Tipo from './components/Documento/tipo_doc'
import Estadisticas from './components/estadisticas/estadisticas'
import PaginaLibros from './pages/PaginaLibros/PaginaLibros'
import LoginBiblio from './pages/PaginaLibros/loginLibros'
import PaginaItsec from './pages/pagina/pagina'
import Login from './pages/Login/login'
import ProtectedRoutes from './routes/ProtectedRoutes';
import Backup from './components/backup/backup';
import Cargar from './components/cargarEstudiantes/cargarestudiante';
import Recuperacion from './components/recuperacion/recuperacion';

import { HOME_INICIO,HOME_RECUPERACION,CARGAR, HOME_ITSEC,LOGIN,HOME_ESTADISTICAS,HOME_BACKUP, PAGINA_LIBRO, HOME_TIPO, HOME_AUTOR, HOME_ROL, HOME_ESTUDIANTE, HOME_CARRERA, HOME_FORMATO, HOME_AREA, HOME_SANCION, HOME_USUARIO, HOME_DOCUMENTO, HOME_LIBRO, HOME_PRESTAMO, LOGIN_BIBLIOTECA, HOME_REPORTES } from './routes/path';
const App = () => {


  const [token, setToken] = useState("");
  const [usuario, setUsuario] = useState("");
  const addToken = (token) => { setToken(token) }
  const addUsuario = (usuario) => { setUsuario(usuario) }

  
  return (
    <>
      <BrowserRouter>

        <Routes>
          <Route path={LOGIN} element={<Login addToken={addToken} addUsuario={addUsuario} />} />
          <Route path={PAGINA_LIBRO} element={<PaginaLibros/>} />
          <Route path={CARGAR} element={<Cargar/>} />
          <Route path={HOME_ITSEC} element={<PaginaItsec/>} />
          <Route path={LOGIN_BIBLIOTECA} element={<LoginBiblio/>} />
          <Route element={<ProtectedRoutes />}>
            <Route path={HOME_INICIO} element={<div className='contenedor2'><Home usuario={usuario}/> <Entrada /> </div>} />
            <Route path={HOME_ROL} element={<div className='contenedor2'><Home /> <Rol /> </div>} />
            <Route path={HOME_ESTUDIANTE} element={<div className='contenedor2'><Home /> <Estudiante /> </div>} />
            <Route path={HOME_CARRERA} element={<div className='contenedor2'><Home /> <Carrera /> </div>} />
            <Route path={HOME_FORMATO} element={<div className='contenedor2'><Home /> <Formato /> </div>} />
            <Route path={HOME_AREA} element={<div className='contenedor2'><Home /> <Area /> </div>} />
            <Route path={HOME_AUTOR} element={<div className='contenedor2'><Home /> <Autor /> </div>} />
            <Route path={HOME_SANCION} element={<div className='contenedor2'><Home /> <Sancion /> </div>} />
            <Route path={HOME_USUARIO} element={<div className='contenedor2'><Home /> <Usuario /> </div>} />
            <Route path={HOME_DOCUMENTO} element={<div className='contenedor2'><Home /> <Documento /> </div>} />
            <Route path={HOME_LIBRO} element={<div className='contenedor2'><Home /> <Libro /> </div>} />
            <Route path={HOME_PRESTAMO} element={<div className='contenedor2'><Home /> <Prestamo /> </div>} />
            <Route path={HOME_ESTADISTICAS} element={<div className='contenedor2'><Home /> <Estadisticas /> </div>} />
            <Route path={HOME_REPORTES} element={<div className='contenedor2'><Home /> <Reportes /> </div>} />
            <Route path={HOME_TIPO} element={<div className='contenedor2'><Home /> <Tipo /> </div>} />
            <Route path={HOME_BACKUP} element={<div className='contenedor2'><Home /> <Backup /> </div>} />
            <Route path={HOME_RECUPERACION} element={<div className='contenedor2'><Home /> <Recuperacion /> </div>} />
          </Route>

        <Route path='*' element={<Navigate to='/login' />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
