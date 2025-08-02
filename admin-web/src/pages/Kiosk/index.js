import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../../services/api';
import './styles.css';

export default function Kiosk() {
  const history = useHistory();
  const [settings, setSettings] = useState({});
  const [credits, setCredits] = useState(0);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [productToConfirm, setProductToConfirm] = useState(null);
  const [, setConsumptions] = useState([]); // Apenas o setter é usado para o histórico
  const [lastConsumed, setLastConsumed] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');

  const loadData = useCallback(async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
      return;
    }

    try {
      const settingsResponse = await api.get('/settings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSettings(settingsResponse.data);

      const productsResponse = await api.get('/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(productsResponse.data);

      const consumptionsResponse = await api.get(
        `/consumptions?user_id=${user.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const userResponse = await api.get(`/users/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const today = new Date().toISOString().split('T')[0];
      const todayConsumptions = consumptionsResponse.data.filter((c) =>
        c.created_at.startsWith(today)
      );

      setCredits(userResponse.data.daily_credits - todayConsumptions.length);
      setConsumptions(todayConsumptions);
    } catch (error) {
      console.error('Failed to load data', error);
    }
  }, []);

  const handleConfirmConsumption = useCallback(async () => {
    if (!productToConfirm || isPaused) return;

    if (credits <= 0) {
      setLastConsumed({ product: { name: 'Você não tem créditos suficientes.' }, status: 'error' });
      setProductToConfirm(null);
      setTimeout(() => {
        setLastConsumed(null);
      }, 3000);
      return;
    }

    setIsPaused(true);
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        '/consumptions',
        { barcode: productToConfirm.barcode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLastConsumed({
        product: response.data.product,
        status: 'success',
      });
      loadData();
    } catch (error) {
      let errorMessage = 'Ocorreu um erro.';
      if (error.response) {
        errorMessage =
          error.response.data.error || 'Erro desconhecido do servidor.';
      } else if (error.request) {
        errorMessage =
          'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.';
      } else {
        errorMessage = error.message;
      }
      setLastConsumed({ product: { name: errorMessage }, status: 'error' });
    } finally {
      setProductToConfirm(null);
      setTimeout(() => {
        setLastConsumed(null);
        setIsPaused(false);
      }, 3000);
    }
  }, [productToConfirm, isPaused, loadData]);

  const handleProductSelection = (barcode) => {
    const product = products.find((p) => p.barcode === barcode);
    if (product) {
      setProductToConfirm(product);
    }
  };

  useEffect(() => {
    loadData();

    if (!isPaused && !productToConfirm) {
      const scanner = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, qrbox: 250 },
        false
      );

      const onScanSuccess = (decodedText) => {
        handleProductSelection(decodedText);
        scanner.clear();
      };

      scanner.render(onScanSuccess);

      return () => {
        if (scanner) {
          scanner.clear();
        }
      };
    }
  }, [loadData, isPaused, productToConfirm]);

  const handleManualSubmit = (event) => {
    event.preventDefault();
    handleProductSelection(manualBarcode);
    setManualBarcode('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    history.push('/');
  };

  return (
    <div
      className="kiosk-container"
      style={{
        '--primary-color': settings.primary_color || '#007bff',
      }}
    >
      <div className="kiosk-header">
        {settings.logo_path && (
          <img src={settings.logo_path} alt="Logo" className="kiosk-logo" />
        )}
        <h1>Quiosque</h1>
        <h2>Créditos restantes: {credits}</h2>
      </div>

      <div className="scanner-container">
        <div id="qr-reader"></div>
        {lastConsumed && (
          <div className={`feedback-overlay ${lastConsumed.status}`}>
            <h2>
              {lastConsumed.status === 'success'
                ? 'Consumo Registrado!'
                : 'Erro!'}
            </h2>
            <p>{lastConsumed.product?.name}</p>
          </div>
        )}
      </div>

      <button onClick={handleLogout} className="logout-button">
        Sair
      </button>

      <div className="manual-input-container">
        <input
          type="text"
          placeholder="Pesquisar produto por nome ou código de barras"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <ul className="product-selection-list">
          {products
            .filter((p) => {
              const term = searchTerm.toLowerCase();
              return (
                p.name.toLowerCase().includes(term) ||
                p.barcode.toLowerCase().includes(term)
              );
            })
            .map((product) => (
              <li
                key={product.id}
                onClick={() => handleProductSelection(product.barcode)}
              >
                {product.name}
              </li>
            ))}
        </ul>
      </div>

      <div className="consumptions-history">
        {/* ... (mesmo histórico) ... */}
      </div>

      {productToConfirm && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <h2>Confirmar Consumo</h2>
            <p>Você tem certeza que deseja consumir o produto: <strong>{productToConfirm.name}</strong>?</p>
            <div className="modal-actions">
              <button onClick={handleConfirmConsumption} className="confirm-button">Confirmar</button>
              <button onClick={() => setProductToConfirm(null)} className="cancel-button">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
