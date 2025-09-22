// RUTAS DE roles

const router = require("express").Router(); // importar express.Router()

const rolController = require('../controllers/rol.controller') // importar el archivo de controladores de roles


router.post('/', rolController.crear)
router.get('/', rolController.listar)
router.put('/:id', rolController.update)
router.put('/baja/:id', rolController.darBaja)
router.delete('/:id', rolController.eliminar)


module.exports = router;