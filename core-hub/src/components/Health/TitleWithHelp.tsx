import { Stack, Typography, Tooltip, IconButton } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function TitleWithHelp({
  title,
  help,
}: {
  title: string;
  help: string;
}) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Typography variant="h6">{title}</Typography>
      <Tooltip
        title={help}
        arrow
        enterTouchDelay={0}
        leaveDelay={200}
      >
        <IconButton
          size="small"
          aria-label={`ayuda sobre ${title}`}
          sx={{ ml: -0.5 }}
        >
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
