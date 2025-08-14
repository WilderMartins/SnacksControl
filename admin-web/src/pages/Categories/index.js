import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import './styles.css';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '' });
  const [editingCategory, setEditingCategory] = useState(null);

  const loadCategories = useCallback(async () => {
    const token = localStorage.getItem('token');
    const response = await api.get('/categories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setCategories(response.data);
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await api.post('/categories', newCategory, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Categoria criada com sucesso!');
      loadCategories();
      setNewCategory({ name: '' });
    } catch (error) {
      alert('Falha ao criar a categoria.');
    }
  };

  const handleDelete = async (categoryId) => {
    const token = localStorage.getItem('token');
    try {
      await api.delete(`/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Categoria excluída com sucesso!');
      loadCategories();
    } catch (error) {
      alert('Falha ao excluir a categoria.');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await api.put(`/categories/${editingCategory.id}`, editingCategory, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Categoria atualizada com sucesso!');
      loadCategories();
      setEditingCategory(null);
    } catch (error) {
      alert('Falha ao atualizar a categoria.');
    }
  };

  return (
    <div className="container">
      <h1>Gestão de Categorias</h1>

      <div className="category-creation-container">
        <h2>Nova Categoria</h2>
        <form onSubmit={handleManualSubmit}>
          <input
            name="name"
            value={newCategory.name}
            onChange={handleInputChange}
            placeholder="Nome da Categoria"
          />
          <button type="submit">Criar</button>
        </form>
      </div>

      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <strong>{category.name}</strong>
            <div className="category-actions">
              <button onClick={() => handleEdit(category)}>Editar</button>
              <button onClick={() => handleDelete(category.id)}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>

      {editingCategory && (
        <div className="edit-modal">
          <form onSubmit={handleUpdate}>
            <h2>Editar Categoria</h2>
            <input
              name="name"
              value={editingCategory.name}
              onChange={(e) =>
                setEditingCategory({ ...editingCategory, name: e.target.value })
              }
              placeholder="Nome da Categoria"
            />
            <div className="modal-buttons">
              <button type="submit">Salvar</button>
              <button onClick={() => setEditingCategory(null)} className="cancel-button">Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
