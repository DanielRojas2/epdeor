// components/MenuNavigation/MenuNavigation.jsx
import { Link, Outlet } from "react-router-dom";
import './MenuNavigation.css';

function MenuNavigation() {
    return (
        <div className="page">
            <header tabIndex="0">EPDEOR</header>

            <div id="nav-container">
                <div className="bg"></div>
                <div className="button" tabIndex="0">
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                </div>

                <div id="nav-content" tabIndex="0">
                    <ul>
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/archivos">Archivos</Link></li>
                        <li><Link to="/material">Material</Link></li>
                        <li><Link to="/usuarios">Usuarios</Link></li>
                        <li className="small"><Link to="/iniciar-sesion">Cerrar Sesión</Link></li>
                    </ul>
                </div>
            </div>

            <main>
                <div className="content">
                    {/* Aquí se renderizarán dinámicamente las páginas */}
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default MenuNavigation;
