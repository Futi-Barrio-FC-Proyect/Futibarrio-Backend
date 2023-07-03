//importaciones
const { Router } = require('express');
const { check } = require('express-validator');

const { getEquipo, postEquipo, putEquipo, deleteEquipo, agregarJugadores, eliminarJugadores } = require('../controllers/equipo');
const { existeJugadorPorId, existeEquipoPorId, existeNombreEquipo, } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminCampRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar', getEquipo);

router.post('/agregar', [
    validarJWT,
    esAdminCampRole,
    check('nombre', 'El nombre es obligatorio para el post').not().isEmpty(),
    check('nombre').custom(existeNombreEquipo),
    check('descripcion', 'La descripcion es obligatorio para el post').not().isEmpty(),
    check('logros', 'los logros del equipo son obligatorio para el post').not().isEmpty(),
    check('director', 'El director del equipo es obligatorio para el post').not().isEmpty(),
    check('puntaje', 'El puntaje de equipo es obligatorio para el post').not().isEmpty(),
    validarCampos
], postEquipo);

router.put('/agregarJugador/:idJugador', [
    validarJWT,
    esAdminCampRole,
    check('idJugador', 'No es un ID valido').isMongoId().custom(existeJugadorPorId),
    check('equipoId', 'El Id del Equipo al que pertenecerá el jugador es obligatorio').not().isEmpty(),
    check('equipoId').custom(existeEquipoPorId),
    validarCampos
], agregarJugadores);

router.delete('/eliminarJugador/:idJugador', [
    validarJWT,
    esAdminCampRole,
    check('idJugador', 'No es un ID valido').isMongoId().custom(existeJugadorPorId),
    check('equipoId', 'El Id del Equipo que se quiere eliminar es obligatorio').not().isEmpty(),
    check('equipoId').custom(existeEquipoPorId),
    validarCampos
], eliminarJugadores);

router.put('/editar/:id', [
    validarJWT,
    esAdminCampRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeEquipoPorId),
    validarCampos
], putEquipo);

router.delete('/eliminar/:id', [
    validarJWT,
    esAdminCampRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeEquipoPorId),
    validarCampos
], deleteEquipo);


module.exports = router;