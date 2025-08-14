import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';
import './styles.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ResetPassword() {
  const query = useQuery();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(query.get('token'));
  }, [query]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (password !== confirmPassword) {
      setFeedback({ message: 'As senhas não conferem.', type: 'error' });
      return;
    }
    if (!token) {
      setFeedback({ message: 'Token de redefinição inválido ou ausente.', type: 'error' });
      return;
    }

    setFeedback({ message: 'Processando...', type: 'info' });
    try {
      await api.post('/sessions/reset-password', { token, password });
      setFeedback({ message: 'Senha redefinida com sucesso! Você já pode fazer login com a nova senha.', type: 'success' });
    } catch (error) {
      setFeedback({ message: error.response?.data?.error || 'Falha ao redefinir a senha.', type: 'error' });
    }
  }

  return (
    <div className="reset-password-container">
      <div className="reset-password-form">
        <h1>Crie uma Nova Senha</h1>
        <form onSubmit={handleSubmit}>
          {feedback.message && (
            <div className={`feedback ${feedback.type}`}>{feedback.message}</div>
          )}
          <input
            type="password"
            placeholder="Nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirme a nova senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Redefinir Senha</button>
        </form>
      </div>
    </div>
  );
}
