//importaciones
const { Router } = require('express');
const { check } = require('express-validator');

const { getJugador, postJugador, putjugador, deleteJugador } = require('../controllers/jugadores');
const { esRoleValido, existeJugadorPorId, existeNombreCamiseta } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminCampRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar', getJugador);

router.post('/agregar', [
    validarJWT,
    esAdminCampRole,
    check('nombre', 'El nombre es obligatorio para el post').not().isEmpty(),
    check('nombreCamiseta').custom(existeNombreCamiseta),
    check('edad', 'La edad es obligatorio para el post').not().isEmpty(),
    check('partidos', 'los partidos jugados es obligatorio para el post').not().isEmpty(),
    check('reconocimientos', 'los reconociemintos del jugador es obligatorio para el post').not().isEmpty(),
    // check('estado', 'El estado del jugador es obligatorio para el post').not().isEmpty(),
    // check('rol', 'El rol de participnte es obligatorio para el post').not().isEmpty(),
    // check('rol').custom(esRoleValido),
    validarCampos
], postJugador);


router.put('/editar/:id', [
    validarJWT,
    esAdminCampRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeJugadorPorId),
    // check('rol').custom(esRoleValido),
    validarCampos
], putjugador);

router.delete('/eliminar/:id', [
    validarJWT,
    esAdminCampRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeJugadorPorId),
    validarCampos
], deleteJugador);


module.exports = router;
