//This file is used to create all the images for the different projects
import fs from 'fs';
import path from 'path';
import { Canvas, loadImage } from 'skia-canvas';
import { fileURLToPath } from 'url';
import { getProjectInfo } from './getData.js';
import { useComposition } from './createProjectImageCompositionsNode.js';


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '../assets/images/visualizationsProjects');
const DATA_PATH = path.join(__dirname, '../assets/data/structured-data.json');
const IMAGE_SIZE = 300;
const IMAGE_PATH = path.join(__dirname, '../assets/images/keywordsEnThemas/digitalSkillsMediawijsheid/0001.webp');

const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
const projects = data.projects;

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const generateProjectImage = async (projectInfo) => {
    let canvas = new Canvas(IMAGE_SIZE, IMAGE_SIZE),
        ctx = canvas.getContext("2d"),
        [x, y] = [IMAGE_SIZE / 2, IMAGE_SIZE / 2]

    // Background
    ctx.fillStyle = 'red'
    ctx.fillRect(0, 0, x, y)
    ctx.fillStyle = 'green'
    ctx.fillRect(x, y, x, y)

    // // load the webp at runtime instead of importing it
    // const img = await loadImage(IMAGE_PATH);
    // // draw the loaded image (adjust position/size as needed)
    // ctx.drawImage(img, 50, 50, IMAGE_SIZE - 100, IMAGE_SIZE - 100);

    //get data for composition
    const composition = await useComposition(projectInfo, 150, 150, 300, 300);
    console.log('composition for', projectInfo.formattedName, composition);

    //create composition on canvas

    // Save image
    const filename = `${projectInfo.formattedName}.png`;
    const filepath = path.join(OUTPUT_DIR, filename);
    const buffer = await canvas.toBuffer('image/png');
    fs.writeFileSync(filepath, buffer);

    console.log(`Generated image for ${projectInfo.formattedName}`);
}

/**
 * Main function to process all projects
 */
async function createAllProjectImages() {
    console.log(`Creating images for ${projects.length} projects...`);

    // for (const project of projects) {
    //     const projectInfo = getProjectInfo(project.id);

    //     // Wait for one image to finish before starting the next
    //     await generateProjectImage(projectInfo);
    // }

    const project = projects[0];
    const projectInfo = getProjectInfo(project.id);
    await generateProjectImage(projectInfo);

    console.log(`✓ All images created in ${OUTPUT_DIR}`);
}

// Run the script
createAllProjectImages().catch(console.error);
