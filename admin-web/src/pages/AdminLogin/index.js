import React, { useState } from 'react';
import api from '../../services/api';
import { login } from '../../services/auth';
import './styles.css';

export default function AdminLogin({ history }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  async function handleLogin(event) {
    event.preventDefault();
    setFeedback({ message: '', type: '' });
    try {
      const response = await api.post('/sessions', { email, password });
      const { token, user } = response.data;

      if (user.role !== 'admin') {
        setFeedback({ message: 'Acesso restrito a administradores.', type: 'error' });
        return;
      }

      login(token, user);
      history.push('/dashboard');
    } catch (error) {
      setFeedback({ message: 'Falha no login, verifique suas credenciais.', type: 'error' });
    }
  }

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>EXA Snacks</h1>
        <h2>Acesso Administrativo</h2>
      </div>
      <form onSubmit={handleLogin}>
        {feedback.message && (
          <div className={`feedback ${feedback.type}`}>{feedback.message}</div>
        )}
        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
