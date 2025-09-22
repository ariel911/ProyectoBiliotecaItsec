import React from 'react';
import servicio1 from '../img/oile.jpg';
import servicio2 from '../img/asesoramiento.jpg';
import servicio3 from '../img/guarderia.jpeg';


const Services = () => {
  const servicios = [
    { img: servicio1, title: 'OILE',description:'La OILE del "ITSEC SUCRE" es una organización dedicada a fomentar el emprendimiento de nuestros estudiantes a través de una metodología propia basada en los años de experiencia en el sector del emprendimiento, la formación y la consultoría empresarial de su equipo humano.'},
    { img: servicio2, title: 'ASESORIAMIENTO JURIDICO', description:'La finalidad básica del área de orientación y asesoramiento jurídico es prestar un servicio a los estudiantes de nuestro instituto, consistente en el asesoramiento en cualquier controversia de orden jurídico en los que se vean implicados, en su doble condición de ciudadanos y de miembros de la comunidad educativa.'},
    { img: servicio3, title: 'GUARDERIA',description:'Nuestra guardería es un establecimiento educativo, donde se realiza el cuidado de niños y niñas que aún no cuentan con la edad necesaria para ingresar a una escuela. Aquí serán cuidados, guiados y supervisados por personal preparado y estudiado, en el área de educación infantil.' },
  ];

  return (
    <div className='w-100' id="servicio">

      <section className="w-100 servicios"  >
        <div className="d-flex flex-column justify-content-center align-items-center text-center w-50 m-auto mt-5" id="intro">
          <h1 className="fs-2 border-bottom border-3 mt-3">Nuestros <span className="text-primary">Servicios</span>.</h1>
        </div>
        <div className="container mb-5 d-flex justify-content-center w-75">
          <div className="row justify-content-center" id="fila-servicios">
            {servicios.map((servicio, index) => (
              <div className="col-lg-4 col-md-6 col-sm-12 d-flex justify-content-center my-4" key={index}>
                <div className="card d-flex align-items-center text-center" style={{ width: '18rem' }}>
                  <img src={servicio.img} className="card-img-top" height={250} alt={servicio.title} />
                  <div className="card-body">
                    <h5 className="card-title">{servicio.title}</h5>
                    {servicio.description && <p className="card-text textoServicios">{servicio.description}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Services;
