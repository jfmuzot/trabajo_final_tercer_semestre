import React from 'react';
import './LateralMenu.css';

const LateralMenu = ({ items, onSelect, onConfigClick, isGuest }) => {
  return (
    <div className="lateral-menu">
      {items.map((item, index) => (
        item !== "Configuración" || !isGuest ? ( // Oculta la opción de Configuración si es un invitado
          <button key={index} onClick={() => onSelect(item)} className="menu-button">
            {item}
          </button>
        ) : null
      ))}
    </div>
  );
};

export default LateralMenu;
