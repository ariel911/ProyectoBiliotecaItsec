// FUNCIONAMIENTO DE TODAS LAS RUTAS DE ROLES

const models = require("../database/models/index");

module.exports = {
  listar: async (req, res) => {
    try {
      const rol = await models.rol.findAll({
        model: models.rol,
        attributes: ['id', 'nombre_rol', 'estado'],
        include:[
          {
            model:models.menu_rol,
            attributes: ['menuId','rolId'],
            include:[{
              model:models.menu,
              attributes: ['id','nombre_menu'],
            }]
          }
        ]
      });
      res.json({
        success: true,
        data: {
          rol: rol
        }
      });
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: "Ha ocurrido un error al obtener la lista de roles"
        }
      });
    }
  },
  crear: async (req, res) => {
    try {
      const rol = await models.rol.create(req.body);
    
      // Crear las relaciones muchos a muchos con los autores
      
      if (req.body.menus && Array.isArray(req.body.menus)) {
        for (const menuId of req.body.menus) {
          
          await models.menu_rol.create({
            rolId: rol.id,
            menuId: menuId
          });
        }
      }

      res.status(201).json({
        success: true,
        data: rol
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Ha ocurrido un error al crear el rol'
      });
    }
  },
  eliminar: async (req, res) => {
    try {
      const rol = await models.rol.findByPk(req.params.id);
      if (rol) {
        await rol.destroy();
        res.json({
          success: true,
          data: {
            message: `El rol con id ${rol.id} ha sido eliminado exitosamente`
          }
        });
      } else {
        res.json({
          success: false,
          data: {
            message: "No se encontró ningún rol con el ID proporcionado"
          }
        });
      }
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: "Ha ocurrido un error al eliminar el rol"
        }
      });
    }
  },
  update: async (req, res) => {
    try {
      const id = req.params.id; // Suponiendo que el ID del rol a actualizar se pasa en los parámetros de la solicitud
      const { menus, ...datosActualizados } = req.body; // Suponiendo que 'menus' es una propiedad que contiene la lista de menús asociados al rol
  
      // Actualizar el rol
      const [actualizados] = await models.rol.update(datosActualizados, {
        where: { id }
      });
  
      // Verificar si se ha actualizado algún rol
      console.log()
      if (actualizados === 0 && !menus) {
        return res.status(404).json({
          success: false,
          error: 'El rol especificado no existe'
        });
      }
  
      // Eliminar todas las relaciones existentes entre el rol y los menús
      if(!!menus){
        await models.menu_rol.destroy({
          where: { rolId: id }
        });
      }
      
  
      // Crear las nuevas relaciones muchos a muchos con los menús actualizados
      if (menus && Array.isArray(menus)) {
        for (const menuId of menus) {
          await models.menu_rol.create({
            rolId: id,
            menuId
          });
        }
      }
  
      // Obtener el rol actualizado
      const rolActualizado = await models.rol.findByPk(id);
  
      // Responder con el resultado
      res.status(200).json({
        success: true,
        data: rolActualizado
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Ha ocurrido un error al actualizar el rol'
      });
    }
  },
  
  darBaja: async (req, res) => {
    try {
      const rol = await models.rol.findByPk(req.params.id);


      if (rol) {
        await rol.update(req.body);
      }

      res.json({
        success: true,
        data: {
          message: `El rol con id ${rol.id} ha sido actualizado exitosamente`
        }
      });

    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: 'Ha ocurrido un error al actualizar el rol'
        }
      });
    }
  },
}