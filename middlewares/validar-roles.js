const { request, response } = require('express');

const esAdminAppRole = (req = request, res = response, next) => {

    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Antes de validar tu rol, debes estar logueado'
        });
    }
    const { rol, nombre } = req.usuario
    if (rol !== 'ADMIN_APP_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es admin de la app - solo el admin de la app tiene autorización`
        });
    }

    next();

}

const esAdminCampRole = (req = request, res = response, next) => {

    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Antes de validar tu rol, debes estar logueado'
        });
    }
    const { rol, nombre } = req.usuario
    if (rol !== 'ADMIN_CAMP_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es admin del campo - solo el admin del campo tiene autorización`
        });
    }

    next();

}

const sonAdmins = (req = request, res = response, next) => {

    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Antes de validar tu rol, debes estar logueado'
        });
    }
    const { rol, nombre } = req.usuario
    if (rol !== 'ADMIN_APP_ROLE' && rol !== 'ADMIN_CAMP_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es admin - hablar con un admin`
        });
    }

    next();

}

module.exports = {
    esAdminAppRole,
    esAdminCampRole,
    sonAdmins,
}