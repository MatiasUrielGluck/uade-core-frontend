import { useMemo, useState } from 'react';
import {
  Box,
  FormControl,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Toolbar,
  Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MyQueuesTable from "../components/MyQueues/MyQueuesTable.tsx";
import type { QueueRow, QueueStatus } from "../components/MyQueues/MyQueuesRow.tsx";

const MOCK_QUEUES: QueueRow[] = [
  {
    id: 'q1',
    name: 'orders.payment',
    messageCount: 32,
    status: 'Running',
    lastActivity: 'hace 1m',
    health: 92,
    activityRate: 12.4
  },
  {
    id: 'q2',
    name: 'orders.settlement',
    messageCount: 0,
    status: 'Paused',
    lastActivity: 'hace 15m',
    health: 74,
    activityRate: 0
  },
  {
    id: 'q3',
    name: 'md.ticks',
    messageCount: 1342,
    status: 'Running',
    lastActivity: 'hace 5s',
    health: 88,
    activityRate: 560.2
  },
  {
    id: 'q4',
    name: 'alerts.critical',
    messageCount: 3,
    status: 'Degraded',
    lastActivity: 'hace 40s',
    health: 48,
    activityRate: 0.4
  },
  {
    id: 'q5',
    name: 'backfill.replay',
    messageCount: 120,
    status: 'Running',
    lastActivity: 'hace 10s',
    health: 81,
    activityRate: 25.9
  },
  {
    id: 'q6',
    name: 'audit.events',
    messageCount: 0,
    status: 'Running',
    lastActivity: 'hace 2h',
    health: 95,
    activityRate: 0.1
  },
  {
    id: 'q7',
    name: 'orders.risk',
    messageCount: 18,
    status: 'Running',
    lastActivity: 'hace 3m',
    health: 89,
    activityRate: 6.2
  },
  {
    id: 'q8',
    name: 'notifications.email',
    messageCount: 212,
    status: 'Paused',
    lastActivity: 'hace 30m',
    health: 67,
    activityRate: 0
  },
];

export default function MyQueuesPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'ALL' | QueueStatus>('ALL');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MOCK_QUEUES.filter(r => {
      const matchText = !q || r.name.toLowerCase().includes(q);
      const matchStatus = status === 'ALL' || r.status === status;
      return matchText && matchStatus;
    });
  }, [query, status]);

  return (
    <Box>
      <Toolbar sx={{px: 0, mb: 2, gap: 2, flexWrap: 'wrap'}}>
        <Typography variant="h5" sx={{fontWeight: 700, flexGrow: 1}}></Typography>

        <FormControl size="small">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            input={<OutlinedInput/>}
            sx={{minWidth: 160}}
          >
            <MenuItem value="ALL">All statuses</MenuItem>
            <MenuItem value="Running">Running</MenuItem>
            <MenuItem value="Paused">Paused</MenuItem>
            <MenuItem value="Degraded">Degraded</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          placeholder="Search queues…"
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
      </Toolbar>

      <MyQueuesTable
        rows={rows}
        onPause={(r) => console.log('pause', r)}
        onResume={(r) => console.log('resume', r)}
        onPurge={(r) => console.log('purge', r)}
      />
    </Box>
  );
}
