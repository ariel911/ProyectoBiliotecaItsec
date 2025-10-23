// FUNCIONAMIENTO DE TODAS LAS RUTAS DE USUARIO

const models = require("../database/models/index");

module.exports = {

  listar: async (req, res) => {
    try {
      const prestamos = await models.prestamo.findAll({
        attributes: ['id', 'garantia', 'estado', 'fecha_prestamo', 'fecha_devolucion'],
        include: [
          {
            model: models.usuario, // Agregar modelo de usuarios
            attributes: ['id', 'nombre', 'estado'], // Especificar las columnas que se desean obtener
          },
          {
            model: models.documento,
            attributes: ['id', 'descripcion', 'titulo', 'estado']

          },
          {
            model: models.persona,
            attributes: ['id', 'nombre', 'correo', 'estado'],
            include: [{
              model: models.persona_carrera,
              include: [{
                model: models.carrera,
                attributes: ['id', 'nombre', 'estado'],
              }]
            },
            {
              model: models.tipo_persona,
              attributes: ['id', 'nombre', 'estado'],

            }
            ]
          },
        ],
      });
      res.json({
        success: true,
        data: {
          prestamos: prestamos
        }
      });
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: "Ha ocurrido un error al obtener la lista de prestamos"
        }
      });
    }
  },

  crear: async (req, res) => {
    try {
      const { documentoId, usuarioId, personaId } = req.body; // Se extraen los valores de documentoId y usuarioId del cuerpo de la solicitud

      const documento = await models.documento.findByPk(documentoId); // Se busca el documento correspondiente en la base de datos

      //console.log(documento.cantidad)
      if (!documento) { // Si el documento no existe, se responde con un mensaje de error
        res.json({
          success: false,
          data: {
            message: `El documento no existe `
          }
        });
        return;
      }
      if (documento.estado === 0) { // Si el documento ya está reservado, se responde con un mensaje de error
        res.json({
          success: false,
          data: {
            message: 'El documento ya no tiene ejemplares'
          }
        });
        return;
      }

      await models.sequelize.transaction(async (t) => { // Se inicia una transacción de base de datos
        if (documento.cantidad === 0) {
          await documento.update({ // Se actualiza el número de cantidad del documento
            cantidad: 0
          }, { transaction: t });
        } else {
          await documento.update({ // Se actualiza el número de cantidad del documento
            cantidad: documento.cantidad - 1
          }, { transaction: t });
        }


        await models.prestamo.create({ // Se crea una nueva reserva en la base de datos
          documentoId,
          usuarioId,
          personaId,
          estado: req.body.estado,
          garantia: req.body.garantia,
          observaciones: req.body.observaciones,
          fecha_devolucion: req.body.fecha_devolucion,
          fecha_prestamo: req.body.fecha_prestamo,
          sancionId: req.body.sancionId // Actualiza la relación con sancion
        }, { transaction: t });
      });
      if (documento.cantidad == 0) { // Si no hay cantidad disponibles, se actualiza el estado del documento y se responde con un mensaje de error
        await documento.update({
          estado: 0
        });
      }
      res.json({ // Se responde con un mensaje de éxito
        success: true,
        data: {
          message: `El documento con id ${documentoId} con cantidad ${documento.cantidad} ha sido prestado exitosamente`
        }
      });


    } catch (error) { // Si ocurre algún error, se responde con un mensaje de error
      console.error(error);
      res.json({
        success: false,
        data: {
          message: 'Ha ocurrido un error al prestar el documento'
        }
      });
    }

  },
  crearPR: async (req, res) => {
    try {
      const prestamos = await models.prestamo.create(req.body);
      res.status(201).json({
        success: true,
        data: prestamos
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Ha ocurrido un error al crear el prestamo'
      });
    }
  },
  update: async (req, res) => {
    try {
      const prestamo = await models.prestamo.findByPk(req.params.id);
      const documento2 = await models.documento.findByPk(prestamo.documentoId);
      const documento = await models.documento.findByPk(req.body.documentoId);


      // Se busca el documento correspondiente en la base de datos

      if (!documento) { // Si el documento no existe, se responde con un mensaje de error
        res.json({
          success: false,
          data: {
            message: 'El documento no existe'
          }
        });
        return;
      }
      if (documento.cantidad > 0) {

        if (prestamo) {
          if (documento.cantidad === documento2.cantidad) {
            await documento.update({
              cantidad: documento.cantidad
            })
          } else {
            await documento.update({
              cantidad: documento.cantidad - 1
            })
            await documento2.update({
              cantidad: documento2.cantidad + 1
            })
          }

          await prestamo.update(req.body);

          res.json({
            success: true,
            data: {
              message: `El prestamo con id ${prestamo.id} ha sido actualizado exitosamente`
            }
          });
        } else {
          res.json({
            success: false,
            data: {
              message: 'La prestamo no existe'
            }
          });
        }
      } else {
        res.json({
          success: false,
          data: {
            message: 'No existe cantidad'
          }
        });
      }

    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: 'Ha ocurrido un error al actualizar el prestamo'
        }
      });
    }
  },
  eliminar: async (req, res) => {
    try {
      const prestamo = await models.prestamo.findByPk(req.params.id);
      const documento = await models.documento.findByPk(prestamo.documentoId);
      if (prestamo) {

        await documento.update({
          cantidad: documento.cantidad + 1, // Se actualiza el número de cantidad del documento
          estado: 1
        })
        await prestamo.destroy();
        res.json({
          success: true,
          data: {
            message: `El prestamo con id ${prestamo.id} ha sido eliminado exitosamente`
          }
        });
      } else {
        res.json({
          success: false,
          data: {
            message: "No se encontró ningún prestamo con el ID proporcionado"
          }
        });
      }
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: "Ha ocurrido un error al eliminar el prestamo"
        }
      });
    }
  },
  darBaja: async (req, res) => {
    try {
      const prestamo = await models.prestamo.findByPk(req.params.id);
      const documento = await models.documento.findByPk(prestamo.documentoId);
      if (prestamo) {
        await documento.update({
          cantidad: documento.cantidad + 1, // Se actualiza el número de cantidad del documento
          estado: 1
        })
        if (prestamo) {
          await prestamo.update({
            cantidad: documento.cantidad + 1, // Se actualiza el número de cantidad del documento
            estado: 0
          });
        }
      }
      res.json({
        success: true,
        data: {
          message: `El prestamo con id ${prestamo.id} ha sido actualizado exitosamente`
        }
      });

    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: 'Ha ocurrido un error al actualizar el prestamo'
        }
      });
    }
  },
}