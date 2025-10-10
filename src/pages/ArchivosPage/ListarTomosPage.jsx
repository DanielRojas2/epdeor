import * as React from 'react';
import PropTypes from 'prop-types';
import {
    Box, Collapse, IconButton, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Typography, Paper, TextField, MenuItem, TablePagination
} from '@mui/material';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useContext, useState, useMemo } from 'react';
import { ArchivosContext } from '../../contexts/archivos.context';

// --- Row collapsible ---
function Row({ row }) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
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
            </TableRow>

            <TableRow>
                <TableCell colSpan={8} style={{ paddingBottom: 0, paddingTop: 0 }}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6">Detalles de Archivos</Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Nro Archivo</TableCell>
                                        <TableCell>Nombre</TableCell>
                                        <TableCell>Fojas</TableCell>
                                        <TableCell>Fecha Adj.</TableCell>
                                        <TableCell>Estado</TableCell>
                                        <TableCell>Archivo</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.detalles?.map(det => (
                                        <TableRow key={det.nro_archivo}>
                                            <TableCell>{det.nro_archivo}</TableCell>
                                            <TableCell>{det.nombre_archivo}</TableCell>
                                            <TableCell>{det.nro_fojas}</TableCell>
                                            <TableCell>{det.fecha_adjunto}</TableCell>
                                            <TableCell>{det.estado_archivo}</TableCell>
                                            <TableCell>
                                                <a href={det.archivo} target="_blank" rel="noopener noreferrer">Ver PDF</a>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

Row.propTypes = { row: PropTypes.object.isRequired };

// --- Tab Panel ---
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
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function ListarTomosPage() {
    const { tomos } = useContext(ArchivosContext);
    const [tabValue, setTabValue] = useState(0);

    const handleChangeTab = (event, newValue) => setTabValue(newValue);

    // --- Estados propios del Tab 0 ---
    const [filtroFecha, setFiltroFecha] = useState('');
    const [filtroGestion, setFiltroGestion] = useState('');
    const [filtroTitulo, setFiltroTitulo] = useState('');
    const [busqueda, setBusqueda] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const gestiones = useMemo(() => Array.from(new Set(tomos.map(t => t.gestion))), [tomos]);

    const tomosFiltrados = useMemo(() => {
        return tomos.filter(t => {
            const coincideFecha = filtroFecha ? t.fecha_apertura === filtroFecha : true;
            const coincideGestion = filtroGestion ? String(t.gestion) === String(filtroGestion) : true;
            const coincideTitulo = filtroTitulo ? t.titulo.toLowerCase().includes(filtroTitulo.toLowerCase()) : true;
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

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const { reporteInventarioTomos } = useContext(ArchivosContext);
    const [filtroEstado, setFiltroEstado] = useState('');
    const [filtroNroTomo, setFiltroNroTomo] = useState('');
    const [filtroTituloInventario, setFiltroTituloInventario] = useState('');
    const [pageInventario, setPageInventario] = useState(0);
    const [rowsPerPageInventario, setRowsPerPageInventario] = useState(5);

    // --- Filtrado ---
    const inventarioFiltrado = useMemo(() => {
        return reporteInventarioTomos.filter(item => {
            const coincideEstado = filtroEstado ? item.estado === filtroEstado : true;
            const coincideNroTomo = filtroNroTomo ? item.tomo.nro_tomo === Number(filtroNroTomo) : true;
            const coincideTitulo = filtroTituloInventario ? item.tomo.titulo.toLowerCase().includes(filtroTituloInventario.toLowerCase()) : true;
            return coincideEstado && coincideNroTomo && coincideTitulo;
        });
    }, [reporteInventarioTomos, filtroEstado, filtroNroTomo, filtroTituloInventario]);

    // --- Paginación ---
    const inventarioPaginado = useMemo(() => {
        const start = pageInventario * rowsPerPageInventario;
        return inventarioFiltrado.slice(start, start + rowsPerPageInventario);
    }, [inventarioFiltrado, pageInventario, rowsPerPageInventario]);

    const handleChangePageInventario = (event, newPage) => setPageInventario(newPage);
    const handleChangeRowsPerPageInventario = event => {
        setRowsPerPageInventario(parseInt(event.target.value, 10));
        setPageInventario(0);
    };

    return (
        <Box sx={{ width: '100%', padding: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleChangeTab} aria-label="Tabs de Reportes">
                    <Tab label="Reporte Tomos" {...a11yProps(0)} />
                    <Tab label="Ubicación Inventario" {...a11yProps(1)} />
                    <Tab label="Solicitudes Préstamo" {...a11yProps(2)} />
                </Tabs>
            </Box>

            {/* --- Tab 0: Tomos --- */}
            <CustomTabPanel value={tabValue} index={0}>
                <Typography variant="h5" gutterBottom>Reporte General de Tomos</Typography>
                <Paper sx={{ padding: 2, marginBottom: 2 }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 2 }}>
                            <TextField label="Fecha de apertura" type="date" fullWidth value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} InputLabelProps={{ shrink: true }} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 2 }}>
                            <TextField select fullWidth value={filtroGestion} onChange={(e) => setFiltroGestion(e.target.value)} SelectProps={{ displayEmpty: true }}>
                                <MenuItem value=""><em>Todo</em></MenuItem>
                                {gestiones.map(g => <MenuItem key={g} value={g}>{g}</MenuItem>)}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField label="Filtrar por título" fullWidth value={filtroTitulo} onChange={e => setFiltroTitulo(e.target.value)} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <TextField label="Buscar (título, glosa o archivo)" fullWidth value={busqueda} onChange={e => setBusqueda(e.target.value)} />
                        </Grid>
                    </Grid>
                </Paper>

                <Paper sx={{ width: '100%', overflowX: 'auto' }}>
                    <TableContainer sx={{ height: 400, overflowY: 'auto', overfloxX: 'auto' }}>
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
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tomosPaginados.length > 0 ? tomosPaginados.map(tomo => <Row key={tomo.glosa} row={tomo} />)
                                : <TableRow><TableCell colSpan={8} align="center">No se encontraron resultados.</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={tomosFiltrados.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </CustomTabPanel>

            {/* --- Tab 1: Inventario --- */}
            <CustomTabPanel value={tabValue} index={1}>
                <Typography variant="h5" gutterBottom>Ubicación en Inventario</Typography>

                <Paper sx={{ padding: 2, marginBottom: 2 }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 3 }}>
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
                                <MenuItem value="reservado">Reservado</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 3 }}>
                            <TextField
                                label="Nro Tomo"
                                type="number"
                                fullWidth
                                value={filtroNroTomo}
                                onChange={e => setFiltroNroTomo(e.target.value)}
                            />
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="Buscar por título"
                                fullWidth
                                value={filtroTituloInventario}
                                onChange={e => setFiltroTituloInventario(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </Paper>

                {/* Tabla */}
                <Paper sx={{ width: '100%', overflowX: 'auto' }}>
                    <TableContainer sx={{ height: 400, overflowY: 'auto', overfloxX: 'auto' }}>
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
                                    <TableCell>Estado Ubicación</TableCell>
                                    <TableCell>Fecha Asignación</TableCell>
                                    <TableCell>Hora Asignación</TableCell>
                                    <TableCell>Estado</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {inventarioFiltrado.length > 0 ? (
                                    inventarioPaginado.map(item => (
                                        <TableRow key={item.tomo.nro_tomo + item.nivel_estante.nivel}>
                                            <TableCell>{item.tomo.nro_tomo}</TableCell>
                                            <TableCell>{item.tomo.titulo}</TableCell>
                                            <TableCell>{item.tomo.glosa}</TableCell>
                                            <TableCell>{item.tomo.nro_fojas_total}</TableCell>
                                            <TableCell>{item.tomo.fecha_apertura}</TableCell>
                                            <TableCell>{item.tomo.estado}</TableCell>
                                            <TableCell>{item.nivel_estante.estante}</TableCell>
                                            <TableCell>{item.nivel_estante.nivel}</TableCell>
                                            <TableCell>{item.nivel_estante.estado}</TableCell>
                                            <TableCell>{item.fecha_asignacion}</TableCell>
                                            <TableCell>{item.hora_asignacion}</TableCell>
                                            <TableCell>{item.estado}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={12} align="center">No se encontraron resultados.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={inventarioFiltrado.length}
                        rowsPerPage={rowsPerPage}
                        page={pageInventario}
                        onPageChange={handleChangePageInventario}
                        onRowsPerPageChange={handleChangeRowsPerPageInventario}
                    />
                </Paper>
            </CustomTabPanel>

            {/* --- Tab 2: Solicitudes --- */}
            <CustomTabPanel value={tabValue} index={2}>
                <Typography variant="h5">Solicitudes de Préstamo</Typography>
                <Typography>Aquí irá la tabla de solicitudes de préstamo</Typography>
            </CustomTabPanel>
        </Box>
    );
}
