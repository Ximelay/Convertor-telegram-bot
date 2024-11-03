-- Создание базы данных
CREATE DATABASE IF NOT EXISTS file_converter_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- Используем новую базу данных
USE file_converter_db;

-- Создание таблицы Conversion
CREATE TABLE IF NOT EXISTS Conversion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(255) NOT NULL,
    originalFileType VARCHAR(50) NOT NULL,
    convertedFileType VARCHAR(50) NOT NULL,
    status ENUM('pending', 'in-progress', 'completed', 'failed') DEFAULT 'pending',
    filePath VARCHAR(255)
    );