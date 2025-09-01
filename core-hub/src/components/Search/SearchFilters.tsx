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

export type SearchFilters = {
  q: string;
  topic: string;
  status: "ALL" | "OK" | "FAILED" | "DLQ";
  range: "15m" | "1h" | "24h";
};

type Props = {
  value: SearchFilters;
  onChange: (v: SearchFilters) => void;
  onSearch: () => void;
  onReset?: () => void;
};

export default function SearchFilters({ value, onChange, onSearch, onReset }: Props) {
  const set = <K extends keyof SearchFilters>(k: K, v: SearchFilters[K]) =>
    onChange({ ...value, [k]: v });

  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        useFlexGap
        sx={{ alignItems: { sm: "center" } }}
      >
        <TextField
          size="small"
          label="Buscar (id / payload / header)"
          value={value.q}
          onChange={(e) => set("q", e.target.value)}
          sx={{ minWidth: 260, flex: 1 }}
        />

        <FormControl size="small" sx={{ minWidth: 160 }}>
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

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Estado</InputLabel>
          <Select
            label="Estado"
            value={value.status}
            onChange={(e) =>
              set("status", e.target.value as SearchFilters["status"])
            }
          >
            <MenuItem value="ALL">Todos</MenuItem>
            <MenuItem value="OK">OK</MenuItem>
            <MenuItem value="FAILED">FAILED</MenuItem>
            <MenuItem value="DLQ">DLQ</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Rango</InputLabel>
          <Select
            label="Rango"
            value={value.range}
            onChange={(e) =>
              set("range", e.target.value as SearchFilters["range"])
            }
          >
            <MenuItem value="15m">15m</MenuItem>
            <MenuItem value="1h">1h</MenuItem>
            <MenuItem value="24h">24h</MenuItem>
          </Select>
        </FormControl>

        <Stack direction="row" spacing={1}>
          <Button variant="outlined" size="small" onClick={onSearch}>
            Buscar
          </Button>
          <Button variant="text" size="small" onClick={onReset}>
            Limpiar
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
