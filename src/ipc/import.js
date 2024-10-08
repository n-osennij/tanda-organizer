import {dialog} from "electron";
import fs from "fs";
import path from "node:path";
import {v4 as uuid} from "uuid";

export async function openFolder() {
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
                id: uuid(),
                title: file.name,
                items: await scanSubFolder(filePath),
            });
        }
    }
    const rootFiles = await scanSubFolder(folderPath);
    if (rootFiles.length > 0) {
        const normalizedPath = folderPath.replace(/\\/g, '/'); // заменяем все \ на /
        const root_name = normalizedPath.split('/').pop(); // получаем последнее имя папки
        structure.push({
            id: uuid(),
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
        if (!file.isDirectory() && isAudio(file.name)) {
            items.push({
                id: uuid(),
                title: file.name,
                path: path.join(folder, file.name),
            });
        }
    }

    return items;
}

function isAudio(title) {
    const audioExtensions = [
        '.mp3', '.aac', '.ogg', '.wma', '.flac', '.alac', '.wav', '.aiff',
        '.pcm', '.m4a', '.mpc', '.aif', '.aifc', '.au', '.amr', '.ape',
        '.dss', '.dsf', '.dff', '.gsm', '.m3u', '.m3u8', '.mmf',
        '.mogg', '.opus', '.raw', '.tta', '.voc', '.wv', '.8svx',
        '.cda', '.ra', '.rm', '.mid', '.midi', '.kar', '.rmi',
    ];
    return audioExtensions.some(ext => title.toLowerCase().endsWith(ext));
}