'use strict' // para que no se pueda usar variables no definidas

module.exports = (sequelize, DataTypes) => {

  let Sancion = sequelize.define('sancion', { // defino el modelo de la tabla persona
    id: {
      type: DataTypes.BIGINT, // tipo de dato
      autoIncrement: true, // autoincrementable
      primaryKey: true, // clave primaria 
      allowNull: false // no permitir nulo
    },
    tipo_sancion: { // nombre de la columna
      type: DataTypes.STRING, // tipo de dato
      allowNull: false // no permitir nulo
    },
    descripcion: { // nombre de la columna
      type: DataTypes.STRING, // tipo de dato
      allowNull: false // no permitir nulo
    },

    fecha_inicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fecha_fin: {
      type: DataTypes.DATE,
      allowNull: false
    },
    estado: {
      type: DataTypes.INTEGER,
    },
    createdAt: { // fecha de creacion
      type: DataTypes.DATE, // tipo de dato
      field: 'created_at', // nombre de la columna
      defaultValue: DataTypes.NOW, // valor por defecto
      allowNull: false // no puede ser nulo
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    deletedAt: { // fecha de eliminacion
      type: DataTypes.DATE, // tipo de dato
      field: 'deleted_at' // nombre de la columna
    }
  }, {
    paranoid: true, // elimina los registros de forma logica
    freezeTableName: true, // no va a modificar el nombre de la tabla a plural
  })

  Sancion.associate = models => {
    // aca se relacionan las tablas de la base de datos  
    Sancion.hasMany(models.sancion_historial)
    Sancion.belongsTo(models.prestamo)
    Sancion.belongsTo(models.persona)
    Sancion.belongsTo(models.usuario)
  }

  return Sancion
}