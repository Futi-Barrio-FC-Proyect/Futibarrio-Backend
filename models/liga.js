const { Schema, model } = require('mongoose');

const LigaSchema = Schema({
    nombre: {
        type: String,
        required: true,
        unique: true
    },
    capacidad: {
        type: Number,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    equipos: {
        type: Array,
        default: [],
    },
    img: {
        type: String
    },
});

module.exports = model('Liga', LigaSchema);