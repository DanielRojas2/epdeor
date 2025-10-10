// App.jsx
import { Route, Routes } from "react-router-dom";
import MenuNavigation from "./components/Navigation/MenuNavigation";
import HomePage from "./pages/HomePage";
import ListarTomosPage from "./pages/ArchivosPage/ListarTomosPage";
import MaterialPage from "./pages/MaterialPage";
import LoginPage from "./pages/Login/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import ListarUsuariosPage from "./pages/UsuariosPage/ListarUsuariosPage";

function App() {
    return (
        <Routes>
            {/* Layout protegido con menú */}
            <Route
                element={
                    <ProtectedRoute>
                        <MenuNavigation />
                    </ProtectedRoute>
                }
            >
                <Route index element={<HomePage />} />
                <Route path="archivos" element={<ListarTomosPage />} />
                <Route path="material" element={<MaterialPage />} />
                <Route path="usuarios" element={<ListarUsuariosPage />} />
            </Route>

            {/* Página pública */}
            <Route path="/iniciar-sesion" element={<LoginPage />} />
        </Routes>
    );
}

export default App;
