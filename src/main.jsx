import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import DechaWebsite from './DechaWebsite.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DechaWebsite />
  </StrictMode>,
)
