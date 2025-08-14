import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './styles.css';

export default function Settings() {
  const [awsAccessKeyId, setAwsAccessKeyId] = useState('');
  const [awsSecretAccessKey, setAwsSecretAccessKey] = useState('');
  const [awsRegion, setAwsRegion] = useState('');
  const [mailFrom, setMailFrom] = useState('');
  const [sidebarColor, setSidebarColor] = useState('#f0f0f0');
  const [sidebarFontColor, setSidebarFontColor] = useState('#000000');
  const [logo, setLogo] = useState(null);
  const [globalCredits, setGlobalCredits] = useState(4);
  const [sesHost, setSesHost] = useState('');
  const [sesPort, setSesPort] = useState('');

  useEffect(() => {
    async function loadSettings() {
      const token = localStorage.getItem('token');
      try {
        const response = await api.get('/settings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { aws_access_key_id, aws_secret_access_key, aws_region, mail_from, sidebar_color, sidebar_font_color, ses_host, ses_port } = response.data;
        setAwsAccessKeyId(aws_access_key_id || '');
        setAwsSecretAccessKey(aws_secret_access_key || '');
        setAwsRegion(aws_region || '');
        setMailFrom(mail_from || '');
        setSidebarColor(sidebar_color || '#f0f0f0');
        setSidebarFontColor(sidebar_font_color || '#000000');
        setSesHost(ses_host || '');
        setSesPort(ses_port || '');
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    }
    loadSettings();
  }, []);

  async function handleSettingsSubmit(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const data = new FormData();

    data.append('aws_access_key_id', awsAccessKeyId);
    data.append('aws_secret_access_key', awsSecretAccessKey);
    data.append('aws_region', awsRegion);
    data.append('mail_from', mailFrom);
    data.append('sidebar_color', sidebarColor);
    data.append('sidebar_font_color', sidebarFontColor);
    data.append('ses_host', sesHost);
    data.append('ses_port', sesPort);
    if (logo) {
      data.append('logo', logo);
    }

    try {
      await api.post('/settings', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      localStorage.setItem('sidebar_color', sidebarColor);
      if (logo) {
        const reader = new FileReader();
        reader.onloadend = () => {
          localStorage.setItem('logo_url', reader.result);
        };
        reader.readAsDataURL(logo);
      }
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Falha ao salvar as configurações.');
    }
  }

  async function handleCreditsSubmit(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await api.post('/users/credits/reset', { credits: globalCredits }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Créditos globais atualizados com sucesso!');
    } catch (error) {
      console.error('Failed to update global credits:', error);
      alert('Falha ao atualizar os créditos globais.');
    }
  }

  async function handleSesTest() {
    const email = document.getElementById('ses-test-email').value;
    if (!email) {
      alert('Por favor, insira um e-mail para o teste.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await api.post('/settings/test-ses', { email }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(response.data.message);
    } catch (error) {
      alert(`Falha ao enviar e-mail de teste: ${error.response.data.details}`);
    }
  }

  return (
    <div className="settings-container">
      <h1>Configurações</h1>
      <form onSubmit={handleSettingsSubmit} className="settings-form">
        <h2>E-mail (AWS SES)</h2>
        <input
          placeholder="AWS Access Key ID"
          value={awsAccessKeyId}
          onChange={(e) => setAwsAccessKeyId(e.target.value)}
        />
        <input
          type="password"
          placeholder="AWS Secret Access Key"
          value={awsSecretAccessKey}
          onChange={(e) => setAwsSecretAccessKey(e.target.value)}
        />
        <input
          placeholder="AWS Region"
          value={awsRegion}
          onChange={(e) => setAwsRegion(e.target.value)}
        />
        <input
          type="email"
          placeholder="E-mail de origem"
          value={mailFrom}
          onChange={(e) => setMailFrom(e.target.value)}
        />
        <input
          placeholder="Host (ex: email-smtp.us-east-1.amazonaws.com)"
          value={sesHost}
          onChange={(e) => setSesHost(e.target.value)}
        />
        <input
          placeholder="Porta (ex: 587)"
          value={sesPort}
          onChange={(e) => setSesPort(e.target.value)}
        />

        <h2>Aparência</h2>
        <label htmlFor="logo">Logo da Empresa:</label>
        <input
          type="file"
          id="logo"
          onChange={(e) => setLogo(e.target.files[0])}
        />
        <label htmlFor="sidebarColor">Cor da Barra Lateral:</label>
        <input
          type="color"
          id="sidebarColor"
          value={sidebarColor}
          onChange={(e) => setSidebarColor(e.target.value)}
        />
        <label htmlFor="sidebarFontColor">Cor da Fonte da Barra Lateral:</label>
        <input
          type="color"
          id="sidebarFontColor"
          value={sidebarFontColor}
          onChange={(e) => setSidebarFontColor(e.target.value)}
        />
        <button type="submit">Salvar Configurações</button>
      </form>

      <div className="ses-test-container">
        <h3>Testar Conexão AWS SES</h3>
        <input
          type="email"
          placeholder="E-mail de destino para o teste"
          id="ses-test-email"
        />
        <button onClick={handleSesTest}>Enviar E-mail de Teste</button>
      </div>

      <form onSubmit={handleCreditsSubmit} className="credits-form">
        <h2>Créditos Globais</h2>
        <p>
          Altere o valor abaixo para definir um novo padrão de créditos diários para todos os usuários.
        </p>
        <input
          type="number"
          value={globalCredits}
          onChange={(e) => setGlobalCredits(e.target.value)}
        />
        <button type="submit">Atualizar Créditos Globais</button>
      </form>
    </div>
  );
}
