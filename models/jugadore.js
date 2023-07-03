const { Schema, model } = require('mongoose');

const JugadorSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    nombreCamiseta: {
        type: String,
        unique: true
    },
    numerojugador: {
        type: Number,
    },
    edad: {
        type: Number,
        required: true
    },
    equipoActual: {
        type: String,
    },
    equiposParticipado: {
        type: String,
    },
    golesMarcados: {
        type: Number,
    },
    posición: {
        type: String,
    },
    partidos: {
        type: String,
        required: true
    },
    reconocimientos: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        required: true
    },
    rol: {
        type: String,
        required: true
    },
});

module.exports = model('Jugadore', JugadorSchema)