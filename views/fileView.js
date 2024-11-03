exports.askFileType = async (ctx) => {
    await ctx.reply('Выберите формат файла для загрузки');
};

exports.showConversionOptions = async (ctx) => {
    await ctx.reply('Выберите, в какой формат конвертировать', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'PDF', callback_data: 'to_pdf' }],
                [{ text: 'DOCX', callback_data: 'to_docx' }],
                // Добавить другие...
            ],
        },
    });
};