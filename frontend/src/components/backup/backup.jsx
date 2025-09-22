import React, { useEffect, useState } from "react";
import axios from "axios";

const BackupAutomatico = () => {
  const [ultimoBackup, setUltimoBackup] = useState(null); // Para mostrar la última fecha de backup
  const [backupData, setBackupData] = useState(null); // Para almacenar los datos del backup

  useEffect(() => {
    // Función para realizar el backup
    const realizarBackup = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/backup");
        if (response.data.success) {
          console.log("Backup realizado:", response.data.data);
          setBackupData(response.data.data); // Almacenar los datos del backup
          setUltimoBackup(new Date().toLocaleString()); // Actualizar la fecha del último backup
        } else {
          console.error("Error en el backup:", response.data.message);
        }
      } catch (error) {
        console.error("Error al realizar el backup:", error);
      }
    };

    // Configurar un intervalo para realizar el backup cada minuto
    const intervalo = setInterval(realizarBackup, 60000); // 60000 ms = 1 minuto

    // Realizar un backup inicial al cargar el componente
    realizarBackup();

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(intervalo);
  }, []);

  // Función para descargar el backup como archivo JSON
  const descargarBackup = () => {
    if (!backupData) {
      alert("No hay datos de backup para descargar.");
      return;
    }

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `backup_${new Date().toISOString()}.json`;
    a.click();

    URL.revokeObjectURL(url); // Limpia la URL generada
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h3>Backup Automático</h3>
      <p>
        Último backup realizado:{" "}
        {ultimoBackup ? ultimoBackup : "Aún no se ha realizado ningún backup."}
      </p>
      <button
        onClick={descargarBackup}
        style={{
          padding: "10px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "10px",
        }}
      >
        Descargar Backup
      </button>
    </div>
  );
};

export default BackupAutomatico;
