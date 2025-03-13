import React, { useState } from 'react';
import Votaciones from './votaciones';
import Resultados from './Resultados';
import './App.css'

function App() {
  const [usuario, setUsuario] = useState(null);
  const [esAdmin, setEsAdmin] = useState(false);

  const login = (nombre, admin) => {
    setUsuario(nombre);
    setEsAdmin(admin);
  };

  const logout = () => {
    setUsuario(null);
    setEsAdmin(false);
  };

  return (
    <div>
      {!usuario ? (
        <Login onLogin={login} />
      ) : esAdmin ? (
        <Resultados onLogout={logout} />
      ) : (
        <Votaciones usuario={usuario} onLogout={logout} />
      )}
    </div>
  );
}

function Login({ onLogin }) {
  const [nombre, setNombre] = useState('');
  const [clave, setClave] = useState('');

  const handleLogin = () => {
    if (clave === 'admin123') {
      onLogin(nombre, true);
    } else {
      onLogin(nombre, false);
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center' ,height: '100vh', backgroundColor: '#f0f4f8'
    }}>
      <div style={{
        textAlign: 'center', padding: '35px', backgroundColor: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', width: '350px'
      }}>
        <img src="/img/fe.ico" alt="Logo" style={{ width: '80px', marginBottom: '15px' }} />
        <h1 style={{ color: '#3a79cc', marginBottom: '20px' }}>Sistema de Votaciones</h1>
        
        <input
          type="text"
          placeholder="Ingresa tu nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{
            width: '80%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none'
          }}
        />
        <input
          type="password"
          placeholder="Clave (admin solo)"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          style={{
            width: '80%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none'
          }}
        />
        <button 
  onClick={handleLogin} 
  style={{
    width: '100%', 
    padding: '12px', 
    borderRadius: '8px', 
    border: 'none', 
    backgroundColor: '#3a79cc', 
    color: '#fff', 
    cursor: 'pointer', 
    fontSize: '16px',
    transition: 'background-color 0.8s ease'
  }}
  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3e83ff'}
  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3a79cc'}
>
  Iniciar sesión
</button>
      </div>
    </div>
  );
}

export default App;
