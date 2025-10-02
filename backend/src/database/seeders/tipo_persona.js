'use strict';

const models = require('../models/index'); // Importa los modelos

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Inserta en la tabla 'menu'
    await Promise.all([
      models.tipo_persona.findOrCreate({
        where: { id: 1 },
        defaults: {
          nombre: 'Docente',
          estado: 1, // Activo
        }
      }),
      models.tipo_persona.findOrCreate({
        where: { id: 2 },
        defaults: {
          nombre: 'Estudiante',
          estado: 1, // Activo
        }
      }),
    ]);
  },
};
