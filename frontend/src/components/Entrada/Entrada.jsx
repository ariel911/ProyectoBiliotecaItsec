import axios from 'axios';
import { useState, useEffect } from 'react';
import './Entrada.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faUser,
  faFolder,
  faBook,
  faHourglass,
  faBookOpen,
  faGraduationCap,
  faChartBar,
} from '@fortawesome/free-solid-svg-icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const Entrada = () => {
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
    const res = await axios.get("http://localhost:8000/api/sancion");
    setSanciones(res.data.data.sancion);
  };

  const handleGetPrestamos = async () => {
    const res = await axios.get("http://localhost:8000/api/prestamo");
    setPrestamos(res.data.data.prestamos);
  };

  const handleGetUsers = async () => {
    const res = await axios.get("http://localhost:8000/api/usuarios");
    setUsuarios(res.data.data.usuarios);
  };

  const handleDocuments = async () => {
    const res = await axios.get("http://localhost:8000/api/documento");
    setDocumentos(res.data.data.documentos);
  };

  const handleAreas = async () => {
    const res = await axios.get("http://localhost:8000/api/area");
    setAreas(res.data.data.area);
  };

  const handleCarreras = async () => {
    const res = await axios.get("http://localhost:8000/api/carrera");
    setCarreras(res.data.data.carrera);
  };

  // === Datos para las tarjetas ===
  const tarjetas = [
    { titulo: 'Documentos', valor: documentos.length, icono: faBook, color: '#007BFF' },
    { titulo: 'Usuarios', valor: usuarios.length, icono: faUsers, color: '#28A745' },
    { titulo: 'Préstamos', valor: prestamos.length, icono: faHourglass, color: '#FFC107' },
    { titulo: 'Carreras', valor: carreras.length, icono: faGraduationCap, color: '#6F42C1' },
    { titulo: 'Sanciones', valor: sanciones.length, icono: faUser, color: '#DC3545' },
    { titulo: 'Áreas', valor: areas.length, icono: faBookOpen, color: '#17A2B8' },
  ];

  // === Datos simulados para gráficos ===
  // En un futuro, puedes reemplazar esto con datos reales de tu API
  const prestamosPorCarrera = carreras.map((carrera) => ({
    name: carrera.nombre,
    prestamos: prestamos.filter(p => p.persona?.persona_carreras[0]?.carrera?.id === carrera.id).length
  }));
  const tiposDocumento = [
    { name: 'Libros', value: documentos.filter(d => d.tipo === 'Libro').length },
    { name: 'Tesis', value: documentos.filter(d => d.tipo === 'Tesis').length },
    { name: 'Proyectos', value: documentos.filter(d => d.tipo === 'Monografía').length },
  ];

  const COLORS = ['#007BFF', '#28A745', '#FFC107', '#6F42C1'];

  return (
    <div className="entrada-container">
      <h1 className="titulo-dashboard">Panel General del Sistema Bibliográfico</h1>

      <div className='dashboard-seccion'>
        <div className="tarjetas-grid ">
          {tarjetas.map((t, index) => (
            <div key={index} className="tarjeta">
              <div className="tarjeta-icono" style={{ backgroundColor: t.color }}>
                <FontAwesomeIcon icon={t.icono} className="iconos" />
              </div>
              <div className="tarjeta-info">
                <span>{t.titulo}</span>
                <h2>{t.valor}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* <div className='dashboard-seccion'> */}
        <div className='chart-container'>
          <div className="graficos-container ">
            <div className="grafico-box">
              <h3>Préstamos por Carrera</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={prestamosPorCarrera}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="prestamos" fill="#007BFF" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className='chart-container'>
          <div className="grafico-box ">
            <h3>Distribución de Documentos</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={tiposDocumento}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  dataKey="value"
                >
                  {tiposDocumento.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
     {/*  </div> */}
      <div className="panel-resumen">
        <FontAwesomeIcon icon={faChartBar} className="icono-resumen" />
        <div>
          <h3>Resumen rápido</h3>
          <p>
            Actualmente el sistema cuenta con <strong>{documentos.length}</strong> documentos,
            <strong> {usuarios.length}</strong> usuarios registrados y
            <strong> {prestamos.length}</strong> préstamos activos.
          </p>
        </div>
      </div>
    </div >
  );
};

export default Entrada;
