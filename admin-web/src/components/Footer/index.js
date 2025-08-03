import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

export default function Footer() {
  return (
    <footer className="footer">
      <p>&copy; {new Date().getFullYear()} EXA Snacks. Todos os direitos reservados.</p>
      <Link to="/privacy-policy">Política de Privacidade</Link>
    </footer>
  );
}
