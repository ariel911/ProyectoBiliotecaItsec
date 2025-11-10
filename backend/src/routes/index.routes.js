// SE ENCARGA DE CONECTAR TODAS LAS RUTAS

const { Router } = require("express") // importar express
//const decodeJWT = require("./middlewares/decodeJWT.js")
const authRoutes = require("./auth.routes")
//const accesRoutes= require("./acces.routes")

const usuarioRoutes = require("../routes/usuario.routes") // importar el archivo de rutas de usuarios
const rolRoutes = require("../routes/rol.routes") // importar el archivo de rutas de rol
const areaRoutes = require("../routes/area.routes") // importar el archivo de rutas de area
const tipo_docRoutes = require("../routes/tipo_doc.routes") // importar el archivo de rutas de tipo_doc
const tipo_personaRoutes = require("../routes/tipo_persona.routes") // importar el archivo de rutas de tipo_doc
const carreraRoutes = require("../routes/carrera.routes") // importar el archivo de rutas de carrera
const sancionRoutes = require("../routes/sancion.routes") // importar el archivo de rutas de sancion
const sancionHistorialRoutes = require("../routes/sancion_historial.routes") // importar el archivo de rutas de sancion historial
const personaRoutes = require("../routes/persona.routes") // importar el archivo de rutas de estudiante
const autorRoutes = require("../routes/autor.routes") // importar el archivo de rutas de autor
const documentoRoutes = require("./documento.routes") // importar el archivo de rutas de documentos
const reservaRoutes= require("./reserva.routes")
const prestamoRoutes= require("./prestamo.routes")
const devolucionRoutes= require("./devolucion.routes")
const menuRoutes= require("./menu.routes")
const backupRoutes = require("./backup.routes"); 
const recuperacionRoutes = require("../routes/recuperacion.routes");

const rutas_init = () => { // aca se ponen todas las rutas que existen
  const router = Router() // crear una instancia de express.Router()

  router.use("/usuarios", usuarioRoutes) // para acceder a las rutas de usuarios de la api siempre deberá empezar con /usuarios
  router.use("/rol", rolRoutes) // para acceder a las rutas de rol de la api siempre deberá empezar con /rol
  router.use("/area", areaRoutes) // para acceder a las rutas de area de la api siempre deberá empezar con /area
  router.use("/tipo_doc", tipo_docRoutes) // para acceder a las rutas de tipo_doc de la api siempre deberá empezar con /tipo_doc
  router.use("/tipo_persona", tipo_personaRoutes) // para acceder a las rutas de tipo_doc de la api siempre deberá empezar con /tipo_doc
  router.use("/carrera", carreraRoutes) // para acceder a las rutas de carrera de la api siempre deberá empezar con /carrera
  router.use("/sancion", sancionRoutes) // para acceder a las rutas de sancion de la api siempre deberá empezar con /sancion
  router.use("/sancion_historial", sancionHistorialRoutes) // para acceder a las rutas de sancion de la api siempre deberá empezar con /sancion historial
  router.use("/persona", personaRoutes) // para acceder a las rutas de estudiante de la api siempre deberá empezar con /estudiante
  router.use("/autor", autorRoutes) // para acceder a las rutas de autor de la api siempre deberá empezar con /autor
  router.use("/documento", documentoRoutes) // para acceder a las rutas de documento de la api siempre deberá empezar con /documento
  router.use("/prestamo", prestamoRoutes)
  router.use("/devolucion", devolucionRoutes)
  router.use("/menu", menuRoutes)
  router.use("/backup", backupRoutes); 
  router.use("/recuperacion", recuperacionRoutes); 

  return router // retornar el router
};
const rutas_auth = () => {
  const router = Router()
  router.use("/auth", authRoutes)
  return router
}
const ruta_reserva = () => {
  const router = Router()
  router.use("/reserva", reservaRoutes)
  return router
}
/* const ruta_acceso=()=>{
  const router = Router()
  router.use("/acceso", accesRoutes)
  return router
} */
module.exports = { rutas_init,rutas_auth,ruta_reserva} // exportar el archivo de rutas de la api