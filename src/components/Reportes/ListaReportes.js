import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ListaReportes = ({ userId }) => {
  const [reportes, setReportes] = useState([]);

  useEffect(() => {
    const obtenerReportes = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/reportes/usuario/${userId}`);
        setReportes(response.data);
      } catch (error) {
        console.error('Error al obtener los reportes:', error);
      }
    };

    obtenerReportes();
  }, [userId]);

  return (
    <div>
      <h2>Mis Reportes</h2>
      <ul>
        {reportes.map((reporte) => (
          <li key={reporte.id}>
            <p>{reporte.descripcion}</p>
            <p>Estado: {reporte.estado}</p>
            <p>Fecha: {reporte.fechaReporte}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaReportes;
