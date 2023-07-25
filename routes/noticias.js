const { Router } = require('express');
const { check } = require('express-validator');

const { getNoticias, postNoticias, deleteNoticia, deleteNoticiaUsuario, PutNoticiaUsuario } = require('../controllers/noticias');
const { existenoticiaPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { sonAdmins, esAdminAppRole } = require('../middlewares/validar-roles');

const router = Router();

// Obtener todas los productos - publico
router.get('/mostrar', getNoticias);

router.post('/agregar', [
    validarJWT,
    sonAdmins,
    check('tittle', 'El titulo es obligatorio').not().isEmpty(),
    check('noticia', 'La noticia es obligatorio').not().isEmpty(),
    validarCampos
], postNoticias);

router.put('/editarPorUsuario/:id', [
    validarJWT,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existenoticiaPorId),
    validarCampos
], PutNoticiaUsuario);

router.delete('/eliminar/:id', [
    validarJWT,
    esAdminAppRole,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existenoticiaPorId),
    validarCampos
], deleteNoticia);

router.delete('/eliminarPorUsuario/:id', [
    validarJWT,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existenoticiaPorId),
    validarCampos
], deleteNoticiaUsuario);

module.exports = router;