//Importacion
const { response, request } = require('express');

//Modelos
const Jugador = require('../models/jugadore');

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
        estado, rol
    } = req.body;

    const jugadorDB = new Jugador({
        nombre, nombreCamiseta, numerojugador, edad, equipoActual,
        equiposParticipado, golesMarcados, posición, partidos, reconocimientos,
        estado, rol
    });

    //Guardar en Base de datos
    await jugadorDB.save();

    res.status(201).json({
        msg: 'Jugador creado con exito',
        jugadorDB
    });

}

const putjugador = async (req = request, res = response) => {

    const { id } = req.params;
    const { _id, ...restoData } = req.body;
    
    const jugadorActualizado = await Jugador.findByIdAndUpdate(id, restoData);
    res.status(201).json({
        msg: 'Put Controller jugador actualizado',
        jugadorActualizado
    });

}


const deleteJugador = async (req = request, res = response) => {

    const { id } = req.params;
    //Eliminar fisicamente de la DB
    const jugadorEliminado = await Jugador.findByIdAndDelete( id );

   res.json({
        msg: 'DELETE jugador',
        //productoEliminado,
        jugadorEliminado
   });

}

module.exports = {
    getJugador,
    postJugador,
    putjugador,
    deleteJugador,
}