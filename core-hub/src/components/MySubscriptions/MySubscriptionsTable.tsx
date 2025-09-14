import { alpha, useTheme } from '@mui/material/styles';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import MySubscriptionsRow from './MySubscriptionsRow';
import type { SubscriptionRow } from './MySubscriptionsRow';

type Props = {
  rows: SubscriptionRow[];
  onView?: (row: SubscriptionRow) => void;
  onDelete?: (row: SubscriptionRow) => void;
};

export default function MySubscriptionsTable({rows, onView, onDelete}: Props) {
  const theme = useTheme();

  return (
    <TableContainer
      component={Paper}
      sx={{
        width: '100%',
        overflowX: 'auto',
        bgcolor: theme.palette.mode === 'dark'
          ? alpha(theme.palette.background.paper, 0.6)
          : theme.palette.background.paper,
        borderRadius: 1,
      }}
    >
      <Table
        size="small"
        sx={{
          width: "100%",
          minWidth: {xs: 600, sm: 800, md: 0},
          '& .MuiTableCell-root': {
            borderBottom: 'none',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
        }}
      >
        <TableHead>
          <TableRow sx={{'& th': {fontWeight: 600, opacity: 0.8}}}>
            <TableCell>Subscription ID</TableCell>
            <TableCell>Topic</TableCell>
            <TableCell>Status</TableCell>
            <TableCell sx={{display: {xs: 'none', md: 'table-cell'}}}>Squad</TableCell>
            <TableCell sx={{display: {xs: 'none', lg: 'table-cell'}}}>Webhook URL</TableCell>
            <TableCell sx={{display: {xs: 'none', sm: 'table-cell'}}}>Created</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row, idx) => (
            <MySubscriptionsRow
              key={row.subscriptionId}
              row={row}
              index={idx}
              onView={onView}
              onDelete={onDelete}
            />
          ))}

          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{py: 6, opacity: 0.7}}>
                No subscriptions match your filters
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
