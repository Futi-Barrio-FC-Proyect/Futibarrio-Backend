//Importacion
const { response, request, query } = require('express');
const bcryptjs = require('bcryptjs');

//Modelos
const Usuario = require('../models/usuario');
const Role = require('../models/role');
const { generarJWT } = require('../helpers/generar-jwt');
const Comentario = require('../models/comentario');

//funcion para crear un admin por defecto
const defaultAdminApp = async () => {
    try {
        let user = new Usuario();
        user.nombre = "Shiro Salas";
        user.usuario = "@AdminShiro";
        user.password = "123456";
        user.rol = "ADMIN_APP_ROLE";
        const userEncontrado = await Usuario.findOne({ usuario: user.usuario });
        if (userEncontrado) return console.log("El administrador está listo");
        user.password = bcryptjs.hashSync(user.password, bcryptjs.genSaltSync());
        user = await user.save();
        if (!user) return console.log("El administrador no está listo!");
        return console.log("El administrador está listo!");
    } catch (err) {
        throw new Error(err);
    }
};


const getUsuarios = async (req = request, res = response) => {

    const listaUsuarios = await Usuario.find();
    const cantidadUsuarios = await Usuario.countDocuments();

    res.json({
        msg: 'Mostrando todos los usuarios existentes',
        cantidadUsuarios,
        listaUsuarios
    });

}

const postUsuario = async (req = request, res = response) => {

    const { nombre, usuario, password, rol, img } = req.body;
    const usuarioDB = new Usuario({ nombre, usuario, password, rol, img });

    if (rol == 'ADMIN_APP_ROLE') {
        res.json({
            msg: 'No puedes agregar a un Admin de la app.',
        });
    } else {
        //Encriptar password
        const salt = bcryptjs.genSaltSync();
        usuarioDB.password = bcryptjs.hashSync(password, salt);

        //Guardar en Base de datos
        await usuarioDB.save();

        res.status(201).json({
            msg: 'Usuario creado con exito',
            usuarioDB
        });
    }
}

const putUsuario = async (req = request, res = response) => {

    const { id } = req.params;
    const { _id, rol, ...resto } = req.body;

    const rolDB = await Role.findOne({ rol: 'ADMIN_APP_ROLE' })
    const usuario = await Usuario.findOne({ _id: id })
    if (usuario.rol == rolDB.rol) {
        return res.status(401).json({
            msg: "No se puede editar un admin"
        });
    }

    // //Encriptar password
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(resto.password, salt);

    //editar y guardar
    const usuarioEditado = await Usuario.findByIdAndUpdate(id, resto);

    res.json({
        msg: 'PUT API de usuario',
        usuarioEditado
    });

}


const deleteUsuario = async (req = request, res = response) => {

    const { id } = req.params;
    const rolDB = await Role.findOne({ rol: 'ADMIN_APP_ROLE' })
    const usuario = await Usuario.findOne({ _id: id })
    if (usuario.rol == rolDB.rol) {
        return res.status(401).json({
            msg: "No se puede eliminar a un admin"
        });
    }

    //eliminar fisicamente y guardar
    const usuarioEliminado = await Usuario.findByIdAndDelete(id);

    res.json({
        msg: 'DELETE API de usuario',
        usuarioEliminado
    });

}

const registroUsuario = async (req = request, res = response) => {
    const { nombre, usuario, password } = req.body;
    //Validar si la liga ya esta registrada en la base de datos
    const UsuarioDB = await Usuario.findOne({ usuario });
    if (UsuarioDB) {
        return res.status(404).json({
            msg: `El usuario: ${usuario} ya existe en la DB`
        })
    }
    const usuarioRegistrado = new Usuario({ nombre, usuario, password });
    const salt = bcryptjs.genSaltSync();
    usuarioRegistrado.password = bcryptjs.hashSync(password, salt);

    await usuarioRegistrado.save();

    const usuarioId = await Usuario.findOne({ usuario });
    //Generar JWT
    const token = await generarJWT(usuarioId.id, usuarioId.rol);

    res.status(201).json({
        msg: 'Nuevo usuario registrado',
        usuarioRegistrado,
        token

    })


}

const deleteCuentaUsuario = async (req = request, res = response) => {
    const { id } = req.params;
    const usuarioId = req.usuario.id;

    if (id === usuarioId) {
        const usuarioEliminado = await Usuario.findByIdAndDelete(id);
        return res.status(401).json({
            msg: 'Cuenta eliminada',
            usuarioEliminado
        })
    } else {
        return res.status(401).json({
            msg: 'No tienes permiso para eliminar este usuario'
        })
    }

}

const updateCuentaUsuario = async (req = request, res = response) => {
    const { id } = req.params;
    const usuarioId = req.usuario.id;
    if (id === usuarioId) {
        const { _id, rol, ...resto } = req.body;

        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(resto.password, salt);

        const usuarioEditado = await Usuario.findByIdAndUpdate(id, resto);
        res.json({
            msg: 'Usuario editado',
            usuarioEditado
        })
    } else {
        return res.status(401).json({
            msg: 'No tienes permiso para editar este usuario'
        })
    }
}

const getMyInfo = async (req = request, res = response) => {
    const usuarioId = req.usuario.id;
    console.log(usuarioId);

    const usuarioById = await Usuario.findById(usuarioId);

    const comentariosUsuario = await Comentario.find({ usuario: usuarioId });

    res.json({
        msg: 'Mi informacion',
        usuarioById,
        comentariosUsuario
    })
}

module.exports = {
    defaultAdminApp,
    getUsuarios,
    postUsuario,
    putUsuario,
    deleteUsuario,
    registroUsuario,
    deleteCuentaUsuario,
    updateCuentaUsuario,
    getMyInfo
}