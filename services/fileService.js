const { downloadFile} = require('some-file-download');
const { convertToFormat} = require('some-file-conversion');

exports.convertFile = async (fileId, targetFormat) => {
    const filePath = await downloadFile(fileId);

    const convertedFile = await convertToFormat(filePath, targetFormat);

    return convertedFile;
};
// ДОДЕЛАТЬ