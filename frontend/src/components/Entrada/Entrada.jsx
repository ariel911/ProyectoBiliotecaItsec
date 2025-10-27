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
  const [data, setData] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/persona");
        const estudiantes = res.data.data.personas;

        // Contar estudiantes por carrera
        const conteo = {};
        estudiantes.forEach((est) => {
          est.persona_carreras?.forEach((pc) => {
            const carrera = pc.carrera?.nombre || "Sin carrera";
            conteo[carrera] = (conteo[carrera] || 0) + 1;
          });
        });

        // Convertir a arreglo para Recharts
        const dataFormateada = Object.keys(conteo).map((nombreCarrera) => ({
          carrera: nombreCarrera,
          cantidad: conteo[nombreCarrera],
        }));

        setData(dataFormateada);
      } catch (error) {
        console.error("Error al obtener estudiantes:", error);
      }
    };
    obtenerDatos();
  }, []);
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
    { name: 'Libro', value: documentos.filter(d => d.tipo_doc.nombre === 'Libro').length },
    { name: 'Tesis', value: documentos.filter(d => d.tipo_doc.nombre === 'Tesis').length },
    { name: 'Proyecto', value: documentos.filter(d => d.tipo_doc.nombre === 'Proyecto').length },
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
      <div className="chart-container">
        <div className="graficos-container full-width">
          <div className="grafico-box">
            <h3>Préstamos por Carrera</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={prestamosPorCarrera}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="prestamos" fill="#007BFF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>


      <div className="grafico-container">
        <div className="chart-container">
          {/* Gráfico circular */}
          <div className="chart">
            <h3 className='h3doc'>Distribución de Documentos</h3>
            <ResponsiveContainer width="100%" height={300}>
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

          {/* Gráfico de barras */}
          <div className="chart">
            <h3 className='h3doc'>Cantidad de estudiantes por carrera</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={data}
                margin={{ top: 20, right: 20, left: 30, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="carrera"
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cantidad" fill="#0d6efd" radius={[10, 10,   0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
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
