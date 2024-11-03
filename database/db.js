const { Sequelize } = require('sequelize');
const { databaseUrl } = require('../config');

console.log("Database URL: ", databaseUrl);

// Устанавливаем подключение к БД
const sequelize = new Sequelize(databaseUrl, {
    dialect: "mysql",
    logging: false,
});

module.exports = sequelize;