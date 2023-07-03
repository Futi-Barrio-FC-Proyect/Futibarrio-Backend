//Importacion
const { response, request, query } = require('express');
const bcryptjs = require('bcryptjs');

//Modelos
const Usuario = require('../models/usuario');
const Role = require('../models/role');

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

    const listaUsuarios = await Promise.all([
        Usuario.countDocuments(),
        Usuario.find()
    ]);

    res.json({
        msg: 'Mostrando todos los usuarios existentes',
        listaUsuarios
    });

}

const postUsuario = async (req = request, res = response) => {

    const { nombre, usuario, password, rol } = req.body;
    const usuarioDB = new Usuario({ nombre, usuario, password, rol });

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
    const usuarioRegistrado = new Usuario({ nombre, usuario, password });
    const salt = bcryptjs.genSaltSync();
    usuarioRegistrado.password = bcryptjs.hashSync(password, salt);

    await usuarioRegistrado.save();

    res.status(201).json({
        msg: 'Nuevo usuario registrado',
        usuarioRegistrado

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

module.exports = {
    defaultAdminApp,
    getUsuarios,
    postUsuario,
    putUsuario,
    deleteUsuario,
    registroUsuario,
    deleteCuentaUsuario,
    updateCuentaUsuario
}