import React from 'react';

import './main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Navbar from './navegacion/navBar';
import Carousel from './carousel/carousel';
import Introduction from './introduction/introduction';
import Services from './services/services';
import Products from './products/products';
import Locations from './locations/locations';
import Contact from './contact/contact';
import Footer from './footer/footer';
/* import { Link } from 'react-router-dom'; */
import WhatsAppButton from './botonesFlotantes/whatsapp';
import FacebookButton from './botonesFlotantes/FacebookButton';

const Pagina = () => {
  return (
    <div>
      <Navbar />
      <Carousel />
      <Locations />
  {/*     <Introduction /> */}
      <Services />
      <Products />
      <Contact />
      <Footer />
      <WhatsAppButton />
      <FacebookButton />
     {/*  <Link to="https://api.whatsapp.com/send?phone=+59175458332" class="btn-wsp" target="_blank">
        <FontAwesomeIcon icon="fa-brands fa-square-whatsapp" />
      </Link> */}
    </div>
  );
}

export default Pagina;