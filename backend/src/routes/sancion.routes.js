// RUTAS DE sancion

const router = require("express").Router(); // importar express.Router()

const sancionController = require('../controllers/sancion.controller') // importar el archivo de controladores de sanciones


router.post('/', sancionController.crear)
router.get('/', sancionController.listar)
router.put('/:id', sancionController.update)


module.exports = router;