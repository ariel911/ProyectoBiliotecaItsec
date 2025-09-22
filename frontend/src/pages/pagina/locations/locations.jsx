import React from 'react';
import img from '../img/itsecInsti.jpg'
const Locations = () => {


  return (
    <div className='w-100' id="local">
      <section className="local">
        <div className="container w-50 m-auto text-center  mt-5">
          <h1 className="fs-2 border-bottom border-3">Sobre <span className="text-primary">Nosotros</span>.</h1>
        </div>
        <div className="container">
          <div className="row">
            <div className='col-6'>
              <h2 className='tituloAntecendes'>Antecedentes</h2>
              <p className='textoAntecedentes'>El Instituto “ITSEC SUCRE” es la mejor alternativa en formación profesional a nivel Técnico Superior, de carácter fiscal y que responde a la demanda laboral de la ciudad de Sucre, el departamento de Chuquisaca y de Bolivia.
                Iniciamos nuestras actividades educativas avalados por la Resolución Administrativa No 194/85, del 30 de julio de 1985, en 1986 se homologa con la Resolución Ministerial Nº 826/86 del 9 de julio, lo que garantiza que los estudiantes concluyan en el tercer año con la Defensa de Modalidad de Graduación y su respectivo título profesional otorgado por el Ministerio de Educación del Estado Plurinacional de Bolivia.
                Actualmente brindamos una oferta académica en las carreras de Secretariado Ejecutivo, Contaduría General, Sistemas Informáticos, Turismo y Mercadotecnia, en los turnos tarde y noche, consolidando el proceso de enseñanza aprendizaje a través del enfoque metodológico “aprender haciendo”, basados en el sistema de evaluación 70% práctica y 30% teoría, para lograr la formación de profesionales comprometidos con la producción y emprendedurismo en beneficio de toda la comunidad.
                Son 37 años de experiencia en educación técnica, comercial y de servicios, siendo uno de los pioneros a nivel nacional.</p>
            </div>
            <div className='col-6'>
              <img src={img} alt="no img" width={700} className='imagenAntecedentes' />
            </div>
          </div>
          <div className="row">
            <div className='col-6'>
              <h2 className='tituloAntecendes'>Misión</h2>
              <p className='textoMision'>El Instituto Técnico Superior de Educación Comercial Sucre “ITSEC SUCRE” busca formar profesionales técnicos y
                 tecnológicos, competitivos y emprendedores, con valores éticos y humanos al servicio de la 
                sociedad, para mejorar la calidad de vida y afrontar los grandes desafíos del siglo XXI.</p>
            </div>
            <div className='col-6'>
              <h2 className='tituloAntecendes'>Visión</h2>
              <p className='textoMision'>Ser un Instituto técnico tecnológico inclusivo que busca consolidarse como referente a nivel nacional, 
                con docentes idóneos y alta vocación de servicio, formando profesionales integrales con capacidades productivas, de emprendimiento 
                e innovación, a partir del modelo de educación Sociocomunitario productivo.</p>
            </div>
          </div>

        </div>
      </section>
    </div>

  );
}

export default Locations;
