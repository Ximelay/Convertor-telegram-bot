const fileService = require('../services/fileService');
const Conversion = require('../models/conversionModel');
const path = require('path');

exports.convertFile = async (ctx) => {
    try {
        const { file_id, mime_type } = ctx.message.document;
        const targetFormat = ctx.session.targetFormat;

        // Запись о конвертации
        const conversion = await Conversion.create({
            userId: ctx.from.id,
            originalFileType: mime_type,
            convertedFileType: targetFormat,
            status: 'in-progress',
        });

        // Скачиваем файл
        const filePath = await fileService.downloadFile(file_id);
        let convertedFilePath;

        // Конвертация в зависимости от типа файла
        if (mime_type.startsWith('image/')) {
            convertedFilePath = await fileService.convertImage(filePath, targetFormat);
        } else if (mime_type.startsWith('video/') || mime_type.startsWith('audio/')) {
            convertedFilePath = await fileService.convertMedia(filePath, targetFormat);
        } else if (
            mime_type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || // DOCX
            mime_type === 'application/msword' || // DOC
            mime_type === 'application/vnd.oasis.opendocument.text' || // ODT
            mime_type === 'application/vnd.ms-excel' || // XLS
            mime_type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || // XLSX
            mime_type === 'application/vnd.oasis.opendocument.spreadsheet' || // ODS
            mime_type === 'text/csv' // CSV
        ) {
            convertedFilePath = await fileService.convertDocument(filePath, targetFormat);
        } else {
            throw new Error('Unsupported file type');
        }

        // Обновляем статус в базе данных
        await conversion.update({ status: 'completed', filePath: convertedFilePath });

        // Формируем URL для скачивания
        const fileName = path.basename(convertedFilePath);
        const downloadUrl = `http://localhost:3000/downloads/${fileName}`;

        // Отправляем ссылку как обычный текст
        await ctx.reply(`Ссылка на скачивание файла: ${downloadUrl}`);

    } catch (error) {
        console.error(error);
        ctx.reply('Произошла ошибка при обработке файла.');
    }
};
