import { Card, CardContent, Typography, Box, useTheme } from "@mui/material";
import ReactECharts from "echarts-for-react";

type Slice = { name: string; value: number };

const DEFAULT_DATA: Slice[] = [
  { value: 12, name: "Timeouts" },
  { value: 8,  name: "Schema mismatch" },
  { value: 5,  name: "SMTP 5xx" },
  { value: 4,  name: "Otros" },
];

export default function ErrorsDonutCard({
  data = DEFAULT_DATA,
  windowLabel = "últimos 15 min",
  title = "Errores recientes",
}: {
  data?: Slice[];
  windowLabel?: string;
  title?: string;
}) {
  const theme = useTheme();
  const total = data.reduce((a, b) => a + b.value, 0);

  const colors = ["#5B8FF9", "#9254DE", "#F6BD16", "#F2637B"];

  const option = {
    color: colors,
    tooltip: {
      trigger: "item",
      appendToBody: true, // evita recortes
      formatter: (p: any) =>
        `${p.marker} <b>${p.name}</b><br/>${p.value} errores · ${p.percent}%`,
      borderWidth: 0,
      padding: 8,
    },
    legend: { show: false }, // 🔕 sin leyenda
    series: [
      {
        type: "pie",
        radius: ["60%", "84%"],     // donut grande
        center: ["50%", "44%"],     // deja espacio para el número abajo
        label: { show: false },
        labelLine: { show: false },
        itemStyle: {
          borderWidth: 2,
          borderColor:
            theme.palette.mode === "light"
              ? "rgba(0,0,0,0.06)"
              : "rgba(255,255,255,0.08)",
          shadowBlur: 8,
          shadowColor:
            theme.palette.mode === "light"
              ? "rgba(0,0,0,0.08)"
              : "rgba(0,0,0,0.35)",
        },
        emphasis: { scale: true, scaleSize: 4 },
        data,
      },
    ],
    media: [
      {
        query: { maxWidth: 420 },
        option: {
          series: [{ radius: ["56%", "78%"], center: ["50%", "42%"] }],
        },
      },
    ],
  };

  return (
    <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "visible", // tooltip fuera de la card
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>{title}</Typography>

        {/* subí el alto si querés aún más grande: 280, 300… */}
        <ReactECharts option={option as any} notMerge lazyUpdate style={{ height: 260 }} />

        {/* número total debajo del donut */}
        <Box sx={{ textAlign: "center", mt: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1 }}>
            {total}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            errores ({windowLabel})
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
