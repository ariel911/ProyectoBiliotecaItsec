import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css'; 
const Footer = () => {
  return (
    <footer className="bg-dark d-flex justify-content-center align-items-center py-5 flex-wrap">
      <p className="text-light m-0 px-3">© ITSEC 2024 - Todos los derechos reservados</p>
      <div className="d-flex">
        <a className="text-light px-2" href="https://www.facebook.com/itsecvirtual" target="_blank">
          <i className="bi bi-facebook"></i>
        </a>
        <a className="text-light px-2" href="https://wa.me/59172429809" target="_blank">
          <i className="bi bi-whatsapp"></i>
        </a>
        <a className="text-light px-2" href="https://www.instagram.com/itsecsucre/" target="_blank">
          <i className="bi bi-instagram"></i>
        </a>
      </div>
    </footer>
  );
}

export default Footer;
