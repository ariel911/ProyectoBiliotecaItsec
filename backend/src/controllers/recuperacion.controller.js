const models = require("../database/models/index");

module.exports = {
  // ✅ Restaurar backup recibido directamente por body
  recuperarBackup: async (req, res) => {
    try {
      const jsonData = req.body;

      // Validación básica del contenido
      if (!jsonData || typeof jsonData !== "object" || Array.isArray(jsonData)) {
        return res.status(400).json({
          success: false,
          message: "El archivo JSON es inválido o está vacío.",
        });
      }

      // Orden lógico de inserción (respetando relaciones)
      const entidades = [
        "rols",
        "usuarios",
        "areas",
        "tipo_docs",
        "tipo_personas",
        "carreras",
        "sancions",
        "personas",
        "persona_carreras",
        "autors",
        "documentos",
        "reservas",
        "prestamos",
        "devolucions",
        "documento_autors",
        "documento_personas",
      ];

      for (const entidad of entidades) {
        const registros = jsonData[entidad];
        if (registros && Array.isArray(registros) && registros.length > 0) {
          const nombreModelo = entidad.slice(0, -1); // quitar plural (ej: usuarios -> usuario)
          const modelo = models[nombreModelo];

          if (modelo) {
            try {
              // Inserta ignorando duplicados
              await modelo.bulkCreate(registros, {
                ignoreDuplicates: true,
              });
            } catch (error) {
              console.warn(`⚠️ Error parcial en ${entidad}:`, error.message);
            }
          } else {
            console.warn(`⚠️ Modelo no encontrado para la entidad: ${entidad}`);
          }
        }
      }

      res.json({
        success: true,
        message: "✅ Backup restaurado correctamente.",
      });
    } catch (error) {
      console.error("❌ Error al recuperar el backup:", error);
      res.status(500).json({
        success: false,
        message: "Ha ocurrido un error al restaurar el backup.",
        error: error.message,
      });
    }
  },
};
