import { Card, CardContent, Typography, Stack, Chip, Box } from '@mui/material';
import ReactECharts from 'echarts-for-react';
import TitleWithHelp from './TitleWithHelp';


function donutOption(value: number) {
  return {
    tooltip: { trigger: 'item' },
    series: [
      {
        type: 'pie',
        radius: ['64%', '86%'],
        avoidLabelOverlap: true,
        label: { show: false },
        labelLine: { show: false },
        data: [
          { value, name: 'up' },
          { value: Math.max(0, 100 - value), name: 'down' },
        ],
        color: ['#1e88e5', '#e6eef7'],
      },
    ],
  };
}

export default function UptimeCard() {
  const uptime = 99.982;

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 2 }}>
        <TitleWithHelp
  title="Uptime"
  help="Porcentaje de tiempo dentro de SLOs en los últimos 30 días. Se calcula con checks/SLIs (availability, errores 5xx, timeouts, etc.). No refleja incidentes en curso; para eso mirá 'Alertas activas'."
/>


        {/* Donut */}
        <Box sx={{ height: 170, mb: 1 }}>
          <ReactECharts
            option={donutOption(uptime)}
            style={{ height: '100%', width: '100%', overflow: 'visible' }}
            opts={{ renderer: 'svg' }}
          />
        </Box>

        {/* Número grande */}
        <Typography variant="h3" fontWeight={700} sx={{ textAlign: 'center', lineHeight: 1, mb: 1 }}>
          {uptime.toFixed(3)}%
        </Typography>

        {/* Badges alineados abajo */}
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{ flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <Chip size="small" label="Críticas: 3" color="error" variant="outlined" />
          <Chip size="small" label="Warning: 5" color="warning" variant="outlined" />
          <Chip size="small" label="Info: 12" variant="outlined" />
          <Chip size="small" label="Total: 20" variant="outlined" />
        </Stack>
      </CardContent>
    </Card>
  );
}
