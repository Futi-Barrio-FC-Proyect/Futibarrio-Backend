//Importacion
const { response, request, } = require('express');

//Modelos
const Comentario = require('../models/comentario');
const Usuario = require('../models/usuario');

const getComentario = async (req = request, res = response) => {

    const listaComentarios = await Promise.all([
        Comentario.countDocuments(),
        Comentario.find()
    ]);

    res.json({
        msg: 'Mostrando todos los Comentarios existentes',
        listaComentarios
    });

}

const postComentario = async (req = request, res = response) => {

    //operador spread
    const { usuario, ...body } = req.body;
    //Generar data a guardar
    const data = {
        ...body,
        usuario: req.usuario._id
    }

    const usuarioinfo = await Usuario.findOne({_id: req.usuario._id});
    const nombreUsuario = usuarioinfo.nombre;

    const comentario = new Comentario(data);

    //Guardar en DB
    await comentario.save();

    res.status(201).json({
        msg: 'Comentario creado con éxito.',
        nombreUsuario,
        comentario
    });
}

const deleteComentario = async (req = request, res = response) => {

    const { id } = req.params;
    //Eliminar fisicamente de la DB
    const comentarioEliminado = await Comentario.findByIdAndDelete(id);

    res.json({
        msg: 'DELETE Comentario',
        //Eliminado,
        comentarioEliminado
    });

}

const deleteComentarioUsuario = async (req = request, res = response) => {

    const { id } = req.params;
    const usuarioId = req.usuario.id;

    const infoDeComentario = await Comentario.findOne({_id: id});
    const idUsuarioComentario = infoDeComentario.usuario;

    if (idUsuarioComentario == usuarioId) {
        const comentarioEliminado = await Comentario.findByIdAndDelete(id);
        return res.status(401).json({
            msg: 'Comentario eliminado',
            comentarioEliminado
        })
    } else {
        return res.status(401).json({
            msg: 'No tienes permiso para eliminar este comentario'
        })
    }
}

module.exports = {
    getComentario,
    postComentario,
    deleteComentario,
    deleteComentarioUsuario,
}