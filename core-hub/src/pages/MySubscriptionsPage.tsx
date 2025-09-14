import { useMemo, useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Toolbar,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import MySubscriptionsTable from "../components/MySubscriptions/MySubscriptionsTable.tsx";
import type { SubscriptionRow, SubscriptionStatus } from "../components/MySubscriptions/MySubscriptionsRow.tsx";
import { subscriptionsService } from '../services/subscriptionsService';


export default function MySubscriptionsPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'ALL' | SubscriptionStatus>('ALL');
  const [subscriptions, setSubscriptions] = useState<SubscriptionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  // Cargar suscripciones al montar el componente
  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await subscriptionsService.getAllSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las suscripciones');
      console.error('Error loading subscriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return subscriptions.filter(r => {
      const matchText = !q || 
        r.subscriptionId.toLowerCase().includes(q) ||
        r.topic.toLowerCase().includes(q) ||
        r.squadName.toLowerCase().includes(q) ||
        r.eventName.toLowerCase().includes(q) ||
        r.webhookUrl.toLowerCase().includes(q);
      const matchStatus = status === 'ALL' || r.status === status;
      return matchText && matchStatus;
    });
  }, [subscriptions, query, status]);

  const handleView = (subscription: SubscriptionRow) => {
    console.log('View subscription:', subscription);
    setSnackbar({
      open: true,
      message: `Ver detalles de suscripción: ${subscription.subscriptionId}`,
      severity: 'info'
    });
    // TODO: Implement view subscription details modal
  };

  const handleDelete = async (subscription: SubscriptionRow) => {
    try {
      await subscriptionsService.deleteSubscription(subscription.subscriptionId);
      setSnackbar({
        open: true,
        message: 'Suscripción eliminada exitosamente',
        severity: 'success'
      });
      // Recargar la lista
      await loadSubscriptions();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Error al eliminar la suscripción',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Mostrar error si hay algún problema
  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Box display="flex" justifyContent="center" mt={4}>
          <button onClick={loadSubscriptions} style={{ padding: '8px 16px' }}>
            Reintentar
          </button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Toolbar sx={{px: 0, mb: 2, gap: 2, flexWrap: 'wrap'}}>
        <Typography variant="h5" sx={{fontWeight: 700, flexGrow: 1}}>
          My Subscriptions
        </Typography>

        <FormControl size="small">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            input={<OutlinedInput/>}
            sx={{minWidth: 160}}
          >
            <MenuItem value="ALL">All statuses</MenuItem>
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="INACTIVE">Inactive</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          placeholder="Search subscriptions…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small"/>
              </InputAdornment>
            ),
          }}
        />

        <Tooltip title="Actualizar suscripciones">
          <IconButton 
            onClick={loadSubscriptions} 
            disabled={loading}
            size="small"
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <MySubscriptionsTable
          rows={rows}
          onView={handleView}
          onDelete={handleDelete}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
