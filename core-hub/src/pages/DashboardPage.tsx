import { useMemo } from 'react';
import {
  Card, CardContent, Typography, Stack, ButtonGroup, Button,
  Select, MenuItem, FormControlLabel, Switch, Link, Box
} from '@mui/material';
import ReactECharts from 'echarts-for-react';
import Kpi from '../components/Dashboard/KPI';
import ErrorsDonutCard from '../components/Dashboard/ErrorDonutsCard';
import styles from '../styles/DashboardPage.module.css';

/* =======================
   MOCKS (visual-only)
======================= */
const OV = {
  messagesIn: 12050,
  messagesProcessed: 11890,
  successRate: 0.987,
  dlqPending: 31,
};

type Pt = { ts: string; in: number; processed: number; p50: number; p95: number };

function makeSeries(): Pt[] {
  const now = Date.now();
  const pts: Pt[] = [];
  for (let i = 14; i >= 0; i--) {
    const ts = new Date(now - i * 60_000).toISOString();
    const inside = 280 + Math.floor(Math.random() * 80);
    const processed = inside - Math.floor(Math.random() * 12);
    const p50 = 140 + Math.floor(Math.random() * 80);
    const p95 = 520 + Math.floor(Math.random() * 180);
    pts.push({ ts, in: inside, processed, p50, p95 });
  }
  return pts;
}

const ERRORS_BY_MODULE = [
  { module: 'orders', errors: 9 },
  { module: 'billing', errors: 12 },
  { module: 'notifications', errors: 5 },
  { module: 'scheduling', errors: 3 },
];

const QUEUE_DEPTH = [
  { topic: 'orders.created', depth: 42 },
  { topic: 'orders.assigned', depth: 17 },
  { topic: 'billing.invoice.issued', depth: 6 },
  { topic: 'notifications.email', depth: 23 },
];

const DLQ_RECENT = [
  { id: 'MSG-8F21', topic: 'orders.created', at: 'hoy 19:22', error: 'Timeout to billing' },
  { id: 'MSG-8F10', topic: 'notifications.email', at: 'hoy 19:20', error: 'SMTP 550' },
  { id: 'MSG-8EF9', topic: 'orders.assigned', at: 'hoy 19:18', error: 'Schema mismatch' },
];

/* Footer pequeño para charts */
function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'baseline' }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="body2">{value}</Typography>
    </Box>
  );
}

export default function DashboardPage() {
  const series = useMemo(makeSeries, []);
  const ts = series.map(p => new Date(p.ts).toLocaleTimeString());
  const gridCommon = { left: 36, right: 12, top: 20, bottom: 28 };

  // Resúmenes para los footers
  const avgIn   = Math.round(series.reduce((a, p) => a + p.in, 0) / series.length);
  const avgProc = Math.round(series.reduce((a, p) => a + p.processed, 0) / series.length);
  const avgP50  = Math.round(series.reduce((a, p) => a + p.p50, 0) / series.length);
  const avgP95  = Math.round(series.reduce((a, p) => a + p.p95, 0) / series.length);

  /* ========= CHART OPTIONS ========= */

  // ====== Throughput ======
  const throughputOpt = {
    grid: gridCommon,
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
      confine: false,
      axisPointer: { type: 'line', label: { show: false } },
    },
    legend: { show: false },
    xAxis: { type: 'category', data: ts, axisLabel: { hideOverlap: true } },
    yAxis: { type: 'value' },
    series: [
      { name: 'In', type: 'line', areaStyle: {}, data: series.map(p => p.in) },
      { name: 'Processed', type: 'line', areaStyle: {}, data: series.map(p => p.processed) },
    ],
  };

  // ====== Latency ======
  const latencyOpt = {
    grid: gridCommon,
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
      confine: false,
      axisPointer: { type: 'line', label: { show: false } },
    },
    xAxis: { type: 'category', data: ts, axisLabel: { hideOverlap: true } },
    yAxis: { type: 'value', name: 'ms' },
    series: [
      { name: 'p50', type: 'line', data: series.map(p => p.p50) },
      { name: 'p95', type: 'line', data: series.map(p => p.p95) },
    ],
  };

  const errorsByModuleOpt = {
    grid: gridCommon,
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
      axisPointer: { type: 'shadow' },
      formatter: (p: any) => {
        const item = Array.isArray(p) ? p[0] : p;
        return `${item.marker} <b>${item.axisValue}</b><br/>${item.value} errores`;
      },
    },
    xAxis: { type: 'category', data: ERRORS_BY_MODULE.map(m => m.module) },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: ERRORS_BY_MODULE.map(m => m.errors) }],
  };

  const queueDepthOpt = {
    grid: gridCommon,
    tooltip: {
      trigger: 'axis',
      appendToBody: true,
      axisPointer: { type: 'shadow' },
      formatter: (p: any) => {
        const item = Array.isArray(p) ? p[0] : p;
        return `${item.marker} <b>${item.axisValue}</b><br/>${item.value} en cola`;
      },
    },
    yAxis: { type: 'category', data: QUEUE_DEPTH.map(d => d.topic) },
    xAxis: { type: 'value' },
    series: [{ type: 'bar', data: QUEUE_DEPTH.map(d => d.depth) }],
  };

  return (
    <div className={styles.page}>
      <div className={styles.grid}>
        {/* Toolbar */}
        <Card variant="outlined" className={`${styles.card} ${styles.toolbar}`}>
          <CardContent className={styles.cardContent} style={{ paddingBlock: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="h6">Dashboard</Typography>
                <Select size="small" value="15m" disabled>
                  <MenuItem value="15m">Últimos 15m</MenuItem>
                  <MenuItem value="1h">Última hora</MenuItem>
                  <MenuItem value="24h">Últimas 24h</MenuItem>
                </Select>
                <FormControlLabel control={<Switch checked />} label="Auto-refresh" />
              </Stack>
              <ButtonGroup variant="outlined" size="small">
                <Button href="/messages?status=FAILED">Ver fallas</Button>
                <Button href="/messages?status=DLQ">Ver DLQ</Button>
                <Button href="/messages">Abrir Search</Button>
              </ButtonGroup>
            </div>
          </CardContent>
        </Card>

        {/* KPIs columna izquierda */}
        <Card variant="outlined" className={`${styles.card} ${styles.kpi1} ${styles.kpi}`}>
          <CardContent className={styles.cardContent}>
            <Kpi label="Mensajes In" value={OV.messagesIn.toLocaleString()} hint="últimos 15 min" trend={series.map(p => p.in)} />
          </CardContent>
        </Card>
        <Card variant="outlined" className={`${styles.card} ${styles.kpi2} ${styles.kpi}`}>
          <CardContent className={styles.cardContent}>
            <Kpi label="Procesados" value={OV.messagesProcessed.toLocaleString()} hint="últimos 15 min" trend={series.map(p => p.processed)} />
          </CardContent>
        </Card>
        <Card variant="outlined" className={`${styles.card} ${styles.kpi3} ${styles.kpi}`}>
          <CardContent className={styles.cardContent}>
            <Kpi label="Éxito" value={`${Math.round(OV.successRate * 100)}%`} hint="últimos 15 min" />
          </CardContent>
        </Card>
        <Card variant="outlined" className={`${styles.card} ${styles.kpi4} ${styles.kpi}`}>
          <CardContent className={styles.cardContent}>
            <Kpi label="DLQ" value={OV.dlqPending} hint="pendientes de reproceso" />
          </CardContent>
        </Card>

        {/* Fila 2: Throughput + Latencia + Donut (3 columnas, altura media) */}
        <Card
          variant="outlined"
          className={`${styles.card} ${styles.throughput} ${styles.midCard}`}
          sx={{ overflow: 'visible', position: 'relative', zIndex: 1 }}
        >
          <CardContent className={styles.cardContent} sx={{ overflow: 'visible', position: 'relative', zIndex: 1 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Throughput (últimos 15 min)</Typography>
            <ReactECharts className={styles.chart} option={throughputOpt as any} />
            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: 1 }}>
              <Stat label="Prom. in/min" value={avgIn} />
              <Stat label="Prom. proc/min" value={avgProc} />
              <Stat label="Ventana" value="15 min" />
            </Box>
          </CardContent>
        </Card>

        <Card
          variant="outlined"
          className={`${styles.card} ${styles.latency} ${styles.midCard}`}
          sx={{ overflow: 'visible', position: 'relative', zIndex: 1 }}
        >
          <CardContent className={styles.cardContent} sx={{ overflow: 'visible', position: 'relative', zIndex: 1 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Latencia p50 / p95 (ms)</Typography>
            <ReactECharts className={styles.chart} option={latencyOpt as any} />
            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', rowGap: 1 }}>
              <Stat label="p50 prom." value={`${avgP50} ms`} />
              <Stat label="p95 prom." value={`${avgP95} ms`} />
              <Stat label="Ventana" value="15 min" />
            </Box>
          </CardContent>
        </Card>

        <div className={`${styles.donut}`}>
          <ErrorsDonutCard />
        </div>

        {/* Fila 3: Errores por módulo (2 cols) + Queue Depth (1 col) */}
        <Card variant="outlined" className={`${styles.card} ${styles.errors} ${styles.midCard}`}>
          <CardContent className={styles.cardContent} sx={{ overflow: 'visible' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Errores por módulo (15 min)</Typography>
            <ReactECharts className={styles.chart} option={errorsByModuleOpt as any} />
            <Stack direction="row" spacing={2}>
              <Link href="/messages?status=FAILED">Ver fallas</Link>
              <Link href="/messages?status=DLQ">Ver DLQ</Link>
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined" className={`${styles.card} ${styles.depth} ${styles.midCard}`}>
          <CardContent className={styles.cardContent} sx={{ overflow: 'visible' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>Queue Depth por tópico</Typography>
            <ReactECharts className={styles.chart} option={queueDepthOpt as any} />
          </CardContent>
        </Card>

        {/* DLQ recientes (full width) */}
        <Card variant="outlined" className={`${styles.card} ${styles.dlq}`}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>DLQ recientes</Typography>
            <Box component="table" sx={{ width: '100%', borderSpacing: 0 }}>
              <Box component="thead" sx={{ '& th': { textAlign: 'left', padding: '8px 12px', opacity: .8 } }}>
                <tr><th>ID</th><th>Tópico</th><th>Fecha</th><th>Error</th></tr>
              </Box>
              <Box component="tbody" sx={{ '& td': { padding: '8px 12px', borderTop: '1px solid', borderColor: 'divider' } }}>
                {DLQ_RECENT.map(r => (
                  <tr key={r.id}>
                    <td><Link href={`/messages?id=${r.id}&status=DLQ`}>{r.id}</Link></td>
                    <td>{r.topic}</td>
                    <td>{r.at}</td>
                    <td>{r.error}</td>
                  </tr>
                ))}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
