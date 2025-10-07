import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ArchivosPage from './pages/ArchivosPage';
import MaterialPage from './pages/MaterialPage';
import UsuariosPage from './pages/UsuariosPage';
import LoginPage from './pages/Login/LoginPage';
import './App.css'

function App() {
    return (
        <Routes>
            <Route path='/' element={<HomePage />}/>
            <Route path='/archivos' element={<ArchivosPage />}/>
            <Route path='/material' element={<MaterialPage />}/>
            <Route path='/usuarios' element={<UsuariosPage />}/>
            <Route path='/iniciar-sesion' element={<LoginPage />}/>
        </Routes>
    )
}

export default App
