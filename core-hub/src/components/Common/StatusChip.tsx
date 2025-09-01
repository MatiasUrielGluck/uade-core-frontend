// components/common/StatusChip.tsx
import { Chip } from "@mui/material";

export type MessageStatus = "OK" | "FAILED" | "DLQ" | "REPLAYED" | "PENDING";

export default function StatusChip({ s }: { s: MessageStatus }) {
  const color =
    s === "OK" || s === "REPLAYED"
      ? "success"
      : s === "PENDING"
      ? "warning"
      : s === "DLQ" || s === "FAILED"
      ? "error"
      : "default";

  return (
    <Chip
      size="small"
      color={color}
      label={s}
      variant="outlined"
      sx={{
        minWidth: 80,
        textTransform: "uppercase",
        "& .MuiChip-label": { fontWeight: 700, letterSpacing: 0.25 },
      }}
    />
  );
}
