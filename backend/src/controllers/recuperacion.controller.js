const models = require("../database/models/index");

module.exports = {
  cargarBackup: async (req, res) => {
    try {
      // Obtén los datos del cuerpo de la solicitud
      const backupData = req.body;

      // Define el mapeo entre entidades y modelos
      const entidadModeloMap = {
        carreras: models.carrera,
        roles: models.rol,
        usuarios: models.usuario,
        areas: models.area,
        tiposDocumento: models.tipo_doc,
        tiposPersona: models.tipo_persona,
        sanciones: models.sancion,
        personas: models.persona,
        autores: models.autor,
        formatos: models.formato,
        documentos: models.documento,
        reservas: models.reserva,
        prestamos: models.prestamo,
        devoluciones: models.devolucion,
        menus: models.menu,
        // Agrega aquí otras entidades según sea necesario
        documento_autor: models.documento_autor,
        menu_rol: models.menu_rol,
      };

      // Procesa cada entidad del objeto JSON
      for (const [entidad, registros] of Object.entries(backupData)) {
        const modelo = entidadModeloMap[entidad];

        if (!modelo) {
          console.warn(`Modelo no definido para la entidad: ${entidad}`);
          continue;
        }

        console.log(`Procesando datos para la entidad: ${entidad}`);
        for (const registro of registros) {
          // Usa findOrCreate para insertar o evitar duplicados
          await modelo.findOrCreate({
            where: { id: registro.id }, // Verifica por ID u otro campo único
            defaults: registro, // Inserta si no existe
          });
        }
      }

      res.json({
        success: true,
        message: "Datos cargados exitosamente desde el backup.",
      });
    } catch (error) {
      console.error("Error al cargar datos desde el backup:", error);
      res.status(500).json({
        success: false,
        message: "Error al cargar datos desde el backup.",
      });
    }
  },
};
