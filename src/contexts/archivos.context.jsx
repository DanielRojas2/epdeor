import { createContext, useEffect, useState } from "react";

const ArchivosContext = createContext();

function ArchivosProviderWrapper({ children }) {
    const [tomos, setTomos] = useState([]);
    const [reporteInventarioTomos, setReporteInventarioTomos] = useState([]);

    const getTomos = async () => {
        const response = await fetch ("http://127.0.0.1:8000/archivos/tomos-reportes/");
        const data = await response.json();
        setTomos(data);
    }

    const getReporteInventarioTomos = async () => {
        const response = await fetch ("http://127.0.0.1:8000/inventario/reporte-inventario-archivos/");
        const data = await response.json();
        setReporteInventarioTomos(data);
    }

    useEffect(() => {
        getTomos();
        getReporteInventarioTomos();
    }, [])

    return (
        <ArchivosContext.Provider
            value={
                {
                    tomos,
                    reporteInventarioTomos
                }
            }
        >
            {children}
        </ArchivosContext.Provider>
    )
}

export {ArchivosContext, ArchivosProviderWrapper}
