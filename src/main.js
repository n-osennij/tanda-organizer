import {openFolder} from "./ipc/import";
import {handleExportFiles} from "./ipc/export";
import {openFile, showFile} from "./ipc/open";

const {app, BrowserWindow, ipcMain, Menu, globalShortcut} = require('electron');
const path = require('node:path');

// IPC для выбора папки и получения её содержимого
ipcMain.handle('open-folder', openFolder);

// IPC для проигрывания файла
ipcMain.handle('open-file', openFile);

// Обработка сообщения IPC для выделения файла в проводнике
ipcMain.handle('show-file-in-folder', showFile);

// IPC вызова функции копирования и переименования файлов
ipcMain.handle('export-files', handleExportFiles);

// Подготовка окна приложения
const createWindow = () => {
    const mainWindow = new BrowserWindow({
        minWidth: 500,
        minHeight: 300,
        width: 800,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
        },
    });

    // Устанавливаем меню приложения в null для его скрытия
    Menu.setApplicationMenu(null);

    // Регистрация глобального сочетания клавиш F5
    globalShortcut.register('F5', () => {
        if (mainWindow) {
            mainWindow.reload(); // Перезагрузка окна
        }
    });

    // Загружаем URL или файл
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL || path.join(__dirname, 'index.html'));
    mainWindow.webContents.openDevTools({mode: 'detach'});
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