//script to get alle the paths in the folder assets/images/visualizationsProjects
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_REL_PATH = '../assets/images/visualizationsProjects';
const IMAGES_DIR = path.join(__dirname, IMAGES_REL_PATH);
const OUTPUT_FILE = path.join(__dirname, 'getVisualizationProjectImages.js');

// 2. Read the directory
// We filter for common image extensions (png, webp, jpg)
const files = fs.readdirSync(IMAGES_DIR).filter(file => {
    return /\.(png|webp|jpg|jpeg)$/i.test(file);
});

console.log(`Found ${files.length} images.`);

// 3. Generate Content
// We generate numeric variable names (img_0, img_1) to avoid syntax errors with dashes/spaces in filenames
const imports = files.map((file, index) => {
    return `import img_${index} from '${IMAGES_REL_PATH}/${file}';`;
}).join('\n');

const mapEntries = files.map((file, index) => {
    const name = path.parse(file).name; // Remove extension (e.g. "project-1.png" -> "project-1")
    return `    '${name}': img_${index},`;
}).join('\n');

const fileContent = `// Auto-generated file. Do not edit manually.
// Generated on: ${new Date().toLocaleString()}

${imports}

const imageMap = {
${mapEntries}
};

/**
 * Returns the image path for a given project name.
 * @param {string} imageName - The name of the file without extension.
 * @returns {string|null} The imported image path or null if not found.
 */
const getVisualizationProjectImage = (imageName) => {
    console.log('imageName', imageName);
    return imageMap[imageName] || null;
};

export default getVisualizationProjectImage;
`;

// 4. Write the file
fs.writeFileSync(OUTPUT_FILE, fileContent, 'utf8');
console.log(`✅ Generated getVisualizationProjectImages.js with ${files.length} entries.`);