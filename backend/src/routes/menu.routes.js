// RUTAS DE clienteS

const router = require("express").Router(); // importar express.Router()

const menuController = require('../controllers/menu.controller') // importar el archivo de controladores de clientes

router.get('/', menuController.listar)
router.post('/', menuController.crear)
router.put('/:id', menuController.darBaja)
router.put('/baja/:id', menuController.darBaja)


module.exports = router;