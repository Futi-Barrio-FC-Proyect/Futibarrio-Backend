//Importacion
const { response, request, } = require('express');

//Modelos
const Noticia = require('../models/noticias');
const Usuario = require('../models/usuario');

const getNoticias = async (req = request, res = response) => {

    const listaNoticias = await Noticia.find();
    const cantidadNoticias = await Noticia.countDocuments();

    res.json({
        msg: 'Mostrando todas las noticias existentes',
        cantidadNoticias,
        listaNoticias
    });

}

const postNoticias = async (req = request, res = response) => {

    const { usuario, ...body } = req.body;
    //Generar data a guardar
    const data = {
        ...body,
        usuario: req.usuario._id
    }

    const usuarioinfo = await Usuario.findOne({_id: req.usuario._id});
    const nombreUsuario = usuarioinfo.nombre;

    const noticia = new Noticia(data);

    //Guardar en DB
    await noticia.save();

    res.status(201).json({
        msg: 'Noticia creado con éxito.',
        nombreUsuario,
        noticia
    });
}

const PutNoticiaUsuario = async (req = request, res = response) => {

    const { id } = req.params;
    const usuarioId = req.usuario.id;

    const infoDeNoticia = await Noticia.findOne({_id: id});
    const idUsuarioNoticia = infoDeNoticia.usuario;

    if (idUsuarioNoticia == usuarioId) {
        const { _id, ...resto } = req.body;
        const noticiaEditado = await Noticia.findByIdAndUpdate(id, resto);
        return res.status(401).json({
            msg: 'Noticia editado',
            noticiaEditado
        })
    } else {
        return res.status(401).json({
            msg: 'No tienes permiso para editar esta noticia'
        })
    }
}

const deleteNoticia = async (req = request, res = response) => {

    const { id } = req.params;
    //Eliminar fisicamente de la DB
    const noticiaEliminado = await Noticia.findByIdAndDelete(id);

    res.json({
        msg: 'DELETE Noticia',
        //Eliminado,
        noticiaEliminado
    });

}

const deleteNoticiaUsuario = async (req = request, res = response) => {

    const { id } = req.params;
    const usuarioId = req.usuario.id;

    const infoDeNoticia = await Noticia.findOne({_id: id});
    const idUsuarioNoticia = infoDeNoticia.usuario;

    if (idUsuarioNoticia == usuarioId) {
        const noticiaEliminado = await Noticia.findByIdAndDelete(id);
        return res.status(401).json({
            msg: 'Noticia eliminado',
            noticiaEliminado
        })
    } else {
        return res.status(401).json({
            msg: 'No tienes permiso para eliminar esta noticia'
        })
    }
}

module.exports = {
    getNoticias,
    postNoticias,
    PutNoticiaUsuario,
    deleteNoticia,
    deleteNoticiaUsuario,
}