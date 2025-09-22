
import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import './Entrada.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUsers, faUser, faFolder, faBook, faHourglass, faBookSkull, faBookAtlas, faBookOpen } from '@fortawesome/free-solid-svg-icons'

const Entrada = () => {
    /* const token = localStorage.getItem('token'); */
    const [usuarios, setUsuarios] = useState([]);
    const [sanciones, setSanciones] = useState([]);
    const [prestamos, setPrestamos] = useState([]);
    const [documentos, setDocumentos] = useState([]);
    const [areas, setAreas] = useState([]);
    const [carreras, setCarreras] = useState([]);

     useEffect(() => {
        handleGetSanciones();
        handleGetPrestamos();
        handleGetUsers();
        handleDocuments();
        handleAreas();
        handleCarreras();
    }, []); 
    const handleGetSanciones = async () => {
        const res = await axios({
          url: "http://localhost:8000/api/sancion",
          method: "GET",
/*          headers: {
            Authorization: `Bearer ${token}`,
          },  */
        });
        setSanciones(res.data.data.sancion);
      };
      const handleGetPrestamos = async () => {
        const res = await axios({
          url: "http://localhost:8000/api/prestamo",
          method: "GET",
/*            headers: {
            Authorization: `Bearer ${token}`,
          },  */
        });
        setPrestamos(res.data.data.prestamos);
      };

    
      const handleGetUsers = async () => {
        const res = await axios({
          url: "http://localhost:8000/api/usuarios",
          method: "GET",
/*           headers: {
            Authorization: `Bearer ${token}`,
          }, */
        });
        setUsuarios(res.data.data.usuarios);
      };
      const handleDocuments = async () => {
        const res = await axios({
          url: "http://localhost:8000/api/documento",
          method: "GET",
/*            headers: {
            Authorization: `Bearer ${token}`,
          },  */
        });
        setDocumentos(res.data.data.documentos);
    
      };

      const handleAreas = async () => {
        const res = await axios({
          url: "http://localhost:8000/api/area",
          method: "GET",
/*           headers: {
            Authorization: `Bearer ${token}`,
          },  */
        });
        setAreas(res.data.data.area);
    
      };
      const handleCarreras= async () => {
        const res = await axios({
          url: "http://localhost:8000/api/carrera",
          method: "GET",
/*           headers: {
            Authorization: `Bearer ${token}`,
          },  */
        });
        setCarreras(res.data.data.carrera);
    
      };
      
    return (
        <div className="tarjetas">
            <div className="tarjeta tarjeta1">
                <div className='grafico'>
                <FontAwesomeIcon className='icone' icon={faBook} size="lg" style={{color: "#ffffff",}} />
                </div>
                <div className='texto1'>
                    <span>Documentos </span>
                    <h2>{documentos.length}</h2>
                </div>
            </div>
            <div className="tarjeta tarjeta2">
                <div className='grafico'>
                <FontAwesomeIcon className='icone' icon={faUsers} size="lg" style={{color: "#ffffff",}} />
                </div>
                <div className='texto1'>
                    <span>Usuarios</span>
                    <h2>{usuarios.length}</h2>
                </div>
            </div>

            <div className="tarjeta tarjeta3">
                <div className='grafico'>
                <FontAwesomeIcon className='icone' icon={faHourglass} size="lg" style={{color: "#ffffff",}} />
                </div>
                <div className='texto1'>
                    <span>Prestamos</span>
                    <h2>{prestamos.length}</h2>
                    
                </div>
            </div>
            <div className="tarjeta tarjeta4">
                <div className='grafico'>
                <FontAwesomeIcon className='icone' icon={faFolder} size="lg" style={{color: "#ffffff",}} />
                </div>
                <div className='texto1'>
                    <span>Carreras</span>
                    <h2>{carreras.length}</h2>
                </div>
            </div>
            <div className="tarjeta tarjeta5">
                <div className='grafico'>
                <FontAwesomeIcon className='icone' icon={faUser} size="lg" style={{color: "#ffffff",}} />
                </div>
                <div className='texto1'>
                    <span>Sancionados</span>
                  {/*   <h2>{sanciones.length}</h2> */}
                </div>
            </div>
            <div className="tarjeta tarjeta6">
                <div className='grafico'>
                <FontAwesomeIcon className='icone' icon={faBookOpen} size="lg" style={{color: "#ffffff",}} />
                </div>
                <div className='texto1'>
                    <span>Areas</span>
                    <h2>{areas.length}</h2>
                </div>
            </div>
            
        </div>
    )
}

export default Entrada
