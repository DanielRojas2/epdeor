import { useContext } from "react";
import { ArchivosContext } from "../../contexts/archivos.context";

function ListarTomosPage() {
    const { tomos } = useContext(ArchivosContext);

    return (
        <div>
            <h2>Listado de Tomos</h2>
            {tomos.map((tomo) => (
                <div key={tomo.nro_tomo}>
                    <h3>{tomo.titulo}</h3>
                </div>
            ))}
        </div>
    );
}

export default ListarTomosPage;
