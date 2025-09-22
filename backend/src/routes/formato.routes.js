// RUTAS DE formato

const router = require("express").Router(); // importar express.Router()

const formatoController = require('../controllers/formato.controller') // importar el archivo de controladores de roles


router.post('/', formatoController.crear)
router.get('/', formatoController.listar)
router.put('/:id', formatoController.update)
router.delete('/:id', formatoController.eliminarformato)


module.exports = router;