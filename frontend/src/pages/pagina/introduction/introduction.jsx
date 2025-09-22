import React from 'react';
import '../main.css'; // Asegúrate de tener este archivo para estilos personalizados

const Introduction = () => {
  return (
    <section className="d-flex flex-column justify-content-center align-items-center pt-5 text-center  m-auto intro" id="intro">
      <h1 className="p-0 fs-2 border-top border-3">
        Somos una empresa especializada en la prevención contra incendios, seguridad industrial y medio ambiente. <span className="text-primary">Geyse.</span>
      </h1>
      <p className="p-1 fs-5">
        Brindamos nuestros servicios por personal calificado (profesionales en el área de seguridad y salud ocupacional, profesionales especializados en medio ambiente)
      </p>
    </section>
  );
}

export default Introduction;
