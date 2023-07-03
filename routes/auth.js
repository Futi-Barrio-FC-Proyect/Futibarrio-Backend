const { Router } = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { usuarioExiste } = require('../helpers/db-validators');

const router = Router();

router.post('/login', [
    check('usuario').not().isEmpty(),
    check('password', 'La password es obligatoria').not().isEmpty(),
    validarCampos
] ,login);


module.exports = router;