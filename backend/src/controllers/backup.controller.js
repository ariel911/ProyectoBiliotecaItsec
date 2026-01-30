const models = require("../database/models/index");

module.exports = {
  generarBackup: async (req, res) => {
    try {
      // Modelos base sin relaciones muchos a muchos
      const entidades = {
        menus: models.menu,
        rols: models.rol,
        menu_rols: models.menu_rol,
        usuarios: models.usuario,
        tipo_docs:models.tipo_doc,
        tipo_personas:models.tipo_persona,
        areas: models.area,
        carreras: models.carrera,
        personas: models.persona,
        persona_carreras: models.persona_carrera,
        autors: models.autor,
        documentos: models.documento,
        reservas: models.reserva,
        prestamos: models.prestamo,
        devolucions: models.devolucion,
        sancions: models.sancion,
        sancion_historials: models.sancion_historial,
    
        // Relaciones muchos a muchos
        documento_autors: models.documento_autor,
        documento_personas: models.documento_persona,
    
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
