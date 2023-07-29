const { Schema, model } = require('mongoose');

const ComentarioSchema = Schema({
    usuario: {
        type: String,
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