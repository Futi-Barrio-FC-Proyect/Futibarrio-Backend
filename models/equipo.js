const { Schema, model } = require('mongoose');

const EqupoSchema = Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    },
    descripcion: {
        type: String,
        required: true
    },
    logros: {
        type: String,
    },
    director: {
        type: String,
        required: true
    },
    jugadores: {
        type: Array,
        default: [],
    },
    puntaje: {
        type: Number,
        required: true
    },
});

module.exports = model('Equipo', EqupoSchema);