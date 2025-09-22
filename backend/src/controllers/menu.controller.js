// FUNCIONAMIENTO DE TODAS LAS RUTAS DE menuES

const models = require("../database/models/index");

module.exports = {
  listar: async (req, res) => {
    try {
      const menu = await models.menu.findAll({
        model: models.menu,
        attributes: ['id', 'nombre_menu', 'estado'],
      });
      res.json({
        success: true,
        data: {
          menu: menu
        }
      });
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: "Ha ocurrido un error al obtener la lista de menues"
        }
      });
    }
  },
  crear: async (req, res) => {
    try {
      const { nombre_menu, estado } = req.body;

      const menu = await models.menu.create({
        nombre_menu,
        estado,
      });

      res.status(201).json({
        success: true,
        data: menu
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        error: 'Ha ocurrido un error al crear el menu'
      });
    }
  },

  
  eliminar: async (req, res) => {
    try {
      const menu = await models.menu.findByPk(req.params.id);
      if (menu) {
        await menu.destroy();
        res.json({
          success: true,
          data: {
            message: `El menu con id ${menu.id} ha sido eliminado exitosamente`
          }
        });
      } else {
        res.json({
          success: false,
          data: {
            message: "No se encontró ningún menu con el ID proporcionado"
          }
        });
      }
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: "Ha ocurrido un error al eliminar el menu"
        }
      });
    }
  },
  darBaja: async (req, res) => {
    try {
      const menu = await models.menu.findByPk(req.params.id);


      if (menu) {
        await menu.update(req.body);
      }

      res.json({
        success: true,
        data: {
          message: `El menu con id ${menu.id} ha sido actualizado exitosamente`
        }
      });

    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        data: {
          message: 'Ha ocurrido un error al actualizar el menu'
        }
      });
    }
  },
}