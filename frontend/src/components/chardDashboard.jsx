import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine
} from "recharts";

const ChartDashboard = ({ products }) => {
  // Array de cores para os produtos
  const colors = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088fe",
    "#00c49f", "#ffbb28", "#ff8042", "#a4de6c", "#d0ed57"
  ];

  // Dados para o gráfico de barras de estoque com cores
  const stockData = products?.map((product, index) => ({
    name: product.name,
    quantidade: product.quantity,
    fill: colors[index % colors.length],
    id: `product-${product.id || index}`
  })) || [];

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Análise de Estoque</h2>
      
      <div style={{ width: '100%', height: 400, marginBottom: '2rem' }}>
        <ResponsiveContainer>
          <BarChart
            data={stockData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <ReferenceLine y={20} stroke="red" strokeDasharray="3 3" label="Estoque Baixo" />
            <Bar 
              dataKey="quantidade" 
              name="Quantidade em Estoque"
              fill={Cell.fill}
              key={`bar-${Math.random()}`}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartDashboard;
