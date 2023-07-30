//Importacion
const { response, request } = require('express');

//Modelos
const Jugador = require('../models/jugadore');
const Equipo = require('../models/equipo');

const getJugador = async (req = request, res = response) => {

    const listaJugadores = await Jugador.find();
    const cantidadJugadores = await Jugador.countDocuments();

    res.json({
        msg: 'Mostrando todos los jugadores existentes',
        cantidadJugadores,
        listaJugadores
    });

}

const postJugador = async (req = request, res = response) => {

    const {
        nombre, nombreCamiseta, numerojugador, edad, equipoActual,
        equiposParticipado, golesMarcados, posición, partidos, reconocimientos,
        estado, img, rol
    } = req.body;

    const jugadorDB = new Jugador({
        nombre, nombreCamiseta, numerojugador, edad, equipoActual,
        equiposParticipado, golesMarcados, posición, partidos, reconocimientos,
        estado, img, rol
    });

    //Guardar en Base de datos
    await jugadorDB.save();

    res.json({
        msg: 'Jugador creado con exito',
        jugadorDB
    });

}

const putjugador = async (req = request, res = response) => {

    const { id } = req.params;
    const { _id, equipoActual, ...restoData } = req.body;
    
    const jugadorActualizado = await Jugador.findByIdAndUpdate(id, restoData);
    res.json({
        msg: 'Put Controller jugador actualizado',
        jugadorActualizado
    });

}


const deleteJugador = async (req = request, res = response) => {

    const { id } = req.params;
    //Eliminar fisicamente de la DB
    const jugadorEliminado = await Jugador.findByIdAndDelete(id);
    const equipoJugador = jugadorEliminado.equipoActual;
    const equipo = await Equipo.find();
    for (let i = 0; i < equipo.length; i++) {
        const infoEquipo = equipo[i];
        if (equipoJugador == infoEquipo.nombre) {
            const equipoActualizar = await Equipo.findById(infoEquipo.id);
            const equipoYJugador = equipoActualizar.jugadores;
            for (let i = 0; i < equipoYJugador.length; i++) {
                const juagdoresArray = equipoYJugador[i];
                const idJugadores = juagdoresArray._id;
                if (idJugadores.toString() == id) {
                    equipoYJugador.splice(i, 1);
                    await equipoActualizar.save();
                }
            }
            res.json({
                msg: 'DELETE jugador',
                //productoEliminado,
                jugadorEliminado
            });
        } return false;
    }
}

module.exports = {
    getJugador,
    postJugador,
    putjugador,
    deleteJugador,
}