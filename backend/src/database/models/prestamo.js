'use strict' 

module.exports = (sequelize, DataTypes) => {

  let Prestamo= sequelize.define('prestamo', { 
    id: {
      type: DataTypes.BIGINT, 
      autoIncrement: true, 
      primaryKey: true,  
      allowNull: false 
    },
    garantia:{
      type: DataTypes.STRING, 
      allowNull: false 
    },
    observaciones: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    fecha_prestamo: { 
        type: DataTypes.DATE, 
        allowNull: false 
    },
    fecha_devolucion: { 
        type: DataTypes.DATE, 
        allowNull: false 
    },
    estado:{
        type:DataTypes.INTEGER,
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

  Prestamo.associate = models => {
    Prestamo.belongsTo(models.usuario)
    Prestamo.belongsTo(models.persona)
    Prestamo.belongsTo(models.documento)
    Prestamo.hasMany(models.devolucion) 
    Prestamo.hasMany(models.sancion)
  }

  return Prestamo
}