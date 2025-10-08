import { Link } from 'react-router-dom';
import './NavbarComponent.css';

function NavbarComponent() {
    return (
        <nav className="menu">
            <ol>
                <li className="menu-item">
                    <Link to="/">Inicio</Link>
                </li>
                <li className="menu-item">
                    <Link to="/archivos">Archivos</Link>
                </li>
                <li className="menu-item">
                    <Link to="/material">Material</Link>
                </li>
                <li className="menu-item">
                    <Link to="/usuarios">Usuarios</Link>
                </li>
            </ol>
        </nav>
    )
}

export default NavbarComponent