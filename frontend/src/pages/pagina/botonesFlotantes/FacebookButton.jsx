import React from 'react';
import { FaFacebook } from 'react-icons/fa';
import './FacebookButton.css'; // Archivo CSS para estilos

const FacebookButton = () => {
  return (
    <div className="facebook-button">
      <a
        href="https://www.facebook.com/itsecvirtual" // Reemplaza con el enlace a tu página de Facebook
        target="_blank"
        rel="noopener noreferrer"
        className="facebook-link"
      >
        <FaFacebook size={40} />
      </a>
    </div>
  );
};

export default FacebookButton;
