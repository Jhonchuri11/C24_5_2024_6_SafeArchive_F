import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logotec from '../../assets/images/Tec-update-01.png';
import { faFacebookF, faTwitter, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';


export default function MainFooter() {

   
   return (
    <footer className="bg-dark text-white py-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <span className="me-3">Copyright © 2024</span>
              <img src={logotec} width={"50px"} className="navbar-brand" />
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <FontAwesomeIcon icon={faFacebookF} className="me-3" />
              <FontAwesomeIcon icon={faTwitter} className="me-3" />
              <FontAwesomeIcon icon={faInstagram} className="me-3" />
              <FontAwesomeIcon icon={faLinkedinIn} className="me-3" />
            </div>
          </div>
        </div>
    </footer>
   )

}