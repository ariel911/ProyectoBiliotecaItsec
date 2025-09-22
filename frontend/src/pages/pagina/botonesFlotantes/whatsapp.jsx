import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import './WhatasAppButton.css'; // Archivo CSS para estilos

const WhatsAppButton = () => {
  return (
    <div className="whatsapp-button">
      <a
        href="https://wa.me/+59172428909" // Reemplaza con tu número de WhatsApp
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-link"
      >
        <FaWhatsapp size={40} />
      </a>
    </div>
  );
};

export default WhatsAppButton;
