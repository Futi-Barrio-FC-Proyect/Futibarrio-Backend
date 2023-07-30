//Importacion
const { response, request, } = require('express');

//Modelos
const Partido = require('../models/partidos');

const getPartido = async (req = request, res = response) => {

    const listaPartidos = await Partido.find();
    const cantidadPartidos = await Partido.countDocuments();

    res.json({
        msg: 'Mostrando todos los partidos existentes',
        cantidadPartidos,
        listaPartidos
    });

}

//validar si el equipo existe y si el equipo 1 es igual al 2
const postPartido = async (req = request, res = response) => {

    const { descripcion, fecha, liga, equipo1, equipo2,img } = req.body;
    const partidoDB = new Partido({ descripcion, fecha, liga, equipo1, equipo2, img });

    if (equipo1 == equipo2) {
        res.json({
            msg: 'Error, el equipo no puede enfrentarse consigo mismo.',
        });
        return false
    } else {
        //Guardar en Base de datos
        await partidoDB.save();

        res.json({
            msg: 'Partido creado con exito',
            partidoDB
        });
    }
}

const putPartido = async (req = request, res = response) => {

    const { id } = req.params;
    const { _id, ...restoData } = req.body;

    const partidoActualizado = await Partido.findByIdAndUpdate(id, restoData);
    res.json({
        msg: 'Put Controller partido actualizado',
        partidoActualizado
    });
}


const deletePartido = async (req = request, res = response) => {

    const { id } = req.params;
    //Eliminar fisicamente de la DB
    const partidoEliminado = await Partido.findByIdAndDelete(id);

    res.json({
        msg: 'DELETE partido',
        //Eliminado,
        partidoEliminado
    });

}

module.exports = {
    getPartido,
    postPartido,
    putPartido,
    deletePartido,
}