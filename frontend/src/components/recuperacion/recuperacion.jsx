import React, { useState } from "react";
import axios from "axios";

const CargarBackup = () => {
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const handleArchivoChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!archivo) {
      setMensaje("Por favor, selecciona un archivo.");
      return;
    }

    try {
      // Leer el archivo JSON
      const reader = new FileReader();
      reader.onload = async (event) => {
        const contenido = JSON.parse(event.target.result);

        // Enviar los datos al backend
        const response = await axios.post(
          "http://localhost:8000/api/recuperacion/cargar",
          contenido,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          setMensaje("Backup cargado exitosamente.");
        } else {
          setMensaje(`Error: ${response.data.message}`);
        }
      };

      reader.readAsText(archivo);
    } catch (error) {
      console.error("Error al cargar el backup:", error);
      setMensaje("Ocurrió un error al cargar el backup.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h3>Cargar Backup</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".json"
          onChange={handleArchivoChange}
          style={{ display: "block", marginBottom: "10px" }}
        />
        <button
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Enviar Backup
        </button>
      </form>
      {mensaje && <p style={{ marginTop: "10px" }}>{mensaje}</p>}
    </div>
  );
};

export default CargarBackup;
