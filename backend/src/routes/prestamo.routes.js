const router = require("express").Router(); // importar express.Router()

const prestamosController = require('../controllers/prestamo.controller') // importar el archivo de controladores de usuarios


router.get('/', prestamosController.listar)
router.post('/', prestamosController.crear)
router.post('/PrestamoR', prestamosController.crearPR)
router.put('/:id', prestamosController.update)
router.put('/ampliar/:id', prestamosController.actualizarFechaFin)
router.delete('/:id', prestamosController.eliminar)
router.put('/baja/:id', prestamosController.darBaja)



module.exports = router;