'use strict'

module.exports = (sequelize, DataTypes) => {

    let Sancion_historial = sequelize.define('sancion_historial', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        motivo_levantamiento: {
            type: DataTypes.STRING,
            allowNull: false
        },

        fecha_levantamiento: {
            type: DataTypes.DATE,
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

    Sancion_historial.associate = models => {
        Sancion_historial.belongsTo(models.sancion)
        Sancion_historial.belongsTo(models.usuario)
    }

    return Sancion_historial
}