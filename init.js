const sequelize = require('./database/db')
const Conversion = require('./models/conversionModel');
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to MySQL has been established successfully.');

        // Синхронизация базы данных, создание таблицы, если ее нет
        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
})();