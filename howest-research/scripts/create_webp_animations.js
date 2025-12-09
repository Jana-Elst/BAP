const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const util = require('util');

const execFilePromise = util.promisify(execFile);

// Configuration
const CLUSTERS_DIR = path.resolve(__dirname, '../assets/images/clusters');
const FRAME_DURATION = 40; // ms

async function createAnimation(folderPath) {
    const folderName = path.basename(folderPath);

    // Read all files in the directory
    let files;
    try {
        files = await fs.promises.readdir(folderPath);
    } catch (err) {
        console.error(`Error reading directory ${folderPath}:`, err);
        return;
    }

    // Filter and sort webp files
    const webpFiles = files
        .filter(file => file.endsWith('.webp'))
        .sort() // Ensure numerical/alphabetical order
        .map(file => path.join(folderPath, file));

    if (webpFiles.length === 0) {
        console.log(`No webp files found in ${folderName}, skipping.`);
        return;
    }

    // Define the parts
    // Intro: 1-36 (indices 0-35)
    // Loop: 37-44 (indices 36-43)
    // Outro: 45-80 (indices 44-79)
    const parts = [
        { suffix: 'intro', start: 0, end: 36, loop: 0 },
        { suffix: 'loop', start: 36, end: 44, loop: 0 },
        { suffix: 'outro', start: 44, end: 80, loop: 0 },
    ];

    for (const part of parts) {
        // webpFiles is 0-indexed, so we slice from start to end (exclusive)
        const partFiles = webpFiles.slice(part.start, part.end);

        if (partFiles.length === 0) {
            continue;
        }

        console.log(`  Creating ${part.suffix} (${partFiles.length} frames)...`);

        const args = [];
        for (const file of partFiles) {
            args.push('-frame', file, `+${FRAME_DURATION}+0+0+1-b`);
        }

        const outputFile = path.join(CLUSTERS_DIR, `${folderName}_${part.suffix}.webp`);
        args.push('-loop', part.loop.toString(), '-o', outputFile);

        try {
            const { stderr } = await execFilePromise('webpmux', args);
            console.log(`  Created ${outputFile}`);
            if (stderr) console.error(stderr);
        } catch (error) {
            console.error(`  Error creating ${part.suffix} for ${folderName}:`, error);
        }
    }
}

async function main() {
    if (!fs.existsSync(CLUSTERS_DIR)) {
        console.error(`Directory not found: ${CLUSTERS_DIR}`);
        return;
    }

    const items = await fs.promises.readdir(CLUSTERS_DIR, { withFileTypes: true });

    for (const item of items) {
        // Only process directories that are not already webp files (though isDirectory filters that usually, sometimes names conflict)
        // and ignore '.' or '..' just in case
        if (item.isDirectory()) {
            const folderPath = path.join(CLUSTERS_DIR, item.name);
            await createAnimation(folderPath);
        }
    }
}

main();
