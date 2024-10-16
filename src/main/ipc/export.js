import {dialog} from "electron";

export async function handleExportFiles(event, cards) {
    return await copyAndRenameFiles(cards);
}

// Основная функция для копирования файлов
async function copyAndRenameFiles(cards) {
    try {
        let targetDir = await selectTargetDirectory();
        if (!targetDir || targetDir.length < 1 || cards.length < 1) {
            return false; // Если папка не выбрана, выходим
        }

        let folderIndex = 1;
        for (let folder of cards) {
            let fileIndex = 1;
            for (let item of folder.items) {
                let newFileName = renameFile(item.title.trim(), folderIndex, fileIndex);
                let newFilePath = `${targetDir}/${newFileName}`;

                // Копируем файл с новым именем
                await copyFile(item.path, newFilePath);

                fileIndex++;
            }
            folderIndex++;
        }
    } catch (error) {
        throw error;
    }

    return true;
}

// Функция для выбора целевой папки
async function selectTargetDirectory() {
    const {canceled, filePaths} = await dialog.showOpenDialog({
        properties: ['openDirectory', 'createDirectory'],
        promptToCreate: true,
    });
    if (canceled || filePaths.length === 0) {
        return [];
    }

    return filePaths[0];
}

// Функция для переименования файла
function renameFile(file_name, folderIndex, fileIndex) {
    const formattedFolderIndex = folderIndex.toString().padStart(2, '0');
    return `${formattedFolderIndex}${fileIndex}_${file_name}`;
}

// Функция для копирования файла
async function copyFile(sourcePath, newFilePath) {
    const fs = require('fs').promises;
    try {
        await fs.copyFile(sourcePath, newFilePath);
    } catch (error) {
        throw error;
    }
}