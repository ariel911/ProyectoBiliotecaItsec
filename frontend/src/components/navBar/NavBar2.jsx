import './NavBar.css';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import {
    faFileArrowDown, faUsers, faFolder, faBook,
    faAngleDown, faGlobe, faClose, faClipboard,
    faHouse
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import {
    LOGIN_BIBLIOTECA, HOME_REPORTES, HOME_ROL, HOME_AUTOR, HOME_ESTUDIANTE,
    HOME_SANCION, HOME_USUARIO, HOME_DOCUMENTO, HOME_LIBRO, HOME_PRESTAMO,
    HOME_BACKUP, HOME_RECUPERACION
} from '../../routes/path';

const NavBar = () => {
    const navigate = useNavigate();
    const id = localStorage.getItem('id');
    const [menuPermissions, setMenuPermissions] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState(null);

    useEffect(() => {
        const fetchUserPermissions = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/usuarios");
                const currentUser = res.data.data.usuarios.find(user => user.id == id);
                if (currentUser) {
                    const permissions = currentUser.rol.menu_rols.map(mr => mr.menu.nombre_menu);
                    setMenuPermissions(permissions);
                }
            } catch (error) {
                console.error("Error fetching user permissions:", error);
            }
        };
        fetchUserPermissions();
    }, [id]);

    const handleLogOut = () => {
        localStorage.clear();
        navigate("/login");
    };

    const toggleSubmenu = (menuName) => {
        setOpenSubmenu(openSubmenu === menuName ? null : menuName);
    };

    return (
        <nav className="navbar-expand-lg navbar-dark bg-dark sidebar">
            <div className="container-fluid d-flex flex-column">
                <button
                    className="navbar-toggler align-self-end mb-3"
                    type="button"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`collapse navbar-collapse w-100 ${menuOpen ? 'show' : ''}`}>
                    <ul className="navbar-nav flex-column w-100">
                        {/* USUARIOS */}
                        {(menuPermissions.includes('Todo') || menuPermissions.includes('Prestamos')) && (
                            <li className="nav-item">
                                <Link className="nav-link" to={'/homeInicio'}>
                                    <FontAwesomeIcon icon={faHouse} className="me-2" /> Inicio
                                </Link>
                            </li>
                        )}
                        {(menuPermissions.includes('Usuarios') || menuPermissions.includes('Cargos') || menuPermissions.includes('Todo')) && (
                            <li className="nav-item">
                                <div
                                    className="nav-link d-flex justify-content-between align-items-center"
                                    onClick={() => toggleSubmenu('usuarios')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <span>
                                        <FontAwesomeIcon icon={faUsers} className="me-2" />
                                        Usuarios
                                    </span>
                                    <FontAwesomeIcon icon={faAngleDown} />
                                </div>
                                <ul className={`submenu list-unstyled ps-4 ${openSubmenu === 'usuarios' ? 'show' : ''}`}>
                                    {(menuPermissions.includes('Todo') || menuPermissions.includes('Cargos')) && (
                                        <li><Link className="dropdown-item" to={HOME_ROL}>Cargos</Link></li>
                                    )}
                                    {(menuPermissions.includes('Todo') || menuPermissions.includes('Usuarios')) && (
                                        <li><Link className="dropdown-item" to={HOME_USUARIO}>Usuarios</Link></li>
                                    )}
                                </ul>
                            </li>
                        )}

                        {/* DOCUMENTOS */}
                        {(menuPermissions.includes('Todo') || menuPermissions.includes('Documentos Academicos') || menuPermissions.includes('Libros') || menuPermissions.includes('Autores')) && (
                            <li className="nav-item">
                                <div
                                    className="nav-link d-flex justify-content-between align-items-center"
                                    onClick={() => toggleSubmenu('documentos')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <span>
                                        <FontAwesomeIcon icon={faBook} className="me-2" />
                                        Documentos
                                    </span>
                                    <FontAwesomeIcon icon={faAngleDown} />
                                </div>
                                <ul className={`submenu list-unstyled ps-4 ${openSubmenu === 'documentos' ? 'show' : ''}`}>
                                    <li><Link className="dropdown-item" to={HOME_DOCUMENTO}>Documentos Académicos</Link></li>
                                    <li><Link className="dropdown-item" to={HOME_LIBRO}>Libros</Link></li>
                                    <li><Link className="dropdown-item" to={HOME_AUTOR}>Áreas y Autores</Link></li>
                                </ul>
                            </li>
                        )}

                        {/* INSTITUTO */}
                        {(menuPermissions.includes('Todo') || menuPermissions.includes('Miembros Instituto')) && (
                            <li className="nav-item">
                                <div
                                    className="nav-link d-flex justify-content-between align-items-center"
                                    onClick={() => toggleSubmenu('instituto')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <span>
                                        <FontAwesomeIcon icon={faUsers} className="me-2" />
                                        Instituto
                                    </span>
                                    <FontAwesomeIcon icon={faAngleDown} />
                                </div>
                                <ul className={`submenu list-unstyled ps-4 ${openSubmenu === 'instituto' ? 'show' : ''}`}>
                                    <li><Link className="dropdown-item" to={HOME_ESTUDIANTE}>Miembros</Link></li>
                                    <li><Link className="dropdown-item" to={HOME_SANCION}>Sancionados</Link></li>
                                </ul>
                            </li>
                        )}

                        {/* OTROS MENÚS */}
                        {(menuPermissions.includes('Todo') || menuPermissions.includes('Prestamos')) && (
                            <li className="nav-item">
                                <Link className="nav-link" to={HOME_PRESTAMO}>
                                    <FontAwesomeIcon icon={faFolder} className="me-2" /> Préstamos
                                </Link>
                            </li>
                        )}

                        {(menuPermissions.includes('Todo') || menuPermissions.includes('Reportes')) && (
                            <li className="nav-item">
                                <Link className="nav-link" to={HOME_REPORTES}>
                                    <FontAwesomeIcon icon={faClipboard} className="me-2" /> Reportes
                                </Link>
                            </li>
                        )}

                        {/* GESTIÓN DE DATOS */}
                        <li className="nav-item">
                            <Link className="nav-link" to={HOME_BACKUP}>
                                <FontAwesomeIcon icon={faFileArrowDown} className="me-2" /> Gestión de Datos
                            </Link>
                        </li>

                        {/* PÁGINA */}
                        <li className="nav-item">
                            <Link className="nav-link" to={LOGIN_BIBLIOTECA}>
                                <FontAwesomeIcon icon={faGlobe} className="me-2" /> Página
                            </Link>
                        </li>

                        {/* CERRAR SESIÓN */}
                        <li className="nav-item">
                            <button className="nav-link text-start btn text-danger" onClick={handleLogOut}>
                                <FontAwesomeIcon icon={faClose} className="me-2" /> Cerrar sesión
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
