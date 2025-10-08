import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { LoginContext } from "../contexts/login.context";

function ProtectedRoute({ children }) {
    const { user, loading } = useContext(LoginContext);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!user) {
        return <Navigate to="/iniciar-sesion" replace />;
    }

    return children;
}

export default ProtectedRoute;
