import * as React from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Collapse,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
    TextField,
    MenuItem,
    TablePagination,
    Grid
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useContext, useState, useMemo } from 'react';
import { ArchivosContext } from '../../contexts/archivos.context';

function Row({ row }) {
    const [open, setOpen] = useState(false);

    return (
        <>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
            <TableCell>
                <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                >
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
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box sx={{ margin: 1 }}>
                        <Typography variant="h6" gutterBottom component="div">
                            Detalles de Archivos
                        </Typography>
                        <Table size="small" aria-label="detalles">
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
                                {row.detalles?.map((det) => (
                                    <TableRow key={det.nro_archivo}>
                                        <TableCell>{det.nro_archivo}</TableCell>
                                        <TableCell>{det.nombre_archivo}</TableCell>
                                        <TableCell>{det.nro_fojas}</TableCell>
                                        <TableCell>{det.fecha_adjunto}</TableCell>
                                        <TableCell>{det.estado_archivo}</TableCell>
                                        <TableCell>
                                            <a
                                            href={det.archivo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            >
                                            Ver PDF
                                            </a>
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

Row.propTypes = {
    row: PropTypes.object.isRequired,
};

export default function ListarTomosPage() {
    const { tomos } = useContext(ArchivosContext);
    const [filtroFecha, setFiltroFecha] = useState('');
    const [filtroGestion, setFiltroGestion] = useState('');
    const [filtroTitulo, setFiltroTitulo] = useState('');
    const [busqueda, setBusqueda] = useState('');

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const gestiones = useMemo(() => {
        const set = new Set(tomos.map((t) => t.gestion));
        return Array.from(set);
    }, [tomos]);

    const tomosFiltrados = useMemo(() => {
        return tomos.filter((t) => {
            const coincideFecha = filtroFecha ? t.fecha_apertura === filtroFecha : true;
            const coincideGestion = filtroGestion ? String(t.gestion) === String(filtroGestion) : true;
            const coincideTitulo = filtroTitulo ? t.titulo.toLowerCase().includes(filtroTitulo.toLowerCase()) : true;
            const coincideBusqueda = busqueda
                ? t.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                t.glosa.toLowerCase().includes(busqueda.toLowerCase()) ||
                t.detalles?.some((d) => d.nombre_archivo.toLowerCase().includes(busqueda.toLowerCase()))
                : true;

            return coincideFecha && coincideGestion && coincideTitulo && coincideBusqueda;
        });
    }, [tomos, filtroFecha, filtroGestion, filtroTitulo, busqueda]);

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const tomosPaginados = useMemo(() => {
        const start = page * rowsPerPage;
        return tomosFiltrados.slice(start, start + rowsPerPage);
    }, [tomosFiltrados, page, rowsPerPage]);

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h5" gutterBottom>
                Tomos
            </Typography>

            {/* Filtros */}
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
                        <MenuItem value="">
                            <em>Todo</em>
                        </MenuItem>
                        {gestiones.map((g) => (
                            <MenuItem key={g} value={g}>
                            {g}
                            </MenuItem>
                        ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Filtrar por título"
                            fullWidth
                            value={filtroTitulo}
                            onChange={(e) => setFiltroTitulo(e.target.value)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Buscar (título, glosa o archivo)"
                            fullWidth
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </Grid>
                </Grid>
            </Paper>

            {/* Tabla scrollable */}
            <Paper sx={{ width: '100%', overflowX: 'auto' }}>
                <TableContainer sx={{ maxHeight: 220 }}>
                    <Table stickyHeader aria-label="collapsible table">
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
                            {tomosPaginados.length > 0 ? (
                                tomosPaginados.map((tomo) => <Row key={tomo.nro_tomo} row={tomo} />)
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">
                                        No se encontraron resultados.
                                    </TableCell>
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
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}
