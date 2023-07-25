const { Schema, model } = require('mongoose');

const NoticiaSchema = Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    img: {
        type: String
    },
    tittle: {
        type: String,
        required: true
    },
    noticia: {
        type: String,
        required: true
    },
});

module.exports = model('Noticia', NoticiaSchema);