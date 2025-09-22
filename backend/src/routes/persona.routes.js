// RUTAS DE personaS

const router = require("express").Router(); // importar express.Router()

const personaController = require('../controllers/persona.controller') // importar el archivo de controladores de personas

router.get('/', personaController.listar)
router.post('/', personaController.crear)
router.put('/:id', personaController.update)
router.put('/baja/:id', personaController.darBaja)
router.put('/sancionar/:id', personaController.sancionar)

module.exports = router;