// FUNCIONAMIENTO DE TODAS LAS RUTAS DE USUARIO

const models = require("../database/models/index");

module.exports = {

    listar: async (req, res) => {
        try {
          const reserva = await models.reserva.findAll({
            attributes:['id','fecha_reserva','estado','fecha_validez','documentoId'],
            include:[{
              model:models.documento,
              attributes:['id','descripcion','titulo','estado'],
            },{
              model: models.persona,
              attributes:['id','nombre','estado']
              }]
          });
          res.json({
            success: true,
            data: {
                reserva: reserva
            }
          });
        } catch (error) {
          //console.error(error);
          res.json({
            success: false,
            data: {
              message: "Ha ocurrido un error al obtener la lista de reservas"
            }
          });
        }
      },
 
      crear: async (req, res) => {
        try {
          const { documentoId, personaId } = req.body; // Se extraen los valores de documentoId y usuarioId del cuerpo de la solicitud
      
          const documento = await models.documento.findByPk(documentoId); // Se busca el documento correspondiente en la base de datos
      
          if (!documento) { // Si el documento no existe, se responde con un mensaje de error
            res.json({
              success: false,
              data: {
                message: 'El documento no existe'
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
      
            if(documento.cantidad === 0){
                await documento.update({ // Se actualiza el número de cantidad del documento
                  cantidad: 0
                }, { transaction: t });
                res.json({ // Se responde con un mensaje de éxito
                    success: false,
                    data: {
                      message: `El documento con id ${documentoId} ya no tiene ejemplares disponibles`
                    }
                  });
              }else{
                await documento.update({ // Se actualiza el número de cantidad del documento
                  cantidad: documento.cantidad - 1
                }, { transaction: t });
                await models.reserva.create({ // Se crea una nueva reserva en la base de datos
                    documentoId,
                    personaId,
                    fecha_reserva:req.body.fecha_reserva,
                    fecha_validez:req.body.fecha_validez,
                    estado:req.body.estado,
                  }, { transaction: t });
              }
      

          });
          if (documento.cantidad == 0) { // Si no hay cantidad disponibles, se actualiza el estado del documento y se responde con un mensaje de error
            await documento.update({
              estado: 0
            });
          }
          res.json({ // Se responde con un mensaje de éxito
            success: true,
            data: {
              message: `El documento con id ${documentoId} ha sido reservado exitosamente`
            }
          });
          
           
        } catch (error) { // Si ocurre algún error, se responde con un mensaje de error
          //console.error(error);
           res.json({
            success: false,
            data: {
              message: 'Ha ocurrido un error al reservar el documento'
            }
          }); 
        }

      },

    update: async (req, res) => {
        try {
            const reserva = await models.reserva.findByPk(req.params.id);
            const documento2 = await models.documento.findByPk(reserva.documentoId);
            const documento = await models.documento.findByPk(req.body.documentoId);
            
            
            // Se busca el documento correspondiente en la base de datos
            if(documento2.id== documento.id){
                await documento.update({
                    cantidad:documento.cantidad
            })
            await reserva.update(req.body);
    
                res.json({
                    success: true,
                    data: {
                        message: `La reserva con id ${reserva.id} ha sido actualizado exitosamente`
                    }
                });
            
            }
          if (!documento) { // Si el documento no existe, se responde con un mensaje de error
            res.json({
              success: false,
              data: {
                message: 'El documento no existe'
              }
            });
            return;
          }
            if(documento.cantidad>0){
              await documento.update({
                cantidad:documento.cantidad-1
              })
              await documento2.update({
                cantidad:documento2.cantidad+1
              })
              if (reserva) {
                await reserva.update(req.body);
    
                res.json({
                    success: true,
                    data: {
                        message: `La reserva con id ${reserva.id} ha sido actualizado exitosamente`
                    }
                });
            } else {
                res.json({
                    success: false,
                    data: {
                        message: 'La reserva no existe'
                    }
                });
            }
            }else{
              res.json({
                success: false,
                data: {
                    message: 'No existe cantidad'
                }
            });
            }
              
        } catch (error) {
            //console.error(error);
            /* res.json({
                success: false,
                data: {
                    message: 'Ha ocurrido un error al actualizar la reserva'
                }
            }); */
        }
    },
    eliminar: async (req, res) => {
        try {
          const reserva = await models.reserva.findByPk(req.params.id);
          const documento = await models.documento.findByPk(reserva.documentoId);
          if (reserva) {
            if(documento.cantidad === 0){
              await documento.update({
                cantidad: documento.cantidad+1, // Se actualiza el número de cantidad del documento
                estado: 1
              })
            }else{
              await documento.update({
                cantidad: documento.cantidad+1, // Se actualiza el número de cantidad del documento
                estado: 1
              })
            }
            
            await reserva.destroy();
            res.json({
              success: true,
              data: {
                message: `La reserva con id ${reserva.id} ha sido eliminado exitosamente`
              }
            });
          } else {
            res.json({
              success: false,
              data: {
                message: "No se encontró ningúna reserva con el ID proporcionado"
              }
            });
          }
        } catch (error) {
          console.error(error);
          res.json({
            success: false,
            data: {
              message: "Ha ocurrido un error al eliminar la reserva"
            }
          });
        }
      },
      darBaja: async (req, res) => {
        try {
          const reserva = await models.reserva.findByPk(req.params.id);
    
    
          if (reserva) {
            await reserva.update(req.body);
          }
    
          res.json({
            success: true,
            data: {
              message: `El reserva con id ${reserva.id} ha sido actualizado exitosamente`
            }
          });
    
        } catch (error) {
          console.error(error);
          res.json({
            success: false,
            data: {
              message: 'Ha ocurrido un error al actualizar el reserva'
            }
          });
        }
      },
}