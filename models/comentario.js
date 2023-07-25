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
    liga: {
        type: Schema.Types.ObjectId,
        ref: 'Liga',
        required: true
    },
});

module.exports = model('Comentario', ComentarioSchema);