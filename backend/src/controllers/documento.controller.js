// FUNCIONAMIENTO DE TODAS LAS RUTAS DE USUARIO

const models = require("../database/models/index");
//const { Op } = require('sequelize');

module.exports = {

  listar: async (req, res) => {
    try {
      const documentos = await models.documento.findAll({
        attributes: ['id', 'titulo', 'cantidad', 'anio_edicion', 'ubicacion', 'descripcion', 'estado', 'codigo', 'imagen'],

        include: [
          {
            model: models.area,
            attributes: ['id', 'nombre', 'estado'],
          },
          {
            model: models.carrera,
            attributes: ['id', 'nombre', 'estado'],
          },
          {
            model: models.formato,
            attributes: ['id', 'nombre', 'estado'],
          },
          {
            model: models.tipo_doc,
            attributes: ['id', 'nombre', 'estado'],
          }, {
            model: models.documento_autor,
            attributes: ['autorId', 'documentoId'],
            include: [{
              model: models.autor,
              attributes: ['id', 'nombre', 'estado'],
            }]
          }],
        // include:[{
        //   model:models.area
        // }]
      });
      res.json({
        success: true,
        data: {
          documentos: documentos
        }
      });
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: "Ha ocurrido un error al obtener la lista de documentos"
        }
      });
    }
  },



  //     // Función para crear un nuevo usuario
  crear: async (req, res) => {
    try {
      // Crear el documento
      const documento = await models.documento.create(req.body);

      // Crear las relaciones muchos a muchos con los autores
      console.log(req.body.autores, Array.isArray(req.body.autores))
      if (req.body.autores && Array.isArray(req.body.autores)) {
        for (const autorId of req.body.autores) {
          console.log(autorId)
          await models.documento_autor.create({
            documentoId: documento.id,
            autorId: autorId
          });
        }
      }

      res.status(201).json({
        success: true,
        data: documento
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Ha ocurrido un error al crear el documento'
      });
    }
  },

  update: async (req, res) => {
    try {
      const documento = await models.documento.findByPk(req.params.id);
      if (documento) {
        await documento.update(req.body);

        // Buscar la relación documento_autor por el documentoId
        const relacion = await models.documento_autor.findOne({
          where: { documentoId: documento.id }
        });

        if (relacion) {
          // Si la relación existe, actualizar el autorId
          await relacion.update({ autorId: req.body.autorId });
        } else {
          // Si la relación no existe, crear una nueva relación
          await models.documento_autor.create({
            documentoId: documento.id,
            autorId: req.body.autorId
          })
        }

        res.json({
          success: true,
          data: {
            message: `El documento con id ${documento.id} ha sido actualizado exitosamente`
          }
        });
      } else {
        res.json({
          success: false,
          data: {
            message: 'El autor no existe'
          }
        });
      }
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: 'Ha ocurrido un error al actualizar el autor'
        }
      });
    }
  },
  darBaja: async (req, res) => {
    try {
      const documento = await models.documento.findByPk(req.params.id);


      if (documento) {
        await documento.update(req.body);
      }

      res.json({
        success: true,
        data: {
          message: `El documento con id ${documento.id} ha sido actualizado exitosamente`
        }
      });

    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: 'Ha ocurrido un error al actualizar el autor'
        }
      });
    }
  },
  actualizarDoc: async (req, res) => {
    try {
      const documento = await models.documento.findByPk(req.params.id);

      if (!documento) {
        return res.status(404).json({
          success: false,
          message: 'Documento no encontrado'
        });
      }

      // Incrementar cantidad en +1
      documento.cantidad = (documento.cantidad || 0) + 1;
      await documento.save();

      res.json({
        success: true,
        data: {
          message: `La cantidad del documento con id ${documento.id} ha sido incrementada exitosamente`,
          nuevaCantidad: documento.cantidad
        }
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        data: {
          message: 'Ha ocurrido un error al actualizar la cantidad del documento'
        }
      });
    }
  },

  eliminar: async (req, res) => {
    try {
      const documento = await models.documento.findByPk(req.params.id);
      if (documento) {
        await documento.destroy();
        res.json({
          success: true,
          data: {
            message: `El documento con id ${documento.id} ha sido eliminado exitosamente`
          }
        });
      } else {
        res.json({
          success: false,
          data: {
            message: "No se encontró ningún documento con el ID proporcionado"
          }
        });
      }
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: "Ha ocurrido un error al eliminar el documento"
        }
      });
    }
  }
}