import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_CLUSTER_DIR = path.join(__dirname, '../assets/images/clusters');
const OUTPUT_FILE = path.join(__dirname, 'getClusterImages.js');

// Read all subdirectories in clusters
const clusters = fs.readdirSync(IMAGES_CLUSTER_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

let imports = '';
let imageArrays = '';
let conditions = '';

clusters.forEach(cluster => {
    const clusterPath = path.join(IMAGES_CLUSTER_DIR, cluster);
    const images = fs.readdirSync(clusterPath)
        .filter(file => /\.(png|jpg|jpeg|gif|webp)$/i.test(file))
        .sort();

    // Generate camelCase variable name
    const varName = cluster.replace(/[-_](.)/g, (_, c) => c.toUpperCase());

    // Generate imports
    images.forEach((image, index) => {
        imports += `import ${varName}${index + 1} from "../assets/images/clusters/${cluster}/${image}";\n`;
    });
    imports += '\n';

    // Generate image array
    imageArrays += `    const ${varName}Images = [\n`;
    images.forEach((_, index) => {
        imageArrays += `        ${varName}${index + 1},\n`;
    });
    imageArrays += `    ];\n\n`;

    // Generate condition - using map logic for 1-to-1 mapping
    conditions += `        if (clusterName === "${cluster}") return ${varName}Images;\n`;
});

// Generate the complete file content
const fileContent = `// filepath: /Users/janaelst/Desktop/BAP/DEV/howest-research/scripts/getClusterImages.js
// Auto-generated file. Do not edit manually.
// Generated on: ${new Date().toLocaleString()}

${imports}
const useGetClusterImages = (clusterData) => {
${imageArrays}

    if (!clusterData) return [];

    // Map 1-to-1 based on input array
    // If input is a single string, wrap in array to handle both cases if needed, but assuming array based on previous usage
    const inputList = Array.isArray(clusterData) ? clusterData : [clusterData];

    return inputList.map(clusterName => {
${conditions}        return clusteroverschrijdendImages;
    });
}

export default useGetClusterImages;
`;

// Write to file
fs.writeFileSync(OUTPUT_FILE, fileContent, 'utf8');
console.log(`✅ Generated getClusterImages.js with ${clusters.length} clusters`);
console.log(`📁 Clusters: ${clusters.join(', ')}`);