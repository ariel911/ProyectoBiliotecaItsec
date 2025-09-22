const express = require("express");
const router = express.Router();
const recuperacionController = require("../controllers/recuperacion.controller");

router.post("/cargar", recuperacionController.cargarBackup);

module.exports = router;
