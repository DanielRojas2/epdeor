import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ArchivosPage from "./pages/ArchivosPage";
import MaterialPage from "./pages/MaterialPage";
import UsuariosPage from "./pages/UsuariosPage";
import LoginPage from "./pages/Login/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/archivos"
                element={
                    <ProtectedRoute>
                        <ArchivosPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/material"
                element={
                    <ProtectedRoute>
                        <MaterialPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/usuarios"
                element={
                    <ProtectedRoute>
                        <UsuariosPage />
                    </ProtectedRoute>
                }
            />

            {/* Página pública */}
            <Route path="/iniciar-sesion" element={<LoginPage />} />
        </Routes>
    );
}

export default App;
