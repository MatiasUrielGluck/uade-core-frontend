import { Card, CardContent, Typography, Box } from '@mui/material';
import ReactECharts from 'echarts-for-react';

function Sparkline({ data }: { data: number[] }) {
  const option = {
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    xAxis: { type: 'category', show: false, data: data.map((_, i) => i) },
    yAxis: { type: 'value', show: false },
    series: [{ type: 'line', data, smooth: true, symbol: 'none', areaStyle: {} }],
  };
  return <ReactECharts style={{ height: 42 }} option={option as any} />;
}

export default function Kpi({
  label,
  value,
  hint,
  trend,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  trend?: number[];
}) {
  return (
    <Card variant="outlined" sx={{ height: 150, display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ pb: 0.5 }}>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography variant="h4" sx={{ mt: 0.5 }}>{value}</Typography>
        {hint && <Typography variant="caption" color="text.secondary">{hint}</Typography>}
      </CardContent>
      {trend && (
        <Box sx={{ px: 1.5, pb: 1 }}>
          <Sparkline data={trend} />
        </Box>
      )}
    </Card>
  );
}
