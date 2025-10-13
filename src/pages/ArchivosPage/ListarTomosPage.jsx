import React, { useContext, useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import {
    Box, Collapse, IconButton, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Typography, Paper, TextField, MenuItem, TablePagination,
    Grid, Tabs, Tab, Button
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { ArchivosContext } from "../../contexts/archivos.context";
import { RolContext } from "../../contexts/rol.context";
import TomoModalForm from "./TomoModalForm";
import DetalleTomoModalForm from "./DetalleTomoModalForm";

function Row({ row, onAddDetalle, onArchivoAdjuntado, onEditarTomo }) {
    const [open, setOpen] = useState(false);
    const { hasRol } = useContext(RolContext);

    const handleSolicitarTomo = (tomo) => {
        console.log("Solicitar tomo:", tomo.id);
        alert("Función de solicitar tomo pendiente de implementación");
    };

    const handleSolicitarArchivo = () => {
        console.log("Solicitar archivo");
        alert("Función en desarrollo");
    }

    const handleAdjuntarArchivo = async (detalleId, file) => {
        try {
            const getResponse = await fetch(`http://127.0.0.1:8000/archivos/detalles/${detalleId}/`);
            if (!getResponse.ok) throw new Error("No se pudo obtener el detalle");
            const detalleActual = await getResponse.json();

            const formData = new FormData();
            formData.append("nro_archivo", detalleActual.nro_archivo);
            formData.append("nombre_archivo", detalleActual.nombre_archivo);
            formData.append("nro_fojas", detalleActual.nro_fojas);
            formData.append("tomo", detalleActual.tomo?.id || detalleActual.tomo);
            formData.append("fecha_adjunto", new Date().toISOString().split("T")[0]);
            formData.append("archivo", file);

            const putResponse = await fetch(`http://127.0.0.1:8000/archivos/detalles/${detalleId}/`, {
                method: "PUT",
                body: formData,
            });

            if (!putResponse.ok) {
                const errorData = await putResponse.json();
                console.error("Respuesta del servidor:", errorData);
                throw new Error("Error al adjuntar archivo");
            }

            alert("Archivo adjuntado correctamente");
            onArchivoAdjuntado();
        } catch (error) {
            console.error(error);
            alert("No se pudo adjuntar el archivo");
        }
    };

    return (
        <>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
            <TableCell>
                <IconButton size="small" onClick={() => setOpen(!open)}>
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </TableCell>
            <TableCell>{row.nro_tomo}</TableCell>
            <TableCell>{row.titulo}</TableCell>
            <TableCell>{row.glosa}</TableCell>
            <TableCell>{row.nro_fojas_total}</TableCell>
            <TableCell>{row.fecha_apertura}</TableCell>
            <TableCell>{row.estado}</TableCell>
            <TableCell>{row.gestion}</TableCell>
            <TableCell>
                <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                        if (hasRol("Encargado de archivos")) {
                            onEditarTomo(row)
                        } else {
                            handleSolicitarTomo(row);
                        }
                    }}
                >
                    {hasRol("Encargado de archivos") ? "Editar": "Solicitar"}
                </Button>
            </TableCell>
        </TableRow>

        <TableRow>
            <TableCell colSpan={9} style={{ paddingBottom: 0, paddingTop: 0 }}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 1
                            }}
                        >
                            <Typography variant="h6">Detalles de Archivos</Typography>
                            {hasRol("Encargado de archivos")&&(
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => onAddDetalle(row.id)}
                                >
                                    Agregar Archivo
                                </Button>
                            )}
                        </Box>

                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nro Archivo</TableCell>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>Fojas</TableCell>
                                    <TableCell>Fecha Adj.</TableCell>
                                    <TableCell>Estado</TableCell>
                                    {hasRol("Encargado de archivos") && (
                                        <TableCell>Archivo</TableCell>
                                    )}
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {row.detalles?.length > 0 ? (
                                    row.detalles.map((det) => (
                                        <TableRow key={det.nro_archivo}>
                                            <TableCell>{det.nro_archivo}</TableCell>
                                            <TableCell>{det.nombre_archivo}</TableCell>
                                            <TableCell>{det.nro_fojas}</TableCell>
                                            <TableCell>{det.fecha_adjunto}</TableCell>
                                            <TableCell>{det.estado_archivo}</TableCell>
                                            {hasRol("Encargado de archivos") && (
                                                <TableCell>
                                                    {det.archivo ? (
                                                        <a
                                                            href={det.archivo}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            Ver PDF
                                                        </a>
                                                    ) : (
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            component="label"
                                                        >
                                                            Adjuntar archivo
                                                            <input
                                                                type="file"
                                                                hidden
                                                                accept="application/pdf"
                                                                onChange={(e) => {
                                                                    const file = e.target.files[0];
                                                                    if (file) handleAdjuntarArchivo(det.id, file);
                                                                }}
                                                            />
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            )}
                                            <TableCell>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => {
                                                        if (hasRol("Encargado de archivos")) {
                                                            onAddDetalle(row.id, det)
                                                        } else {
                                                            handleSolicitarArchivo();
                                                        }
                                                    }}
                                                >
                                                    {hasRol(
                                                        "Encargado de archivos"
                                                    ) ? "Editar": "Solicitar"}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            No hay archivos adjuntos.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
        </>
    );
}

Row.propTypes = {
    row: PropTypes.object.isRequired,
    onAddDetalle: PropTypes.func.isRequired,
    onArchivoAdjuntado: PropTypes.func,
    onEditarTomo: PropTypes.func.isRequired,
};

function CustomTabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

export default function ListarTomosPage() {
    const { tomos, getTomos, reporteInventarioTomos } = useContext(ArchivosContext);
    const { hasRol } = useContext(RolContext);
    const [tabValue, setTabValue] = useState(0);
    const [openForm, setOpenForm] = useState(false);
    const [openDetalleForm, setOpenDetalleForm] = useState(false);
    const [selectedTomo, setSelectedTomo] = useState(null);
    const [selectedTomoId, setSelectedTomoId] = useState(null);
    const [selectedDetalle, setSelectedDetalle] = useState(null);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [filtroFecha, setFiltroFecha] = useState("");
    const [filtroGestion, setFiltroGestion] = useState("");
    const [filtroTitulo, setFiltroTitulo] = useState("");
    const [busqueda, setBusqueda] = useState("");

    const [filtroEstado, setFiltroEstado] = useState("");
    const [filtroNroTomo, setFiltroNroTomo] = useState("");
    const [filtroTituloInventario, setFiltroTituloInventario] = useState("");
    const [pageInventario, setPageInventario] = useState(0);
    const [rowsPerPageInventario, setRowsPerPageInventario] = useState(5);

    const handleChangePageInventario = (event, newPage) => setPageInventario(newPage);
    const handleChangeRowsPerPageInventario = event => {
        setRowsPerPageInventario(parseInt(event.target.value, 10));
        setPageInventario(0);
    };

    useEffect(() => {
        getTomos();
    }, []);

    const gestiones = useMemo(() => Array.from(new Set(tomos.map(t => t.gestion))), [tomos]);

    const tomosFiltrados = useMemo(() => {
        return tomos.filter(t => {
            const coincideFecha = filtroFecha ? t.fecha_apertura === filtroFecha : true;
            const coincideGestion = filtroGestion ? String(t.gestion) === String(filtroGestion) : true;
            const coincideTitulo = filtroTitulo ? t.titulo.toLowerCase().includes(
                filtroTitulo.toLowerCase()
            ) : true;
            const coincideBusqueda = busqueda
                ? t.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                t.glosa.toLowerCase().includes(busqueda.toLowerCase()) ||
                t.detalles?.some(d => d.nombre_archivo.toLowerCase().includes(busqueda.toLowerCase()))
                : true;
            return coincideFecha && coincideGestion && coincideTitulo && coincideBusqueda;
        });
    }, [tomos, filtroFecha, filtroGestion, filtroTitulo, busqueda]);

    const tomosPaginados = useMemo(() => {
        const start = page * rowsPerPage;
        return tomosFiltrados.slice(start, start + rowsPerPage);
    }, [tomosFiltrados, page, rowsPerPage]);

    const inventarioFiltrado = useMemo(() => {
        return reporteInventarioTomos.filter(item => {
            const coincideEstado = filtroEstado ? item.estado === filtroEstado : true;
            const coincideNroTomo = filtroNroTomo ? item.tomo.nro_tomo === Number(filtroNroTomo) : true;
            const coincideTitulo = filtroTituloInventario
                ? item.tomo.titulo.toLowerCase().includes(filtroTituloInventario.toLowerCase())
                : true;
            return coincideEstado && coincideNroTomo && coincideTitulo;
        });
    }, [reporteInventarioTomos, filtroEstado, filtroNroTomo, filtroTituloInventario]);

    const inventarioPaginado = useMemo(() => {
        const start = pageInventario * rowsPerPageInventario;
        return inventarioFiltrado.slice(start, start + rowsPerPageInventario);
    }, [inventarioFiltrado, pageInventario, rowsPerPageInventario]);

    const handleOpenForm = (tomo = null) => { setSelectedTomo(tomo); setOpenForm(true); };
    const handleCloseForm = () => { setOpenForm(false); setSelectedTomo(null); };
    const handleOpenDetalleForm = (tomoId, detalle = null) => {
        setSelectedTomoId(tomoId);
        setSelectedDetalle(detalle);
        setOpenDetalleForm(true); 
    };
    const handleCloseDetalleForm = () => { setOpenDetalleForm(false); setSelectedTomoId(null); setSelectedDetalle(null); };

    const handleChangePageTab0 = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPageTab0 = event => { setRowsPerPage(parseInt(event.target.value, 10)); setPage(0); };

    return (
        <Box sx={{ width: "100%", padding: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} aria-label="Tabs de Reportes">
                    <Tab label="Tomos" {...a11yProps(0)} />
                    {hasRol("Encargado de archivos") && (
                        <Tab label="Inventario" {...a11yProps(1)} />
                    )}
                    <Tab
                        label="Solicitudes"
                        {...a11yProps(hasRol("Encargado de archivos") ? 2 : 1)}
                    />
                </Tabs>
            </Box>

            <CustomTabPanel value={tabValue} index={0}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h5" gutterBottom sx={{ m: 0 }}>Tomos</Typography>
                    {hasRol("Encargado de archivos")&&(
                        <Button variant="contained" onClick={() => handleOpenForm()}>
                            Nuevo Tomo
                        </Button>
                    )}
                </Box>

                <Paper sx={{ padding: 2, marginBottom: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={2}>
                            <TextField 
                                label="Fecha de apertura"
                                type="date"
                                fullWidth
                                value={filtroFecha}
                                onChange={(e) => setFiltroFecha(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <TextField
                                select
                                fullWidth
                                value={filtroGestion}
                                onChange={(e) => setFiltroGestion(e.target.value)}
                                SelectProps={{ displayEmpty: true }}
                            >
                                <MenuItem value=""><em>Todo</em></MenuItem>
                                {gestiones.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Filtrar por título"
                                fullWidth
                                value={filtroTitulo}
                                onChange={e => setFiltroTitulo(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="Buscar (título, glosa o archivo)" 
                                fullWidth
                                value={busqueda}
                                onChange={e => setBusqueda(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </Paper>

                <Paper sx={{ width: '100%', overflowX: 'auto' }}>
                    <TableContainer sx={{ height: 400, overflowY: 'auto' }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell>Nro Tomo</TableCell>
                                    <TableCell>Título</TableCell>
                                    <TableCell>Glosa</TableCell>
                                    <TableCell>Nro Fojas</TableCell>
                                    <TableCell>Fecha Apertura</TableCell>
                                    <TableCell>Estado</TableCell>
                                    <TableCell>Gestión</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tomosPaginados.length > 0 ? tomosPaginados.map(tomo => (
                                    <Row
                                        key={tomo.id}
                                        row={tomo}
                                        onAddDetalle={handleOpenDetalleForm}
                                        onArchivoAdjuntado={getTomos}
                                        onEditarTomo={handleOpenForm}
                                    />
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center">No se encontraron resultados.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={tomosFiltrados.length}
                        rowsPerPage={rowsPerPage}
                        labelRowsPerPage="Filas por página"
                        page={page}
                        onPageChange={handleChangePageTab0}
                        onRowsPerPageChange={handleChangeRowsPerPageTab0}
                        labelDisplayedRows={({ from, to, count }) =>
                            `${from} - ${to} de ${count !== -1 ? count : `más de ${to}`}`
                        }
                    />
                </Paper>

                <TomoModalForm
                    open={openForm}
                    onClose={handleCloseForm}
                    onSuccess={() => { handleCloseForm(); getTomos(); }}
                    tomo={selectedTomo}
                />
                <DetalleTomoModalForm
                    open={openDetalleForm}
                    onClose={handleCloseDetalleForm}
                    onSuccess={() => { handleCloseDetalleForm(); getTomos(); }}
                    tomoId={selectedTomoId}
                    detalle={selectedDetalle}
                />
            </CustomTabPanel>

            {hasRol("Encargado de archivos") ? (
                <CustomTabPanel value={tabValue} index={1}>
                    <Typography variant="h5" gutterBottom>Ubicación en Inventario</Typography>
                    <Paper sx={{ padding: 2, marginBottom: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    select
                                    fullWidth
                                    value={filtroEstado}
                                    onChange={e => setFiltroEstado(e.target.value)}
                                    SelectProps={{ displayEmpty: true }}
                                >
                                    <MenuItem value=""><em>Todo</em></MenuItem>
                                    <MenuItem value="disponible">Disponible</MenuItem>
                                    <MenuItem value="prestado">Prestado</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <TextField
                                    label="Nro Tomo"
                                    type="number"
                                    fullWidth
                                    value={filtroNroTomo}
                                    onChange={e => setFiltroNroTomo(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Buscar por título"
                                    fullWidth
                                    value={filtroTituloInventario}
                                    onChange={e => setFiltroTituloInventario(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </Paper>

                    <Paper sx={{ width: '100%', overflowX: 'auto' }}>
                        <TableContainer sx={{ maxHeight: 300 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nro Tomo</TableCell>
                                        <TableCell>Título</TableCell>
                                        <TableCell>Glosa</TableCell>
                                        <TableCell>Nro Fojas</TableCell>
                                        <TableCell>Fecha Apertura</TableCell>
                                        <TableCell>Estado Tomo</TableCell>
                                        <TableCell>Estante</TableCell>
                                        <TableCell>Nivel</TableCell>
                                        <TableCell>Fila</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {inventarioPaginado.length > 0 ? inventarioPaginado.map(item => (
                                        <TableRow key={item.tomo.id}>
                                            <TableCell>{item.tomo.nro_tomo}</TableCell>
                                            <TableCell>{item.tomo.titulo}</TableCell>
                                            <TableCell>{item.tomo.glosa}</TableCell>
                                            <TableCell>{item.tomo.nro_fojas_total}</TableCell>
                                            <TableCell>{item.tomo.fecha_apertura}</TableCell>
                                            <TableCell>{item.estado}</TableCell>
                                            <TableCell>{item.estante}</TableCell>
                                            <TableCell>{item.nivel}</TableCell>
                                            <TableCell>{item.fila}</TableCell>
                                        </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={9} align="center">No hay resultados.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={inventarioFiltrado.length}
                            rowsPerPage={rowsPerPageInventario}
                            labelRowsPerPage="Filas por página"
                            page={pageInventario}
                            onPageChange={handleChangePageInventario}
                            onRowsPerPageChange={handleChangeRowsPerPageInventario}
                            labelDisplayedRows={({ from, to, count }) =>
                                `${from} - ${to} de ${count !== -1 ? count : `más de ${to}`}`
                            }
                        />
                    </Paper>
                </CustomTabPanel>
            ): null}

            <CustomTabPanel value={tabValue} index={hasRol("Encargado de archivos") ? 2 : 1}>
                <Typography variant="h5">Solicitudes</Typography>
                <Typography>Aquí puedes agregar la tabla o lista de solicitudes.</Typography>
            </CustomTabPanel>
        </Box>
    );
}
