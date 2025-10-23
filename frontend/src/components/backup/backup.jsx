import React, { useEffect, useState } from "react";
import axios from "axios";


const RespaldoRestauracion = () => {
  const [ultimoBackup, setUltimoBackup] = useState(null);
  const [backupData, setBackupData] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [activo, setActivo] = useState("backup");
  const [historial, setHistorial] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [toast, setToast] = useState({ show: false, tipo: "", texto: "" });
  const INTERVALO_BACKUP = 10 * 60 * 1000;
  // -------- FUNCIONES DE BACKUP --------
  const realizarBackup = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/backup");
      if (response.data.success) {
        const backupInfo = {
          fecha: new Date().toLocaleString(),
          nombre: `backup_${new Date().toISOString()}.json`,
        };

        setBackupData(response.data.data);
        setUltimoBackup(backupInfo.fecha);

        // Mantener solo los últimos 5 backups
        setHistorial((prev) => [backupInfo, ...prev.slice(0, 4)]);

        mostrarToast("success", "✅ Backup creado exitosamente.");
      } else {
        mostrarToast("danger", "❌ Error al crear el backup.");
      }
    } catch (error) {
      mostrarToast("danger", "❌ Error de conexión con el servidor.");
    }
  };

  // Realiza backup inicial y cada 1 min
  useEffect(() => {
    realizarBackup();
    const intervalo = setInterval(realizarBackup, INTERVALO_BACKUP);
    return () => clearInterval(intervalo);
  }, []);

  const descargarBackup = () => {
    if (!backupData) {
      mostrarToast("warning", "⚠️ No hay datos de backup para descargar.");
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
    URL.revokeObjectURL(url);
  };

  // -------- FUNCIONES DE RESTAURACIÓN --------
  const handleArchivoChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const confirmarRestauracion = (e) => {
    e.preventDefault();
    if (!archivo) {
      mostrarToast("warning", "⚠️ Por favor selecciona un archivo JSON.");
      return;
    }
    setMostrarModal(true); // abrir modal de confirmación
  };

  const restaurarBackup = async () => {
    setMostrarModal(false);
    setMensaje("");

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const contenido = JSON.parse(event.target.result);
          const response = await axios.post(
            "http://localhost:8000/api/recuperacion/cargar",
            contenido,
            { headers: { "Content-Type": "application/json" } }
          );

          if (response.data.success) {
            mostrarToast("success", "✅ Backup restaurado correctamente.");
          } else {
            mostrarToast("danger", `❌ Error: ${response.data.message}`);
          }
        } catch {
          mostrarToast("danger", "❌ Archivo inválido o dañado.");
        }
      };
      reader.readAsText(archivo);
    } catch (error) {
      mostrarToast("danger", "❌ Error al cargar el archivo.");
    }
  };

  // -------- FUNCIONES DE TOAST --------
  const mostrarToast = (tipo, texto) => {
    setToast({ show: true, tipo, texto });
    setTimeout(() => setToast({ show: false, tipo: "", texto: "" }), 3000);
  };

  // -------- INTERFAZ --------
  return (
    <div className="container mt-4">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-primary text-white text-center rounded-top">
          <h4 className="mb-0">📦 Respaldo y Restauración de Datos</h4>
        </div>

        {/* Pestañas */}
        <ul className="nav nav-tabs mt-3">
          <li className="nav-item">
            <span
              className={`nav-link ${activo === "backup" ? "active" : ""}`}
              onClick={() => setActivo("backup")}
              style={{ cursor: "pointer" }}
            >
              💾 Crear Backup
            </span>
          </li>
          <li className="nav-item">
            <span
              className={`nav-link ${activo === "restaurar" ? "active" : ""}`}
              onClick={() => setActivo("restaurar")}
              style={{ cursor: "pointer" }}
            >
              ♻️ Restaurar Backup
            </span>
          </li>
        </ul>

        <div className="card-body">
          {/* SECCIÓN BACKUP */}
          {activo === "backup" && (
            <div className="text-center">
              <h5 className="mb-3">Generar Copia de Seguridad</h5>
              <p>
                Último backup realizado:{" "}
                <strong>
                  {ultimoBackup || "Aún no se ha realizado ningún backup."}
                </strong>
              </p>
              <div className="d-flex justify-content-center gap-2">
                <button onClick={realizarBackup} className="btn btn-outline-primary">
                  🔄 Crear Backup Manual
                </button>
                <button onClick={descargarBackup} className="btn btn-success">
                  📥 Descargar Backup
                </button>
              </div>

              <hr />
              <h6 className="mt-3 text-secondary">Historial de Backups</h6>
              {historial.length > 0 ? (
                <ul className="list-group mt-2">
                  {historial.map((b, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between">
                      <span>{b.fecha}</span>
                      <span className="text-muted">{b.nombre}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted mt-2">No hay backups en el historial.</p>
              )}
            </div>
          )}

          {/* SECCIÓN RESTAURAR */}
          {activo === "restaurar" && (
            <div className="text-center">
              <h5 className="mb-3">Restaurar Datos desde un Backup</h5>
              <form onSubmit={confirmarRestauracion}>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleArchivoChange}
                  className="form-control mb-3 mx-auto"
                  style={{ maxWidth: "300px" }}
                />
                <button type="submit" className="btn btn-primary px-4">
                  🚀 Restaurar Backup
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
      {mostrarModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title">⚠️ Confirmar Restauración</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setMostrarModal(false)}
                ></button>
              </div>
              <div className="modal-body text-center">
                <p>
                  ¿Seguro que deseas restaurar el backup? <br />
                  Esto reemplazará los datos actuales del sistema.
                </p>
              </div>
              <div className="modal-footer justify-content-center">
                <button
                  className="btn btn-secondary"
                  onClick={() => setMostrarModal(false)}
                >
                  Cancelar
                </button>
                <button className="btn btn-danger" onClick={restaurarBackup}>
                  Sí, Restaurar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST DE NOTIFICACIONES */}
      {toast.show && (
        <div
          className={`toast align-items-center text-bg-${toast.tipo} border-0 show position-fixed bottom-0 end-0 m-3`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          style={{ zIndex: 9999 }}
        >
          <div className="d-flex">
            <div className="toast-body">{toast.texto}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setToast({ show: false, tipo: "", texto: "" })}
            ></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RespaldoRestauracion;
