const { Schema, model } = require('mongoose');

const PartidosSchema = Schema({
    descripcion: {
        type: String,
        required: true,
    },
    fecha: {
        type: Date,
        requiredd: true,
        default: Date(),
    },
    liga: {
        type: String,
        required: true,
    },
    equipo1: {
        type: String,
        required: true,
    },
    equipo2: {
        type: String,
        required: true,
    },
});

module.exports = model('Partidos', PartidosSchema);