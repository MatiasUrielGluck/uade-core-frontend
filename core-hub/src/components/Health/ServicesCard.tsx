// components/Health/ServicesCard.tsx
import * as React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  Chip,
  Tooltip,
  useMediaQuery,
  Theme,
} from "@mui/material";

type ServiceStatus = "OK" | "DELAYED" | "DOWN";
export type ServiceItem = {
  id: string;
  name: string;
  status?: ServiceStatus;
  latencyMs?: number | null; // sólo para inferencia si no llega status
};

type Props = {
  title?: string;
  items?: ServiceItem[];
  onRowClick?: (item: ServiceItem) => void;
  clampLines?: 2 | 3 | 0; // 0 = sin clamp (wrap libre)
};

/* ---------- helpers ---------- */
function inferStatus(latencyMs?: number | null): ServiceStatus {
  if (latencyMs == null) return "OK";
  if (latencyMs >= 1000) return "DOWN";
  if (latencyMs >= 120) return "DELAYED";
  return "OK";
}
function statusColor(s: ServiceStatus) {
  switch (s) {
    case "OK":
      return "success";
    case "DELAYED":
      return "warning";
    case "DOWN":
      return "error";
    default:
      return "default";
  }
}

/* ---------- constants (alineación & estilo) ---------- */
const CHIP_MIN_WIDTH = 72;      // para que no “salte”
const CHIP_BORDER_WIDTH = 1;    // entero → evita medias posiciones
const CHIP_LABEL_PX = 1;        // 1 = 8px padding interno del texto
const CARD_RADIUS_PX = 1;      // radio suave igual al resto de tus cards

const MOCK: ServiceItem[] = [
  { id: "1", name: "orders-service", status: "OK" },
  { id: "2", name: "billing-api", latencyMs: 142 },
  { id: "3", name: "auth-gateway", latencyMs: 1140 },
  { id: "4", name: "inventory-svc - region/eu-west-1", status: "OK" },
  { id: "5", name: "notifications", status: "DELAYED" },
];

export default function ServicesCard({
  title = "Servicios",
  items = MOCK,
  onRowClick,
  clampLines = 2,
}: Props) {
  const isDesktop = useMediaQuery((t: Theme) => t.breakpoints.up("lg"));
  const isTablet = useMediaQuery((t: Theme) => t.breakpoints.between("md", "lg"));
  const isMobile = !isDesktop && !isTablet;

  // Col derecha fija; izquierda flexible
  const rightColDesktop = 108; // px
  const rightColTablet = 100;  // px
  const templateDesktop = `minmax(0, 1fr) ${rightColDesktop}px`;
  const templateTablet = `minmax(0, 1fr) ${rightColTablet}px`;

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: CARD_RADIUS_PX, // 👈 radio controlado, no óvalo
      }}
    >
      <CardContent sx={{ pt: 1.5, pr: 2, pb: 1, pl: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.2 }}>
          {title}
        </Typography>
      </CardContent>

      {/* Header (solo md+) */}
      {!isMobile && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: isDesktop ? templateDesktop : templateTablet,
            alignItems: "center",
            gap: 1,
            px: 1, pr: 2, py: 0.75,          // mismos paddings que el body
            borderTop: (t) => `1px solid ${t.palette.divider}`,
            borderBottom: (t) => `1px solid ${t.palette.divider}`,
            backgroundColor: (t) => t.palette.action.hover,
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", opacity: 0.7 }}>
            Servicio
          </Typography>

          {/* 👇 “Ghost chip” para replicar el offset del texto del chip real */}
          <Chip
            label={
              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase", opacity: 0.7 }}>
                Estado
              </Typography>
            }
            size="small"
            variant="outlined"
            sx={{
              justifySelf: "start",
              // que ocupe como el chip real pero sin ruido visual
              minWidth: CHIP_MIN_WIDTH,
              px: 0,
              borderWidth: 0,
              borderColor: "transparent",
              backgroundColor: "transparent",
              pointerEvents: "none",
              "& .MuiChip-label": {
                px: CHIP_LABEL_PX, // 👈 mismo padding que los chips de la columna
              },
            }}
          />
        </Box>
      )}

      {/* Body */}
      <Box sx={{ flex: 1, overflow: "hidden" }}>
        {items.map((item, idx) => {
          const status: ServiceStatus = item.status ?? inferStatus(item.latencyMs);
          const clickable = typeof onRowClick === "function";

          return (
            <Box
              key={item.id}
              onClick={clickable ? () => onRowClick!(item) : undefined}
              sx={{
                display: { xs: "block", md: "grid" },
                gridTemplateColumns: { md: isDesktop ? templateDesktop : templateTablet },
                alignItems: { xs: "stretch", md: "center" },
                columnGap: { xs: 1, md: 1 },
                rowGap: { xs: 0.5, md: 0 },
                px: 1, pr: 2, py: { xs: 1, md: 0.9 },
                cursor: clickable ? "pointer" : "default",
                backgroundColor: (t) => (idx % 2 ? t.palette.action.hover : "transparent"),
                borderBottom: (t) => (idx < items.length - 1 ? `1px dashed ${t.palette.divider}` : "none"),
                transition: "background-color 120ms ease",
                "&:hover": clickable ? { backgroundColor: (t) => t.palette.action.selected } : undefined,
              }}
            >
              {/* Servicio (wrap/clamp) */}
              <Tooltip title={item.name} enterDelay={600}>
                <Typography
                  variant="body2"
                  sx={{
                    minWidth: 0,
                    overflowWrap: "anywhere",
                    wordBreak: "break-word",
                    whiteSpace: "normal",
                    lineHeight: 1.35,
                    display: clampLines ? "-webkit-box" : "block",
                    WebkitLineClamp: clampLines || "unset",
                    WebkitBoxOrient: clampLines ? "vertical" : undefined,
                    ...(clampLines ? { overflow: "hidden" } : null),
                    fontWeight: 500,
                  }}
                >
                  {item.name}
                </Typography>
              </Tooltip>

              {/* Estado (chip real) */}
              {isMobile ? (
                <Box sx={{ display: "flex", mt: 0.5 }}>
                  <Chip
                    label={status}
                    variant="outlined"
                    color={statusColor(status) as any}
                    size="small"
                    sx={{
                      ml: "auto",
                      minWidth: CHIP_MIN_WIDTH,
                      px: 0,
                      borderWidth: CHIP_BORDER_WIDTH,
                      "& .MuiChip-label": { px: CHIP_LABEL_PX, fontWeight: 700, letterSpacing: 0.2 },
                    }}
                  />
                </Box>
              ) : (
                <Chip
                  label={status}
                  variant="outlined"
                  color={statusColor(status) as any}
                  size="small"
                  sx={{
                    justifySelf: "start",
                    alignSelf: "center",
                    minWidth: CHIP_MIN_WIDTH,
                    px: 0,
                    borderWidth: CHIP_BORDER_WIDTH,
                    "& .MuiChip-label": { px: CHIP_LABEL_PX, fontWeight: 700, letterSpacing: 0.2 },
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>
    </Card>
  );
}
