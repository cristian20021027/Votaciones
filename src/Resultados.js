import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://192.168.1.164:3000');

function Resultados() {
  const [resultados, setResultados] = useState({});

  useEffect(() => {
    socket.on('actualizarResultados', (data) => {
      setResultados(data);
    });

    return () => socket.off('actualizarResultados');
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f0f4f8', borderRadius: '10px' }}>
      <h1 style={{ color: '#3a79cc', padding: '10px' }}>Resultados de las Votaciones</h1>
      <table style={{ width: '90%', margin: '20px auto', borderCollapse: 'collapse', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '10px', overflow: 'hidden' }}>
        <thead>
          <tr style={{ backgroundColor: '#0984e3', color: '#fff' }}>
            <th style={{ padding: '15px', border: '1px solid #ccc' }}>Candidato</th>
            <th style={{ padding: '15px', border: '1px solid #ccc' }}>Votos</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(resultados).map(([clave, votos]) => {
            const candidato = clave.includes('-') ? clave.split('-')[1]?.trim() : clave;
            return (
              <tr key={clave} style={{ backgroundColor: '#ffffff' }}>
                <td style={{ padding: '15px', border: '1px solid #ccc' }}>{candidato || 'Desconocido'}</td>
                <td style={{ padding: '15px', border: '1px solid #ccc' }}>{votos}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Resultados;

// Luego podemos agregar esto a las rutas con React Router 😉