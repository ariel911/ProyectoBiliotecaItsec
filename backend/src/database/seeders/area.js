'use strict';

const models = require('../models/index'); // Importa los modelos

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Inserta en la tabla 'menu'
    await Promise.all([
      models.area.findOrCreate({
        where: { id: 1 },
        defaults: {
          nombre: 'Programación',
          estado: 1, // Activo
        }
      }),
      models.area.findOrCreate({
        where: { id: 2 },
        defaults: {
          nombre: 'Fisica',
          estado: 1, // Activo
        }
      }),
      models.area.findOrCreate({
        where: { id: 3 },
        defaults: {
          nombre: 'Matematicas',
          estado: 1, // Activo
        }
      }),

      models.area.findOrCreate({
        where: { id: 4 },
        defaults: {
          nombre: 'Economia',
          estado: 1, // Activo
        }
      }),
      models.area.findOrCreate({
        where: { id: 5 },
        defaults: {
          nombre: 'Historia',
          estado: 1, // Activo
        }
      }),
    ]);
  },
};
