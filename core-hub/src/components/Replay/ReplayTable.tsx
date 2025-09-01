// components/Replay/ReplayTable.tsx
import * as React from "react";
import {
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import StatusChip from "../Common/StatusChip";
import type { MessageStatus } from "../Common/StatusChip";

export type ReplayRow = {
  id: string;
  topic: string;
  timestamp: string;
  error: string;
  status: MessageStatus; // DLQ | FAILED | PENDING | ...
  payload: unknown;
  headers?: Record<string, string>;
};

type Props = {
  rows: ReplayRow[];
  onReplay: (row: ReplayRow) => void;
  onDiscard: (row: ReplayRow) => void;
  onOpenDetail: (row: ReplayRow) => void;
};

export default function ReplayTable({
  rows,
  onReplay,
  onDiscard,
  onOpenDetail,
}: Props) {
  return (
    <TableContainer
      component={Box}
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        overflowX: "auto", // solo la tabla, no toda la página
      }}
    >
      <Table size="small" sx={{ minWidth: 680 }}>
        <TableHead>
          <TableRow
            sx={{
              "& th": {
                fontWeight: 700,
                color: "text.secondary",
                whiteSpace: "nowrap",
              },
            }}
          >
            <TableCell>ID</TableCell>
            <TableCell>Tópico</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Error</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell align="right">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r) => (
            <TableRow
              key={r.id}
              hover
              sx={{
                cursor: "pointer",
                "& td": { borderColor: "divider" },
              }}
              onClick={() => onOpenDetail(r)}
            >
              <TableCell sx={{ whiteSpace: "nowrap" }}>{r.id}</TableCell>
              <TableCell
                title={r.topic}
                sx={{
                  maxWidth: 220,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {r.topic}
              </TableCell>
              <TableCell sx={{ whiteSpace: "nowrap" }}>{r.timestamp}</TableCell>
              <TableCell
                title={r.error}
                sx={{
                  maxWidth: 260,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {r.error}
              </TableCell>
              <TableCell>
                <StatusChip s={r.status} />
              </TableCell>
              <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                <Tooltip title="Replay">
                  <IconButton size="small" onClick={() => onReplay(r)}>
                    <ReplayIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Descartar">
                  <IconButton size="small" onClick={() => onDiscard(r)}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                Sin resultados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

