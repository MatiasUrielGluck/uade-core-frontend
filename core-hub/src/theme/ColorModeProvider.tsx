import { createTheme, CssBaseline, type PaletteMode, ThemeProvider } from '@mui/material'
import { createContext, useMemo, useState } from "react";

export const ColorModeContext = createContext<{ mode: PaletteMode; toggleColorMode: () => void }>(
  {
    mode: 'light', toggleColorMode: () => {
    }
  }
)

function getDesignTokens(mode: PaletteMode) {
  return {
    palette: {
      mode,
      ...(mode === 'light'
        ? {
          background: {default: '#f7f8fa', paper: '#ffffff'},
        }
        : {
          background: {default: '#0f1115', paper: '#151821'},
        }),
    },
    shape: {borderRadius: 12},
  } as const
}

export function ColorModeProvider({children}: { children: React.ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>(() => (localStorage.getItem('mui-mode') as PaletteMode) || 'dark')

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((prev) => {
          const next = prev === 'light' ? 'dark' : 'light'
          localStorage.setItem('mui-mode', next)
          return next
        })
      },
    }),
    [mode]
  )

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode])

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}