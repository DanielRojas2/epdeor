import epdeorLogo from '../../assets/logos/epdeor_nobg.png';
import './NavbarComponent.css';

function NavbarComponent() {
    return (
        <div className="container">
            <div className="logo">
                <img src={epdeorLogo} alt="EPDEOR" />
            </div>
            <nav className="nav-links">
                <ul>
                    <li className="links">
                        <a href="#">Inicio</a>
                    </li>
                    <li className="links">
                        <a href="#">Archivos</a>
                    </li>
                    <li className="links">
                        <a href="#">Material</a>
                    </li>
                    <li className="links">
                        <a href="#">Usuarios</a>
                    </li>
                </ul>
            </nav>
            <div className="sesion">
                <a href="#">Cerrar Sesion</a>
            </div>
        </div>
    )
}

export default NavbarComponent