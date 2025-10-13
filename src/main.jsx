import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { LoginProviderWrapper } from './contexts/login.context.jsx'
import { RolProvider } from './contexts/rol.context.jsx'
import { ArchivosProviderWrapper } from './contexts/archivos.context.jsx'
import { UsuariosProviderWrapper } from './contexts/usuarios.context.jsx'

createRoot(document.getElementById('root')).render(
    
    <BrowserRouter>
        <LoginProviderWrapper>
            <RolProvider>
                <ArchivosProviderWrapper>
                    <UsuariosProviderWrapper>
                        <StrictMode>
                            <App />
                        </StrictMode>
                    </UsuariosProviderWrapper>
                </ArchivosProviderWrapper>
            </RolProvider>
        </LoginProviderWrapper>
    </BrowserRouter>
)
