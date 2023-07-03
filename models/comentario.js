const { Schema, model } = require('mongoose');

const ComentarioSchema = Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    comentario: {
        type: String,
    },
});

module.exports = model('Comentario', ComentarioSchema);