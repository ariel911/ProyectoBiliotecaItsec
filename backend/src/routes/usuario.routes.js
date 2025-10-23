// RUTAS DE USUARIOS

const router = require("express").Router(); // importar express.Router()

const usuarioController = require('../controllers/usuario.controller') // importar el archivo de controladores de usuarios

router.get('/', usuarioController.listar)
router.post('/', usuarioController.crear)
router.put('/:id', usuarioController.update)
router.put('/baja/:id', usuarioController.darBaja)
router.get('/:id', usuarioController.buscarPorId);
module.exports = router;