import {
  Chip,
  IconButton,
  LinearProgress,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import PauseRounded from '@mui/icons-material/PauseRounded';
import DeleteForeverRounded from '@mui/icons-material/DeleteForeverRounded';

export type QueueStatus = 'Running' | 'Paused' | 'Degraded';

export type QueueRow = {
  id: string;
  name: string;
  messageCount: number;
  status: QueueStatus;
  lastActivity: string;
  health: number;
  activityRate: number;
};

function statusColor(status: QueueStatus) {
  return status === 'Running'
    ? 'success'
    : status === 'Paused'
    ? 'default'
    : 'warning';
}

// ✅ Tipamos con Theme y usamos la palette que ya trae success/warning/error
function healthColor(theme: Theme, v: number) {
  const { palette } = theme;
  if (v >= 85) return palette.success.main;
  if (v >= 60) return palette.warning.main;
  return palette.error.main;
}

type Props = {
  row: QueueRow;
  index: number;
  onPause?: (row: QueueRow) => void;
  onResume?: (row: QueueRow) => void;
  onPurge?: (row: QueueRow) => void;
};

export default function MyQueuesRow({
  row,
  index,
  onPause,
  onResume,
  onPurge,
}: Props) {
  const theme = useTheme();

  return (
    <TableRow
      hover
      sx={{
        transition: 'transform .15s ease, background-color .15s ease',
        borderRadius: 2,
        backgroundColor:
          index % 2 === 0
            ? alpha(theme.palette.text.primary, 0.02)
            : 'transparent',
        '&:hover': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.mode === 'dark' ? 0.08 : 0.06
          ),
          transform: 'translateY(-1px)',
        },
      }}
    >
      <TableCell>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography fontWeight={600}>{row.name}</Typography>
          <Tooltip title={`Throughput: ${row.activityRate} msgs/s`} arrow>
            <InfoOutlined sx={{ fontSize: 16, opacity: 0.6 }} />
          </Tooltip>
        </Stack>
      </TableCell>

      <TableCell align="right">
        <Typography fontWeight={600}>
          {row.messageCount.toLocaleString()}
        </Typography>
      </TableCell>

      <TableCell>
        <Chip
          label={row.status}
          size="small"
          color={statusColor(row.status) as any}
          variant={row.status === 'Paused' ? 'outlined' : 'filled'}
          sx={{ fontWeight: 600 }}
        />
      </TableCell>

      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          {row.lastActivity}
        </Typography>
      </TableCell>

      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
        <Stack spacing={0.5}>
          <LinearProgress
            variant="determinate"
            value={row.health}
            sx={{
              height: 8,
              borderRadius: 6,
              bgcolor: alpha(theme.palette.text.primary, 0.1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 6,
                backgroundColor: healthColor(theme, row.health), // 👈 aquí
              },
            }}
          />
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            {row.health}%
          </Typography>
        </Stack>
      </TableCell>

      <TableCell align="right">
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          {row.status !== 'Running' ? (
            <Tooltip title="Resume" arrow>
              <IconButton size="small" onClick={() => onResume?.(row)}>
                <PlayArrowRounded />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Pause" arrow>
              <IconButton size="small" onClick={() => onPause?.(row)}>
                <PauseRounded />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Purge" arrow>
            <IconButton
              size="small"
              color="error"
              onClick={() => onPurge?.(row)}
            >
              <DeleteForeverRounded />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
