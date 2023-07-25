const Usuario = require('../models/usuario');
const Role = require('../models/role');
const Jugador = require('../models/jugadore');
const Equipo = require('../models/equipo');
const Liga = require('../models/liga');
const Partido = require('../models/partidos');
const comentario = require('../models/comentario');
const noticias = require('../models/noticias');

const esRoleValido = async (rol = '') => {
    //Verificar si el rol es valido y existe en la DB
    const existeRolDB = await Role.findOne({ rol });
    if (!existeRolDB) {
        throw new Error(`El rol ${rol}, no existe en la DB `);
    }
}

const existeUsuarioPorId = async (id) => {

    //Verificar si existe el ID
    const existIdOfUser = await Usuario.findById(id);
    if (!existIdOfUser) {
        throw new Error(`El id: ${id} no existe en la DB`);
    }

}

const existeUsuario = async (usuario = '') => {
    //Validar si la liga ya esta registrada en la base de datos
    const existeUsuarioDB = await Usuario.findOne({usuario});
    if (existeUsuarioDB) {
        throw new Error(`El usuario: ${usuario} ya existe en la DB`);
    }
}

const existeEquipoPorId = async (id) => {

    //Verificar si existe el ID
    const existIdOfEquipo = await Equipo.findById(id);
    if (!existIdOfEquipo) {
        throw new Error(`El id de equipo: ${id} no existe en la DB`);
    }

}

const existeJugadorPorId = async (idJugador) => {

    //Verificar si existe el ID
    const existIdOfJugador = await Jugador.findById(idJugador);
    if (!existIdOfJugador) {
        throw new Error(`El id del jugador: ${idJugador} no existe en la DB`);
    }

}

const existeNombreCamiseta = async (nombreCamiseta = '') => {
    //Validar si la camiseta ya esta registrada en la base de datos
    const existeNombreCamisetaDB = await Jugador.findOne({nombreCamiseta});
    if (existeNombreCamisetaDB) {
        throw new Error(`la camiseta: ${nombreCamiseta} ya existe en la DB`);
    }
}

const existeLigaPorId = async (id) => {

    //Verificar si existe el ID
    const existIdOfLiga = await Liga.findById(id);
    if (!existIdOfLiga) {
        throw new Error(`El id de liga: ${id} no existe en la DB`);
    }

}

const existeNombreLiga = async (nombre = '') => {
    //Validar si la liga ya esta registrada en la base de datos
    const existeNombreDB = await Liga.findOne({nombre});
    if (existeNombreDB) {
        throw new Error(`La liga: ${nombre} ya existe en la DB`);
    }
}

const existeNombreLigaP = async (nombre = '') => {
    //Validar si la liga ya esta registrada en la base de datos
    const existeNombreDB = await Liga.findOne({nombre});
    if (!existeNombreDB) {
        throw new Error (`La liga: ${nombre} no existe en la DB`);
    }
}

const existeNombreEquipo = async (nombre = '') => {
    //Validar si la liga ya esta registrada en la base de datos
    const existeNombreDB = await Equipo.findOne({nombre});
    if (existeNombreDB) {
        throw new Error(`El equipo: ${nombre} ya existe en la DB`);
    }
}

const existeNombreEquipoP = async (nombre = '') => {
    //Validar si la liga ya esta registrada en la base de datos
    const existeNombreDB = await Equipo.findOne({nombre});
    if (!existeNombreDB) {
        throw new Error(`El equipo: ${nombre} no existe en la DB`);
    }
}

const existePartidoPorId = async (id) => {

    //Verificar si existe el ID
    const existIdOfPartido = await Partido.findById(id);
    if (!existIdOfPartido) {
        throw new Error(`El id de liga: ${id} no existe en la DB`);
    }

}

const existecomentarioPorId = async (id) => {

    //Verificar si existe el ID
    const existIdOfComenatrio = await comentario.findById(id);
    if (!existIdOfComenatrio) {
        throw new Error(`El id de comentario: ${id} no existe en la DB`);
    }

}

const existenoticiaPorId = async (id) => {

    //Verificar si existe el ID
    const existIdOfNoticia = await noticias.findById(id);
    if (!existIdOfNoticia) {
        throw new Error(`El id la noticia: ${id} no existe en la DB`);
    }

}


module.exports = {
    esRoleValido,
    existeUsuarioPorId,
    existeUsuario,
    existeEquipoPorId,
    existeJugadorPorId,
    existeNombreCamiseta,
    existeLigaPorId,
    existeNombreLiga,
    existeNombreEquipo,
    existePartidoPorId,
    existeNombreLigaP,
    existeNombreEquipoP,
    existecomentarioPorId,
    existenoticiaPorId,
}