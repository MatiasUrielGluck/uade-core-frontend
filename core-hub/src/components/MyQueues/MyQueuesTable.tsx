import { alpha, useTheme } from '@mui/material/styles';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import MyQueuesRow, { QueueRow } from './MyQueuesRow';

type Props = {
  rows: QueueRow[];
  onPause?: (row: QueueRow) => void;
  onResume?: (row: QueueRow) => void;
  onPurge?: (row: QueueRow) => void;
};

export default function MyQueuesTable({rows, onPause, onResume, onPurge}: Props) {
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
          minWidth: {xs: 520, sm: 680, md: 0},
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
            <TableCell>Queue name</TableCell>
            <TableCell align="right">Messages</TableCell>
            <TableCell>Status</TableCell>
            <TableCell sx={{display: {xs: 'none', md: 'table-cell'}}}>Last activity</TableCell>
            <TableCell sx={{display: {xs: 'none', sm: 'table-cell'}}}>Health</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row, idx) => (
            <MyQueuesRow
              key={row.id}
              row={row}
              index={idx}
              onPause={onPause}
              onResume={onResume}
              onPurge={onPurge}
            />
          ))}

          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{py: 6, opacity: 0.7}}>
                No queues match your filters
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
