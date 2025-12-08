import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_KEYWORD_DIR = path.join(__dirname, '../assets/images/keywordsEnThemas');
const OUTPUT_FILE = path.join(__dirname, 'getKeywordImages.js');

// Read all subdirectories in keywordsEnThemas
const categories = fs.readdirSync(IMAGES_KEYWORD_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

let imports = '';
let imageArrays = '';
let conditions = '';

categories.forEach(category => {
    const categoryPath = path.join(IMAGES_KEYWORD_DIR, category);
    const images = fs.readdirSync(categoryPath)
        .filter(file => /\.(png|jpg|jpeg|gif|webp)$/i.test(file))
        .sort();

    // Generate camelCase variable name
    const varName = category.replace(/[-_](.)/g, (_, c) => c.toUpperCase());

    // Generate imports
    images.forEach((image, index) => {
        const imageName = path.parse(image).name;
        imports += `import ${varName}${index + 1} from "../assets/images/keywordsEnThemas/${category}/${image}";\n`;
    });
    imports += '\n';

    // Generate image array
    imageArrays += `    const ${varName}Images = [\n`;
    images.forEach((_, index) => {
        imageArrays += `        ${varName}${index + 1},\n`;
    });
    imageArrays += `    ];\n\n`;

    // Generate condition - using map logic for 1-to-1 mapping
    conditions += `        if (keywordName === "${category}") return ${varName}Images;\n`;
});

// Generate the complete file content
const fileContent = `// filepath: /Users/janaelst/Desktop/BAP/DEV/howest-research/scripts/getKeywordImages.js
// Auto-generated file. Do not edit manually.
// Generated on: ${new Date().toLocaleString()}

${imports}
const useGetKeywordImages = (keywordData) => {
${imageArrays}

    if (!keywordData) return [];

    // Map 1-to-1 based on input array
    // If input is a single string, wrap in array to handle both cases if needed, but assuming array based on previous usage
    const inputList = Array.isArray(keywordData) ? keywordData : [keywordData];

    return inputList.map(keywordName => {
${conditions}        return placeholderImages;
    });
}

export default useGetKeywordImages;
`;

// Write to file
fs.writeFileSync(OUTPUT_FILE, fileContent, 'utf8');
console.log(`✅ Generated getKeywordImages.js with ${categories.length} categories`);
console.log(`📁 Categories: ${categories.join(', ')}`);