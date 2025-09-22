// importo el archivo de constantes globales
const globalConstants = require('../../const/globalConstants')

module.exports = {

  "development": {
    "username": globalConstants.DB_USERNAME,
    "password": globalConstants.DB_PASSWORD,
    "database": globalConstants.DB_NAME,
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
  

}