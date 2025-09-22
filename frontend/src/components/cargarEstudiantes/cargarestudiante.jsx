import React, { useState, useEffect } from 'react';
import * as XLSX from "xlsx";
import axios from "axios";

const CargarEstudiantes = () => {
    const [estudiantes, setEstudiantes] = useState([]);
    const [tipoPersonas, setTipoPersonas] = useState([]);
    const [personaId, setPersonaId] = useState("");

    const [carreras, setCarreras] = useState([]); // Valor inicial del rol
    // Método para leer el archivo Excel
    useEffect(() => {
        handleGetTipoPersonas();
        handleGetCarreras(); // ya lo tienes
    }, []);
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            setEstudiantes(jsonData); // Guardamos los datos
        };

        reader.readAsArrayBuffer(file);
    };

    // Método para enviar a tu API
    const handleGetTipoPersonas = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/tipo_persona");
            setTipoPersonas(response.data.data.tipo_persona);
        } catch (error) {
            console.error("Error al obtener tipos de persona", error);
        }
    };
    const handleGuardar = async () => {
        try {
            if (!personaId) {
                alert("Debes seleccionar un tipo de persona antes de guardar ❌");
                return;
            }

            const estudiantesConDatos = estudiantes.map((est) => {
                // Buscar carrera
                const carreraEncontrada = carreras.find(
                    (c) => c.nombre.toLowerCase() === est.carrera.toLowerCase()
                );

                return {
                    ...est,
                    estado: '1',
                    tipoPersonaId: parseInt(personaId), // viene del select dinámico
                    sancionId: null, // viene del select dinámico
                    carreras: carreraEncontrada ? [carreraEncontrada.id.toString()] : null,
                };
            });


            estudiantesConDatos.forEach(obj => {
                delete obj.Nro;
                delete obj.carrera;
            });
            console.log("Estudiantes2:", estudiantesConDatos)
            await Promise.all(
                estudiantesConDatos.map(est =>
                    axios.post("http://localhost:8000/api/persona", est)
                )
            );

            alert("Estudiantes guardados correctamente ✅");
        } catch (error) {
            console.error(error);
            alert("Hubo un error al guardar los estudiantes ❌");
        }
    };


    const handleGetCarreras = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/carrera', {
                /*         headers: {
                          Authorization: `Bearer ${token}`
                        } */
            });

            setCarreras(response.data.data.carrera);

        } catch (error) {
            // Opcional: Mostrar una notificación o mensaje de error
        }

    };
    return (
        <div className="container mt-4">
            <h3>Cargar Estudiantes desde Excel</h3>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

            <button className="btn btn-primary mt-3" onClick={handleGuardar}>
                Guardar en la base de datos
            </button>
            <div className="mb-3">
                <label className="form-label">Tipo de Persona</label>
                <select
                    className="form-select"
                    value={personaId}
                    onChange={(e) => setPersonaId(e.target.value)}
                >
                    <option value="">Seleccionar tipo de persona</option>
                    {tipoPersonas.map((tp) => (
                        <option key={tp.id} value={tp.id}>
                            {tp.nombre}
                        </option>
                    ))}
                </select>
            </div>
            <h5 className="mt-4">Vista previa:</h5>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Nro</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>CI</th>
                        <th>Celular</th>
                        <th>Carrera</th>
                    </tr>
                </thead>
                <tbody>
                    {estudiantes.map((est, index) => (
                        <tr key={index}>
                            <td>{est.Nro}</td>
                            <td>{est.nombre}</td>
                            <td>{est.correo}</td>
                            <td>{est.ci}</td>
                            <td>{est.celular}</td>
                            <td>{est.carrera}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CargarEstudiantes;
