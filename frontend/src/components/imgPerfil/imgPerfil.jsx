
import { useNavigate } from 'react-router-dom'
import './imgPerfil.css'
import imagenCircular from '../../assets/imgCirular.webp'
const ImgPerfil = () => {
  const navigate = useNavigate()
  
  function toggleMenu(){
    let submenu = document.getElementById("subMenu");
    submenu.classList.toggle("submenuPerfilMostrar")

  }
  

  const handleLogOut = ({Component}) => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombre");
    localStorage.removeItem("id");
    localStorage.removeItem("Rol");
    navigate("/")
  }

  return (
    <div className='elementoLink' >
      <div  >
        <img src={imagenCircular} className='imagenCircular' onClick={toggleMenu} alt='hi'/>

      </div>
      <ul className={`submenuPerfil `} id="subMenu">
        <li className='perfilLink' >
          <a href='/#'>Configuracion</a>
        </li>
        <li className='perfilLink'>
          <a type='button' className='buttonLogout' onClick={handleLogOut}>Cerrar</a>
        </li>
      </ul>
    </div>
  )
}

export default ImgPerfil
