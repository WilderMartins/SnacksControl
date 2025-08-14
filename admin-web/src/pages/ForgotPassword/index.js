import React, { useState } from 'react';
import api from '../../services/api';
import './styles.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  async function handleSubmit(event) {
    event.preventDefault();
    setFeedback({ message: 'Processando...', type: 'info' });
    try {
      await api.post('/sessions/forgot-password', { email });
      setFeedback({ message: 'Se um administrador com este e-mail existir, um link para redefinição de senha foi enviado.', type: 'success' });
    } catch (error) {
      setFeedback({ message: 'Ocorreu um erro. Por favor, tente novamente.', type: 'error' });
    }
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-form">
        <h1>Redefinir Senha</h1>
        <p>Insira o seu e-mail de administrador. Se ele estiver em nosso sistema, enviaremos um link para você criar uma nova senha.</p>
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Enviar Link</button>
        </form>
      </div>
    </div>
  );
}
