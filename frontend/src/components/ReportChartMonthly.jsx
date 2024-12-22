import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Typography, Box, Alert } from '@mui/material';

const ReportChartMonthly = ({ data }) => {
  if (!data) return null;

  const formatChartData = () => {
    try {
      return data.movimentacoesPorProduto.map(produto => ({
        name: produto.nome,
        entradas: produto.entradas,
        saidas: produto.saidas,
        ajustes: produto.ajustes
      }));
    } catch (error) {
      console.error('Erro ao formatar dados:', error);
      return [];
    }
  };

  if (data.error) {
    return (
      <Box sx={{ mt: 3 }}>
        <Alert severity="error">
          Ocorreu um erro ao carregar os dados do gráfico {data.error}. Por favor, tente novamente.
          {data.error.message && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Detalhes: {data.error.message}
            </Typography>
          )}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Movimentações por Produto no Mês
      </Typography>
      {data.totalMovimentacoes && (
        <Typography variant="subtitle1" gutterBottom>
          Total de Movimentações: {data.totalMovimentacoes}
        </Typography>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart 
          data={formatChartData()}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis />
          <Tooltip 
            formatter={(value, name) => {
              const labels = {
                entradas: 'Entradas',
                saidas: 'Saídas',
                ajustes: 'Ajustes'
              };
              return [value, labels[name] || name];
            }}
          />
          <Legend />
          <Bar dataKey="entradas" fill="#4caf50" name="Entradas" stackId="a" />
          <Bar dataKey="saidas" fill="#f44336" name="Saídas" stackId="a" />
          <Bar dataKey="ajustes" fill="#ff9800" name="Ajustes" stackId="a" />
        </BarChart>
      </ResponsiveContainer>
      
      {data.produtosMaisMovimentados && data.produtosMaisMovimentados.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Produtos Mais Movimentados
          </Typography>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.produtosMaisMovimentados}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalMovimentacoes" fill="#9c27b0" name="Total de Movimentações" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
};

export default ReportChartMonthly;