import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn, faYoutube } from '@fortawesome/free-brands-svg-icons';
//import logotecsup from '../../assets/images/logo_tecsup.png';

export default function MainFooter() {

    /*
    return (
        <footer className="text-center py-4 bg-dark text-white">
            <div className="container">
                <img src={logotecsup} alt="Logo Tecsup" style={{ width: '100px' }} />
                <p class="mt-2">Tecsup cerca de ti 2024!</p>
            </div>
        </footer>
    )
    */
   
   return (
    <footer className="bg-dark text-white py-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <span className="me-3">Central telefónica: (01) 612-8230</span>
              <span className="me-3">Línea gratuita: 0800-00018</span>
              <span>Whatsapp: 914-121-106</span>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <FontAwesomeIcon icon={faFacebookF} className="me-3" />
              <FontAwesomeIcon icon={faTwitter} className="me-3" />
              <FontAwesomeIcon icon={faInstagram} className="me-3" />
              <FontAwesomeIcon icon={faLinkedinIn} className="me-3" />
              <FontAwesomeIcon icon={faYoutube} />
            </div>
          </div>
        </div>
    </footer>
   )

}