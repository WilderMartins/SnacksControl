import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import api from './services/api';
import Routes from './routes';
import SetupWizard from './pages/Setup';
import Layout from './components/Layout';

function AppLoader() {
  const [isSetupComplete, setIsSetupComplete] = useState(null);

  useEffect(() => {
    async function checkSetupStatus() {
      try {
        const response = await api.get('/setup/status');
        setIsSetupComplete(response.data.isSetupComplete);
      } catch (error) {
        // Se o backend não estiver rodando, assumimos que o setup não está completo
        setIsSetupComplete(false);
      }
    }
    checkSetupStatus();
  }, []);

  if (isSetupComplete === null) {
    return <div>Carregando...</div>;
  }

  return isSetupComplete ? <Routes /> : <BrowserRouter><Layout><SetupWizard /></Layout></BrowserRouter>;
}

function App() {
  return <AppLoader />;
}

export default App;
