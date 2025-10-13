import React, { useEffect, useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, MenuItem, Grid
} from "@mui/material";

export default function UsuarioModalForm({ open, onClose, onSuccess, usuario }) {
    const isEdit = Boolean(usuario);
    const [puestos, setPuestos] = useState([]);
    const [form, setForm] = useState({
        nombre: "",
        apellido_paterno: "",
        apellido_materno: "",
        ci: "",
        baja: null,
        puesto: ""
    });

    useEffect(() => {
        if (open) {
            if (usuario) {
                const nroItem = usuario.puesto?.split(": ").pop() || "";
                setForm({
                    nombre: usuario.nombre || "",
                    apellido_paterno: usuario.apellido_paterno || "",
                    apellido_materno: usuario.apellido_materno || "",
                    ci: usuario.ci || "",
                    baja: usuario.baja || "",
                    puesto: nroItem
                });
            } else {
                setForm({
                    nombre: "",
                    apellido_paterno: "",
                    apellido_materno: "",
                    ci: "",
                    baja: "",
                    puesto: ""
                });
            }
        }
    }, [open, usuario]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/usuarios/puestos/")
        .then(res => res.json())
        .then(data => setPuestos(data))
        .catch(console.error);
    }, []);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const userId = usuario?.id ?? usuario?.id_usuario;

        const url = isEdit
            ? `http://127.0.0.1:8000/usuarios/perfiles/${userId}/`
            : "http://127.0.0.1:8000/usuarios/perfiles/";

        const method = isEdit ? "PUT" : "POST";

        const payload = { ...form };
        payload.baja = payload.baja || null;

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error del servidor:", errorData);
                throw new Error("Error al guardar usuario");
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error en handleSubmit:", error);
            alert("Ocurrió un error al guardar el usuario");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{isEdit ? "Editar Usuario" : "Registrar Nuevo Usuario"}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label="Apellido Paterno" name="apellido_paterno" value={form.apellido_paterno} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label="Apellido Materno" name="apellido_materno" value={form.apellido_materno} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField label="CI" name="ci" value={form.ci} onChange={handleChange} fullWidth />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 12 }}>
                        <TextField
                            select
                            label="Puesto"
                            name="puesto"
                            value={form.puesto}
                            onChange={handleChange}
                            fullWidth
                        >
                            {puestos.map(p => (
                                <MenuItem key={p.nro_item} value={p.nro_item}>
                                    {p.unidad.unidad} ({p.departamento.departamento})
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                            label="Fecha de baja (opcional)"
                            type="date"
                            name="baja"
                            value={form.baja}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    {isEdit ? "Actualizar" : "Registrar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
