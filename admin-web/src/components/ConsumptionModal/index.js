import React from 'react';
import './styles.css';

export default function ConsumptionModal({ product, onConfirm, onCancel }) {
  if (!product) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h1>Confirmar Consumo</h1>
        <div className="product-info">
          <img src={product.image_url} alt={product.name} />
          <h2>{product.name}</h2>
        </div>
        <div className="buttons">
          <button onClick={onConfirm}>Confirmar</button>
          <button onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
