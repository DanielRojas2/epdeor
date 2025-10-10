import { createContext, useEffect, useState } from "react";

const UsuariosContext = createContext();

function UsuariosProviderWrapper({ children }) {
    const [usuarios, setUsuario] = useState([]);
    const [reporteUsuarios, setReporteUsuarios] = useState([]);

    const getUsuario = async () => {
        const response = await fetch ("http://127.0.0.1:8000/usuarios/perfiles/");
        const data = await response.json();
        setUsuario(data);
    }

    const getReporteUsuarios = async () => {
        const response = await fetch ("http://127.0.0.1:8000/usuarios/perfiles-reporte/");
        const data = await response.json();
        setReporteUsuarios(data);
    }

    useEffect(() => {
        getUsuario();
        getReporteUsuarios();
    }, [])

    return (
        <UsuariosContext.Provider
            value={
                {
                    usuarios,
                    reporteUsuarios,
                    getReporteUsuarios
                }
            }
        >
            {children}
        </UsuariosContext.Provider>
    )
}

export {UsuariosContext, UsuariosProviderWrapper}
