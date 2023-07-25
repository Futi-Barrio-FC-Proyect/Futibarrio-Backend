//Importacion
const { response, request } = require('express');

//Modelos
const Equipo = require('../models/equipo');
const Jugador = require('../models/jugadore');


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

    const { nombre, descripcion, logros, director, puntaje } = req.body;
    const equipoDB = new Equipo({ nombre, descripcion, logros, director, puntaje });

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

    //guardar Jugador
    const equipoConJugador = await Equipo.findOneAndUpdate(
        { _id: equipo._id },
        { $push: { 'jugadores': jugadores } },
        { new: true }
    );

    res.json({
        msg: 'Equipo actualizado ' + (numJugadores.length + 1) + ' jugadores en el equipo',
        equipoConJugador
    })

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
            } else {
                res.json({
                    msg: `El Jugador: ${jugadores.nombre} no esta en este equipo`
                })
            }
        }
    }

}

const putEquipo = async (req = request, res = response) => {

    const { id } = req.params;
    const { _id, ...restoData } = req.body;

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

}

module.exports = {
    getEquipo,
    postEquipo,
    agregarJugadores,
    eliminarJugadores,
    putEquipo,
    deleteEquipo,
}