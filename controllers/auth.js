const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async( req = request, res = response ) => {

    const { usuario, password } = req.body;

    try {
        
        //Verificar si el usuario existe
        const usuarioExiste = await Usuario.findOne( { usuario } );

        if ( !usuarioExiste ) {
            return res.status(404).json({
                msg: 'Usuario no existe en la base de datos.'
            });
        }
    
        //Verificar la password el usuario    //comporeSync, encripta ambas passwords y las compara
        const validarPassword = bcryptjs.compareSync( password, usuarioExiste.password );
        if ( !validarPassword ) {
            return res.status(400).json({
                msg: 'La password es incorrecta'
            });
        }

        //Generar JWT
        const roleAsignado = usuarioExiste.rol;
        const token = await generarJWT( usuarioExiste.id, usuarioExiste.rol );


    
        res.json({
            msg: 'Login Auth Funciona!',
            nombre: usuarioExiste.nombre,
            usuario, password,
            token,
            roleAsignado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el admin'
        })
    }


}


module.exports = {
    login
}