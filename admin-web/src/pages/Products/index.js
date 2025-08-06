import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import './styles.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    barcode: '',
    category_id: '',
    image_url: '',
    stock_quantity: 0,
  });
  const [editingProduct, setEditingProduct] = useState(null);

  const loadProducts = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.get('/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products', error);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.get('/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to load categories', error);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts, loadCategories]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Por favor, selecione um arquivo.');
      return;
    }

    const data = new FormData();
    data.append('file', file);

    const token = localStorage.getItem('token');
    try {
      await api.post('/products/bulk', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Produtos importados com sucesso!');
      loadProducts(); // Recarrega a lista
    } catch (error) {
      alert('Falha na importação dos produtos.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await api.post('/products', newProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Produto criado com sucesso!');
      loadProducts();
      setNewProduct({ name: '', barcode: '', category_id: '', image_url: '' });
    } catch (error) {
      alert('Falha ao criar o produto.');
    }
  };

  const handleDelete = async (productId) => {
    const token = localStorage.getItem('token');
    try {
      await api.delete(`/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Produto excluído com sucesso!');
      loadProducts();
    } catch (error) {
      alert('Falha ao excluir o produto.');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await api.put(`/products/${editingProduct.id}`, editingProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Produto atualizado com sucesso!');
      loadProducts();
      setEditingProduct(null);
    } catch (error) {
      alert('Falha ao atualizar o produto.');
    }
  };

  return (
    <div className="container">
      <h1>Gestão de Produtos</h1>

      <div className="manual-creation-container">
        <h2>Criar Novo Produto</h2>
        <form onSubmit={handleManualSubmit}>
          <input
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
            placeholder="Nome do Produto"
          />
          <input
            name="barcode"
            value={newProduct.barcode}
            onChange={handleInputChange}
            placeholder="Código de Barras"
          />
          <select
            name="category_id"
            value={newProduct.category_id}
            onChange={handleInputChange}
          >
            <option value="">Selecione uma categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            name="image_url"
            value={newProduct.image_url}
            onChange={handleInputChange}
            placeholder="URL da Imagem"
          />
          <input
            name="stock_quantity"
            type="number"
            value={newProduct.stock_quantity}
            onChange={handleInputChange}
            placeholder="Quantidade em Estoque"
          />
          <button type="submit">Criar</button>
        </form>
      </div>

      <div className="upload-container">
        <h2>Importar Produtos via CSV</h2>
        <p>O arquivo CSV deve ter as colunas: `name`, `barcode`, `category`, `image_url`.</p>
        <input type="file" onChange={handleFileChange} accept=".csv" />
        <button onClick={handleUpload}>Enviar</button>
      </div>

      <div className="products-list">
        <h2>Lista de Produtos</h2>
        <table className="products-table">
          <thead>
            <tr>
              <th>Imagem</th>
              <th>Nome</th>
              <th>Código de Barras</th>
              <th>Categoria</th>
              <th>Estoque</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <img src={product.image_url} alt={product.name} className="product-thumbnail" />
                </td>
                <td>{product.name}</td>
                <td>{product.barcode}</td>
                <td>{product.category ? product.category.name : ''}</td>
                <td>
                  {product.stock_quantity > 0 ? (
                    product.stock_quantity
                  ) : (
                    <span className="out-of-stock">Fora de estoque</span>
                  )}
                </td>
                <td>
                  <div className="product-actions">
                    <button onClick={() => handleEdit(product)}>Editar</button>
                    <button onClick={() => handleDelete(product.id)}>Excluir</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingProduct && (
        <div className="edit-modal">
          <form onSubmit={handleUpdate}>
            <h2>Editar Produto</h2>
            <input
              name="name"
              value={editingProduct.name}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, name: e.target.value })
              }
              placeholder="Nome do Produto"
            />
            <input
              name="barcode"
              value={editingProduct.barcode}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  barcode: e.target.value,
                })
              }
              placeholder="Código de Barras"
            />
            <select
              name="category_id"
              value={editingProduct.category_id}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  category_id: e.target.value,
                })
              }
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input
              name="image_url"
              value={editingProduct.image_url}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  image_url: e.target.value,
                })
              }
              placeholder="URL da Imagem"
            />
            <input
              name="stock_quantity"
              type="number"
              value={editingProduct.stock_quantity}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  stock_quantity: e.target.value,
                })
              }
              placeholder="Quantidade em Estoque"
            />
            <button type="submit">Salvar</button>
            <button onClick={() => setEditingProduct(null)}>Cancelar</button>
          </form>
        </div>
      )}
    </div>
  );
}
