import fs from 'fs';
import path from 'path';

/**
 * Sanitizes a string to be a valid variable name (camelCase, no leading digits).
 * @param {string} name 
 * @returns {string}
 */
export const sanitizeVarName = (name) => {
    let varName = name.replace(/[-_](.)/g, (_, c) => c.toUpperCase());
    if (/^\d/.test(varName)) {
        varName = varName.replace(/^\d+/, '');
    }
    return varName;
};

/**
 * Scans subdirectories in a given root directory for images.
 * Returns an array of objects containing directory info and image lists.
 * @param {string} rootDir 
 * @returns {Array<{name: string, path: string, images: string[], varName: string}>}
 */
export const scanImageDirectories = (rootDir) => {
    if (!fs.existsSync(rootDir)) return [];

    const dirs = fs.readdirSync(rootDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    return dirs.map(dirName => {
        const dirPath = path.join(rootDir, dirName);
        const images = fs.readdirSync(dirPath)
            .filter(file => /\.(png|jpg|jpeg|gif|webp)$/i.test(file))
            .sort();

        return {
            name: dirName,
            path: dirPath,
            images,
            varName: sanitizeVarName(dirName)
        };
    });
};
