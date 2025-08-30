import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { ColorModeProvider } from './theme/ColorModeProvider'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ColorModeProvider>
      <App/>
    </ColorModeProvider>
  </StrictMode>
)