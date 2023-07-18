//importaciones
const { Router } = require('express');
const { check } = require('express-validator');

const { getUsuarios, postUsuario, putUsuario, deleteUsuario, registroUsuario, deleteCuentaUsuario, updateCuentaUsuario } = require('../controllers/usuario');
const { esRoleValido, existeUsuarioPorId, existeUsuario } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { esAdminAppRole, sonAdmins } = require('../middlewares/validar-roles');

const router = Router();

router.get('/mostrar', [
    validarJWT,
    esAdminAppRole,
], getUsuarios);

router.post('/agregar', [
    validarJWT,
    sonAdmins,
    check('nombre', 'El nombre es obligatorio para el post').not().isEmpty(),
    check('usuario', 'El usuario es obligatorio para registrase').not().isEmpty(),
    check('usuario').custom(existeUsuario),
    check('password', 'La password es obligatorio para el post').not().isEmpty(),
    check('password', 'La passwarod debe ser mayor a 6 letras').isLength({ min: 6 }),
    check('rol', 'El rol es obligatorio para el post').not().isEmpty(),
    check('rol').custom(esRoleValido),
    validarCampos,
    
], postUsuario);


router.put('/editar/:id', [
    validarJWT,
    sonAdmins,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('usuario').custom(existeUsuario),
    check('password', 'La password es obligatorio para el put').not().isEmpty(),
    check('password', 'La passwarod debe ser mayor a 6 letras').isLength({ min: 6 }),
    check('rol').custom(esRoleValido),
    validarCampos
], putUsuario);

router.delete('/eliminar/:id', [
    validarJWT,
    sonAdmins,
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], deleteUsuario);

router.put('/editarmicuenta/:id', [
    validarJWT,
], updateCuentaUsuario);

router.delete('/eliminarmicuenta/:id', [
    validarJWT,
], deleteCuentaUsuario);

router.post('/register', [
    check('nombre', 'El nombre es obligatorio para registrase').not().isEmpty(),
    check('usuario', 'El nombre es obligatorio para registrase').not().isEmpty(),
    check('usuario').custom(existeUsuario),
    check('password', 'El nombre es obligatorio para registrase').not().isEmpty(),
    validarCampos
], registroUsuario)


module.exports = router;