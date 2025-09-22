'use strict'

module.exports = (sequelize, DataTypes) => {

  let Documento = sequelize.define('documento', {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    anio_edicion: {
      type: DataTypes.DATE,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Codigo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ubicacion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: false
    },
    estado: {
      type: DataTypes.INTEGER,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at'
    }
  }, {
    paranoid: true,
    freezeTableName: true,
  })

  Documento.associate = models => {
    // aca se relacionan las tablas de la base de datos  
    //llaves foraneas llevadas a las siguientes tablas
    Documento.hasMany(models.prestamo)
    Documento.hasMany(models.reserva)
    Documento.hasMany(models.documento_autor)

    //llaves foraneas en la tabla documento
    Documento.belongsTo(models.area)
    Documento.belongsTo(models.tipo_doc)
    Documento.belongsTo(models.carrera)
    Documento.belongsTo(models.formato)

  }

  return Documento
}