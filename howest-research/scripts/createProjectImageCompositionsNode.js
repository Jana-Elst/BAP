//----------------------------- IMPORTS -----------------------------//
import { Canvas, loadImage } from 'skia-canvas';
import { useGetClusterImages } from './getClusterImagesNode.js';
import { useGetImages } from './getKeywordImagesNode.js';

//----------------------------- VARIABLES -----------------------------//
let centerX
let centerY
let widthCluster
let heightCluster
let offset
let widhtKeyword
let heightKeyword
let screenWidth
let screenHeight

let clusterImage
let keywordImages;

//----------------------------- IMPORTS -----------------------------//
import {
    colorOffsets,
    getEllipseIntersection,
    keywordPositionsConfig
} from './utils/composition-helpers.js';



//----------------------------- helper functions -----------------------------//

//----------------------------- helper functions -----------------------------//
//----- Get Positions & Bounding boxes -----//
//get cluster position based on visible pixels

//--- CHANGE
//--- Using app
// const getClusterPosition = () => {

//---NODE
const getClusterPosition = async () => {

    //check if cluster image is loaded
    const allLoadedCluster = clusterImage !== null;
    if (!allLoadedCluster) return;

    const visibleInfo = getVisiblePixelsInfo(clusterImage, widthCluster, heightCluster);

    if (!visibleInfo) return;

    const imageX = centerX - visibleInfo.boundingBox.width / 2 - visibleInfo.offsetX;
    const imageY = centerY - visibleInfo.boundingBox.height / 2 - visibleInfo.offsetY;

    const x = centerX - visibleInfo.boundingBox.width / 2;
    const y = centerY - visibleInfo.boundingBox.height / 2;
    const width = visibleInfo.boundingBox.width;
    const height = visibleInfo.boundingBox.height;

    return { x, y, width, height, imageX, imageY };
};

//get keyword positions based on cluster position
const getKeywordPositions = (clusterPosition, positions) => {
    if (!clusterPosition) return [];

    const radiusX = (clusterPosition.width + offset) / 2;
    const radiusY = (clusterPosition.height + offset) / 2;

    if (!positions) return [];
    return positions.degrees.map((degree) => {
        const intersection = getEllipseIntersection(degree, centerX, centerY, radiusX, radiusY);
        return {
            x: intersection.x - widhtKeyword / 2,
            y: intersection.y - heightKeyword / 2,
            centerX: intersection.x,
            centerY: intersection.y,
        };
    });
};

//
const getBoundingBoxesKeywords = (keywordPositions, keywordData) => {
    const boxesKeywords = keywordData.map((data, index) => {
        const pos = keywordPositions[index];
        if (!pos) return undefined;

        const image = keywordImages[index];
        if (!image) return undefined;

        const visibleInfo = getVisiblePixelsInfo(image, widhtKeyword, heightKeyword);
        if (!visibleInfo) return undefined;

        // Calculate where the visible content currently would be
        const visibleX = pos.x + visibleInfo.offsetX;
        const visibleY = pos.y + visibleInfo.offsetY;
        const visibleCenterX = visibleX + visibleInfo.boundingBox.width / 2;
        const visibleCenterY = visibleY + visibleInfo.boundingBox.height / 2;

        // Calculate how much we need to adjust to center on the intersection point
        const diffX = pos.centerX - visibleCenterX;
        const diffY = pos.centerY - visibleCenterY;

        // Apply the adjustment to both the render position and bounding box
        const finalRenderX = pos.x + diffX;
        const finalRenderY = pos.y + diffY;
        const finalBoundingX = visibleX + diffX;
        const finalBoundingY = visibleY + diffY;

        return {
            x: finalBoundingX,
            y: finalBoundingY,
            width: visibleInfo.boundingBox.width,
            height: visibleInfo.boundingBox.height,
            renderX: finalRenderX,
            renderY: finalRenderY,
        };
    });

    return boxesKeywords;
};

const getBoundingBoxCluster = (boundingBoxesKeywords) => {
    if (!boundingBoxesKeywords || boundingBoxesKeywords.length === 0) return;

    let minX = screenWidth;
    let minY = screenHeight;
    let maxX = 0;
    let maxY = 0;

    boundingBoxesKeywords.forEach((boundingBoxKeyword) => {
        if (!boundingBoxKeyword) return;

        // Find the minimum top-left corner
        minX = Math.min(minX, boundingBoxKeyword.x);
        minY = Math.min(minY, boundingBoxKeyword.y);

        // Find the maximum bottom-right corner
        maxX = Math.max(maxX, boundingBoxKeyword.x + boundingBoxKeyword.width);
        maxY = Math.max(maxY, boundingBoxKeyword.y + boundingBoxKeyword.height);
    });

    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
    };
};


//----- xxx -----//
const getVisiblePixelsInfo = (image, imageWidth, imageHeight) => {
    if (image instanceof Promise) {
        console.error("❌ Error: getVisiblePixelsInfo received a Promise, not an Image.");
        return undefined;
    }

    const originalWidth = image.width;
    const originalHeight = image.height;

    // ... (rest of your logic remains exactly the same) ...

    const tempCanvas = new Canvas(originalWidth, originalHeight);
    const tempCtx = tempCanvas.getContext("2d");

    tempCtx.clearRect(0, 0, originalWidth, originalHeight);

    // This is where it was crashing because 'image' was a Promise
    tempCtx.drawImage(image, 0, 0);

    const imgData = tempCtx.getImageData(0, 0, originalWidth, originalHeight);
    const pixels = imgData.data;

    if (!pixels) return undefined;

    let minX = originalWidth;
    let minY = originalHeight;
    let maxX = 0;
    let maxY = 0;

    for (let y = 0; y < originalHeight; y++) {
        for (let x = 0; x < originalWidth; x++) {
            const index = (y * originalWidth + x) * 4;
            const alpha = pixels[index + 3];

            if (alpha > 0) {
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
            }
        }
    }

    if (maxX >= minX && maxY >= minY) {
        const imageAspect = originalWidth / originalHeight;
        const containerAspect = imageWidth / imageHeight;

        let renderedWidth;
        let renderedHeight;
        let containerOffsetX = 0;
        let containerOffsetY = 0;

        if (imageAspect > containerAspect) {
            renderedWidth = imageWidth;
            renderedHeight = imageWidth / imageAspect;
            containerOffsetY = (imageHeight - renderedHeight) / 2;
        } else {
            renderedHeight = imageHeight;
            renderedWidth = imageHeight * imageAspect;
            containerOffsetX = (imageWidth - renderedWidth) / 2;
        }

        const scaleX = renderedWidth / originalWidth;
        const scaleY = renderedHeight / originalHeight;

        // Calculate the offset of visible content from top-left of container
        //make sure the element is centered
        const visibleOffsetX = containerOffsetX + minX * scaleX;
        const visibleOffsetY = containerOffsetY + minY * scaleY;
        const visibleWidth = (maxX - minX + 1) * scaleX;
        const visibleHeight = (maxY - minY + 1) * scaleY;

        return {
            boundingBox: {
                x: 0, // Will be set later based on image position
                y: 0,
                width: visibleWidth,
                height: visibleHeight,
            },
            offsetX: visibleOffsetX,
            offsetY: visibleOffsetY,
        };
    }

    return undefined;
};



//----------------------------- export function -----------------------------//
//CHANGE FOR NODE
export const useComposition = async (project, width, height, sWidth, sHeight) => {
    // export const useComposition = (project, width, height, sWidth, sHeight) => {
    //----- constants -----//
    centerX = sWidth / 2;
    centerY = sHeight / 2;
    widthCluster = width;
    heightCluster = height;
    offset = widthCluster / 7.5;
    screenHeight = sHeight;
    screenWidth = sWidth;

    widhtKeyword = widthCluster / 2;
    heightKeyword = heightCluster / 2;

    console.log('🟢 Generating composition for project:', project.formattedName);
    console.log('🟢 with dimensions:', width, height, 'and screen size:', sWidth, sHeight);
    console.log('🟢 Calculated parameters - centerX:', centerX, 'centerY:', centerY, 'widthCluster:', widthCluster, 'heightCluster:', heightCluster, 'offset:', offset, 'widhtKeyword:', widhtKeyword, 'heightKeyword:', heightKeyword);

    //----- get data from project -----//
    const keywordData = project.keywords;
    const projectColor = project.color;
    const keywordFormatted = keywordData.map(keyword => keyword.formattedName);
    const clusterData = project.cluster;

    console.log('🔵 1. keywordData', keywordData);
    console.log('🔵 2. keywordFormatted', keywordFormatted);
    console.log('🔵 3. clusterData', clusterData);

    //----- get images from project -----//
    const keywordImagesSources = useGetImages(keywordFormatted);
    const clusterImagesSources = useGetClusterImages(clusterData.formattedName);
    // console.log('🔵 4. keywordImages', keywordImagesSources);
    // console.log('🔵 5. clusterImages', clusterImagesSources);
    console.log('🔵 4. keywordImages');
    console.log('🔵 5. clusterImages');

    //----- get correct positions from keywordPositionsConfig -----//
    const positions = keywordPositionsConfig[keywordData.length];
    console.log('🔵 6. positions', positions);

    //----- get correct keyword & cluster images based on rotation from config -----//
    //keywords
    const keywordSources = keywordData.map((data, index) => {
        const image = keywordImagesSources[index];
        const offset = colorOffsets[projectColor]
        if (!image || !positions) return null;

        const rotationIndex = positions.rotationImages?.[index] || 0;
        return image[rotationIndex + offset];
    });

    console.log('🔵 7. keywordSources', keywordSources);

    const loadedKeywordImages = await Promise.all(
        keywordSources.map(async (src) => {
            if (!src) return null;
            try {
                return await loadImage(src);
            } catch (error) {
                console.error("Failed to load:", src);
                return null;
            }
        })
    );

    // Pad the array to 8 items with nulls (to match your previous manual code)
    keywordImages = [...loadedKeywordImages];
    while (keywordImages.length < 8) {
        keywordImages.push(null);
    }

    console.log('🔵 8. keywordImages loaded', keywordImages);

    //clusters
    const clusterSource = clusterImagesSources[0]; // Get first image from first cluster
    clusterImage = await loadImage(clusterSource) || null;

    const requiredKeywordImages = keywordImages.slice(0, keywordData.length);
    const allImagesLoaded = clusterImage !== null && requiredKeywordImages.every(img => img !== null);

    console.log('🔵 9. clusterImage loaded', clusterImage);

    //----- return loading state if images not loaded -----//
    if (!allImagesLoaded) {
        console.log('⏳ Waiting for all images to load...');
        return {
            clusterPosition: undefined,
            keywordPositions: [],
            boundingBoxesKeywords: undefined,
            boundingBoxesCluster: undefined,
            keyWordLabelPositions: [],
            keywordImageSources: keywordImages,
            clusterImageSources: [clusterSource],
            keywordData,
            keywordImages: requiredKeywordImages,
            clusterImage,
            positions,
            centerX,
            centerY,
            offset,
            widthCluster,
            heightCluster,
            widhtKeyword,
            heightKeyword,
            getEllipseIntersection,
            isLoading: true,
        };
    }

    console.log('✅ All images loaded! Performing calculations...');

    //----- Calculations -----//
    const clusterPosition = await getClusterPosition();
    console.log('🔵 10. clusterPosition', clusterPosition);

    const keywordPositions = getKeywordPositions(clusterPosition, positions);
    console.log('🔵 11. keywordPositions', keywordPositions);

    const boundingBoxesKeywords = await getBoundingBoxesKeywords(keywordPositions, keywordData);
    console.log('🔵 12. boundingBoxesKeywords', boundingBoxesKeywords);

    const boundingBoxesCluster = getBoundingBoxCluster(boundingBoxesKeywords);
    console.log('🔵 13. boundingBoxesCluster', boundingBoxesCluster);

    // console.log('🟢 Composition data ready.', boundingBoxesCluster, boundingBoxesKeywords);
    return {
        clusterPosition,
        keywordPositions,
        boundingBoxesKeywords,
        boundingBoxesCluster: boundingBoxesCluster,
        keywordImageSources: keywordImages,
        clusterImageSources: [clusterSource],
        keywordData,
        keywordImages: requiredKeywordImages,
        clusterImage,
        positions,
        centerX,
        centerY,
        offset,
        widthCluster,
        heightCluster,
        widhtKeyword,
        heightKeyword,
        getEllipseIntersection,
        isLoading: false,
    };
};

