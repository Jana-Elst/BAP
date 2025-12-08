import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_CLUSTER_DIR = path.join(__dirname, '../assets/images/clusters');
const OUTPUT_FILE = path.join(__dirname, 'getClusterImagesNode.js');

// Read all subdirectories in clusters
const clusters = fs.readdirSync(IMAGES_CLUSTER_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

let clusterMap = {};

clusters.forEach(cluster => {
    const clusterPath = path.join(IMAGES_CLUSTER_DIR, cluster);
    const images = fs.readdirSync(clusterPath)
        .filter(file => /\.(png|jpg|jpeg|gif|webp)$/i.test(file))
        .sort();

    clusterMap[cluster] = images.map(image =>
        path.join(IMAGES_CLUSTER_DIR, cluster, image)
    );
});

const fileContent = `// Auto-generated file. Do not edit manually.
// Generated on: ${new Date().toLocaleString()}

const clusterImagePaths = ${JSON.stringify(clusterMap, null, 4)};

export function useGetClusterImages(clusterName) {
    console.log("Fetching images for cluster:", clusterName);
    console.log("Available clusters:", Object.keys(clusterImagePaths));

    let path = clusterImagePaths[clusterName];
    if (!path) {
        path = clusterImagePaths["clusteroverschrijdend"];
    }
    return path
}
`;

// Write to file
fs.writeFileSync(OUTPUT_FILE, fileContent, 'utf8');
console.log(`✅ Generated getClusterImages.js with ${clusters.length} clusters`);
console.log(`📁 Clusters: ${clusters.join(', ')}`);