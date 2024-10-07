const {app, BrowserWindow, ipcMain, shell, dialog} = require('electron');
import fs from "fs";
import {v4 as uuidv4} from 'uuid';
const path = require('node:path');

// IPC для выбора папки и получения её содержимого
ipcMain.handle('open-folder', openFolder);

async function openFolder() {
    const {canceled, filePaths} = await dialog.showOpenDialog({
        properties: ['openDirectory'],
    });
    if (canceled || filePaths.length === 0) {
        return [];
    }

    return dirStructure(filePaths[0]);
}

async function dirStructure(folderPath) {
    const files = fs.readdirSync(folderPath, {withFileTypes: true});
    let structure = [];
    for (const file of files) {
        const filePath = path.join(folderPath, file.name);
        if (file.isDirectory()) {
            structure.push({
                id: uuidv4(),
                title: file.name,
                items: await scanSubFolder(filePath),
            });
        }
    }
    const rootFiles = await scanSubFolder(folderPath);
    if (rootFiles.length > 0) {
        const root_name = folderPath.split('/').pop();
        structure.push({
            id: uuidv4(),
            title: root_name,
            items: rootFiles,
        });
    }

    return structure;
}

async function scanSubFolder(folder) {
    const files = fs.readdirSync(folder, {withFileTypes: true});
    let items = [];
    for (const file of files) {
        if (!file.isDirectory()) {
            items.push({
                id: uuidv4(),
                title: file.name,
                path: path.join(folder, file.name),
            });
        }
    }

    return items;
}


// IPC для проигрывания файла
ipcMain.handle('open-file', openFile);
async function openFile(event, filePath) {
    try {
        await shell.openPath(filePath);
    } catch (err) {
        console.error('Ошибка при открытии файла:', err);
        throw err;
    }
}


// Экспорт
// Обработка вызова функции копирования и переименования файлов
ipcMain.handle('export-files', async (event, cards) => {
    return await copyAndRenameFiles(cards);
});
// Основная функция для копирования файлов
async function copyAndRenameFiles(cards) {
    try {
        let targetDir = await selectTargetDirectory();
        if (!targetDir || cards.length < 1) {
            return; // Если папка не выбрана, выходим
        }

        let folderIndex = 1;
        for (let folder of cards) {
            let fileIndex = 1;
            for (let item of folder.items) {
                let title = item.title.replace(/\.mp3$/, '');
                let newFileName = renameFile(title, folderIndex, fileIndex);
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
}

// Функция для выбора целевой папки
async function selectTargetDirectory() {
    const {canceled, filePaths} = await dialog.showOpenDialog({
        properties: ['openDirectory'],
    });
    if (canceled || filePaths.length === 0) {
        return [];
    }

    return filePaths[0];
}

// Функция для переименования файла
function renameFile(file_name, folderIndex, fileIndex) {
    return `${folderIndex}${fileIndex}_${file_name}.mp3`;
}

// Функция для копирования файла
async function copyFile(sourcePath, newFilePath) {
    const fs = require('fs').promises; // Используем промисы для работы с файловой системой
    try {
        await fs.copyFile(sourcePath, newFilePath);
    } catch (error) {
        throw error;
    }
}





// Подготовка окна приложения
const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
        },
    });

    // Загружаем URL или файл
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL || path.join(__dirname, 'index.html'));
    mainWindow.webContents.openDevTools({ mode: 'detach' });
};

// Создание окна приложения
app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// При закрытии окна выключаем приложение
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});