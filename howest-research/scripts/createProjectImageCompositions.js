//----------------------------- IMPORTS -----------------------------//
import { useMemo } from 'react';
import { useImageWithVisibleInfo } from '../hooks/useSkiaImageWithVisibleInfo';
import useGetClusterImages from './getClusterImages';
import useGetImages from './getKeywordImages';

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
        degrees: [320],
        rotationImages: [1],
        keyWordLabelPositionsOffset: [2],
    },
    {
        id: 2,
        degrees: [340, 200],
        rotationImages: [1, 6],
        keyWordLabelPositionsOffset: [2, 1],
    },
    {
        id: 3,
        degrees: [270, 35, 145],
        rotationImages: [0, 2, 5],
    },
    {
        id: 4,
        degrees: [325, 35, 145, 215],
        rotationImages: [1, 2, 5, 6],
        keyWordLabelPositionsOffset: [0, 1.5, 0, 1.5],
    },
    {
        id: 5,
        degrees: [10, 82, 154, 226, 298],
        rotationImages: [2, 3, 5, 7, 0],
        keyWordLabelPositionsOffset: [0, 2, 1, 1, 2],
    },
    {
        id: 6,
        degrees: [310, 5, 60, 120, 175, 230],
        rotationImages: [0, 1, 3, 4, 5, 7],
    },
    {
        id: 7,
        degrees: [296, 347, 38.5, 90, 141, 193, 244],
        rotationImages: [0, 1, 2, 3, 5, 6, 7],
    },
    {
        id: 8,
        degrees: [292.5, 337.5, 22.5, 67.5, 112.5, 157.5, 202.5, 247.5],
        rotationImages: [0, 1, 2, 3, 4, 5, 6, 7],
        keyWordLabelPositionsOffset: [0, 2, 3, 1, 0, 1, 2, 1],
    },
];

const colorOffsets = {
    pink: 16,
    blue: 0,
    yellow: 32,
    purple: 8,
    green: 24,
};

//----------------------------- helper functions -----------------------------//
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

//----- Get Positions & Bounding boxes -----//
//get cluster position based on visible pixels
const getClusterPosition = (visibleInfo, centerX, centerY, widthCluster, heightCluster, offset) => {
    //check if cluster image is loaded
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
const getKeywordPositions = (clusterPosition, positions, centerX, centerY, offset, widthKeyword, heightKeyword) => {
    if (!clusterPosition) return [];

    const radiusX = (clusterPosition.width + offset) / 2;
    const radiusY = (clusterPosition.height + offset) / 2;

    if (!positions) return [];
    return positions.degrees.map((degree) => {
        const intersection = getEllipseIntersection(degree, centerX, centerY, radiusX, radiusY);
        return {
            x: intersection.x - widthKeyword / 2,
            y: intersection.y - heightKeyword / 2,
            centerX: intersection.x,
            centerY: intersection.y,
        };
    });
};

const getKeywordInitialPositions = (positions, centerX, centerY, widthKeyword, heightKeyword) => {
    if (!positions) return [];
    return positions.degrees.map((degree) => {
        const intersection = getEllipseIntersection(degree, centerX, centerY, 1920, 1080);
        return {
            x: intersection.x - widthKeyword / 2,
            y: intersection.y - heightKeyword / 2,
            centerX: intersection.x,
            centerY: intersection.y,
        };
    });
};

//
const getBoundingBoxesKeywords = (keywordPositions, keywordVisibleInfos, widthKeyword, heightKeyword) => {
    const boxesKeywords = keywordPositions.map((pos, index) => {
        if (!pos) return undefined;

        // Use the pre-calculated visible info
        const visibleInfo = keywordVisibleInfos[index];
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

const getBoundingBoxCluster = (boundingBoxesKeywords, screenWidth, screenHeight) => {
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


//----------------------------- export function -----------------------------//
export const useComposition = (project, width, height, sWidth, sHeight, name = 'default') => {
    console.log('🟢 start using useComposition', name);
    //----- constants -----//
    const centerX = sWidth / 2;
    const centerY = sHeight / 2;
    const widthCluster = width;
    const heightCluster = height;
    const offset = widthCluster / 7.5;
    const screenHeight = sHeight;
    const screenWidth = sWidth;

    const widthKeyword = widthCluster / 2;
    const heightKeyword = heightCluster / 2;

    //----- get data from project (SAFE GUARDED) -----//
    const keywordData = project ? project.keywords : [];
    const projectColor = project ? project.color : 'blue'; // default
    const keywordFormatted = keywordData.map(keyword => keyword.formattedName);
    const clusterData = project ? project.cluster : { formattedName: '' };

    // console.log('🔵 1. keywordData', keywordData);
    // console.log('🔵 2. keywordFormatted', keywordFormatted);
    // console.log('🔵 3. clusterData', clusterData);

    //----- get images from project -----//
    const keywordImagesSources = useGetImages(keywordFormatted);
    const clusterImagesSources = useGetClusterImages(clusterData.formattedName);
    // console.log('🔵 4. keywordImages', keywordImagesSources);
    // console.log('🔵 5. clusterImages', clusterImagesSources);

    //----- get correct positions from keywordPositionsConfig -----//
    const positions = keywordPositionsConfig[keywordData.length] || null;
    // console.log('🔵 6. positions', positions);

    //----- get correct keyword & cluster images based on rotation from config -----//
    //keywords
    const keywordSources = keywordData.map((data, index) => {
        const image = keywordImagesSources[index];
        const offset = colorOffsets[projectColor]
        if (!image || !positions) return null;

        const rotationIndex = positions.rotationImages?.[index] || 0;
        return image[rotationIndex + offset];
    });

    // console.log('🔵 7. keywordSources', keywordSources);

    const [keywordImage0, visibleInfo0] = useImageWithVisibleInfo(keywordSources[0] || null, widthKeyword, heightKeyword);
    const [keywordImage1, visibleInfo1] = useImageWithVisibleInfo(keywordSources[1] || null, widthKeyword, heightKeyword);
    const [keywordImage2, visibleInfo2] = useImageWithVisibleInfo(keywordSources[2] || null, widthKeyword, heightKeyword);
    const [keywordImage3, visibleInfo3] = useImageWithVisibleInfo(keywordSources[3] || null, widthKeyword, heightKeyword);
    const [keywordImage4, visibleInfo4] = useImageWithVisibleInfo(keywordSources[4] || null, widthKeyword, heightKeyword);
    const [keywordImage5, visibleInfo5] = useImageWithVisibleInfo(keywordSources[5] || null, widthKeyword, heightKeyword);
    const [keywordImage6, visibleInfo6] = useImageWithVisibleInfo(keywordSources[6] || null, widthKeyword, heightKeyword);
    const [keywordImage7, visibleInfo7] = useImageWithVisibleInfo(keywordSources[7] || null, widthKeyword, heightKeyword);
    const [keywordImage8, visibleInfo8] = useImageWithVisibleInfo(keywordSources[8] || null, widthKeyword, heightKeyword);

    const keywordImages = useMemo(() => [
        keywordImage0,
        keywordImage1,
        keywordImage2,
        keywordImage3,
        keywordImage4,
        keywordImage5,
        keywordImage6,
        keywordImage7,
        keywordImage8,
    ], [keywordImage0, keywordImage1, keywordImage2, keywordImage3, keywordImage4, keywordImage5, keywordImage6, keywordImage7, keywordImage8]);

    const keywordVisibleInfos = useMemo(() => [
        visibleInfo0, visibleInfo1, visibleInfo2, visibleInfo3, visibleInfo4, visibleInfo5, visibleInfo6, visibleInfo7, visibleInfo8
    ], [visibleInfo0, visibleInfo1, visibleInfo2, visibleInfo3, visibleInfo4, visibleInfo5, visibleInfo6, visibleInfo7, visibleInfo8]);

    //clusters
    const clusterSource = clusterImagesSources[0]?.[0]; // Get first image from first cluster
    const [clusterImage, visibleInfoCluster] = useImageWithVisibleInfo(clusterSource || null, widthCluster, heightCluster);

    // If no project was provided, return early NOW (after all hooks have run)
    return useMemo(() => {
        if (!project) return { isLoading: true };

        const requiredKeywordImages = keywordImages.slice(0, keywordData.length);
        const requiredVisibleInfos = keywordVisibleInfos.slice(0, keywordData.length);

        const allImagesLoaded = clusterImage !== null && requiredKeywordImages.every(img => img !== null);

        // console.log('🔵 8. keywordImages loaded', keywordImages);
        // console.log('🔵 9. clusterImage loaded', clusterImage);

        const allVisibleInfosReady = visibleInfoCluster !== undefined && requiredVisibleInfos.every(info => info !== undefined);
        // console.log('🔵 10. visibleInfoCluster', visibleInfoCluster);
        // console.log('🔵 11. requiredVisibleInfos', requiredVisibleInfos);


        //----- return loading state if images not loaded -----//
        if (!allImagesLoaded || !allVisibleInfosReady) {
            console.log('⏳ Waiting for all images and visible infos to load...');
            return {
                clusterPosition: undefined,
                keywordPositions: [],
                keywordInitialPositions: [],
                boundingBoxesKeywords: undefined,
                boundingBoxesKeywordsInitial: undefined,
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
                widthKeyword,
                heightKeyword,
                getEllipseIntersection,
                isLoading: true,
            };
        }

        console.log('✅ All images and visible infos loaded! Performing calculations...');

        //----- Calculations -----//
        const clusterPosition = getClusterPosition(visibleInfoCluster, centerX, centerY, widthCluster, heightCluster, offset);
        const keywordPositions = getKeywordPositions(clusterPosition, positions, centerX, centerY, offset, widthKeyword, heightKeyword);
        const keywordInitialPositions = getKeywordInitialPositions(positions, centerX, centerY, widthKeyword, heightKeyword);

        const boundingBoxesKeywords = getBoundingBoxesKeywords(keywordPositions, requiredVisibleInfos, widthKeyword, heightKeyword);
        const boundingBoxesKeywordsInitial = getBoundingBoxesKeywords(keywordInitialPositions, requiredVisibleInfos, widthKeyword, heightKeyword);

        const boundingBoxesCluster = getBoundingBoxCluster(boundingBoxesKeywords, screenWidth, screenHeight);

        console.log('Composition data ready.');
        return {
            clusterPosition,
            keywordPositions,
            keywordInitialPositions,
            boundingBoxesKeywords,
            boundingBoxesKeywordsInitial,
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
            widthKeyword,
            heightKeyword,
            getEllipseIntersection,
            isLoading: false,
        };
    }, [
        project,
        clusterImage,
        visibleInfoCluster,
        keywordImages,
        keywordVisibleInfos,
        keywordData,
        positions,
        centerX,
        centerY,
        offset,
        widthCluster,
        heightCluster,
        widthKeyword,
        heightKeyword,
        screenWidth,
        screenHeight,
        clusterSource
    ]);
};