//importaciones
const { Router } = require('express');
const { check } = require('express-validator');

const { getLiga, postLiga, putLiga, deleteLiga, agregarEquipos, eliminarEquipos } = require('../controllers/liga');
const { existeEquipoPorId, existeLigaPorId, existeNombreLiga, } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminAppRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar', getLiga);

router.post('/agregar', [
    validarJWT,
    esAdminAppRole,
    check('nombre', 'El nombre es obligatorio para el post').not().isEmpty(),
    check('nombre').custom(existeNombreLiga),
    check('capacidad', 'La capacidad de la liga es obligatorio para el post').not().isEmpty(),
    check('descripcion', 'La descripcion es obligatorio para el post').not().isEmpty(),
    validarCampos
], postLiga);

router.put('/agregarEquipo/:idEquipo', [
    validarJWT,
    esAdminAppRole,
    check('idEquipo', 'No es un ID valido').isMongoId().custom(existeEquipoPorId),
    check('ligaId', 'El Id de la liga al que pertenecerá el equipo es obligatorio').not().isEmpty(),
    check('ligaId').custom(existeLigaPorId),
    validarCampos
], agregarEquipos);

router.delete('/eliminarEquipo/:idEquipo', [
    validarJWT,
    esAdminAppRole,
    check('idEquipo', 'No es un ID valido').isMongoId().custom(existeEquipoPorId),
    check('ligaId', 'El Id de la liga que se desea eliminar es obligatorio').not().isEmpty(),
    check('ligaId').custom(existeLigaPorId),
    validarCampos
], eliminarEquipos);


router.put('/editar/:id', [
    validarJWT,
    esAdminAppRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeLigaPorId),
    validarCampos
], putLiga);

router.delete('/eliminar/:id', [
    validarJWT,
    esAdminAppRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeLigaPorId),
    validarCampos
], deleteLiga);


module.exports = router;