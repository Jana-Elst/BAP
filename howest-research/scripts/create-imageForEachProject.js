//This file is used to create all the images for the different projects
import fs from 'fs';
import path from 'path';
import { Canvas } from 'skia-canvas';
import { fileURLToPath } from 'url';
import { useComposition } from './createProjectImageCompositionsNode.js';
import { getProjectInfo } from './getData.js';


const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '../assets/images/visualizationsProjects');
const DATA_PATH = path.join(__dirname, '../assets/data/structured-data.json');
const IMAGE_SIZE = 600;

const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
const projects = data.projects;

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const drawImageProp = (ctx, img, x, y, w, h, offsetX = 0, offsetY = 0) => {
    if (!img) return;

    // 1. Calculate the ratios
    const r = Math.min(w / img.width, h / img.height);

    // 2. Calculate new width and height based on the ratio
    const nw = img.width * r;
    const nh = img.height * r;

    // 3. Center the image in the box
    // (cx, cy) is the top-left corner where drawing should start
    const cx = x + (w - nw) / 2 + offsetX;
    const cy = y + (h - nh) / 2 + offsetY;

    // 4. Draw
    ctx.drawImage(img, cx, cy, nw, nh);

    // Optional: Return the actual box drawn (for debugging)
    return { x: cx, y: cy, width: nw, height: nh };
}

const generateProjectImage = async (projectInfo) => {
    let canvas = new Canvas(IMAGE_SIZE, IMAGE_SIZE),
        ctx = canvas.getContext("2d")

    //get data for composition
    const composition = await useComposition(projectInfo, 600, 600, 600, 600);
    // console.log('composition for', projectInfo.formattedName, composition);

    const {
        clusterPosition,
        keywordPositions,
        boundingBoxesKeywords,
        keywordImages,
        clusterImage,
        offset,
        widhtKeyword,
        heightKeyword,
        widthCluster,
        heightCluster
    } = composition;

    // ---------------------------------------------------------
    // DRAWING LOGIC (Translated from React Native Skia)
    // ---------------------------------------------------------

    // 1. Draw Keyword Images (at intersection points)
    if (keywordImages && keywordPositions) {
        keywordImages.forEach((image, index) => {
            const pos = keywordPositions[index];
            const boundingBox = boundingBoxesKeywords ? boundingBoxesKeywords[index] : undefined;

            if (!pos || !image) return;

            const renderX = boundingBox?.renderX ?? pos.x;
            const renderY = boundingBox?.renderY ?? pos.y;

            // This prevents the squash/stretch effect
            drawImageProp(ctx, image, renderX, renderY, widhtKeyword, heightKeyword);

            // Optional: Debug Bounding Box
            if (boundingBox) {
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
                ctx.lineWidth = 1;
                ctx.strokeRect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);
            }

        });
    }

    // 2. Draw Cluster Image and Ellipses
    if (clusterPosition && clusterImage) {

        drawImageProp(
            ctx,
            clusterImage,
            clusterPosition.imageX,
            clusterPosition.imageY,
            widthCluster,
            heightCluster
        );

        // B. Draw Inner Ellipse
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(
            clusterPosition.x + clusterPosition.width / 2,
            clusterPosition.y + clusterPosition.height / 2,
            clusterPosition.width / 2,
            clusterPosition.height / 2,
            0, 0, 2 * Math.PI
        );
        ctx.stroke();

        // C. Draw Outer Ellipse
        const outerX = clusterPosition.x - offset / 2;
        const outerY = clusterPosition.y - offset / 2;
        const outerW = clusterPosition.width + offset;
        const outerH = clusterPosition.height + offset;

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(
            outerX + outerW / 2,
            outerY + outerH / 2,
            outerW / 2,
            outerH / 2,
            0, 0, 2 * Math.PI
        );
        ctx.stroke();
    }

    // ---------------------------------------------------------
    // SAVE IMAGE
    // ---------------------------------------------------------

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

    for (const project of projects) {
        const projectInfo = getProjectInfo(project.id);

        // Wait for one image to finish before starting the next
        await generateProjectImage(projectInfo);
    }

    // const projectInfo = getProjectInfo(projects[0].id);
    // await generateProjectImage(projectInfo);

    console.log(`✓ All images created in ${OUTPUT_DIR}`);
}

// Run the script
createAllProjectImages().catch(console.error);