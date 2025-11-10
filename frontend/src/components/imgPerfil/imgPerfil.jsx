import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./imgPerfil.css";
import imagenCircular from "../../assets/imgCirular.webp";
import ariel from "../../assets/ariel.jpeg";

const ImgPerfil = () => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState("");
  const [modalEditar, setModalEditar] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    clave: "",
    imagen: "",
  });
  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || "",
        correo: usuario.correo || "",
        imagen: usuario.imagen || "",
        clave: "",
      });
    }
  }, [usuario]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleGuardarCambios = async () => {
    try {
      const idUsuario = localStorage.getItem("id");
      await axios.put(`http://localhost:8000/api/usuarios/${idUsuario}`, formData);
      swal("¡Éxito!", "Datos actualizados correctamente", "success");
      setModalEditar(false);
    } catch (err) {
      console.error("Error al actualizar los datos:", err);
      swal("Error", "No se pudieron actualizar los datos", "error");
    }
  };


  // Obtener datos del usuario actual

  useEffect(() => {
    const idUsuario = localStorage.getItem("id");

    if (idUsuario) {
      const fetchData = async () => {
        try {
          const resUsuario = await axios.get(`http://localhost:8000/api/usuarios/${idUsuario}`);
          setUsuario(resUsuario.data.data || resUsuario.data);
          const resRol = await axios.get("http://localhost:8000/api/rol");

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
  console.log("r",formData.imagen)
  return (
    <>
      <div className="elementoLink">
        <img
          src={`${formData.imagen}`}
          className="imagenCircular"
          onClick={() => setModalOpen(true)}
          alt="Perfil"
        />
      </div>
      {modalEditar && (
        <div className="modalPerfilOverlay" onClick={() => setModalEditar(false)}>
          <div className="modalPerfil" onClick={(e) => e.stopPropagation()}>
            <h3>Editar datos</h3>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              className="form-control mb-2"
            />
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="Correo"
              className="form-control mb-2"
            />
            <input
              type="password"
              name="clave"
              value={formData.clave}
              onChange={handleChange}
              placeholder="Nueva contraseña (opcional)"
              className="form-control mb-2"
            />
            <button className="modalBoton" onClick={handleGuardarCambios}>Guardar cambios</button>
            <button className="modalBotonCerrar " onClick={() => setModalEditar(false)}>Cancelar</button>
          </div>
        </div>
      )}
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
              <button className="modalBoton" onClick={() => { setModalOpen(false); setModalEditar(true); }}>Editar datos</button>
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
