import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react';
import Home from './pages/home/Home';
import Entrada from './components/Entrada/Entrada';

import Estudiante from './components/Estudiante/estudiante';
import Sancion from './components/Usuario/sanciones'
import Usuario from './components/Usuario/usuario'
import Documento from './components/Documento/documento'
import Reportes from './components/reportes/reportes'
import Libro from './components/Documento/libro'
import Prestamo from './components/Prestamo/prestamo'
import Autor from './components/autor/autor'


import PaginaLibros from './pages/PaginaLibros/PaginaLibros'
import LoginBiblio from './pages/PaginaLibros/loginLibros'
import PaginaItsec from './pages/pagina/pagina'
import Login from './pages/Login/login'
import ProtectedRoutes from './routes/ProtectedRoutes';
import Backup from './components/backup/backup';
import Recuperacion from './components/recuperacion/recuperacion';

import { HOME_INICIO, HOME_RECUPERACION, HOME_ITSEC, LOGIN, HOME_BACKUP, PAGINA_LIBRO, HOME_AUTOR, HOME_ESTUDIANTE, HOME_SANCION, HOME_USUARIO, HOME_DOCUMENTO, HOME_LIBRO, HOME_PRESTAMO, LOGIN_BIBLIOTECA, HOME_REPORTES } from './routes/path';
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
          <Route path={PAGINA_LIBRO} element={<PaginaLibros />} />
          <Route path={HOME_ITSEC} element={<PaginaItsec />} />
          <Route path={LOGIN_BIBLIOTECA} element={<LoginBiblio />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/homeInicio" element={<Home />}>
              <Route path={HOME_INICIO} index element={<Entrada /> } />
              <Route path={HOME_ESTUDIANTE} element={<Estudiante />} />
              <Route path={HOME_AUTOR} element={<Autor />} />
              <Route path={HOME_SANCION} element={<Sancion />} />
              <Route path={HOME_USUARIO} element={<Usuario />} />
              <Route path={HOME_DOCUMENTO} element={<Documento />} />
              <Route path={HOME_LIBRO} element={<Libro />} />
              <Route path={HOME_PRESTAMO} element={<Prestamo />} />
              <Route path={HOME_REPORTES} element={<Reportes /> } />        
              <Route path={HOME_BACKUP} element={<Backup /> } />
              <Route path={HOME_RECUPERACION} element={<Recuperacion />} />
            </Route>
          </Route>
          <Route path='*' element={<Navigate to='/login' />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
  