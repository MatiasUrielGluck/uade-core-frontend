// components/common/MessageDetailDrawer.tsx
import * as React from "react";
import {
  Drawer,
  Box,
  Typography,
  Divider,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

type Props = {
  open: boolean;
  onClose: () => void;
  message: {
    id: string;
    topic: string;
    timestamp: string;
    status: string;
    error?: string | null;
    payload: unknown;
    headers?: Record<string, string>;
  } | null;
};

export default function MessageDetailDrawer({ open, onClose, message }: Props) {
  const json = React.useMemo(
    () => (message ? JSON.stringify(message.payload, null, 2) : ""),
    [message]
  );

  const copy = (txt: string) => {
    navigator.clipboard?.writeText(txt).catch(() => {});
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: { xs: "90vw", sm: 520 },
          p: 2,
          display: "grid",
          gap: 1,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Detalle del mensaje</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>

        {message && (
          <>
            <Typography variant="body2" color="text.secondary">
              <b>ID:</b> {message.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <b>Tópico:</b> {message.topic}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <b>Fecha:</b> {message.timestamp}
            </Typography>
            {message.error && (
              <Typography variant="body2" color="error">
                <b>Error:</b> {message.error}
              </Typography>
            )}
            <Divider sx={{ my: 1 }} />

            {!!message.headers && (
              <>
                <Typography variant="subtitle2">Headers</Typography>
                <Box
                  component="pre"
                  sx={{
                    p: 1,
                    bgcolor: "action.hover",
                    borderRadius: 1,
                    overflow: "auto",
                    maxHeight: 160,
                  }}
                >
                  {JSON.stringify(message.headers, null, 2)}
                </Box>
              </>
            )}

            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
              <Typography variant="subtitle2" sx={{ flex: 1 }}>
                Payload
              </Typography>
              <Tooltip title="Copiar JSON">
                <IconButton size="small" onClick={() => copy(json)}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
            <Box
              component="pre"
              sx={{
                p: 1,
                bgcolor: "action.hover",
                borderRadius: 1,
                overflow: "auto",
                maxHeight: "48vh",
                mb: 1,
              }}
            >
              {json}
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
}
