const models = require("../database/models/index");

module.exports = {
  generarBackup: async (req, res) => {
    try {
      // Modelos base sin relaciones muchos a muchos
      const entidades = {
        usuarios: models.usuario,
        roles: models.rol,
        areas: models.area,
        tiposDocumento: models.tipo_doc,
        tiposPersona: models.tipo_persona,
        carreras: models.carrera,
        sanciones: models.sancion,
        personas: models.persona,
        autores: models.autor,
        formatos: models.formato,
        documentos: models.documento,
        reservas: models.reserva,
        prestamos: models.prestamo,
        devoluciones: models.devolucion,
        menus: models.menu,
        // Relaciones muchos a muchos
        documento_autor: models.documento_autor,
        menu_rol: models.menu_rol,
      };

      const backup = {};

      for (const [nombre, modelo] of Object.entries(entidades)) {
        backup[nombre] = await modelo.findAll({ raw: true });
      }

      // ✅ Enviar el backup como JSON
      res.json({
        success: true,
        data: backup,
      });
    } catch (error) {
      console.error("Error generando el backup:", error);
      res.status(500).json({
        success: false,
        message: "Ha ocurrido un error al generar el backup.",
      });
    }
  },
};
