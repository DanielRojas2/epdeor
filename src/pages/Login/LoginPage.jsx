import "./css/style.css";
import "./fonts/material-design-iconic-font/css/material-design-iconic-font.min.css";
import epdeorFrontis from "../../assets/img/epdeor_frontis.png";

function LoginPage() {
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

                <form>
                    <h3>Iniciar Sesión</h3>

                    <p style={{ color: "red", display: "none" }}>
                        Credenciales no válidas. Inténtalo de nuevo.
                    </p>

                    <div className="form-wrapper">
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            placeholder="Nombre de usuario"
                            required
                        />
                        <i className="zmdi zmdi-account"></i>
                    </div>

                    <div className="form-wrapper">
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Contraseña"
                            required
                        />
                        <i className="zmdi zmdi-lock"></i>
                    </div>

                    <button
                        type="submit"
                        style={{ backgroundColor: "#CC0000", borderRadius: "10px" }}
                    >
                        Iniciar Sesión <i className="zmdi zmdi-arrow-right"></i>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
