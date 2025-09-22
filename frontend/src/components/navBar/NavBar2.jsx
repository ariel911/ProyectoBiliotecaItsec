
import './NavBar.css';
import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faHome, faUsers, faUser, faFolder, faBook, faAngleRight, faGlobe, faClose, faClipboard } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import { HOME_ESTADISTICAS, PAGINA_LIBRO, HOME_TIPO, HOME_RESERVA, LOGIN_BIBLIOTECA, HOME_REPORTES, HOME_ROL, HOME_AUTOR, HOME_ESTUDIANTE, HOME_CARRERA, HOME_FORMATO, HOME_AREA, HOME_SANCION, HOME_USUARIO, HOME_DOCUMENTO, HOME_LIBRO, HOME_PRESTAMO, HOME_BACKUP, HOME_RECUPERACION } from '../../routes/path'

const NavBar = ({ brand }) => {
    //Object.values(brand)
    // console.log(brand[1])<FontAwesomeIcon icon="fa-solid faUserGraduate" />
    const nombre = localStorage.getItem('nombre');
    const rol = localStorage.getItem('Rol');
    const id = localStorage.getItem('id');
    const [menuPermissions, setMenuPermissions] = useState([]);
    useEffect(() => {
        const fetchUserPermissions = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/usuarios", {
                
                });
                const currentUser = res.data.data.usuarios.find(user => user.id == id);
                console.log("b",currentUser)
                if (currentUser) {
                    const permissions = currentUser.rol.menu_rols.map(menuRol => menuRol.menu.nombre_menu);
                    setMenuPermissions(permissions);
                }
            } catch (error) {
                console.error("Error fetching user permissions:", error);
            }
        };

        fetchUserPermissions();
    }, [id]);
    const handleLogOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("nombre");
        localStorage.removeItem("id");
        localStorage.removeItem("Rol");
        localStorage.removeItem("user"); // Asegúrate de eliminar toda la información del usuario
        navigate("/login");
    };

    return (
        /*  ul li ul li a */
        <ul>
            {((menuPermissions.includes('Usuarios') || (menuPermissions.includes('Cargos'))) || menuPermissions.includes('Todo')) && (
                <li className='elemento'>
                    <Link to={HOME_USUARIO} className='text'>
                        <FontAwesomeIcon className='icono' icon={faUsers} style={{ "--fa-primary-color": "#ffffff", "--fa-secondary-color": "#b0b0b0", }} />
                        {brand[1]}
                        <FontAwesomeIcon className='faAngle' icon={faAngleRight} style={{ "--fa-primary-color": "#ffffff", "--fa-secondary-color": "#b0b0b0", }} />
                    </Link>
                    <ul className='submenu subm2' >
                        {(menuPermissions.includes('Todo') || menuPermissions.includes('Cargos')) && <li className='subitem'><Link to={HOME_ROL}>Cargos</Link></li>}
                        {(menuPermissions.includes('Todo') || menuPermissions.includes('Usuarios')) && <li className='subitem'><Link to={HOME_USUARIO}>Usuario</Link></li>}

                    </ul>
                </li>)}
            {(menuPermissions.includes('Todo') || menuPermissions.includes('Documentos Academicos') || menuPermissions.includes('Libros') || menuPermissions.includes('Areas')|| menuPermissions.includes('Autores') || menuPermissions.includes('Carreras')  ) && (
                <li className='elemento'>
                    <Link to={HOME_DOCUMENTO} className='text'>
                        <FontAwesomeIcon className='icono' icon={faBook} style={{ "--fa-primary-color": "#ffffff", "--fa-secondary-color": "#b0b0b0", }} />
                        {brand[3]}
                        <FontAwesomeIcon className='faAngle3' icon={faAngleRight} style={{ "--fa-primary-color": "#ffffff", "--fa-secondary-color": "#b0b0b0", }} />
                    </Link>
                    <ul className='submenu4 subm'>
                        {(menuPermissions.includes('Todo') || menuPermissions.includes('Documentos Academicos')) && <li className='subitem'><Link to={HOME_DOCUMENTO}>Documentos Academicos</Link></li>}
                        {(menuPermissions.includes('Todo') || menuPermissions.includes('Libros')) && <li className='subitem'><Link to={HOME_LIBRO}>Libros</Link></li>}
                        {/* {(menuPermissions.includes('Todo') || menuPermissions.includes('Formatos')) && <li className='subitem'><Link to={HOME_FORMATO}>Formatos</Link></li>} */}
                        {(menuPermissions.includes('Todo') || menuPermissions.includes('Tipo Documentos')) && <li className='subitem'><Link to={HOME_TIPO}>Tipo Documentos</Link></li>}
                        {(menuPermissions.includes('Todo') || menuPermissions.includes('Areas')) && <li className='subitem'><Link to={HOME_AREA}>Areas</Link></li>}
                        {(menuPermissions.includes('Todo') || menuPermissions.includes('Autores')) && <li className='subitem'><Link to={HOME_AUTOR}>Autores</Link></li>}
                        {(menuPermissions.includes('Todo') || menuPermissions.includes('Carreras')) && <li className='subitem'><Link to={HOME_CARRERA}>Carreras</Link></li>}
                    </ul>
                </li>
            )}
            {(menuPermissions.includes('Todo') || menuPermissions.includes('Miembros Instituto')) && (
                <li className='elemento'>
                    <Link to={HOME_ESTUDIANTE} className='text'>
                        <FontAwesomeIcon className='icono' icon={faUsers} style={{ "--fa-primary-color": "#ffffff", "--fa-secondary-color": "#b0b0b0", }} />
                        {"Instituto"}
                        <FontAwesomeIcon className='faAngle4' icon={faAngleRight} style={{ "--fa-primary-color": "#ffffff", "--fa-secondary-color": "#b0b0b0", }} />
                    </Link>
                    <ul className='submenu3 subm2'>
                        {(menuPermissions.includes('Todo') || menuPermissions.includes('Miembros Instituto')) && <li className='subitem'><Link to={HOME_ESTUDIANTE}>Miembros Instituto</Link></li>}
                        {(menuPermissions.includes('Todo') || menuPermissions.includes('Sancionados')) && <li className='subitem'><Link to={HOME_SANCION}>Miembros Sancionados</Link></li>}
                    </ul>
                </li>
            )}
            {(menuPermissions.includes('Todo') || menuPermissions.includes('Reportes')) && (
                <li className='elemento'>
                    <Link to={HOME_REPORTES} className='text'>
                        <FontAwesomeIcon className='icono' icon={faClipboard} style={{ "--fa-primary-color": "#ffffff", "--fa-secondary-color": "#b0b0b0", }} />
                        {'Reportes'}
                    </Link>
                </li>
            )}
            {(menuPermissions.includes('Todo') || menuPermissions.includes('Prestamos')) && (
            <li className='elemento'>
                <Link to={HOME_PRESTAMO} className='text'>
                    <FontAwesomeIcon className='icono' icon={faFolder} style={{ "--fa-primary-color": "#ffffff", "--fa-secondary-color": "#b0b0b0", }} />
                    {'Prestamos'}
                </Link>
            </li>
            )}
             <li className='elemento'>
                <Link to={HOME_BACKUP} className='text'>
                    <FontAwesomeIcon className='icono' icon={faGlobe} style={{ "--fa-primary-color": "#ffffff", "--fa-secondary-color": "#b0b0b0", }} />
                    {"Backup"}
                </Link>
            </li>
            <li className='elemento'>
                <Link to={HOME_RECUPERACION} className='text'>
                    <FontAwesomeIcon className='icono' icon={faGlobe} style={{ "--fa-primary-color": "#ffffff", "--fa-secondary-color": "#b0b0b0", }} />
                    {"Recuperacion"}
                </Link>
            </li>
            <li className='elemento'>
                <Link to={LOGIN_BIBLIOTECA} className='text'>
                    <FontAwesomeIcon className='icono' icon={faGlobe} style={{ "--fa-primary-color": "#ffffff", "--fa-secondary-color": "#b0b0b0", }} />
                    {"Pagina"}
                </Link>
            </li>
            <li className='elemento'>
                <Link to='*' className='text' onClick={handleLogOut}>
                    <FontAwesomeIcon className='icono' icon={faClose} style={{ "--fa-primary-color": "#ffffff", "--fa-secondary-color": "#b0b0b0", }} />
                    {"Cerrar"}
                </Link>
            </li>
        </ul>

    )
}

export default NavBar
