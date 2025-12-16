import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { scanImageDirectories } from './utils/file-helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_CLUSTER_DIR = path.join(__dirname, '../assets/images/clusters');
const OUTPUT_FILE = path.join(__dirname, 'getClusterImagesNode.js');

const clusters = scanImageDirectories(IMAGES_CLUSTER_DIR);

let clusterMap = {};

clusters.forEach(({ name: cluster, images }) => {
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