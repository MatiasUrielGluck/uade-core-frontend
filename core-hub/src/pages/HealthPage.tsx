import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Stack,
  Divider,
  useTheme,
} from "@mui/material";
import ReactECharts from "echarts-for-react";
import styles from "../styles/HealthPage.module.css";

// 👇 Tus componentes ya creados
import UptimeCard from "../components/Health/UptimeCard";
import ServicesCard from "../components/Health/ServicesCard";
import ResourceCard from "../components/Health/ResourceCard";
import TitleWithHelp from "../components/Health/TitleWithHelp";

type ConsumerRow = {
  module: string;
  topic: string;
  lag: number;
  last: string;
  status: "OK" | "WARN" | "DOWN";
};

const CONSUMERS: ConsumerRow[] = [
  {
    module: "billing",
    topic: "orders.created",
    lag: 120,
    last: "hace 1m",
    status: "OK",
  },
  {
    module: "scheduler",
    topic: "orders.assigned",
    lag: 35,
    last: "hace 3m",
    status: "OK",
  },
  {
    module: "mailer",
    topic: "notifications.email",
    lag: 420,
    last: "hace 10m",
    status: "WARN",
  },
  {
    module: "analytics",
    topic: "billing.invoice.issued",
    lag: 0,
    last: "hace 5m",
    status: "OK",
  },
  {
    module: "fraud",
    topic: "orders.payment.failed",
    lag: 18,
    last: "hace 2m",
    status: "OK",
  },
];

function StatusChip({ s }: { s: "OK" | "WARN" | "DOWN" }) {
  const color = s === "OK" ? "success" : s === "WARN" ? "warning" : "error";
  return <Chip size="small" color={color} label={s} variant="outlined" />;
}

export default function HealthPage() {
  const theme = useTheme();

  return (
    <div className={styles.page}>
      <div
        className={styles.grid}
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(12, 1fr)",
        }}
      >
        {/* ===== Fila 1 (3 columnas) ===== */}
        <Box sx={{ gridColumn: { xs: "1 / -1", md: "span 6", lg: "span 4" }, minWidth: 0 }}>
          <UptimeCard />
        </Box>

        <Card variant="outlined" sx={{ gridColumn: { xs: "1 / -1", md: "span 6", lg: "span 4" } }}>
          <CardContent sx={{ p: 2 }}>
            <TitleWithHelp
              title="Alertas activas"
              help="Incidentes abiertos ahora, agrupados por severidad (Críticas, Warning, Info). Una alerta activa puede ser degradación o umbral superado; no necesariamente caída total."
            />

            {/* Gráfico más alto */}
            <ReactECharts
              option={
                {
                  grid: { left: 36, right: 12, top: 10, bottom: 40 },
                  xAxis: {
                    type: "category",
                    data: ["Críticas", "Warning", "Info"],
                  },
                  yAxis: { type: "value", splitLine: { show: false } },
                  series: [
                    {
                      type: "bar",
                      data: [
                        { value: 3, itemStyle: { color: "#ef5350" } },
                        { value: 5, itemStyle: { color: "#ffa726" } },
                        { value: 12, itemStyle: { color: "#5c6bc0" } },
                      ],
                      barWidth: 22,
                    },
                  ],
                  tooltip: { trigger: "axis" },
                } as any
              }
              style={{ height: 200, width: "100%", overflow: "visible" }}
              opts={{ renderer: "svg" }}
            />

            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              sx={{ mt: 1, flexWrap: "wrap", justifyContent: "center" }}
            >
              <Chip
                size="small"
                label="Críticas: 3"
                sx={{
                  bgcolor: "transparent",
                  borderColor: "#ef5350",
                  color: "#ef5350",
                }}
                variant="outlined"
              />
              <Chip
                size="small"
                label="Warning: 5"
                sx={{
                  bgcolor: "transparent",
                  borderColor: "#ffa726",
                  color: "#ffa726",
                }}
                variant="outlined"
              />
              <Chip
                size="small"
                label="Info: 12"
                sx={{
                  bgcolor: "transparent",
                  borderColor: "#5c6bc0",
                  color: "#5c6bc0",
                }}
                variant="outlined"
              />
              <Chip size="small" label="Total: 20" variant="outlined" />
            </Stack>
          </CardContent>
        </Card>

        <Box sx={{ gridColumn: { xs: "1 / -1", md: "span 12", lg: "span 4" } }}>
          <ServicesCard />
        </Box>

        {/* ===== Fila 2 (full width) ===== */}
        <Card
          variant="outlined"
          sx={{
            gridColumn: "1 / -1",
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Typography variant="h6" align="center" sx={{ mb: 1 }}>
              Consumidores
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "2fr 4fr 1fr 2fr 1fr",
                px: 1,
                py: 1,
                fontSize: 14,
                color: "text.secondary",
              }}
            >
              <span>Módulo</span>
              <span>Tópico</span>
              <span>Lag</span>
              <span>Última actividad</span>
              <span>Estado</span>
            </Box>
            <Divider />
            <Box>
              {CONSUMERS.map((r) => (
                <Box
                  key={`${r.module}-${r.topic}`}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "2fr 4fr 1fr 2fr 1fr",
                    alignItems: "center",
                    px: 1,
                    py: 1.25,
                    "&:not(:last-of-type)": {
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    },
                    "& > span": {
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    },
                  }}
                >
                  <span title={r.module}>{r.module}</span>
                  <span title={r.topic}>{r.topic}</span>
                  <span>{r.lag}</span>
                  <span>{r.last}</span>
                  <span>
                    <StatusChip s={r.status} />
                  </span>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* ===== Fila 3 (3 KPIs cloud) ===== */}
        <Box sx={{ gridColumn: "span 4" }}>
          <ResourceCard
            title="Error rate"
            value="0.23"
            unit="%"
            series={[0.2, 0.22, 0.19, 0.23]}
          />
        </Box>
        <Box sx={{ gridColumn: "span 4" }}>
          <ResourceCard
            title="p95 latency"
            value="185"
            unit="ms"
            series={[210, 190, 205, 185]}
          />
        </Box>
        <Box sx={{ gridColumn: "span 4" }}>
          <ResourceCard title="RPS" value="312" series={[280, 295, 305, 312]} />
        </Box>
      </div>
    </div>
  );
}
