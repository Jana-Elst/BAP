//----------------------------- IMPORTS -----------------------------//
// const { useGetClusterImages } = require('./getClusterImagesNode.js');
import { useGetClusterImages } from './getClusterImagesNode.js';
import { useGetImages } from './getKeywordImagesNode.js';
import { Image as SkiaImage, Canvas } from 'skia-canvas';
import fs from 'fs';
import path from 'path';

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

//----------------------------- DATA -----------------------------//
const keywordPositionsConfig = [
    {
        id: 0,
        degrees: [],
        rotationImages: [],
        keyWordLabelPositionsOffset: [],

    },
    {
        id: 1,
        degrees: [20],
        rotationImages: [0],
        keyWordLabelPositionsOffset: [2],
    },
    {
        id: 2,
        degrees: [340, 200],
        rotationImages: [0, 1],
        keyWordLabelPositionsOffset: [2, 1],
    },
    {
        id: 3,
        degrees: [0, 45, 90],
        rotationImages: [0, 1, 2],
    },
    {
        id: 4,
        degrees: [0, 75, 165, 250],
        rotationImages: [0, 1, 2, 3],
        keyWordLabelPositionsOffset: [0, 1.5, 0, 1.5],
    },
    {
        id: 5,
        degrees: [0, 72, 144, 216, 288],
        rotationImages: [2, 3, 4, 6, 1],
        keyWordLabelPositionsOffset: [0, 2, 1, 1, 2],
    },
    {
        id: 6,
        degrees: [0, 45, 90, 135, 180, 225],
        rotationImages: [0, 1, 2, 3, 4, 5],
    },
    {
        id: 7,
        degrees: [0, 45, 90, 135, 180, 225, 270],
        rotationImages: [0, 1, 2, 3, 4, 5, 6],
    },
    {
        id: 8,
        degrees: [0, 45, 90, 135, 179, 225, 270, 315],
        rotationImages: [0, 1, 2, 3, 4, 5, 6, 7],
        keyWordLabelPositionsOffset: [0, 2, 3, 1, 0, 1, 2, 1],
    },
];

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

    // const visibleInfo = getVisiblePixelsInfo(clusterImage, widthCluster, heightCluster);
    const visibleInfo = await getVisiblePixelsInfo(clusterImage, widthCluster, heightCluster);

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
    const boxesKeywords = keywordImages.map((image, index) => {
        const pos = keywordPositions[index];
        if (!pos) return undefined;

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

//ONLY FOR NODE
const loadSkiaImage = async (filePath) => {
    if (!filePath) return null;
    const resolved = path.isAbsolute(filePath) ? filePath : path.resolve(__dirname, '..', filePath);
    try {
        const buffer = await fs.promises.readFile(resolved);
        const img = new SkiaImage();
        await img.load(buffer);
        return img;
    } catch (e) {
        console.warn(`Could not load image ${resolved}: ${e.message}`);
        return null;
    }
};

//----- xxx -----//
//change for NODE
const getVisiblePixelsInfo = async (imageOrPath, imageWidth, imageHeight) => {
    if (!imageOrPath) return undefined;

    const image = typeof imageOrPath === 'string' ? await loadSkiaImage(imageOrPath) : imageOrPath;
    if (!image) return undefined;

    //--- Using app
    // const getVisiblePixelsInfo = (image, imageWidth, imageHeight) => {
    // if (!image) return undefined;

    // console.log('Analyzing visible pixels for image:', image);

    // const originalWidth = image.width();
    // const originalHeight = image.height();

    // const pixels = image.readPixels(0, 0, {
    //     width: originalWidth,
    //     height: originalHeight,
    //     colorType: 4,
    //     alphaType: 2,
    // });

    // if (!pixels) return undefined;

    //--using NODE
    // Width/height may be properties or functions depending on image object
    const originalWidth = typeof image.width === 'function' ? image.width() : image.width;
    const originalHeight = typeof image.height === 'function' ? image.height() : image.height;

    if (!originalWidth || !originalHeight) return undefined;

    // Draw image onto a Canvas and read pixels via getImageData
    const tmpCanvas = new Canvas(originalWidth, originalHeight);
    const tmpCtx = tmpCanvas.getContext('2d');
    tmpCtx.clearRect(0, 0, originalWidth, originalHeight);
    tmpCtx.drawImage(image, 0, 0, originalWidth, originalHeight);
    const imgData = tmpCtx.getImageData(0, 0, originalWidth, originalHeight);
    if (!imgData || !imgData.data) return undefined;
    const pixels = imgData.data;
    //STOP USING NODE

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

//----- Calculate the intersection point on the offset ellipse for a given angle -----//
const getEllipseIntersection = (degree, ellipseCenterX, ellipseCenterY, radiusX, radiusY) => {
    const radians = (degree * Math.PI) / 180;

    // For a line from center at angle θ intersecting an ellipse:
    // We need to find the distance r from center where the line intersects the ellipse
    // Formula: r = (a * b) / sqrt((b * cos(θ))² + (a * sin(θ))²)
    // where a = radiusX (semi-major axis) and b = radiusY (semi-minor axis)

    const cosTheta = Math.cos(radians);
    const sinTheta = Math.sin(radians);

    const denominator = Math.sqrt(
        Math.pow(radiusY * cosTheta, 2) +
        Math.pow(radiusX * sinTheta, 2)
    );

    const r = (radiusX * radiusY) / denominator;

    const x = ellipseCenterX + r * cosTheta;
    const y = ellipseCenterY + r * sinTheta;

    return { x, y };
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

    //----- get data from project -----//
    const keywordData = project.keywords;
    const keywordFormatted = keywordData.map(keyword => keyword.formattedName);
    const clusterData = project.cluster;

    // console.log('🔵 1. keywordData', keywordData);
    // console.log('🔵 2. keywordFormatted', keywordFormatted);
    // console.log('🔵 3. clusterData', clusterData);

    //----- get images from project -----//
    const keywordImagesSources = useGetImages(keywordFormatted);
    const clusterImagesSources = useGetClusterImages(clusterData.formattedName);
    // console.log('🔵 4. keywordImages', keywordImagesSources);
    // console.log('🔵 5. clusterImages', clusterImagesSources);

    //----- get correct positions from keywordPositionsConfig -----//
    const positions = keywordPositionsConfig[keywordData.length];
    // console.log('🔵 6. positions', positions);

    //----- get correct keyword & cluster images based on rotation from config -----//
    //keywords
    //TO FIX: offset based on color
    const keywordSources = keywordData.map((data, index) => {
        const image = keywordImagesSources[index];
        if (!image || !positions) return null;

        const rotationIndex = positions.rotationImages?.[index] || 0;
        return image[rotationIndex];
    });

    // console.log('🔵 7. keywordSources', keywordSources);

    // Load keyword images (Skia) for Node so later logic gets actual Image objects
    const keywordImage0 = await loadSkiaImage(keywordSources[0] || null);
    const keywordImage1 = await loadSkiaImage(keywordSources[1] || null);
    const keywordImage2 = await loadSkiaImage(keywordSources[2] || null);
    const keywordImage3 = await loadSkiaImage(keywordSources[3] || null);
    const keywordImage4 = await loadSkiaImage(keywordSources[4] || null);
    const keywordImage5 = await loadSkiaImage(keywordSources[5] || null);
    const keywordImage6 = await loadSkiaImage(keywordSources[6] || null);
    const keywordImage7 = await loadSkiaImage(keywordSources[7] || null);

    keywordImages = [
        keywordImage0,
        keywordImage1,
        keywordImage2,
        keywordImage3,
        keywordImage4,
        keywordImage5,
        keywordImage6,
        keywordImage7,
    ];

    //clusters
    const clusterSource = clusterImagesSources[0]?.[0]; // Get first image from first cluster
    clusterImage = await loadSkiaImage(clusterSource) || null;

    const requiredKeywordImages = keywordImages.slice(0, keywordData.length);
    const allImagesLoaded = clusterImage !== null && requiredKeywordImages.every(img => img !== null);

    // console.log('Checking image loading status...');
    // console.log('Cluster Image Loaded:', !!clusterImage);
    // console.log('Required Keyword Images Loaded:', requiredKeywordImages.map(img => img !== null));

    // console.log('🔵 8. keywordImages loaded', keywordImages);
    // console.log('🔵 9. clusterImage loaded', clusterImage);

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
    //---CHANGE
    // -- if using the app
    // const clusterPosition = getClusterPosition();
    // // console.log('🔵 10. clusterPosition', clusterPosition);
    // const keywordPositions = getKeywordPositions(clusterPosition, positions);
    // // console.log('🔵 11. keywordPositions', keywordPositions);
    // const boundingBoxesKeywords = getBoundingBoxesKeywords(keywordPositions, keywordData);
    // // console.log('🔵 12. boundingBoxesKeywords', boundingBoxesKeywords);
    // const boundingBoxesCluster = getBoundingBoxCluster(boundingBoxesKeywords);
    // // console.log('🔵 13. boundingBoxesCluster', boundingBoxesCluster);

    //--- node
    const clusterPosition = await getClusterPosition();
    const keywordPositions = getKeywordPositions(clusterPosition, positions);
    const boundingBoxesKeywords = await getBoundingBoxesKeywords(keywordPositions, keywordData);
    const boundingBoxesCluster = getBoundingBoxCluster(boundingBoxesKeywords);

    // console.log('Composition data ready.', boundingBoxesCluster, boundingBoxesKeywords);
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

