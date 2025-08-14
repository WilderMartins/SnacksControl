import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import './styles.css';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    daily_credits: 4,
  });
  const [editingUser, setEditingUser] = useState(null);

  const loadUsers = useCallback(async () => {
    const token = localStorage.getItem('token');
    const response = await api.get('/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUsers(response.data);
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await api.post('/users', newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Usuário criado com sucesso!');
      loadUsers();
      setNewUser({ name: '', email: '', password: '', role: 'user', daily_credits: 4 });
    } catch (error) {
      alert('Falha ao criar o usuário.');
    }
  };

  const handleDelete = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      await api.delete(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Usuário excluído com sucesso!');
      loadUsers();
    } catch (error) {
      alert('Falha ao excluir o usuário.');
    }
  };

  const handleToggleOtp = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      await api.put(`/users/${userId}/toggle-otp`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Status do OTP alterado com sucesso!');
      loadUsers();
    } catch (error) {
      alert('Falha ao alterar o status do OTP.');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const { name, email, password, role } = editingUser;
      const updatedData = { name, email, role };
      if (password) {
        updatedData.password = password;
      }

      await api.put(`/users/${editingUser.id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await api.patch(`/users/${editingUser.id}/credits`, { credits: editingUser.daily_credits }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Usuário atualizado com sucesso!');
      loadUsers();
      setEditingUser(null);
    } catch (error) {
      alert('Falha ao atualizar o usuário.');
    }
  };

  return (
    <div className="users-page-container">
      <h1>Colaboradores</h1>

      <div className="user-creation-container">
        <h2>Novo Colaborador</h2>
        <form onSubmit={handleManualSubmit}>
          <input
            name="name"
            value={newUser.name}
            onChange={handleInputChange}
            placeholder="Nome Completo"
          />
          <input
            name="email"
            type="email"
            value={newUser.email}
            onChange={handleInputChange}
            placeholder="E-mail"
          />
          <input
            name="password"
            type="password"
            value={newUser.password}
            onChange={handleInputChange}
            placeholder="Senha"
          />
           <input
            name="daily_credits"
            type="number"
            value={newUser.daily_credits}
            onChange={handleInputChange}
            placeholder="Créditos Diários"
          />
          <select name="role" value={newUser.role} onChange={handleInputChange}>
            <option value="user">Usuário</option>
            <option value="manager">Gerente</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Criar</button>
        </form>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Créditos</th>
              <th>Login com OTP</th>
              <th>Ações</th>
            </tr>
          </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.daily_credits}</td>
              <td>
                <button
                  onClick={() => handleToggleOtp(user.id)}
                  disabled={user.role === 'admin'}
                  className={`otp-toggle-button ${user.otp_enabled ? 'enabled' : 'disabled'}`}
                >
                  {user.otp_enabled ? 'Ativado' : 'Desativado'}
                </button>
              </td>
              <td>
                <div className="user-actions">
                  <button onClick={() => handleEdit(user)}>Editar</button>
                  <button onClick={() => handleDelete(user.id)}>Excluir</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>

      {editingUser && (
        <div className="edit-modal">
          <form onSubmit={handleUpdate}>
            <h2>Editar Colaborador</h2>
            <input
              name="name"
              value={editingUser.name}
              onChange={(e) =>
                setEditingUser({ ...editingUser, name: e.target.value })
              }
              placeholder="Nome Completo"
            />
            <input
              name="email"
              type="email"
              value={editingUser.email}
              onChange={(e) =>
                setEditingUser({ ...editingUser, email: e.target.value })
              }
              placeholder="E-mail"
            />
            <input
              name="daily_credits"
              type="number"
              value={editingUser.daily_credits}
              onChange={(e) =>
                setEditingUser({ ...editingUser, daily_credits: e.target.value })
              }
              placeholder="Créditos Diários"
            />
            <select
              name="role"
              value={editingUser.role}
              onChange={(e) =>
                setEditingUser({ ...editingUser, role: e.target.value })
              }
            >
              <option value="user">Usuário</option>
              <option value="manager">Gerente</option>
              <option value="admin">Admin</option>
            </select>
            <input
              name="password"
              type="password"
              onChange={(e) =>
                setEditingUser({ ...editingUser, password: e.target.value })
              }
              placeholder="Nova Senha"
            />
            <div className="modal-buttons">
              <button type="submit">Salvar</button>
              <button onClick={() => setEditingUser(null)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
