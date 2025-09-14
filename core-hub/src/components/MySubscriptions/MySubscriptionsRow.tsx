import {
  Chip,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import VisibilityRounded from '@mui/icons-material/VisibilityRounded';
import DeleteForeverRounded from '@mui/icons-material/DeleteForeverRounded';
import ContentCopyRounded from '@mui/icons-material/ContentCopyRounded';

export type SubscriptionStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

export type SubscriptionRow = {
  subscriptionId: string;
  webhookUrl: string;
  squadName: string;
  topic: string;
  eventName: string;
  status: SubscriptionStatus;
  createdAt: string;
  message: string;
};

function statusColor(status: SubscriptionStatus) {
  return status === 'ACTIVE'
    ? 'success'
    : status === 'INACTIVE'
    ? 'default'
    : 'warning';
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'hace un momento';
  if (diffInMinutes < 60) return `hace ${diffInMinutes}m`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `hace ${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `hace ${diffInDays}d`;
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}

type Props = {
  row: SubscriptionRow;
  index: number;
  onView?: (row: SubscriptionRow) => void;
  onDelete?: (row: SubscriptionRow) => void;
};

export default function MySubscriptionsRow({
  row,
  index,
  onView,
  onDelete,
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
          <Typography fontWeight={600} sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
            {row.subscriptionId.slice(0, 8)}...
          </Typography>
          <Tooltip title={`ID completo: ${row.subscriptionId}`} arrow>
            <IconButton 
              size="small" 
              onClick={() => copyToClipboard(row.subscriptionId)}
              sx={{ p: 0.5 }}
            >
              <ContentCopyRounded sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>

      <TableCell>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography fontWeight={600} sx={{ fontSize: '0.9rem' }}>
            {row.topic}
          </Typography>
          <Tooltip title={`Evento: ${row.eventName}`} arrow>
            <InfoOutlined sx={{ fontSize: 16, opacity: 0.6 }} />
          </Tooltip>
        </Stack>
      </TableCell>

      <TableCell>
        <Chip
          label={row.status}
          size="small"
          color={statusColor(row.status) as any}
          variant={row.status === 'INACTIVE' ? 'outlined' : 'filled'}
          sx={{ fontWeight: 600 }}
        />
      </TableCell>

      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
        <Typography variant="body2" sx={{ opacity: 0.8, fontFamily: 'monospace', fontSize: '0.8rem' }}>
          {row.squadName}
        </Typography>
      </TableCell>

      <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
        <Typography variant="body2" sx={{ opacity: 0.8, fontFamily: 'monospace', fontSize: '0.8rem' }}>
          {row.webhookUrl}
        </Typography>
      </TableCell>

      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          {formatDate(row.createdAt)}
        </Typography>
      </TableCell>

      <TableCell align="right">
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Tooltip title="Ver detalles" arrow>
            <IconButton size="small" onClick={() => onView?.(row)}>
              <VisibilityRounded />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar" arrow>
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete?.(row)}
            >
              <DeleteForeverRounded />
            </IconButton>
          </Tooltip>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
