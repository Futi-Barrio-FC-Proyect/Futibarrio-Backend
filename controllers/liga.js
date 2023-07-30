//Importacion
const { response, request } = require('express');

//Modelos
const Liga = require('../models/liga');
const Equipo = require('../models/equipo');


const getLiga = async (req = request, res = response) => {

    const listaLigas = await Liga.find();
    const cantidadLigas = await Liga.countDocuments();

    res.json({
        msg: 'Mostrando todas la ligas existentes',
        cantidadLigas,
        listaLigas
    });

}

const postLiga = async (req = request, res = response) => {

    const { nombre, capacidad, descripcion, equipos, img } = req.body;
    const ligaDB = new Liga({ nombre, capacidad, descripcion, equipos, img });

    //Guardar en Base de datos
    await ligaDB.save();

    res.json({
        msg: 'Liga creado con exito',
        ligaDB
    });

}

const agregarEquipos = async (req = request, res = response) => {

    const { idEquipo } = req.params;
    const { ligaId } = req.body;

    //traer la informacion de la liga y equipo
    const equipos = await Equipo.findOne({ _id: idEquipo });
    const ligaInfo = await Liga.findOne({ _id: ligaId });
    const numLigas = ligaInfo.equipos;
    //ver si un equipo ya esta en la liga
    for (let equipo = 0; equipo < numLigas.length; equipo++) {
        arrayEquiposId = [ligaInfo.equipos[equipo]._id]
        if (arrayEquiposId == idEquipo) {
            res.json({
                msg: `El equipo: ${equipos.nombre} ya está en la liga.`,
            });
            return false;
        }
    }

    if (equipos.liga != null) {
        res.json({
            msg: `El equipo: ${equipos.nombre} ya esta en una liga.`,
        });
        return false;
    } else {
        //guardar la liga al equipo agregado
        const liga = ligaInfo.nombre;
        const equipoActualizado = await Equipo.findByIdAndUpdate(idEquipo, { $set: { liga } });
        const equipos = await Equipo.findOne({ _id: idEquipo });
        //guardar equipo
        const ligaConEquipo = await Liga.findOneAndUpdate(
            { _id: ligaInfo._id },
            { $push: { 'equipos': equipos } },
            { new: true }
        );

        res.json({
            msg: 'Liga actualizada ' + (numLigas.length + 1) + ' equipos en la liga.',
            ligaConEquipo
        })
    }

}

const eliminarEquipos = async (req = request, res = response) => {

    const { idEquipo } = req.params;
    const { ligaId } = req.body;

    //traer la informacion de la liga y equipo
    const equipos = await Equipo.findOne({ _id: idEquipo });
    const ligaInfo = await Liga.findOne({ _id: ligaId });
    const ligasInfo = ligaInfo.equipos;
    //verificar si existen equipos en la liga
    if (ligasInfo.length == 0) {
        res.json({
            msg: 'No existen equipos en esta liga',
        })
    } else {
        //ver si un jugador ya esta en el equipo
        for (let equipo = 0; equipo < ligasInfo.length; equipo++) {
            arrayEquiposId = [ligaInfo.equipos[equipo]._id]
            if (arrayEquiposId == idEquipo) {
                //eliminar la liga al equipo
                const liga = null;
                const equipoActualizado = await Equipo.findByIdAndUpdate(idEquipo, { $set: { liga } });
                //eliminar Jugador
                //eliminar equipo
                const ligaActualizado = await Liga.findOneAndUpdate(
                    { _id: ligaInfo._id },
                    { $pull: { 'equipos': equipos } },
                    { new: true }
                );

                res.json({
                    msg: `El equipo: ${equipos.nombre} fue eliminado`,
                    ligaActualizado
                })
                return false;
            } else {
                res.json({
                    msg: `El equipo: ${equipos.nombre} no esta en esta liga.`
                })
            }
        }
    }

}

const putLiga = async (req = request, res = response) => {

    const { id } = req.params;
    const { _id, ...restoData } = req.body;

    const ligaActualizada = await Liga.findByIdAndUpdate(id, restoData);
    res.json({
        msg: 'Put Controller liga actualizado',
        ligaActualizada
    });

}


const deleteLiga = async (req = request, res = response) => {

    const { id } = req.params;
    //Eliminar fisicamente de la DB
    const ligaEliminado = await Liga.findByIdAndDelete(id);
    const nombreLiga = ligaEliminado.nombre;
    const equipos = await Equipo.find();
    for (let i = 0; i < equipos.length; i++) {
        const element = equipos[i];
        if (element.liga == nombreLiga) {
            //eliminar la liga al quipo
            const liga = null;
            const equipoActualizado = await Equipo.findByIdAndUpdate(element.id, { $set: { liga } });
        }
    }

    res.json({
        msg: 'DELETE liga',
        //Eliminado,
        ligaEliminado
    });

}

module.exports = {
    getLiga,
    postLiga,
    agregarEquipos,
    eliminarEquipos,
    putLiga,
    deleteLiga,
}