import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, MenuItem
} from "@mui/material";

export default function TomoModalForm({ open, onClose, onSuccess, tomo }) {
    const isEdit = Boolean(tomo);

    const [form, setForm] = useState({
        nro_tomo: "",
        titulo: "",
        glosa: "",
        fecha_apertura: "",
        estado: "activo"
    });

    useEffect(() => {
        if (open) {
            if (tomo) {
                setForm({
                    nro_tomo: tomo.nro_tomo || "",
                    titulo: tomo.titulo || "",
                    glosa: tomo.glosa || "",
                    fecha_apertura: tomo.fecha_apertura || "",
                    estado: tomo.estado || "abierto"
                });
            } else {
                setForm({
                    nro_tomo: "",
                    titulo: "",
                    glosa: "",
                    fecha_apertura: "",
                    estado: "abierto"
                });
            }
        }
    }, [open, tomo]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        const url = isEdit
            ? `http://127.0.0.1:8000/archivos/tomos/${tomo.id}/`
            : "http://127.0.0.1:8000/archivos/tomos/";

        const method = isEdit ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (!response.ok) throw new Error("Error al guardar tomo");

            const savedTomo = await response.json();
            onSuccess(savedTomo);
            onClose();
        } catch (error) {
            console.error(error);
            alert("Ocurrió un error al guardar el tomo");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{isEdit ? "Editar Tomo" : "Registrar Nuevo Tomo"}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            label="Nro Tomo"
                            name="nro_tomo"
                            value={form.nro_tomo}
                            onChange={handleChange}
                            fullWidth
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        <TextField
                            label="Título"
                            name="titulo"
                            value={form.titulo}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Glosa"
                            name="glosa"
                            value={form.glosa}
                            onChange={handleChange}
                            multiline
                            rows={2}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Fecha Apertura"
                            name="fecha_apertura"
                            type="date"
                            value={form.fecha_apertura}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            select
                            label="Estado"
                            name="estado"
                            value={form.estado}
                            onChange={handleChange}
                            fullWidth
                        >
                            <MenuItem value="abierto">Abierto</MenuItem>
                            <MenuItem value="cerrado">Cerrado</MenuItem>
                        </TextField>
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
