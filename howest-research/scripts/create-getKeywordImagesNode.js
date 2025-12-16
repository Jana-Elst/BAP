import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { scanImageDirectories } from './utils/file-helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_KEYWORD_DIR = path.join(__dirname, '../assets/images/keywordsEnThemas');
const OUTPUT_FILE = path.join(__dirname, 'getKeywordImagesNode.js');

const categories = scanImageDirectories(IMAGES_KEYWORD_DIR);

let keywordMap = {};

categories.forEach(({ name: category, images }) => {
    keywordMap[category] = images.map(image =>
        path.join(IMAGES_KEYWORD_DIR, category, image)
    );
});

const fileContent = `// Auto-generated file. Do not edit manually.
// Generated on: ${new Date().toLocaleString()}

const keywordImagePaths = ${JSON.stringify(keywordMap, null, 4)};

/**
 * Returns an array of image paths for each keyword in the input.
 * If input is a string, returns the array for that keyword.
 * If input is an array, returns an array of arrays (one per keyword).
 */
export function useGetImages(keywordData) {
    if (!keywordData) return [];
    console.log("Fetching images for keywords:", keywordData);
    
    const keywordPaths = keywordData.map(keyword => keywordImagePaths[keyword] || keywordImagePaths["placeholder"]);
    return keywordPaths;
}
`;

// Write to file
fs.writeFileSync(OUTPUT_FILE, fileContent, 'utf8');
console.log(`✅ Generated getKeywordImages.js with ${categories.length} categories`);
console.log(`📁 Categories: ${categories.join(', ')}`);