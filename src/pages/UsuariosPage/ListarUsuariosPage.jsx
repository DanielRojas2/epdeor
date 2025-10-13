import * as React from "react";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    TextField,
    MenuItem,
    Typography,
    Button,
    IconButton,
    Tooltip,
    Snackbar,
    Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useContext, useMemo, useState } from "react";
import { UsuariosContext } from "../../contexts/usuarios.context";
import UsuarioModalForm from "./UsuarioModalForm";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/PersonOff";
import RestoreIcon from "@mui/icons-material/PersonAdd";

export default function ListarUsuariosPage() {
    const { reporteUsuarios, getReporteUsuarios } = useContext(UsuariosContext);

    // Filtros
    const [filtroNombre, setFiltroNombre] = useState("");
    const [filtroApellidoPaterno, setFiltroApellidoPaterno] = useState("");
    const [filtroApellidoMaterno, setFiltroApellidoMaterno] = useState("");
    const [filtroCi, setFiltroCi] = useState("");
    const [filtroPuesto, setFiltroPuesto] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Modal
    const [openModal, setOpenModal] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    // Snackbar
    const [alerta, setAlerta] = useState({
        open: false,
        mensaje: "",
        tipo: "success",
    });

    const mostrarAlerta = (mensaje, tipo = "success") => {
        setAlerta({ open: true, mensaje, tipo });
    };

    const cerrarAlerta = () => setAlerta({ ...alerta, open: false });

    const puestos = useMemo(
        () => Array.from(new Set(reporteUsuarios.map((u) => u.puesto))),
        [reporteUsuarios]
    );

    const usuariosFiltrados = useMemo(() => {
        return reporteUsuarios.filter((u) => {
            const coincideNombre = filtroNombre
                ? u.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
                : true;
            const coincideApellidoPaterno = filtroApellidoPaterno
                ? u.apellido_paterno
                      .toLowerCase()
                      .includes(filtroApellidoPaterno.toLowerCase())
                : true;
            const coincideApellidoMaterno = filtroApellidoMaterno
                ? u.apellido_materno
                      .toLowerCase()
                      .includes(filtroApellidoMaterno.toLowerCase())
                : true;
            const coincideCi = filtroCi ? u.ci.includes(filtroCi) : true;
            const coincidePuesto = filtroPuesto ? u.puesto === filtroPuesto : true;
            const coincideEstado =
                filtroEstado !== ""
                    ? u.estado === (filtroEstado === "activo")
                    : true;
            return (
                coincideNombre &&
                coincideApellidoPaterno &&
                coincideApellidoMaterno &&
                coincideCi &&
                coincidePuesto &&
                coincideEstado
            );
        });
    }, [
        reporteUsuarios,
        filtroNombre,
        filtroApellidoPaterno,
        filtroApellidoMaterno,
        filtroCi,
        filtroPuesto,
        filtroEstado,
    ]);

    const usuariosPaginados = useMemo(() => {
        const start = page * rowsPerPage;
        return usuariosFiltrados.slice(start, start + rowsPerPage);
    }, [usuariosFiltrados, page, rowsPerPage]);

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // --- Acciones ---
    const handleEditar = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setOpenModal(true);
    };

    const handleEstado = async (usuario) => {
        try {
            const nuevoEstado = !usuario.estado;
            const url = `http://127.0.0.1:8000/usuarios/perfiles/${usuario.id}/actualizar-estado/`;

            const response = await fetch(url, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ estado: nuevoEstado }),
            });

            if (!response.ok) {
                throw new Error("Error al actualizar el estado del usuario");
            }

            const data = await response.json();
            mostrarAlerta(data.mensaje || "Estado actualizado correctamente", "success");
            await getReporteUsuarios();
        } catch (error) {
            mostrarAlerta(error.message, "error");
        }
    };

    return (
        <Box sx={{ width: "100%", padding: 2 }}>
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Typography variant="h5" gutterBottom sx={{ m: 0 }}>
                    Usuarios
                </Typography>

                <Button
                    variant="contained"
                    onClick={() => {
                        setUsuarioSeleccionado(null);
                        setOpenModal(true);
                    }}
                >
                    Nuevo Usuario
                </Button>
            </Box>

            {/* Filtros */}
            <Paper sx={{ padding: 2, marginBottom: 2 }}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 2 }}>
                        <TextField
                            label="Nombre"
                            fullWidth
                            value={filtroNombre}
                            onChange={(e) => setFiltroNombre(e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 2 }}>
                        <TextField
                            label="Apellido Paterno"
                            fullWidth
                            value={filtroApellidoPaterno}
                            onChange={(e) => setFiltroApellidoPaterno(e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 2 }}>
                        <TextField
                            label="Apellido Materno"
                            fullWidth
                            value={filtroApellidoMaterno}
                            onChange={(e) => setFiltroApellidoMaterno(e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 2 }}>
                        <TextField
                            label="CI"
                            fullWidth
                            value={filtroCi}
                            onChange={(e) => setFiltroCi(e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 2 }}>
                        <TextField
                            select
                            fullWidth
                            value={filtroPuesto}
                            onChange={(e) => setFiltroPuesto(e.target.value)}
                            SelectProps={{ displayEmpty: true }}
                        >
                            <MenuItem value="">
                                <em>Todos</em>
                            </MenuItem>
                            {puestos.map((p) => (
                                <MenuItem key={p} value={p}>
                                    {p}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 2 }}>
                        <TextField
                            select
                            fullWidth
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                            SelectProps={{ displayEmpty: true }}
                        >
                            <MenuItem value="">
                                <em>Todos</em>
                            </MenuItem>
                            <MenuItem value="activo">Activo</MenuItem>
                            <MenuItem value="inactivo">Inactivo</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
            </Paper>

            {/* Tabla */}
            <Paper sx={{ width: "100%", overflowX: "auto" }}>
                <TableContainer sx={{ height: 400 }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Apellido Paterno</TableCell>
                                <TableCell>Apellido Materno</TableCell>
                                <TableCell>CI</TableCell>
                                <TableCell>Alta</TableCell>
                                <TableCell>Baja</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Puesto</TableCell>
                                <TableCell>Usuario</TableCell>
                                <TableCell align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {usuariosPaginados.length > 0 ? (
                                usuariosPaginados.map((u, idx) => (
                                    <TableRow key={idx}>
                                        <TableCell>{u.nombre}</TableCell>
                                        <TableCell>{u.apellido_paterno}</TableCell>
                                        <TableCell>{u.apellido_materno}</TableCell>
                                        <TableCell>{u.ci}</TableCell>
                                        <TableCell>{u.alta}</TableCell>
                                        <TableCell>{u.baja || "-"}</TableCell>
                                        <TableCell>
                                            {u.estado ? "Activo" : "Inactivo"}
                                        </TableCell>
                                        <TableCell>{u.puesto}</TableCell>
                                        <TableCell>{u.usuario}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Editar">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => handleEditar(u)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>

                                            <Tooltip
                                                title={
                                                    u.estado
                                                        ? "Dar de baja"
                                                        : "Dar de alta"
                                                }
                                            >
                                                <IconButton
                                                    color={u.estado ? "error" : "success"}
                                                    onClick={() => handleEstado(u)}
                                                >
                                                    {u.estado ? (
                                                        <DeleteIcon />
                                                    ) : (
                                                        <RestoreIcon />
                                                    )}
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={10} align="center">
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
                    count={usuariosFiltrados.length}
                    rowsPerPage={rowsPerPage}
                    labelRowsPerPage="Filas por página"
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelDisplayedRows={({ from, to, count }) =>
                        `${from} - ${to} de ${count !== -1 ? count : `más de ${to}`}`
                    }
                />
            </Paper>

            {/* Modal */}
            <UsuarioModalForm
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSuccess={getReporteUsuarios}
                usuario={usuarioSeleccionado}
            />

            {/* Snackbar de alertas */}
            <Snackbar
                open={alerta.open}
                autoHideDuration={4000}
                onClose={cerrarAlerta}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    onClose={cerrarAlerta}
                    severity={alerta.tipo}
                    sx={{ width: "100%" }}
                >
                    {alerta.mensaje}
                </Alert>
            </Snackbar>
        </Box>
    );
}
