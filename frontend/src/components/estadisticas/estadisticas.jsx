/* import { Line, Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';
import { useEffect, useState } from 'react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  ArcElement, Tooltip, Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);


var beneficios = [0, 56, 20, 36, 80, 40, 30, -20, 25, 30, 12, 60];
var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];


var misoptions2 = {
  responsive: true,
  animation: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      min: -25,
      max: 100
    },
    x: {
      ticks: { color: 'rgba(0, 220, 195)' }
    }
  } */
/* };
var midata2 = {
  labels: meses,
  datasets: [
    {
      label: 'Beneficios',
      data: beneficios,
      backgroundColor: 'rgba(0, 220, 195, 0.5)'
    }
  ]
};



import "./estadisticas.css"
const formato = () => {

  const [documentos, setDocumentos] = useState([]);
  const [tipoDoc, setTipoDoc] = useState([]);
  const [carreras, setCarreras] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);


  useEffect(() => {
    // Obtener la lista de formatoes al cargar el componente
    handleDocuments();
    handleTipoDoc();
    handleCarreras();
    handleEstudiantes();

  }, []); */

/*   const handleEstudiantes = async () => {
    const res = await axios({
      url: "http://localhost:8000/api/estudiante",
      method: "GET",
    });
    setEstudiantes(res.data.data.estudiantes);
  };
  const handleTipoDoc = async () => {
    try {
      const res = await axios({
        url: "http://localhost:8000/api/tipo_doc",
        method: "GET",

      });
      const documentTypes = res.data.data.tipo_doc;

      // Crear un nuevo array con solo los nombres de los tipos de documento
      const documentTypeNames = documentTypes.map((tipo) => tipo.nombre);
      // Puedes almacenar esta información en el estado si es necesario
      setTipoDoc(documentTypeNames);
    } catch (error) {
      console.error("Error al obtener tipos de documento", error);
    }
  }; */
/* 
  const handleDocuments = async () => {
    const res = await axios({
      url: "http://localhost:8000/api/documento",
      method: "GET",
    });
    setDocumentos(res.data.data.documentos);
  };


  const countByTipoDoc = tipoDoc.map((tipo) => {
    const count = documentos.filter((documento) => documento.tipo_doc.nombre === tipo).length;
    return count || 0; // Si no hay documentos de ese tipo, devolver 0
  }); */

/* 
  console.log("Conteo por tipo de documento:", countByTipoDoc);
  console.log("documentos:", tipoDoc);

  var options3 = {
    responsive: true,
    maintainAspectRatio: false,
  };

  var data3 = {
    labels: tipoDoc,
    datasets: [
      {
        label: 'Cantidad',
        data: countByTipoDoc,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };



  const handleCarreras = async () => {
    try {
      const res = await axios({
        url: "http://localhost:8000/api/carrera",
        method: "GET",
        // headers: {
        //   Authorization: `Bearer ${token}`,
        // },
      });
      const carreras = res.data.data.carrera;

      // Crear un nuevo array con solo los nombres de las carreras
      const carreraNames = carreras.map((carrera) => carrera.nombre);

      // Puedes almacenar esta información en el estado si es necesario
      setCarreras(carreraNames);
    } catch (error) {
      console.error("Error al obtener carreras", error);
    }
  };
 */

/* const countByCarrera = carreras.map((carrera) => {
  const count = estudiantes.filter((estudiante) => estudiante.carrera && estudiante.carrera.nombre === carrera).length;
  return count || 0;
});

console.log("Conteo por carrera:", countByCarrera);
console.log("carreras:", carreras);

  
   var midata = {
    labels: carreras,
    datasets: [ // Cada una de las líneas del gráfico
        {
            label: 'Carreras',
            data: countByCarrera,
            tension: 0.5,
            fill : true,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            pointRadius: 5,
            pointBorderColor: 'rgba(255, 99, 132)',
            pointBackgroundColor: 'rgba(255, 99, 132)',
        },

    ],
};
 */
/* var misoptions = {
    scales : {
        y : {
            min : 0
        },
        x: {
            ticks: { color: 'rgb(255, 99, 132)'}
        }
    }
};  */
/*   return (
    <div className='estadisticas'>
      <h1 className='tituloEstadisticas'>Estadísticas</h1>
      <div className='NuevoFormato'>

        <div className="mb-3 col ">
          <div className='grafica2'>
            <Bar data={midata} options={misoptions} />
          </div>
        </div>
        <div className="mb-3 col ">
          <div className='grafica3'>
            <Pie data={data3} options={options3} />
          </div>
        </div>

      </div>
    </div>
  );
}; */

//export default formato;
import React from 'react'

const estadisticas = () => {
  return (
    <div>
      
    </div>
  )
}

export default estadisticas
