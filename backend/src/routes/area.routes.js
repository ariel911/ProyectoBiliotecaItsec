// RUTAS DE AREA

const router = require("express").Router(); // importar express.Router()

const areaController = require('../controllers/area.controller') // importar el archivo de controladores de roles


router.post('/', areaController.crear)
router.get('/', areaController.listar)
router.put('/:id', areaController.update)
router.delete('/:id', areaController.eliminarArea)


module.exports = router;