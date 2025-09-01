// ResourceCard.tsx
import { Card, CardContent, Typography, Box } from '@mui/material';
import ReactECharts from 'echarts-for-react';

function CloudKpi({ title, value, unit, series }: { title: string; value: string; unit?: string; series: number[] }) {
  const opt = { 
    xAxis: { show: false, type: 'category', data: series.map((_, i) => i) },
    yAxis: { show: false },
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    series: [{ type: 'line', data: series, areaStyle: {}, symbol: 'none' }],
  };

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
        <Typography variant="h5" sx={{ mb: 1 }}>
          {value}{unit ? ` ${unit}` : ''}
        </Typography>
        <Box sx={{ height: 36 }}>
          <ReactECharts
            option={opt as any}
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'svg' }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

// 👇 agregamos default export
export default CloudKpi;
