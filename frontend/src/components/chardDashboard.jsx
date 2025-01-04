import React, { useState } from "react";
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
import { 
  Box, 
  Typography, 
  useTheme, 
  Tabs, 
  Tab, 
  Paper,
  Chip,
  Stack,
  Alert,
  IconButton,
  Grid
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';

const ChartDashboard = ({ stockComponents }) => {
  const theme = useTheme();
  const [selectedSector, setSelectedSector] = useState(0);

  // Agrupa os dados por setor/estoque
  const sectorGroups = stockComponents.reduce((acc, component) => {
    const sectorId = component.Stock?.sectorId;
    const stockName = component.Stock?.name || 'Sem Estoque';
    
    if (!acc[sectorId]) {
      acc[sectorId] = {
        id: sectorId,
        name: stockName,
        items: []
      };
    }
    
    acc[sectorId].items.push({
      name: component.name,
      quantidade: component.quantity,
      minQuantity: component.minQuantity,
      unit: component.unit,
      status: component.quantity <= component.minQuantity ? 'baixo' : 'normal'
    });
    
    return acc;
  }, {});

  const sectors = Object.values(sectorGroups);

  // Cores para os itens
  const colors = {
    normal: "#4CAF50",
    baixo: "#FF9800"
  };

  const handleSectorChange = (event, newValue) => {
    setSelectedSector(newValue);
  };

  const currentSector = sectors[selectedSector] || { items: [] };

  const StockItemCard = ({ item }) => (
    <Box
      sx={{
        p: 2,
        borderRadius: 1,
        border: 1,
        borderColor: 'divider',
        bgcolor: item.status === 'baixo' ? 'warning.lighter' : 'background.paper',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <Box>
        <Typography variant="subtitle1" fontWeight="bold">
          {item.name}
        </Typography>
        <Stack direction="row" spacing={1} mt={1}>
          <Chip
            icon={<InventoryIcon />}
            label={`${item.quantidade} ${item.unit}`}
            color={item.status === 'baixo' ? 'warning' : 'success'}
            size="small"
          />
          <Chip
            icon={<TimelineIcon />}
            label={`Mín: ${item.minQuantity} ${item.unit}`}
            variant="outlined"
            size="small"
          />
        </Stack>
      </Box>
      {item.status === 'baixo' && (
        <IconButton color="warning">
          <WarningIcon />
        </IconButton>
      )}
    </Box>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={selectedSector}
          onChange={handleSectorChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          {sectors.map((sector, index) => (
            <Tab 
              key={sector.id} 
              label={sector.name}
              icon={<InventoryIcon />}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Paper>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {currentSector.name} - Detalhes do Estoque
        </Typography>
        {currentSector.items.some(item => item.status === 'baixo') && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Existem itens com estoque abaixo do mínimo neste setor!
          </Alert>
        )}
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: 400 }}>
            <ResponsiveContainer>
              <BarChart
                data={currentSector.items}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: theme.palette.text.primary }}
                  tickLine={{ stroke: theme.palette.divider }}
                />
                <YAxis 
                  tick={{ fill: theme.palette.text.primary }}
                  tickLine={{ stroke: theme.palette.divider }}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <Paper sx={{ p: 2 }}>
                          <Typography variant="subtitle2" color="primary">
                            {label}
                          </Typography>
                          <Typography variant="body2">
                            Quantidade: {item.quantidade} {item.unit}
                          </Typography>
                          <Typography variant="body2">
                            Mínimo: {item.minQuantity} {item.unit}
                          </Typography>
                        </Paper>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="quantidade"
                  name="Quantidade"
                  radius={[4, 4, 0, 0]}
                >
                  {currentSector.items.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={colors[entry.status]}
                      fillOpacity={0.9}
                    />
                  ))}
                </Bar>
                <ReferenceLine
                  y={Math.min(...currentSector.items.map(item => item.minQuantity))}
                  stroke={theme.palette.error.main}
                  strokeDasharray="3 3"
                  label={{
                    value: "Quantidade Mínima",
                    fill: theme.palette.error.main,
                    position: 'center'
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Stack spacing={2}>
            {currentSector.items.map((item, index) => (
              <StockItemCard key={index} item={item} />
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChartDashboard;
