import React, { useState } from 'react';
import api from '../../services/api';
import { login } from '../../services/auth';
import './styles.css';

export default function Login({ history }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  async function handleLogin(event) {
    event.preventDefault();
    setFeedback({ message: '', type: '' });
    try {
      const payload = loginMethod === 'password' ? { email, password } : { email, otp };
      const response = await api.post('/sessions', payload);
      const { token, user } = response.data;
      login(token, user);
      history.push(user.role === 'admin' ? '/dashboard' : '/kiosk');
    } catch (error) {
      setFeedback({ message: 'Falha no login, verifique suas credenciais.', type: 'error' });
    }
  }

  async function handleRequestOtp(event) {
    event.preventDefault();
    setFeedback({ message: '', type: '' });
    try {
      await api.post('/sessions/otp', { email });
      setFeedback({ message: 'Código OTP enviado para o seu e-mail.', type: 'success' });
    } catch (error) {
      setFeedback({ message: 'Falha ao solicitar OTP, verifique o e-mail e tente novamente.', type: 'error' });
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Acesse o quiosque</h2>

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
        {loginMethod === 'password' ? (
          <input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        ) : (
          <div className="otp-group">
            <input
              type="text"
              placeholder="Seu código OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button type="button" onClick={handleRequestOtp}>
              Enviar OTP
            </button>
          </div>
        )}
        <button type="submit">Entrar</button>
        <div className="login-toggle">
          {loginMethod === 'password' ? (
            <a href="#" onClick={() => setLoginMethod('otp')}>
              Entrar com código OTP
            </a>
          ) : (
            <a href="#" onClick={() => setLoginMethod('password')}>
              Entrar com senha
            </a>
          )}
        </div>
      </form>
    </div>
  );
}
