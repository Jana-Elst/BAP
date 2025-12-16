
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scripts = [
    'create_webp_animations.js',
    'create-getClusterImagesNode.js',
    'create-getKeywordImagesNode.js',
    'create-imageForEachProject.js',
    'create-getClusterImages.js',
    'create-getKeywordImages.js',
    'create-getImages.js',
];

console.log('Starting sequence of scripts...');

for (const script of scripts) {
    try {
        const scriptPath = path.join(__dirname, script);
        console.log(`\n---------------------------------------------------------`);
        console.log(`Running: ${script}`);
        console.log(`---------------------------------------------------------\n`);

        // Execute the script synchronously
        execSync(`node "${scriptPath}"`, { stdio: 'inherit' });

        console.log(`\nSuccessfully finished: ${script}`);
    } catch (error) {
        console.error(`\nFAILED: ${script}`);
        console.error(`Error message: ${error.message}`);
        console.error('Stopping execution flow.');
        process.exit(1);
    }
}

console.log(`\n---------------------------------------------------------`);
console.log('All scripts executed successfully!');
console.log(`---------------------------------------------------------\n`);
