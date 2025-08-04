import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import './styles.css';

export default function Dashboard() {
  const [dailyConsumption, setDailyConsumption] = useState([]);
  const [categoryConsumption, setCategoryConsumption] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalConsumptionsLast30Days, setTotalConsumptionsLast30Days] = useState(0);
  const [consumptionByUser, setConsumptionByUser] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    async function loadData() {
      const token = localStorage.getItem('token');
      try {
        const response = await api.get('/consumptions/summary', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDailyConsumption(response.data.dailyConsumptions.map(d => ({ date: new Date(d.date).toLocaleDateString(), count: d.count })));
        setCategoryConsumption(response.data.categoryConsumptions.map(c => ({ name: c.product.category.name, value: parseInt(c.count, 10) })));
        setTotalUsers(response.data.totalUsers);
        setTotalProducts(response.data.totalProducts);
        setTotalConsumptionsLast30Days(response.data.totalConsumptionsLast30Days);
        setConsumptionByUser(response.data.consumptionByUser.map(u => ({ name: u.user.name, value: parseInt(u.total_consumed, 10) })));
        setTopProducts(response.data.topProducts.map(p => ({ name: p.product.name, value: parseInt(p.total_consumed, 10) })));
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      }
    }
    loadData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <div className="key-metrics">
        <div className="metric-card">
          <h2>Total de Colaboradores</h2>
          <p>{totalUsers}</p>
        </div>
        <div className="metric-card">
          <h2>Total de Produtos</h2>
          <p>{totalProducts}</p>
        </div>
        <div className="metric-card">
          <h2>Consumo (Últimos 30 Dias)</h2>
          <p>{totalConsumptionsLast30Days}</p>
        </div>
      </div>
      <div className="charts-container">
        <div className="chart">
          <h2>Consumo Diário (Últimos 7 Dias)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyConsumption}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart">
          <h2>Consumo por Categoria</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryConsumption}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryConsumption.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart">
          <h2>Top 5 Consumidores</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={consumptionByUser}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart">
          <h2>Top 5 Produtos</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
