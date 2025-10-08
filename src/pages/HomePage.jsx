import { useContext, useState } from "react"
import NavbarComponent from "../components/Navbar/NavbarComponent";

function HomePage() {
    const [rol, setRol] = useState(null);

    return (
        <>
            <NavbarComponent />
            <section>
                Inicio
            </section>
        </>
    )
}

export default HomePage