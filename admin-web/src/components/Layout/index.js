import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import api from '../../services/api';
import { getUser, logout } from '../../services/auth';
import './styles.css';

function Layout({ children, history }) {
  const [sidebarColor, setSidebarColor] = useState('#f0f0f0');
  const [sidebarFontColor, setSidebarFontColor] = useState('#000000');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = getUser();

  const [logoPath, setLogoPath] = useState('/logo.png');

  useEffect(() => {
    async function loadSettings() {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await api.get('/settings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.sidebar_color) {
          setSidebarColor(response.data.sidebar_color);
        }
        if (response.data.sidebar_font_color) {
          setSidebarFontColor(response.data.sidebar_font_color);
        }
        if (response.data.logo_path) {
          setLogoPath(response.data.logo_path);
        }
      } catch (error) {
        console.error('Failed to load settings for layout', error);
      }
    }
    loadSettings();
  }, [history]);

  const isAdmin = user && user.role === 'admin';

  return (
    <div className="layout-container">
      <nav className={`sidebar ${isMenuOpen ? 'open' : ''}`} style={{ backgroundColor: sidebarColor }}>
        <div className="logo-container">
          <img src={logoPath} alt="Logo" />
        </div>
        <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          &#9776;
        </button>
        <ul className={isMenuOpen ? 'open' : ''}>
          {isAdmin ? (
            <>
              <li>
                <Link to="/dashboard" style={{ color: sidebarFontColor }}>Dashboard</Link>
              </li>
              <li>
                <Link to="/users" style={{ color: sidebarFontColor }}>Colaboradores</Link>
              </li>
              <li>
                <Link to="/products" style={{ color: sidebarFontColor }}>Produtos</Link>
              </li>
              <li>
                <Link to="/categories" style={{ color: sidebarFontColor }}>Categorias</Link>
              </li>
              <li>
                <Link to="/reports" style={{ color: sidebarFontColor }}>Relatórios</Link>
              </li>
              <li>
                <Link to="/settings" style={{ color: sidebarFontColor }}>Configurações</Link>
              </li>
            </>
          ) : (
            <li>
              <Link to="/kiosk" style={{ color: sidebarFontColor }}>Quiosque</Link>
            </li>
          )}
        </ul>
        <div className="logout-button">
          <button
            onClick={() => {
              logout();
              history.push('/');
            }}
          >
            Sair
          </button>
        </div>
      </nav>
      <main className="content">{children}</main>
    </div>
  );
}

export default withRouter(Layout);
