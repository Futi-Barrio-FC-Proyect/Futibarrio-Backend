//Importacion
const { response, request } = require('express');

//Modelos
const Equipo = require('../models/equipo');
const Jugador = require('../models/jugadore');
const Liga = require('../models/liga');


const getEquipo = async (req = request, res = response) => {

    const listaEquipos = await Equipo.find();
    const cantidaEquipos = await Equipo.countDocuments();

    res.json({
        msg: 'Mostrando todos los equipos existentes',
        cantidaEquipos,
        listaEquipos
    });

}

const postEquipo = async (req = request, res = response) => {

    const { nombre, descripcion, logros, director, puntaje, img } = req.body;
    const equipoDB = new Equipo({ nombre, descripcion, logros, director, puntaje, img });

    //Guardar en Base de datos
    await equipoDB.save();

    res.status(201).json({
        msg: 'Equipo creado con exito',
        equipoDB
    });

}

const agregarJugadores = async (req = request, res = response) => {

    const { idJugador } = req.params;
    const { equipoId } = req.body;

    //traer la informacion del jugador y equipo
    const jugadores = await Jugador.findOne({ _id: idJugador });
    const equipo = await Equipo.findOne({ _id: equipoId });
    const numJugadores = equipo.jugadores;
    //ver si un jugador ya esta en el equipo
    for (let jugador = 0; jugador < numJugadores.length; jugador++) {
        arrayJugadoresId = [equipo.jugadores[jugador]._id]
        if (arrayJugadoresId == idJugador) {
            res.json({
                msg: `El Jugador: ${jugadores.nombre} ya esta en el equipo`,
            });
            return false;
        }
    }

    if (jugadores.equipoActual != null) {
        res.json({
            msg: `El Jugador: ${jugadores.nombre} ya esta en un equipo`,
        });
        return false;
    } else {
        //guardar el equipo al jugador agregado
        const equipoActual = equipo.nombre;
        const jugadorActualizado = await Jugador.findByIdAndUpdate(idJugador, { $set: { equipoActual } });

        const jugador = await Jugador.findOne({ _id: idJugador });

        //guardar Jugador
        const equipoConJugador = await Equipo.findOneAndUpdate(
            { _id: equipo._id },
            { $push: { 'jugadores': jugador } },
            { new: true }
        );

        res.json({
            msg: 'Equipo actualizado ' + (numJugadores.length + 1) + ' jugadores en el equipo',
            equipoConJugador
        })
    }
}

const eliminarJugadores = async (req = request, res = response) => {

    const { idJugador } = req.params;
    const { equipoId } = req.body;

    //traer la informacion del jugador y equipo
    const jugadores = await Jugador.findOne({ _id: idJugador });
    const equipo = await Equipo.findOne({ _id: equipoId });
    const jugadoresInfo = equipo.jugadores;
    //verificar si existen  jugadores en el equipo
    if (jugadoresInfo.length == 0) {
        res.json({
            msg: 'No existen Jugadores en este equipo',
        });
        return false;
    } else {
        //ver si un jugador ya esta en el equipo
        for (let jugador = 0; jugador < jugadoresInfo.length; jugador++) {
            arrayJugadoresId = [equipo.jugadores[jugador]._id]
            if (arrayJugadoresId == idJugador) {
                //eliminar el equipo al jugador
                const equipoActual = null;
                const jugadorActualizado = await Jugador.findByIdAndUpdate(idJugador, { $set: { equipoActual } });
                //eliminar Jugador
                const equipoActualizado = await Equipo.findOneAndUpdate(
                    { _id: equipo._id },
                    { $pull: { 'jugadores': jugadores } },
                    { new: true }
                );

                res.json({
                    msg: `El Jugador: ${jugadores.nombre} fue eliminado`,
                    equipoActualizado
                })
                return false;
            }
        }

        {
            res.json({
                msg: `El Jugador: ${jugadores.nombre} no esta en este equipo`
            })
        }
    }

}

const putEquipo = async (req = request, res = response) => {

    const { id } = req.params;
    const { _id, liga, ...restoData } = req.body;

    const equipoActualizado = await Equipo.findByIdAndUpdate(id, restoData);
    res.status(201).json({
        msg: 'Put Controller equipo actualizado',
        equipoActualizado
    });

}


const deleteEquipo = async (req = request, res = response) => {

    const { id } = req.params;
    //Eliminar fisicamente de la DB
    const equipoEliminado = await Equipo.findByIdAndDelete(id);
    res.json({
        msg: 'DELETE equipo',
        //productoEliminado,
        equipoEliminado
    });
    const nombreEquipo = equipoEliminado.nombre;
    const ligaEquipo = equipoEliminado.liga;
    const jugadores = await Jugador.find();
    const liga = await Liga.find();
    for (let i = 0; i < jugadores.length; i++) {
        const element = jugadores[i];
        if (element.equipoActual == nombreEquipo) {
            //eliminar el equipo al jugador
            const equipoActual = null;
            const jugadorActualizado = await Jugador.findByIdAndUpdate(element.id, { $set: { equipoActual } });
        }
    }
    for (let i = 0; i < liga.length; i++) {
        const infoLiga = liga[i];
        if (ligaEquipo == infoLiga.nombre) {
            const ligaActualizar = await Liga.findById(infoLiga.id);
            const ligaYEquipo = ligaActualizar.equipos;
            for (let i = 0; i < ligaYEquipo.length; i++) {
                const equiposArray = ligaYEquipo[i];
                const idEquipos = equiposArray._id;
                if (idEquipos.toString() == id) {
                    ligaYEquipo.splice(i, 1);
                    await ligaActualizar.save();
                }
            }
        } 
    }
}

module.exports = {
    getEquipo,
    postEquipo,
    agregarJugadores,
    eliminarJugadores,
    putEquipo,
    deleteEquipo,
}