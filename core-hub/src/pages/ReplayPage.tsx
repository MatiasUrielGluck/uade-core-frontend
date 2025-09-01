import * as React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import ReplayFilters from "../components/Replay/ReplayFilters";
import type { ReplayFilters as Filters } from "../components/Replay/ReplayFilters";
import ReplayTable from "../components/Replay/ReplayTable";
import type { ReplayRow } from "../components/Replay/ReplayTable";
import MessageDetailDrawer from "../components/Common/MessageDetailDrawer";

const MOCK: ReplayRow[] = [
  {
    id: "MSG-8F21",
    topic: "orders.created",
    timestamp: "hoy 19:22",
    error: "Timeout to billing",
    status: "DLQ",
    payload: { orderId: 123, total: 42.5 },
  },
  {
    id: "MSG-8F10",
    topic: "notifications.email",
    timestamp: "hoy 19:20",
    error: "SMTP 550",
    status: "FAILED",
    payload: { to: "user@example.com" },
  },
  {
    id: "MSG-8EF9",
    topic: "orders.assigned",
    timestamp: "hoy 19:18",
    error: "Schema mismatch",
    status: "DLQ",
    payload: { assign: true },
  },
];

export default function ReplayPage() {
  const [filters, setFilters] = React.useState<Filters>({
    topic: "",
    status: "ALL",
    q: "",
    range: "15m",
  });

  const [rows, setRows] = React.useState<ReplayRow[]>(MOCK);
  const [detail, setDetail] = React.useState<ReplayRow | null>(null);
  const [toast, setToast] = React.useState<{
    open: boolean;
    msg: string;
    type: "success" | "info" | "error";
  }>({ open: false, msg: "", type: "success" });

  const apply = () => {
    const lower = filters.q.toLowerCase();
    const filtered = MOCK.filter((r) => {
      const byTopic = !filters.topic || r.topic === filters.topic;
      const byStatus =
        filters.status === "ALL" ? true : r.status === filters.status;
      const byQ =
        !lower ||
        r.id.toLowerCase().includes(lower) ||
        r.error.toLowerCase().includes(lower);
      return byTopic && byStatus && byQ;
    });
    setRows(filtered);
  };

  const onReplay = (r: ReplayRow) => {
    setToast({ open: true, msg: `Reenviado ${r.id}`, type: "success" });
  };

  const onDiscard = (r: ReplayRow) => {
    setToast({ open: true, msg: `Descartado ${r.id}`, type: "info" });
  };

  return (
    <Box sx={{ p: { xs: 1.5, md: 2 }, display: "grid", gap: 2 }}>
      {/* ===== Toolbar / Filtros ===== */}
      <Card variant="outlined">
        <CardContent sx={{ p: 2 }}>
          <Box
            sx={{
              display: "grid",
              gap: 1.5,
              alignItems: "center",
              gridTemplateColumns: {
                xs: "1fr",          // título arriba, filtros abajo
                md: "auto 1fr",     // título a la izquierda, filtros a la derecha
              },
              "& .filters-wrap": {
                width: "100%",
              },
            }}
          >
            <Typography variant="h6">Replay</Typography>

            {/* Aseguramos que los controles internos ocupen todo el ancho */}
            <Box className="filters-wrap">
              <ReplayFilters value={filters} onChange={setFilters} onApply={apply} />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* ===== Tabla ===== */}
      <Card variant="outlined">
        <CardContent sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Mensajes en DLQ / fallidos
          </Typography>
          <ReplayTable
            rows={rows}
            onReplay={onReplay}
            onDiscard={onDiscard}
            onOpenDetail={setDetail}
          />
        </CardContent>
      </Card>

      {/* ===== Detalle (drawer) ===== */}
      <MessageDetailDrawer
        open={!!detail}
        onClose={() => setDetail(null)}
        message={
          detail && {
            id: detail.id,
            topic: detail.topic,
            timestamp: detail.timestamp,
            status: detail.status,
            error: detail.error,
            payload: detail.payload,
            headers: detail.headers,
          }
        }
      />

      {/* ===== Toast ===== */}
      <Snackbar
        open={toast.open}
        autoHideDuration={2200}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toast.type} variant="filled" sx={{ width: "100%" }}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
