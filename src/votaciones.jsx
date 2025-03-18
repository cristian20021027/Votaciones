import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import './App.css';

const socket = io('http://192.168.1.164:3000');

function Votaciones() {
  const [nombre, setNombre] = useState('');
  const [bloqueo, setBloqueo] = useState({ personero: false, contraloria: false });
  const [contador, setContador] = useState({ personero: 0, contraloria: 0 });
  const [mostrandoLoader, setMostrandoLoader] = useState(false);
  const [votoPersonero, setVotoPersonero] = useState(false); // Estado para habilitar contraloría

  useEffect(() => {
    socket.on('actualizarResultados', (data) => {
      console.log('Resultados actualizados:', data);
    });

    return () => socket.off('actualizarResultados');
  }, []);

  const votar = async (seccion, candidato) => {
    if (nombre && candidato && !bloqueo[seccion]) {
      await axios.post('http://192.168.1.164:3000/votar', { nombre, seccion, candidato });
      setBloqueo((prev) => ({ ...prev, [seccion]: true }));
      setContador((prev) => ({ ...prev, [seccion]: 7 }));

      if (seccion === 'personero') {
        setVotoPersonero(true); // ✅ Se activa para permitir votar por contraloría
      }

      const interval = setInterval(() => {
        setContador((prev) => {
          if (prev[seccion] <= 1) {
            clearInterval(interval);
            setBloqueo((prev) => ({ ...prev, [seccion]: false }));

            if (seccion === "contraloria") {
              setMostrandoLoader(true);
              setTimeout(() => {
                setMostrandoLoader(false);
              }, 3000);
            }
          }
          return { ...prev, [seccion]: prev[seccion] - 1 };
        });
      }, 1000);
    }
  };

  console.log("Estado de votoPersonero:", votoPersonero); // 🔍 Para depuración

  const renderSeccion = (titulo, seccion, candidatos, habilitado = true) => (
    <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ color: '#34495e', fontSize: '24px', marginBottom: '16px' }}>{titulo}</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '66px', flexWrap: 'wrap' }}>
        {candidatos.map((candidato, index) => (
          <div key={index} style={{
            padding: '16px',
            background: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            width: '260px',
            color: '#333',
            transition: 'transform 0.3s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <img 
              src={candidato.foto} 
              alt={candidato.nombre} 
              style={{ width: '60%', borderRadius: '12px', marginBottom: '12px', border: '2px solid #74b9ff' }}
            />
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{candidato.nombre}</h3>
            <button 
              onClick={() => votar(seccion, candidato.nombre)}
              disabled={bloqueo[seccion] || (seccion === 'contraloria' && !votoPersonero)} // 🔥 Ahora sí se bloquea correctamente
              style={{
                backgroundColor: bloqueo[seccion] || (seccion === 'contraloria' && !votoPersonero) ? '#bdc3c7' : '#e74c3c',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '10px',
                cursor: bloqueo[seccion] || (seccion === 'contraloria' && !votoPersonero) ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.3s',
              }}
            >
              {bloqueo[seccion] ? `Esperando (${contador[seccion]}s)` : 'Votar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f0f4f8', borderRadius: '10px', padding: '0px' }}>
      {mostrandoLoader && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <svg className="pl" width="240" height="240" viewBox="0 0 240 240">
	<circle className="pl__ring pl__ring--a" cx="120" cy="120" r="105" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 660" stroke-dashoffset="-330" stroke-linecap="round"></circle>
	<circle className="pl__ring pl__ring--b" cx="120" cy="120" r="35" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 220" stroke-dashoffset="-110" stroke-linecap="round"></circle>
	<circle className="pl__ring pl__ring--c" cx="85" cy="120" r="70" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round"></circle>
	<circle className="pl__ring pl__ring--d" cx="155" cy="120" r="70" fill="none" stroke="#000" stroke-width="20" stroke-dasharray="0 440" stroke-linecap="round"></circle>
</svg>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#3a79cc',
          padding: '10px',
        }}
      >
        <h1
          style={{
            color: '#faf9f9',
            display: 'flex',
            alignItems: 'center',
            margin: 0,
          }}
        >
          <img
            src="/img/fe.ico"
            alt="Logo"
            style={{ width: '50px', marginRight: '10px' }}
          />
          Sistema de Votaciones
        </h1>
        <input
          type="text"
          placeholder="Ingresa tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="input"
          style={{
            padding: '5px',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />
      </div>

      <div style={{ textAlign: 'center', padding: '10px' }}>
        {renderSeccion('Personero Estudiantil', 'personero', [
          { nombre: 'SAMUEL SANCHEZ CORDERO 01 (Personero)', foto: '/img/01.png' },
          { nombre: 'ALBEIRO BERRÍO DOMÍNGUEZ 02 (Personero)', foto: '/img/02.png' },
          { nombre: 'ELIAM TORRENEGRA MANGA 03 (Personero)', foto: '/img/03.png' },
          { nombre: 'VOTO EN BLANCO (personero)', foto: '/img/voto.jpg' },
        ])}
        {renderSeccion('Contralor Estudiantil', 'contraloria', [
          { nombre: 'OSMARLY GONZÁLEZ MUÑOZ 01 (contraloria)', foto: '/img/04.png' },
          { nombre: 'DORETHY PARADA HERRERA 02 (contraloria)', foto: '/img/05.png' },
          { nombre: 'JUAN PÉREZ MORALES 03 (contraloria)', foto: '/img/06.png' },
          { nombre: 'VOTO EN BLANCO (contraloria)', foto: '/img/voto.jpg' },
        ], votoPersonero)} 
      </div>
    </div>
  );
}

export default Votaciones;
