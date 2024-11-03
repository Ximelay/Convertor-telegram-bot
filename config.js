require('dotenv').config();

// console.log("Loaded BOT_TOKEN:", process.env.BOT_TOKEN);  // Отладочный вывод
// console.log("Loaded DATABASE_URL:", process.env.DATABASE_URL);  // Отладочный вывод

module.exports = {
    botToken: process.env.BOT_TOKEN,
    databaseUrl: process.env.DATABASE_URL,
};