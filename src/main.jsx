import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { LoginProviderWrapper } from './contexts/login.context.jsx'
import { ArchivosProviderWrapper } from './contexts/archivos.context.jsx'

createRoot(document.getElementById('root')).render(
    
    <BrowserRouter>
        <LoginProviderWrapper>
            <ArchivosProviderWrapper>
                <StrictMode>
                    <App />
                </StrictMode>
            </ArchivosProviderWrapper>
        </LoginProviderWrapper>
    </BrowserRouter>
)
