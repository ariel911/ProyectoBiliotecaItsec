'use strict' 

module.exports = (sequelize, DataTypes) => {

  let Reserva= sequelize.define('reserva', { 
    id: {
      type: DataTypes.BIGINT, 
      autoIncrement: true, 
      primaryKey: true,  
      allowNull: false 
    },
    fecha_reserva: { 
        type: DataTypes.DATE, 
        allowNull: false 
    },
    fecha_validez: { 
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

  Reserva.associate = models => {
    Reserva.belongsTo(models.documento)
    Reserva.belongsTo(models.persona)
  }

  return Reserva
}