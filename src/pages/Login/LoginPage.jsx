import "./css/style.css";
import "./fonts/material-design-iconic-font/css/material-design-iconic-font.min.css";
import epdeorFrontis from "../../assets/img/epdeor_frontis.png";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../../contexts/login.context";
import toast, { Toaster } from "react-hot-toast";

function LoginPage() {
    const { iniciarSesion, error, loading } = useContext(LoginContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        iniciarSesion(username, password);
    };

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    return (
        <div className="wrapper">
            <div
                className="inner"
                style={{
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "10px",
                }}
            >
                <div className="image-holder">
                    <img src={epdeorFrontis} alt="EPDEOR" />
                </div>

                <form onSubmit={handleSubmit}>
                    <h3>Iniciar Sesión</h3>

                    <div className="form-wrapper">
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            value={username}
                            placeholder="Nombre de usuario"
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <i className="zmdi zmdi-account"></i>
                    </div>

                    <div className="form-wrapper">
                        <input
                            type="password"
                            name="password"
                            value={password}
                            className="form-control"
                            placeholder="Contraseña"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <i className="zmdi zmdi-lock"></i>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ backgroundColor: "#CC0000", borderRadius: "10px" }}
                    >
                        {loading ? (
                            "Iniciando..."
                        ) : (
                            <>
                                Iniciar Sesión <i className="zmdi zmdi-arrow-right"></i>
                            </>
                        )}
                    </button>

                    {/* Coloca el Toaster una sola vez */}
                    <Toaster position="top-center" reverseOrder={false} />
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
