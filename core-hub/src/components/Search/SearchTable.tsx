// components/Search/SearchTable.tsx
import * as React from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Chip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  useMediaQuery,
} from "@mui/material";
import type { Theme } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";

export type MessageStatus = "OK" | "FAILED" | "DLQ";

export type SearchRow = {
  id: string;
  topic: string;
  at: string;
  status: MessageStatus;
  summary: string;
  payload?: unknown;
};

function StatusChip({ s }: { s: MessageStatus }) {
  const color = s === "OK" ? "success" : "error"; // FAILED y DLQ -> error
  return (
    <Chip
      size="small"
      color={color}
      variant="outlined"
      label={s}
      sx={{ minWidth: 56, textTransform: "none" }}
    />
  );
}

export default function SearchTable({ rows }: { rows: SearchRow[] }) {
  const [open, setOpen] = React.useState(false);
  const [current, setCurrent] = React.useState<SearchRow | null>(null);
  const isXs = useMediaQuery((t: Theme) => t.breakpoints.down("sm"));

  const show = (r: SearchRow) => {
    setCurrent(r);
    setOpen(true);
  };
  const close = () => setOpen(false);

  return (
    <>
      <Box
        sx={{
          borderRadius: 2,
          overflow: "hidden",
          border: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        {/* Encabezado */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1.2fr 2fr 1.2fr 1fr 3fr 72px",
            px: 2,
            py: 1,
            bgcolor: (t) => t.palette.action.hover,
            borderBottom: (t) => `1px solid ${t.palette.divider}`,
            "& > span": { fontSize: 13, opacity: 0.75 },
          }}
        >
          <span>ID</span>
          <span>Tópico</span>
          <span>Fecha</span>
          <span>Estado</span>
          <span>Resumen</span>
          <span style={{ textAlign: "right" }}>Acciones</span>
        </Box>

        {/* Filas */}
        {rows.map((r, i) => (
          <Box
            key={r.id}
            sx={{
              display: "grid",
              gridTemplateColumns: "1.2fr 2fr 1.2fr 1fr 3fr 72px",
              alignItems: "center",
              px: 2,
              py: 1.25,
              borderTop: (t) => (i === 0 ? "none" : `1px solid ${t.palette.divider}`),
              "& > span": {
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontSize: 14,
              },
            }}
          >
            <span>{r.id}</span>
            <span title={r.topic}>{r.topic}</span>
            <span>{r.at}</span>
            <span>
              <StatusChip s={r.status} />
            </span>
            <span title={r.summary}>{r.summary}</span>
            <span style={{ textAlign: "right" }}>
              <Tooltip title="Ver payload">
                <IconButton size="small" onClick={() => show(r)}>
                  <VisibilityIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </span>
          </Box>
        ))}
      </Box>

      {/* Dialog (centrado; full-screen en XS) */}
      <Dialog
        open={open}
        onClose={close}
        fullScreen={isXs}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { m: { xs: 0, sm: 2 }, borderRadius: { xs: 0, sm: 2 } },
        }}
      >
        <DialogTitle sx={{ pr: 6 }}>
          <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
            ID: {current?.id}
          </Typography>
          <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
            Tópico: {current?.topic}
          </Typography>
          <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
            Fecha: {current?.at}
          </Typography>

        {/* Botón cerrar */}
          <IconButton
            aria-label="cerrar"
            onClick={close}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent dividers>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Payload
          </Typography>
          <Box
            component="pre"
            sx={{
              m: 0,
              p: 1.5,
              borderRadius: 1,
              bgcolor: (t) => t.palette.background.paper,
              border: (t) => `1px solid ${t.palette.divider}`,
              fontSize: 13,
              overflow: "auto",
              maxHeight: { xs: "calc(100dvh - 200px)", sm: 480 },
            }}
          >
            {JSON.stringify(current?.payload ?? {}, null, 2)}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
