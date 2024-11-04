const axios = require('axios');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp')
const ffmpeg = require('fluent-ffmpeg');
const { exec } = require('child_process');
const { botToken } = require('../config');

// Скачивание файлов из Telegram
async function downloadFile(fileId) {
    try {
        // Получаем информацию о файле с заданным таймаутом
        const fileInfo = await axios.get(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`, {
            timeout: 10000, // 10 секунд таймаут
        });
        const filePath = fileInfo.data.result.file_path;

        const downloadUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;
        const localFilePath = path.resolve(__dirname, '../downloads', path.basename(filePath));

        // Скачиваем файл с заданным таймаутом
        const response = await axios({
            url: downloadUrl,
            method: 'GET',
            responseType: 'stream',
            timeout: 10000, // 10 секунд таймаут
        });

        const writer = fs.createWriteStream(localFilePath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(localFilePath));
            writer.on('error', reject);
        });
    } catch (error) {
        console.error('Error downloading file:', error);
        throw new Error('Failed to download file');
    }
}

// Функция для конвертации изображений
async function convertImage(filePath, targetFormat) {
    const outputFilePath = filePath.replace(path.extname(filePath), `.${targetFormat}`);
    await sharp(filePath).toFormat(targetFormat).toFile(outputFilePath);
    return outputFilePath;
}

// Функция конвертации аудио/видео
async function convertMedia(filePath, targetFormat) {
    const outputFilePath = filePath.replace(path.extname(filePath), `.${targetFormat}`);

    return new Promise((resolve, reject) => {
        ffmpeg(filePath)
            .toFormat(targetFormat)
            .on('end', () => resolve(outputFilePath))
            .on('error', (error) => {
                console.error('Error converting media: ', error);
                reject(new Error('Failed to convert media'));
            })
            .save(outputFilePath);
    });
}

// Функция для конвертации документов и таблиц с помошью LibreOffice
async function convertDocument(filePath, targetFormat) {
    const outputFilePath = filePath.replace(path.extname(filePath), `.${targetFormat}`);

    // Определение типа файла
    let format;
    switch (targetFormat) {
        case 'pdf':
            format = 'pdf';
            break;
        case 'doc':
        case 'docx':
            format = targetFormat;
            break;
        case 'odt':
            format = 'odt';
            break;
        case 'xls':
        case 'xlsx':
        case 'ods':
            format = targetFormat;
            break;
        case 'csv':
            format = 'csv';
            break;
        default:
            throw new Error('Unsupported document format')
    }

    return new Promise((resolve,reject) => {
        exec(`libreoffice --headless --convert-to ${format} "${filePath}" --outdir "${path.dirname(filePath)}"`, (error) => {
            if (error) {
                console.error('Error converting document: ', error);
                return new reject(new Error('Failed to convert document'));
            }
            resolve(outputFilePath);
        });
    });
}

module.exports = {
    downloadFile,
    convertImage,
    convertMedia,
    convertDocument,
}