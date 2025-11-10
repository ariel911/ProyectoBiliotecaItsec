'use strict';

const models = require("../models/index");
const { encrypt } = require('../../helpers/handleBcrypt'); // Importa la función de encriptación

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      models.usuario.findOrCreate({
        where: {
          id: "1"
        },
        defaults: {
          nombre: "Ariel Achu",
          user_name: "Ariel123",
          correo: "ariel@gmail.com",
          imagen: "../../assets/ariel",
          ci: "10350511",
          clave: await encrypt("75457842"), // Encripta la clave
          estado: 1,
          rolId: 1 // Asocia el rol correspondiente
        }
      }),
    ]);
  },
};
