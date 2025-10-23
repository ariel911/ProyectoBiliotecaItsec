import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./imgPerfil.css";
import imagenCircular from "../../assets/imgCirular.webp";

const ImgPerfil = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState("");

  // Obtener datos del usuario actual
  useEffect(() => {
    const idUsuario = localStorage.getItem("id");

    if (idUsuario) {
      const fetchData = async () => {
        try {
          const resUsuario = await axios.get(`http://localhost:8000/api/usuarios/${idUsuario}`);
          setUsuario(resUsuario.data.data || resUsuario.data);

          const resRol = await axios.get("http://localhost:8000/api/rol");
         
          console.log("r",resRol.data.data)  
          const rolUsuario = resRol.data.data.rol.find(r => r.id === resUsuario.data.data.rol.id);
          setRol(rolUsuario ? rolUsuario.nombre_rol : "Sin rol asignado");
        } catch (err) {
          console.error("Error al obtener los datos del usuario:", err);
        }
      };
      fetchData();  
    }
  }, []);

  // Cerrar sesión
  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombre");
    localStorage.removeItem("id");
    localStorage.removeItem("Rol");
    navigate("/");
  };
  
  return (
    <>
      <div className="elementoLink">
        <img
          src={imagenCircular}
          className="imagenCircular"
          onClick={() => setModalOpen(true)}
          alt="Perfil"
        />
      </div>

      {/* Modal de perfil */}
      {modalOpen && (
        <div className="modalPerfilOverlay" onClick={() => setModalOpen(false)}>
          <div className="modalPerfil" onClick={(e) => e.stopPropagation()}>
            {usuario ? (
              <div className="modalPerfilContenido">
                <img src={imagenCircular} className="modalImagen" alt="Usuario" />
                <h2>{usuario.nombre}</h2>
                <p><strong>Correo:</strong> {usuario.correo}</p>
                <p><strong>Cargo:</strong> {rol}</p>
              </div>
            ) : (
              <p className="cargandoTexto">Cargando datos del usuario...</p>
            )}

            <div className="modalOpciones">
              <button className="modalBoton">Editar datos</button>
              <button className="modalBoton">Ver actividad reciente</button>
              <button className="modalBotonCerrar" onClick={handleLogOut}>Cerrar sesión</button>
            </div>

            <button className="modalCerrar" onClick={() => setModalOpen(false)}>×</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ImgPerfil;
