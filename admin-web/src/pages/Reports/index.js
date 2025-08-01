import React, { useState, useEffect, useCallback } from 'react';
import { format, parseISO } from 'date-fns';
import api from '../../services/api';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function Reports() {
  const [consumptions, setConsumptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ userId: '', startDate: '', endDate: '' });
  const [csvData, setCsvData] = useState([]);
  const [summaryByUser, setSummaryByUser] = useState([]);
  const [summaryByProduct, setSummaryByProduct] = useState([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

  const loadData = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const params = {};
      if (filters.userId) params.user_id = filters.userId;
      if (filters.startDate) params.start_date = filters.startDate;
      if (filters.endDate) params.end_date = filters.endDate;

      const [usersRes, consumptionsRes, byUserRes, byProductRes] = await Promise.all([
        api.get('/users', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/consumptions', { headers: { Authorization: `Bearer ${token}` }, params }),
        api.get('/consumptions/summary/by-user', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/consumptions/summary/by-product', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setUsers(usersRes.data);
      setConsumptions(consumptionsRes.data);
      setSummaryByUser(byUserRes.data.map(item => ({ name: item.user.name, total: item.total_consumed })));
      setSummaryByProduct(byProductRes.data.map(item => ({ name: item.product.name, value: parseInt(item.total_consumed, 10) })));

      const dataForCsv = consumptionsRes.data.map(c => ({
        user_name: c.user.name,
        user_email: c.user.email,
        product_name: c.product.name,
        product_barcode: c.product.barcode,
        date: format(parseISO(c.created_at), 'Pp'),
      }));
      setCsvData(dataForCsv);

    } catch (error) {
      console.error('Failed to load data', error);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleExportPdf = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Usuário', 'Produto', 'Data']],
      body: consumptions.map(c => [c.user.name, c.product.name, format(parseISO(c.created_at), 'Pp')]),
    });
    doc.save('consumptions-report.pdf');
  };

  return (
    <div className="container">
      <h1>Relatórios</h1>

      <div className="charts-container">
        <div className="chart">
          <h2>Top 10 Consumidores</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={summaryByUser}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#8884d8" name="Itens Consumidos" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart">
          <h2>Produtos Mais Consumidos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={summaryByProduct} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                {summaryByProduct.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h2>Relatório de Consumo Detalhado</h2>
      <div className="filters-container">
        <select name="userId" onChange={handleFilterChange} value={filters.userId}>
          <option value="">Todos os usuários</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
        <input type="date" name="startDate" onChange={handleFilterChange} value={filters.startDate} />
        <input type="date" name="endDate" onChange={handleFilterChange} value={filters.endDate} />
      </div>
      <CSVLink data={csvData} filename={"consumptions-report.csv"}>
        Exportar para CSV
      </CSVLink>
      <button onClick={handleExportPdf}>Exportar para PDF</button>
      <table>
        <thead>
          <tr>
            <th>Usuário</th>
            <th>Produto</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {consumptions.map((consumption) => (
            <tr key={consumption.id}>
              <td>{consumption.user.name}</td>
              <td>{consumption.product.name}</td>
              <td>{format(parseISO(consumption.created_at), 'Pp')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
