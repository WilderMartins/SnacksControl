import React, { useState, useEffect, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import api from '../../services/api';
import './styles.css';

export default function Kiosk() {
  const [credits, setCredits] = useState(0);
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
      const consumptionsResponse = await api.get(`/consumptions?user_id=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userResponse = await api.get(`/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
      });

      const today = new Date().toISOString().split('T')[0];
      const todayConsumptions = consumptionsResponse.data.filter(c => c.created_at.startsWith(today));

      setCredits(userResponse.data.daily_credits - todayConsumptions.length);
      setConsumptions(todayConsumptions);
    } catch (error) {
      console.error('Failed to load data', error);
    }

  }, []);

  const processConsumption = useCallback(async (barcode) => {
    if (!barcode || isPaused) return;

    setIsPaused(true);
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        '/consumptions',
        { barcode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLastConsumed({ product: response.data.product, status: 'success' });
      loadData();
    } catch (error) {
      let errorMessage = 'Ocorreu um erro.';
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = error.response.data.error || 'Erro desconhecido do servidor.';
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message;
      }
      setLastConsumed({ product: { name: errorMessage }, status: 'error' });
    } finally {
      setTimeout(() => {
        setLastConsumed(null);
        setIsPaused(false);
      }, 3000);
    }
  }, [isPaused, loadData]);

  useEffect(() => {
    loadData();

    if (!isPaused) {
      const scanner = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, qrbox: 250 },
        false
      );

      const onScanSuccess = (decodedText) => {
        processConsumption(decodedText);
        scanner.clear();
      };

      scanner.render(onScanSuccess);

      return () => {
        scanner.clear();
      };
    }
  }, [loadData, processConsumption, isPaused]);

  const handleManualSubmit = (event) => {
    event.preventDefault();
    processConsumption(manualBarcode);
    setManualBarcode('');
  };

  return (
    <div className="kiosk-container">
      <div className="kiosk-header">
        <h1>Quiosque</h1>
        <h2>Créditos restantes: {credits}</h2>
      </div>

      <div className="scanner-container">
        <div id="qr-reader"></div>
        {lastConsumed && (
          <div className={`feedback-overlay ${lastConsumed.status}`}>
            <h2>{lastConsumed.status === 'success' ? 'Consumo Registrado!' : 'Erro!'}</h2>
            <p>{lastConsumed.product?.name}</p>
          </div>
        )}
      </div>

      <div className="manual-input-container">
        {/* ... (mesmo formulário manual) ... */}
      </div>

      <div className="consumptions-history">
        {/* ... (mesmo histórico) ... */}
      </div>
    </div>
  );
}
