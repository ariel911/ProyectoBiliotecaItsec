import React from 'react';
import secretariado from "../img/secretariado.jpg"
import sistemas from "../img/sistemas info.jpg"
import conta from "../img/contaduria.jpg"
import turismo from "../img/turismo.jpg"
import mercado from "../img/mercado.jpg"

const Products = () => {
  return (
    <div className='w-100' id="producto">
      <section className="productos">
        <div className="d-flex flex-column justify-content-center align-items-center text-center w-50 m-auto mt-5" >
          <h1 className=" fs-2 border-bottom border-3 mt-5">Nuestras <span className="text-primary">Carreras</span>.</h1>
        </div>
        <div className="container d-flex justify-content-center w-75 p-5">
          <div className="row justify-content-center" id="fila-productos">
            <div className="col-lg-4 col-md-12 col-sm-12 d-flex justify-content-center my-4">
              <div className="card d-flex align-items-center text-center" style={{ width: "18rem" }}>
                <img src={secretariado} className="card-img-top" alt="..." height={240} />
                <div className="card-body">
                  <h5 className="card-title">Secretariado Ejecutivo</h5>

                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-12 col-sm-12 d-flex justify-content-center my-4">
              <div className="card d-flex align-items-center text-center" style={{ width: "18rem" }}>
                <img src={sistemas} className="card-img-top" alt="..." height={240} />
                <div className="card-body">
                  <h5 className="card-title">Sistemas Informaticos</h5>

                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-12 col-sm-12 d-flex justify-content-center my-4">
              <div className="card d-flex align-items-center text-center" style={{ width: "18rem" }}>
                <img src={turismo} className="card-img-top" alt="..." height={240} />
                <div className="card-body">
                  <h5 className="card-title">Turismo</h5>

                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-12 col-sm-12 d-flex justify-content-center my-4">
              <div className="card d-flex align-items-center text-center" style={{ width: "18rem" }}>
                <img src={conta} className="card-img-top" alt="..." height={240} />
                <div className="card-body">
                  <h5 className="card-title">Contaduria General</h5>
 
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-12 col-sm-12 d-flex justify-content-center my-4">
              <div className="card d-flex align-items-center text-center" style={{ width: "17rem" }}>
                <img src={mercado} className="card-img-top" alt="..." height={240} />
                <div className="card-body">
                  <h5 className="card-title">Mercadotecnia</h5>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

  );
}

export default Products;