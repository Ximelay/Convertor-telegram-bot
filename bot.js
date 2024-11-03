const { Bot, session } = require('grammy');
const { botToken } = require('./config');
const fileController = require('./controllers/fileController');
const fileView = require('./views/fileView');
const sequelize = require('./database/db');

const bot = require(botToken);

// Проверка подключения к БД
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database: ', error);
    }
})();

// Сессия для хранения информации о формате
bot.use(session({ initial: () => ({ targetFormat: '' }) }));

bot.command('start', (ctx) => ctx.reply('Добро пожаловать!'));

// Обработчик документа и конвертирования
bot.on('document', fileController.convertFile());

// Обработак выбора формата
bot.callbackQuery(/to_(\w+)/, (ctx) => {
    ctx.session.targetFormat = ctx.match[1];
    ctx.reply('Загрузите файл для конвертации');
});

bot.start();