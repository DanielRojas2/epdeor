import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginContext = createContext();

function LoginProviderWrapper({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedAccess = localStorage.getItem("access");
        const storedRefresh = localStorage.getItem("refresh");

        if (storedUser && storedAccess){
            setUser(JSON.parse(storedUser));
            setAccessToken(storedAccess);
            setRefreshToken(storedRefresh);
        }

        if (storedUser) {
            navigate("/");
        }
    }, [])

    const iniciarSesion = async (username, password) => {
        setLoading(true);
        setError(null);
    
        try {
            const response = await fetch("http://127.0.0.1:8000/usuarios/iniciar-sesion/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });
        
            if (!response.ok) {
                throw new Error("Credenciales incorrectas");
            }
        
            const data = await response.json();
        
            setUser(data.user);
            setAccessToken(data.access);
            setRefreshToken(data.refresh);
        
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);
    
            setError(null);
            navigate("/");
        } catch (e) {
            console.error("Error al iniciar sesión:", e);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const cerrarSesion = () => {
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
    };

    return (
        <LoginContext.Provider
            value={{
                user,
                accessToken,
                refreshToken,
                error,
                loading,
                iniciarSesion,
                cerrarSesion,
            }}
        >
        {children}
        </LoginContext.Provider>
    );
}

export {LoginContext, LoginProviderWrapper}
