//importaciones
const { Router } = require('express');
const { check } = require('express-validator');

const { getPartido, postPartido, putPartido, deletePartido, } = require('../controllers/partidos');
const { existePartidoPorId, existeNombreLigaP, existeNombreEquipoP, } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminCampRole } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar', getPartido);

router.post('/agregar', [
    validarJWT,
    esAdminCampRole,
    check('descripcion', 'la descripcion es obligatorio para el post').not().isEmpty(),
    check('fecha', 'la fecha es obligatorio para el post').not().isEmpty(),
    check('liga', 'La liga es obligatorio para el post').not().isEmpty(),
    check('liga').custom(existeNombreLigaP),
    check('equipo1', 'El equipo 1 es obligatorio para el post').not().isEmpty(),
    check('equipo1').custom(existeNombreEquipoP),
    check('equipo2', 'El equipo 2 es obligatorio para el post').not().isEmpty(),
    check('equipo2').custom(existeNombreEquipoP),
    validarCampos
], postPartido);

router.put('/editar/:id', [
    validarJWT,
    esAdminCampRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existePartidoPorId),
    validarCampos
], putPartido);

router.delete('/eliminar/:id', [
    validarJWT,
    esAdminCampRole,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existePartidoPorId),
    validarCampos
], deletePartido);


module.exports = router;