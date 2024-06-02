import React from "react";
import logotecsup from '../assets/images/logo_tecsup.png';

export default function MainFooter() {

    return (
        <footer className="text-center py-4 bg-dark text-white">
            <div className="container">
                <img src={logotecsup} alt="Logo Tecsup" style={{ width: '100px' }} />
                <p class="mt-2">Tecsup cerca de ti 2024!</p>
            </div>
        </footer>
    )
}