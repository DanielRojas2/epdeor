import React, { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Grid
} from "@mui/material";

export default function DetalleTomoModalForm({ open, onClose, onSuccess, tomoId, detalle }) {
    const [form, setForm] = useState({
        nro_archivo: "",
        nombre_archivo: "",
        archivo: null,
        nro_fojas: "",
        fecha_adjunto: "",
        tomo: tomoId
    });

    useEffect(() => {
        if (detalle) {
            setForm({
                nro_archivo: detalle.nro_archivo || "",
                nombre_archivo: detalle.nombre_archivo || "",
                nro_fojas: detalle.nro_fojas || "",
                archivo: detalle.archivo || null,
                fecha_adjunto: detalle.fecha_adjunto || "",
                tomo: tomoId
            });
        } else {
            setForm({
                nro_archivo: "",
                nombre_archivo: "",
                nro_fojas: "",
                archivo: null,
                fecha_adjunto: "",
                tomo: tomoId
            });
        }
    }, [detalle, tomoId]);

    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = e => {
        setForm(prev => ({ ...prev, archivo: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("nro_archivo", form.nro_archivo);
            formData.append("nombre_archivo", form.nombre_archivo);
            formData.append("nro_fojas", form.nro_fojas);
            formData.append("archivo", form.archivo || "");
            formData.append("tomo", tomoId);

            const url = detalle
            ? `http://127.0.0.1:8000/archivos/detalles/${detalle.id}/`
            : `http://127.0.0.1:8000/archivos/detalles/`;

            const method = detalle ? "PUT" : "POST";

            const response = await fetch(url, { method, body: formData });
            if (!response.ok) throw new Error("Error al guardar detalle");

            onSuccess();
        } catch (error) {
            console.error(error);
            alert("Error al guardar detalle");
        }
    };


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Adjuntar Archivo al Tomo N° {tomoId}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={3}>
                        <TextField
                            label="Nro Archivo"
                            name="nro_archivo"
                            value={form.nro_archivo}
                            onChange={handleChange}
                            fullWidth
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={12} sm={9}>
                        <TextField
                            label="Nombre del Archivo"
                            name="nombre_archivo"
                            value={form.nombre_archivo}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Nro Fojas"
                            name="nro_fojas"
                            value={form.nro_fojas}
                            onChange={handleChange}
                            fullWidth
                            type="number"
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Fecha de Adjunto"
                            name="fecha_adjunto"
                            type="date"
                            value={form.fecha_adjunto}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button
                            variant="outlined"
                            component="label"
                            fullWidth
                        >
                            Seleccionar Archivo
                            <input type="file" hidden onChange={handleFileChange} />
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
