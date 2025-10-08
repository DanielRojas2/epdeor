function RegistrarArchivo() {
    return (
        <section className="container">
            <h1>Registrar Tomo</h1>
            <form action="">
                <label htmlFor="nro_tomo">Nro de Tomo</label>
                <input type="text" id="nro_tomo" required />
                <label htmlFor="titulo">Título de Tomo</label>
                <input type="text" id="titulo_tomo" required />
                <label htmlFor="glosa">Glosa</label>
                <textarea name="glosa" id="glosa"></textarea>
                <label htmlFor="fecha_apertura">Fecha Apertura</label>
                <input type="date" name="fecha_apertura" id="fecha_apertura" />
                <label htmlFor="estado">Estado del Tomo</label>
                <select name="estado" id="estado"></select>
            </form>
        </section>
    )
}

export default RegistrarArchivo