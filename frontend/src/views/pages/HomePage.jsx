import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const Home = () => {
  return (
    <div className="homepage-container">
      <div className="homepage-header">
        <h1>Bienvenido a Breath Game</h1>
      </div>
      <div className="homepage-content">
        <h2 className="homepage-tagline">"Respirar bien es vital para el ser humano, ya que una respiración adecuada mejora el bienestar físico y mental, promoviendo una vida más saludable y plena."</h2>
        <p className="homepage-description">
          Explora nuestra herramienta para ayudarte a mejorar tu respiración y alcanzar un estado óptimo de bienestar.
        </p>
        <div className="homepage-buttons">
          <Link to="/login" className="button-link">Iniciar Sesión</Link>
          <Link to="/app?guest=true" className="button-link">Entrar como Invitado</Link> {/* Modificado para pasar una query indicando que es un invitado */}
        </div>
      </div>
    </div>
  );
};

export default Home;
