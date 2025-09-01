// components/Replay/ReplayFilters.tsx
import * as React from "react";
import {
  Box,
  Stack,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
} from "@mui/material";

export type ReplayFilters = {
  topic: string;
  status: "DLQ" | "FAILED" | "PENDING" | "ALL";
  q: string;
  range: "15m" | "1h" | "24h";
};

type Props = {
  value: ReplayFilters;
  onChange: (v: ReplayFilters) => void;
  onApply: () => void;
};

export default function ReplayFilters({ value, onChange, onApply }: Props) {
  const set = <K extends keyof ReplayFilters>(k: K, v: ReplayFilters[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        useFlexGap
        sx={{ alignItems: { sm: "center" } }}
      >
        <FormControl size="small" sx={{ minWidth: 160, flex: 1 }}>
          <InputLabel>Tópico</InputLabel>
          <Select
            label="Tópico"
            value={value.topic}
            onChange={(e) => set("topic", e.target.value)}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="orders.created">orders.created</MenuItem>
            <MenuItem value="orders.assigned">orders.assigned</MenuItem>
            <MenuItem value="notifications.email">notifications.email</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Estado</InputLabel>
          <Select
            label="Estado"
            value={value.status}
            onChange={(e) =>
              set("status", e.target.value as ReplayFilters["status"])
            }
          >
            <MenuItem value="ALL">Todos</MenuItem>
            <MenuItem value="DLQ">DLQ</MenuItem>
            <MenuItem value="FAILED">FAILED</MenuItem>
            <MenuItem value="PENDING">PENDIENTE</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Rango</InputLabel>
          <Select
            label="Rango"
            value={value.range}
            onChange={(e) =>
              set("range", e.target.value as ReplayFilters["range"])
            }
          >
            <MenuItem value="15m">15m</MenuItem>
            <MenuItem value="1h">1h</MenuItem>
            <MenuItem value="24h">24h</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Buscar (id / error)"
          value={value.q}
          onChange={(e) => set("q", e.target.value)}
          sx={{ flex: 1, minWidth: 220 }}
        />

        <Button variant="outlined" size="small" onClick={onApply}>
          Aplicar
        </Button>
      </Stack>
    </Box>
  );
}
