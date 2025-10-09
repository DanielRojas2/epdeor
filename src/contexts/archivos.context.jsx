import { createContext, useEffect, useState } from "react";

const ArchivosContext = createContext();

function ArchivosProviderWrapper({ children }) {
    const [tomos, setTomos] = useState([]);

    const getTomos = async () => {
        const response = await fetch ("http://127.0.0.1:8000/archivos/tomos/");
        const data = await response.json();
        setTomos(data);
    }

    useEffect(() => {
        getTomos();
    }, [])

    return (
        <ArchivosContext.Provider
            value={
                {tomos}
            }
        >
            {children}
        </ArchivosContext.Provider>
    )
}

export {ArchivosContext, ArchivosProviderWrapper}
