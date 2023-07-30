//Importacion
const { response, request, } = require('express');

//Modelos
const Comentario = require('../models/comentario');
const Usuario = require('../models/usuario');
const Liga = require('../models/liga');

const getComentario = async (req = request, res = response) => {

    const listaComentarios = await Comentario.find();
    const cantidadComentarios = await Comentario.countDocuments();

    res.json({
        msg: 'Mostrando todos los Comentarios existentes',
        cantidadComentarios,
        listaComentarios
    });

}

const getMisComentarios = async (req = request, res = response) => {

    const usuarioUser = req.usuario.usuario;
const listMisComentarios = [];
    const listaComentarios = await Comentario.find();
    for (let i = 0; i < listaComentarios.length; i++) {
        const element = listaComentarios[i];
        if (element.usuario == usuarioUser) {
            const userComentarios = await Comentario.findById(element.id);
            const guardarComentarios = listMisComentarios.push(userComentarios);
        }
    }

    res.json({
        msg: 'Mostrando todos los Comentarios de este usuario.',
        listMisComentarios
    });
}

const postComentario = async (req = request, res = response) => {

    //operador spread
    const { usuario, ...body } = req.body;
    //Generar data a guardar
    const data = {
        ...body,
        usuario: req.usuario.usuario
    }

    const usuarioinfo = await Usuario.findOne({ _id: req.usuario._id });
    const nombreUsuario = usuarioinfo.nombre;

    const comentario = new Comentario(data);

    //Guardar en DB
    await comentario.save();

    const ComentarioDeLiga = await Liga.findOneAndUpdate(
        { _id: body.liga },
        { $push: { 'comentario': comentario._id } },
        { new: true }
    );

    res.json({
        msg: 'Comentario creado con éxito.',
        nombreUsuario,
        comentario
    });
}

const PutComentarioUsuario = async (req = request, res = response) => {

    const { id } = req.params;
    const usuarioUser = req.usuario.usuario;

    const infoDeComentario = await Comentario.findOne({ _id: id });

    const idUsuarioComentario = infoDeComentario.usuario;

    if (idUsuarioComentario == usuarioUser) {
        const { _id, ...resto } = req.body;
        const comentarioEditado = await Comentario.findByIdAndUpdate(id, resto);
        return res.json({
            msg: 'Comentario editado',
            comentarioEditado
        })
    } else {
        return res.json({
            msg: 'No tienes permiso para editar este comentario'
        })
    }
}

const deleteComentario = async (req = request, res = response) => {

    const { id } = req.params;
    //Eliminar fisicamente de la DB
    const comentarioEliminado = await Comentario.findByIdAndDelete(id);

    const liga = await Liga.findById(comentarioEliminado.liga);
    const ligaComentario = liga.comentario;
    for (let i = 0; i < ligaComentario.length; i++) {
        const comentarioArray = ligaComentario[i];
        if (comentarioArray.toString() == id) {
            liga.comentario.splice(i, 1);
            await liga.save();
        }

    }
    res.json({
        msg: 'DELETE Comentario',
        //Eliminado,
        comentarioEliminado
    });

}

const deleteComentarioUsuario = async (req = request, res = response) => {

    const { id } = req.params;
    const usuarioUser = req.usuario.usuario;

    const infoDeComentario = await Comentario.findOne({ _id: id });
    const idUsuarioComentario = infoDeComentario.usuario;

    if (idUsuarioComentario == usuarioUser) {
        const comentarioEliminado = await Comentario.findByIdAndDelete(id);
        const liga = await Liga.findById(comentarioEliminado.liga);
        const ligaComentario = liga.comentario;
        console.log(id);
        for (let i = 0; i < ligaComentario.length; i++) {
            const comentarioArray = ligaComentario[i];
            if (comentarioArray.toString() == id) {
                liga.comentario.splice(i, 1);
                await liga.save();
            }

        }
        return res.json({
            msg: 'Comentario eliminado',
            comentarioEliminado
        })
    } else {
        return res.json({
            msg: 'No tienes permiso para eliminar este comentario'
        })
    }
}

module.exports = {
    getComentario,
    getMisComentarios,
    postComentario,
    PutComentarioUsuario,
    deleteComentario,
    deleteComentarioUsuario,
}