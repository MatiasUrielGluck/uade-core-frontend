import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import SearchTable from "../components/Search/SearchTable";
import type { SearchRow } from "../components/Search/SearchTable";

type Filters = {
  q: string;
  topic: string | "ALL";
  status: "ALL" | "OK" | "FAILED" | "DLQ";
  range: "15m" | "1h" | "24h";
};

const MOCK_ROWS: SearchRow[] = [
  {
    id: "MSG-7A11",
    topic: "orders.created",
    at: "hoy 18:54",
    status: "OK",
    summary: "Nuevo pedido #71322 por $42.50",
    payload: { orderId: 71322, total: 42.5 },
  },
  {
    id: "MSG-7A12",
    topic: "notifications.email",
    at: "hoy 18:49",
    status: "FAILED",
    summary: "SMTP 550 al enviar a user@example.com",
    payload: { rcpt: "user@example.com" },
  },
  {
    id: "MSG-7A13",
    topic: "orders.assigned",
    at: "hoy 18:44",
    status: "DLQ",
    summary: "Schema mismatch v3",
    payload: { reason: "schema" },
  },
];

export default function SearchPage() {
  const [filters, setFilters] = useState<Filters>({
    q: "",
    topic: "ALL",
    status: "ALL",
    range: "15m",
  });

  const rows = useMemo(() => {
    return MOCK_ROWS.filter((r) => {
      if (filters.topic !== "ALL" && r.topic !== filters.topic) return false;
      if (filters.status !== "ALL" && r.status !== filters.status) return false;
      if (filters.q) {
        const q = filters.q.toLowerCase();
        const hit = [r.id, r.topic, r.summary]
          .some((v) => v.toLowerCase().includes(q));
        if (!hit) return false;
      }
      return true;
    });
  }, [filters]);

  return (
    <Box sx={{ p: 2, width: "100%" }}>
      <Box sx={{ maxWidth: 1100, mx: "auto", width: "100%" }}>
        {/* ===== Toolbar ===== */}
        <Card variant="outlined" sx={{ mb: 2 }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1.5 }}>
              Search
            </Typography>

            {/* Grid responsive de controles */}
            <Box
              sx={{
                display: "grid",
                gap: 1.5,
                alignItems: "center",
                gridTemplateColumns: {
                  xs: "1fr",                   // móvil (stack)
                  sm: "1fr 1fr",               // 2 columnas
                  md: "2fr 1fr 1fr 1fr auto auto", // desktop
                },
              }}
            >
              <TextField
                fullWidth
                size="small"
                placeholder="Buscar (id / payload / header)"
                value={filters.q}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, q: e.target.value }))
                }
              />

              <FormControl fullWidth size="small">
                <InputLabel>Tópico</InputLabel>
                <Select
                  label="Tópico"
                  value={filters.topic}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      topic: e.target.value as Filters["topic"],
                    }))
                  }
                >
                  <MenuItem value="ALL">Todos</MenuItem>
                  <MenuItem value="orders.created">orders.created</MenuItem>
                  <MenuItem value="orders.assigned">orders.assigned</MenuItem>
                  <MenuItem value="notifications.email">
                    notifications.email
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Estado</InputLabel>
                <Select
                  label="Estado"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      status: e.target.value as Filters["status"],
                    }))
                  }
                >
                  <MenuItem value="ALL">Todos</MenuItem>
                  <MenuItem value="OK">OK</MenuItem>
                  <MenuItem value="FAILED">FAILED</MenuItem>
                  <MenuItem value="DLQ">DLQ</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Rango</InputLabel>
                <Select
                  label="Rango"
                  value={filters.range}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      range: e.target.value as Filters["range"],
                    }))
                  }
                >
                  <MenuItem value="15m">15m</MenuItem>
                  <MenuItem value="1h">1h</MenuItem>
                  <MenuItem value="24h">24h</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                size="small"
                onClick={() => {/* ejecutar búsqueda real aquí */}}
                sx={{ width: { xs: "100%", md: "auto" } }}
              >
                Buscar
              </Button>

              <Button
                variant="text"
                size="small"
                onClick={() =>
                  setFilters({ q: "", topic: "ALL", status: "ALL", range: "15m" })
                }
                sx={{ width: { xs: "100%", md: "auto" } }}
              >
                Limpiar
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* ===== Resultados ===== */}
        <Card variant="outlined">
          <CardContent sx={{ p: 2 }}>
            <Typography variant="h6" align="center" sx={{ mb: 1 }}>
              Resultados
            </Typography>
            <SearchTable rows={rows} />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
