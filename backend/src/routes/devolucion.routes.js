const router = require("express").Router(); // importar express.Router()

const devolucionController = require('../controllers/devolucion.controller') // importar el archivo de controladores de usuarios


router.get('/', devolucionController.listar)
router.post('/', devolucionController.crear)




module.exports = router;