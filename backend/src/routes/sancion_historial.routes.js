// RUTAS DE sancionhistorial

const router = require("express").Router(); // importar express.Router()

const sancionhistorialController = require('../controllers/sancionhistorial.controller') // importar el archivo de controladores de sancionhistoriales


router.post('/', sancionhistorialController.crear)
router.get('/', sancionhistorialController.listar)
router.put('/:id', sancionhistorialController.update)


module.exports = router;