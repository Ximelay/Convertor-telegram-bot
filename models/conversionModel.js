const { DataTypes } = require('sequelize')
const sequelize = require('../database/db')

const Conversion = sequelize.define('Conversion', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    originalFileType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    convertedFileType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'in-progress', 'completed', 'failed'),
        defaultValue: 'pending',
    },
    filePath: {
        type: DataTypes.STRING,
    },
});

module.exports = Conversion