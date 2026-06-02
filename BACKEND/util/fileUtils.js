const fs = require('fs').promises;
const path = require('path');

const dataDir = path.join(__dirname, '../data');

async function readJsonFile(filePath) {
    try {
        // If filePath is absolute, use it directly; otherwise, join with dataDir
        const fullPath = path.isAbsolute(filePath) ? filePath : path.join(dataDir, filePath);
        const data = await fs.readFile(fullPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        throw error;
    }
}

async function writeJsonFile(filePath, data) {
    try {
        // If filePath is absolute, use it directly; otherwise, join with dataDir
        const fullPath = path.isAbsolute(filePath) ? filePath : path.join(dataDir, filePath);
        await fs.writeFile(
            fullPath,
            JSON.stringify(data, null, 2),
            'utf8'
        );
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error);
        throw error;
    }
}

module.exports = {
    readJsonFile,
    writeJsonFile
};
