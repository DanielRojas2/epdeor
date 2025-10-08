import './SideBar.css';

function SideBar() {
  return (
    <nav className="sidebar-navigation">
        <ul>
            <li className="active">
                <i className="fa fa-archive"></i>
                <span className="tooltip">Archivos</span>
            </li>
            <li>
                <i className="fa fa-hdd-o"></i>
                <span className="tooltip">Registrar</span>
            </li>
            <li>
                <i className="fa fa-newspaper-o"></i>
                <span className="tooltip">Solicitar</span>
            </li>
        </ul>
    </nav>
  )
}

export default SideBar