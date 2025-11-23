//This file is used to create all the images for the different projects
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Sample projects data structure (adjust based on your actual data)
const data = require('../assets/data/structured-data.json'); // Adjust path to your projects data
const projects = data.projects; // Adjust path to your projects data

const OUTPUT_DIR = path.join(__dirname, '../assets/images/visualizationsProjects');
const IMAGE_SIZE = 400;

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Generates word cloud style image from keywords
 * @param {Array<string>} keywords - Array of keywords
 * @param {string} projectCode - Project code for filename
 * @param {string} clusterLabel - Cluster label for context
 */
function generateProjectImage(keywords, projectCode, clusterLabel) {
    const canvas = createCanvas(IMAGE_SIZE, IMAGE_SIZE);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, IMAGE_SIZE, IMAGE_SIZE);

    // Draw keywords in a grid/cloud pattern
    const keywordList = keywords || [];
    const maxKeywords = 15; // Limit keywords to prevent overcrowding
    const displayKeywords = keywordList.slice(0, maxKeywords);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Draw keywords with varying sizes
    displayKeywords.forEach((keyword, index) => {
        const fontSize = 20 + Math.random() * 30;
        ctx.font = `${fontSize}px Arial`;
        ctx.fillStyle = `hsl(${(index * 137.5) % 360}, 70%, 50%)`;

        // Random but controlled positioning
        const x = 50 + (index % 3) * 120 + Math.random() * 40;
        const y = 80 + Math.floor(index / 3) * 60 + Math.random() * 20;

        ctx.fillText(keyword, x, y);
    });

    // Add project code at bottom
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText(projectCode, IMAGE_SIZE / 2, IMAGE_SIZE - 30);

    // Save image
    const filename = `${projectCode.replace(/[^a-z0-9]/gi, '_')}.png`;
    const filepath = path.join(OUTPUT_DIR, filename);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(filepath, buffer);

    console.log(`Generated image for ${projectCode}: ${filename}`);
}

/**
 * Main function to process all projects
 */
async function createAllProjectImages() {
    console.log(`Creating images for ${projects.length} projects...`);

    projects.forEach(project => {
        const keywords = project.keywords || project.Keywords || [];
        const projectCode = project.CCODE || project.code;
        const clusterLabel = project.clusterLabel || 'Unknown';

        generateProjectImage(keywords, projectCode, clusterLabel);
    });

    console.log(`✓ All images created in ${OUTPUT_DIR}`);
}

// Run the script
createAllProjectImages().catch(console.error);