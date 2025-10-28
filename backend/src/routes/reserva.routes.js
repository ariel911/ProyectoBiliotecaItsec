const router = require("express").Router(); // importar express.Router()

const reservaController = require('../controllers/reserva.controller') // importar el archivo de controladores de usuarios


router.get('/', reservaController.listar)
router.post('/', reservaController.crear)
router.put('/:id', reservaController.update)
router.put('/baja/:id', reservaController.darBaja)
router.put('/cancelar/:id', reservaController.cancelar)
router.delete('/:id', reservaController.eliminar)



module.exports = router;