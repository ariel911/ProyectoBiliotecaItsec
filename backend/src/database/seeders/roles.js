'use strict';

const models = require("../models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crea el rol de Administrador
    const [rol, created] = await models.rol.findOrCreate({
      where: { id: 1 },
      defaults: {
        nombre_rol: "Administrador",
        estado: 1, // Activo
      }
    });

    // Si el rol fue creado correctamente, asociar los menús
    if (created) {
      // Array de menús que deseas asociar
      const menus = [1];

      // Asociar los menús al rol a través del modelo 'menu_rol'
      await Promise.all(menus.map(async (menuId) => {
        await models.menu_rol.create({
          rolId: rol.id, // Asigna el rol creado
          menuId: menuId // Asigna el menú correspondiente
        });
      }));
    }
  },

};
