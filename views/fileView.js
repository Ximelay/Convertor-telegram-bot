exports.askFileType = async (ctx) => {
    await ctx.reply('Выберите формат файла для загрузки');
};

exports.showConversionOptions = async (ctx) => {
    await ctx.reply('Выберите, в какой формат конвертировать', {
        reply_markup: {
            inline_keyboard: [
                [{ text: 'PDF', callback_data: 'to_pdf' }],
                [{ text: 'DOCX', callback_data: 'to_docx' }],
                [{ text: 'DOC', callback_data: 'to_doc' }],
                [{ text: 'ODT', callback_data: 'to_odt' }],
                [{ text: 'XLS', callback_data: 'to_xls' }],
                [{ text: 'XLSX', callback_data: 'to_xlsx' }],
                [{ text: 'ODS', callback_data: 'to_ods' }],
                [{ text: 'CSV', callback_data: 'to_csv' }],
            ],
        },
    });
};