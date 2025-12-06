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
        imageArrays += `        useImage(${varName}${index + 1}),\n`;
    });
    imageArrays += `    ];\n\n`;

    // Generate condition
    conditions += `    if (keywordData && keywordData.includes("${category}")) {\n`;
    conditions += `        keywordList.push(${varName}Images);\n`;
    conditions += `    }\n\n`;
});

// Generate the complete file content
const fileContent = `// filepath: /Users/janaelst/Desktop/BAP/DEV/howest-research/scripts/getImages.js
import { useImage } from "@shopify/react-native-skia";
${imports}
const useGetImages = (keywordData) => {
${imageArrays}    const keywordList = [];

${conditions}    return keywordList;
}

export default useGetImages;
`;

// Write to file
fs.writeFileSync(OUTPUT_FILE, fileContent, 'utf8');
console.log(`✅ Generated getImages.js with ${categories.length} categories`);
console.log(`📁 Categories: ${categories.join(', ')}`);