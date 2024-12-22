import { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Tabs,
  Tab,
  Fade
} from '@mui/material';
import MainLayout from '../components/layout/MainLayout';
import { reportService } from '../services/stockHistoryService';
import ReportChart from '../components/ReportChart';
import ReportChartMonthly from '../components/ReportChartMonthly';

const Relatorios = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [dailyReport, setDailyReport] = useState(null);
  const [monthlyReport, setMonthlyReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleDailyReport = async () => {
    setLoading(true);
    try {
      const data = await reportService.getDailyReport(new Date(selectedDate));
      setDailyReport(data);
    } catch (error) {
      console.error('Erro ao carregar relatório diário:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMonthlyReport = async () => {
    try {
      setLoading(true);
      const [year, month] = selectedMonth.split('-');
      const data = await reportService.getMonthlyReport(
        parseInt(month),
        parseInt(year)
      );
      setMonthlyReport(data);
    } catch (error) {
      console.error('Erro ao carregar relatório mensal:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            mb: 2
          }}
        >
          <Tab label="Relatório Diário" />
          <Tab label="Relatório Mensal" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <Fade in={activeTab === 0}>
            <Box hidden={activeTab !== 0}>
              <Box sx={{ 
                mb: 3, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                justifyContent: 'center' 
              }}>
                <TextField
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  sx={{ width: 220 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleDailyReport}
                  disabled={loading}
                >
                  Gerar Relatório
                </Button>
              </Box>
              {dailyReport && (
                <Box sx={{ 
                  maxWidth: '100%',
                  margin: '0 auto',
                  transition: 'all 0.3s ease'
                }}>
                  <ReportChart data={dailyReport} type="daily" />
                </Box>
              )}
            </Box>
          </Fade>

          <Fade in={activeTab === 1}>
            <Box hidden={activeTab !== 1}>
              <Box sx={{ 
                mb: 3, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2,
                justifyContent: 'center' 
              }}>
                <TextField
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  sx={{ width: 220 }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleMonthlyReport}
                  disabled={loading}
                >
                  Gerar Relatório
                </Button>
              </Box>
              {monthlyReport && (
                <Box sx={{ 
                  maxWidth: '100%',
                  margin: '0 auto',
                  transition: 'all 0.3s ease'
                }}>
                  <ReportChartMonthly data={monthlyReport} />
                </Box>
              )}
            </Box>
          </Fade>
        </Box>
      </Paper>
    </MainLayout>
  );
};

export default Relatorios;
