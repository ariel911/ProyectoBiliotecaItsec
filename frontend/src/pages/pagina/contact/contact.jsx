import React from 'react';
import '../main.css'; // Asegúrate de crear este archivo para los estilos personalizados

const Contact = () => {
    return (
        <div className='w-100'  id="seccion-contacto">
            <section className="seccion-contacto" >
                <div className="d-flex flex-column justify-content-center align-items-center text-center w-50 m-auto mt-5" >
                    <h1 className="pt-1 fs-2 border-bottom border-3 mt-5">Déjanos tu <span className="text-primary">Mensaje</span>.</h1>
                </div>
                <div className="container text-center py-2">
                    <form className="p-4 rounded shadow" action="https://formsubmit.co/achu.ariel.gabriel@gmail.com" method="POST">
                        <div className="mb-3 text-start">
                            <label htmlFor="exampleInputText" className="form-label">Nombre:</label>
                            <input type="text" className="form-control" name='name' id="exampleInputText" placeholder="Ingresa tu nombre" />
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="exampleInputEmail1" className="form-label">Email:</label>
                            <input type="email" className="form-control" name='email' id="exampleInputEmail1" placeholder="Ingresa tu email" />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" name="subject" id="subject" placeholder="Asunto" />
                        </div>
                        <div className="mb-3 text-start">
                            <label htmlFor="exampleFormControlTextarea1" className="form-label">Mensaje:</label>
                            <textarea className="form-control" name='message' id="exampleFormControlTextarea1" rows="3" placeholder="Escribe tu mensaje"></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Enviar</button>
                        <input type="hidden" name="_next" value="https://geyseproyect.netlify.app/pagina#seccion-contacto" />
                        <input type="hidden" name="_captcha" value="false" />
                    </form>
                </div>
            </section>
        </div>

    );
}

export default Contact;
