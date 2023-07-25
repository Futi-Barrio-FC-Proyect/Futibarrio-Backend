const { Router } = require('express');
const { check } = require('express-validator');

const { getComentario, postComentario, deleteComentario, deleteComentarioUsuario, PutComentarioUsuario } = require('../controllers/comentarios');
const { existecomentarioPorId, existeLigaPorId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminAppRole } = require('../middlewares/validar-roles');

const router = Router();

// Obtener todas los productos - publico
router.get('/mostrar', getComentario);

router.post('/agregar', [
    validarJWT,
    check('comentario', 'El comentario es obligatorio').not().isEmpty(),
    check('liga', 'El ID de la liga a la que pertenecerá el comentario es obluigatorio').not().isEmpty(),
    check('liga').custom(existeLigaPorId),
    validarCampos
], postComentario);

router.put('/editarPorUsuario/:id', [
    validarJWT,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existecomentarioPorId),
    validarCampos
], PutComentarioUsuario);

router.delete('/eliminar/:id', [
    validarJWT,
    esAdminAppRole,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existecomentarioPorId),
    validarCampos
], deleteComentario);

router.delete('/eliminarPorUsuario/:id', [
    validarJWT,
    check('id', 'No es un id de mongo valido').isMongoId(),
    check('id').custom(existecomentarioPorId),
    validarCampos
], deleteComentarioUsuario);

module.exports = router;