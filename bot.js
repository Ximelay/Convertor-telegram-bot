const { Bot, session } = require('grammy');
const { botToken } = require('./config');
const fileController = require('./controllers/fileController');
const fileView = require('./views/fileView');
const sequelize = require('./database/db');
const express = require('express');
const path = require('path')

const bot = new Bot(botToken);

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

bot.command('begin', async (ctx) => {
    await ctx.reply('Добро пожаловать! Пожалуйста, выберите формат для конвертаци');
    await fileView.showConversionOptions(ctx);
});

bot.command('reset', async (ctx) => {
    ctx.session.targetFormat = '';
    await ctx.reply('Состояние сброшено. Используйте /begin, чтобы начать заново')
})

// Обработчик выбора формата чезер callbackQuery
bot.callbackQuery(/to_(\w+)/, async (ctx) => {
    // Сохраняем выбранный формат в сессии пользователя
    ctx.session.targetFormat = ctx.match[1];
    await ctx.reply(`Вы выбрали формат: ${ctx.session.targetFormat}. Теперь загрузите файл для конвертации`);
    await ctx.answerCallbackQuery();
});

// Обработчик для загруженных файлов
bot.on('message:document', async (ctx) => {
    if (!ctx.session.targetFormat) {
        await ctx.reply('Пожалуйста, выберите формат для конвертации перед загрузкой файла');
        return;
    }

    // Вызываем контроллер для обработки файла
    await fileController.convertFile(ctx);
});

const app = express();
const PORT = 3000;

// Статический маршрут к папке /downloads
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

app.listen(PORT, () => {
    console.log(`File server is running on http://localhost:${PORT}`);
});

bot.start();