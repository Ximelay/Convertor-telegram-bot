const fileService = require('../services/fileService');
const Conversion = require('../models/conversionModel');

exports.convertFile = async (ctx) => {
    try {
        const { file_id, mime_type } = ctx.message.document;
        const targetFormat = ctx.session.targetFormat; // Получаем целевой формат из сессии

        // Запись о конвертации
        const conversion = await Conversion.create({
            userId: ctx.from.id,
            originalFileType: mime_type,
            convertedFileType: targetFormat,
            status: 'in-progress',
        });

        const convertedFile = await fileService.convertFile(file_id, targetFormat);

        if (convertedFile) {
            await conversion.update({ status: 'completed', filePath: convertedFile.path });
            ctx.replyWithDocument({ source: convertedFile.path });
        } else {
            await conversion.update({ status: 'failed'});
            ctx.reply('Ошибка конвертации');
        }
    } catch (error) {
        console.error(error);
        ctx.reply('Произошла ошибка при обработке файла');
    }
}