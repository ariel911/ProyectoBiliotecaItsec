// routes/backup.routes.js
const router = require("express").Router();
const backupController = require("../controllers/backup.controller");

router.get("/", backupController.generarBackup);

module.exports = router;
