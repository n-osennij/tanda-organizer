import {shell} from "electron";

export async function openFile(event, filePath) {
    try {
        await shell.openPath(filePath);
    } catch (err) {
        console.error('Ошибка при открытии файла:', err);
        throw err;
    }
}