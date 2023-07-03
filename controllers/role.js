const { request, response } = require('express');
const Roles = require('../models/role');

const defaultRoleAdminApp = async () => {
    try {
        let role = new Roles();
        role.rol = "ADMIN_APP_ROLE";
        const roleEncontrado = await Roles.findOne({ rol: role.rol });
        if (roleEncontrado) return console.log("El rol adminApp está listo");
        role = await role.save();
        if (!role) return console.log("El rol adminApp no está listo!");
        return console.log("El rol adminApp está listo!");
    } catch (err) {
        throw new Error(err);
    }
};

const defaultRoleAdminCampo = async () => {
    try {
        let role = new Roles();
        role.rol = "ADMIN_CAMP_ROLE";
        const roleEncontrado = await Roles.findOne({ rol: role.rol });
        if (roleEncontrado) return console.log("El rol AdminCamp está listo");
        role = await role.save();
        if (!role) return console.log("El rol AdminCamp no está listo!");
        return console.log("El rol AdminCamp está listo!");
    } catch (err) {
        throw new Error(err);
    }
};

const defaultRoleArbitro = async () => {
    try {
        let role = new Roles();
        role.rol = "ARBITRO_ROLE";
        const roleEncontrado = await Roles.findOne({ rol: role.rol });
        if (roleEncontrado) return console.log("El rol arbitro está listo");
        role = await role.save();
        if (!role) return console.log("El rol arbitro no está listo!");
        return console.log("El rol arbitro está listo!");
    } catch (err) {
        throw new Error(err);
    }
};

const defaultRoleJugador = async () => {
    try {
        let role = new Roles();
        role.rol = "JUGADOR_ROLE";
        const roleEncontrado = await Roles.findOne({ rol: role.rol });
        if (roleEncontrado) return console.log("El rol jugador está listo");
        role = await role.save();
        if (!role) return console.log("El rol jugador no está listo!");
        return console.log("El rol jugador está listo!");
    } catch (err) {
        throw new Error(err);
    }
};

const defaultRoleUsuario = async () => {
    try {
        let role = new Roles();
        role.rol = "USUARIO_ROLE";
        const roleEncontrado = await Roles.findOne({ rol: role.rol });
        if (roleEncontrado) return console.log("El rol usuario está listo");
        role = await role.save();
        if (!role) return console.log("El rol usuario no está listo!");
        return console.log("El rol usuario está listo!");
    } catch (err) {
        throw new Error(err);
    }
};

const getRoles = async (req = request, res = response) => {
    const listarRoles = await Promise.all([
        Roles.countDocuments(),
        Roles.find()
    ]);

    res.json({
        msg: 'get Api - Controlador Roles',
        listarRoles
    });
}

const postRoles = async (req = request, res = response) => {
    //toUpperCase para todo a Mayusculas
    const rol = req.body.rol.toUpperCase();

    // Generar la data a guardar
    const data = { rol }

    const role = new Roles(data);
    //Guardar en DB
    await role.save();

    res.status(201).json(role);

}


const putRoles = async (req = request, res = response) => {
    const { id } = req.params;

    const { _id, ...resto } = req.body;

    resto.rol = resto.rol.toUpperCase();

    //Editar o actualiar la cateogira
    const rolEditado = await Roles.findByIdAndUpdate(id, resto, { new: true });

    res.status(201).json({ msg: 'Rol Editado: ', rolEditado });
}

const deleteRoles = async (req = request, res = response) => {
    const { id } = req.params;

    //Editar o actualiar la cateogira: Estado FALSE
    const rolBorrado = await Roles.findByIdAndDelete(id);

    res.status(201).json({ msg: 'Rol borrado: ', rolBorrado });
}

module.exports = {
    getRoles,
    postRoles,
    putRoles,
    deleteRoles,
    defaultRoleAdminApp,
    defaultRoleAdminCampo,
    defaultRoleJugador,
    defaultRoleArbitro,
    defaultRoleUsuario
}