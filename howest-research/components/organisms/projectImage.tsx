import { Canvas, Group, Image as SkiaImage, useImage } from '@shopify/react-native-skia';
import { useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';
import useGetClusterImages from '../../scripts/getClusterImages';
import useGetImages from '../../scripts/getKeywordImages';


const keywordPositionsConfig = [
    {
        id: 0,
        degrees: [],
        rotationImages: [],
    },
    {
        id: 1,
        degrees: [0],
        rotationImages: [0],
    },
    {
        id: 2,
        degrees: [0, 45],
        rotationImages: [0, 1],
    },
    {
        id: 3,
        degrees: [0, 45, 90],
        rotationImages: [0, 1, 2],
    },
    {
        id: 4,
        degrees: [0, 45, 90, 135],
        rotationImages: [0, 1, 2, 3],
    },
    {
        id: 5,
        degrees: [0, 72, 144, 216, 288],
        rotationImages: [2, 3, 4, 6, 1],
    },
    {
        id: 6,
        degrees: [0, 45, 90, 135, 180, 225],
        rotationImages: [0, 1, 2, 3, 4, 5],
    },
    {
        id: 7,
        degrees: [0, 45, 90, 135, 180, 225, 270, 315],
        rotationImages: [0, 1, 2, 3, 4, 5, 6, 7],
    },
];

const ProjectImage = ({ screenWidth, screenHeight, width, height, project, setPage, page }) => {
    //----- get data from project -----//
    const keywordData = useMemo(() => project.keywords, [project.keywords]);
    const keywordDataFormatted = useMemo(() => keywordData.map(keyword => keyword.formattedName), [keywordData]);
    const clusterData = useMemo(() => project.cluster, [project.cluster]);

    //----- get images from data -----//
    const keywordImageSources = useGetImages(keywordDataFormatted);
    const clusterImageSources = useGetClusterImages(clusterData.formattedName);
    const positions = useMemo(() => keywordPositionsConfig[keywordData.length - 1], [keywordData.length]);

    //----- select correct images -----//
    //keywords
    const selectedImageSources = useMemo(() => {
        let sources = [];
        for (let i = 0; i < 8; i++) {
            if (i < keywordData.length && keywordImageSources && keywordImageSources[i] && positions && positions.rotationImages) {
                const rotationIndex = positions.rotationImages[i];

                if (keywordImageSources[i] && rotationIndex !== undefined && rotationIndex < keywordImageSources[i].length) {
                    sources.push(keywordImageSources[i][rotationIndex]);
                } else {
                    sources.push(null);
                }
            } else {
                sources.push(null);
            }
        }
        return sources;
    }, [keywordImageSources, positions, keywordData.length]);

    // Always call useImage 8 times. Pass null if no source selected.
    const image1 = useImage(selectedImageSources[0]);
    const image2 = useImage(selectedImageSources[1]);
    const image3 = useImage(selectedImageSources[2]);
    const image4 = useImage(selectedImageSources[3]);
    const image5 = useImage(selectedImageSources[4]);
    const image6 = useImage(selectedImageSources[5]);
    const image7 = useImage(selectedImageSources[6]);
    const image8 = useImage(selectedImageSources[7]);

    const keywordImages = useMemo(() => {
        return [image1, image2, image3, image4, image5, image6, image7, image8].filter(img => img !== null);
    }, [[image1, image2, image3, image4, image5, image6, image7, image8]]);

    //cluster
    const clusterImageSource = useMemo(() => {
        if (!clusterImageSources || clusterImageSources.length === 0) {
            console.log('No cluster image sources available');
            return null;
        }

        // clusterImageSources is an array of arrays
        // clusterImageSources[0] is the first cluster's images array
        const firstClusterImages = clusterImageSources[0];
        if (!firstClusterImages || firstClusterImages.length === 0) {
            console.log('First cluster has no images');
            return null;
        }

        // Use the first image from the cluster (index 0)
        return firstClusterImages[0];
    }, [clusterImageSources]);

    // useImage is async internally - it returns null while loading, then the SkImage when ready
    // No need for await - just check if it's null before using
    const clusterImage = useImage(clusterImageSource);

    // Log when cluster image actually loads
    if (clusterImage) {
        console.log('Cluster image LOADED successfully!', clusterImage);
    } else if (clusterImageSource) {
        console.log('Waiting for cluster image to load... source:', clusterImageSource);
    }

    //----- set bounding boxes & sizes -----//
    const widthCluster = width;
    const heightCluster = height;

    const widhtKeyword = widthCluster / 2;
    const heightKeyword = heightCluster / 2;

    const offset = widthCluster / 7.5;

    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;

    const getVisiblePixelsInfo = (image: any, imageWidth: number, imageHeight: number): VisiblePixelsResult | undefined => {
        if (!image) return undefined;

        const originalWidth = image.width();
        const originalHeight = image.height();

        const pixels = image.readPixels(0, 0, {
            width: originalWidth,
            height: originalHeight,
            colorType: 4,
            alphaType: 2,
        });

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

            let renderedWidth: number;
            let renderedHeight: number;
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

    const getClusterPosition = () => {
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
    }

    //----- Get the keyword positions based on the offset ellipse -----//
    const getKeywordPositions = (clusterPosition: any) => {
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

    //----- Calculate the intersection point on the offset ellipse for a given angle -----//
    const getEllipseIntersection = (degree: number, ellipseCenterX: number, ellipseCenterY: number, radiusX: number, radiusY: number) => {
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

    const getBoundingBoxesKeywords = () => {
        const allLoadedKeywords = keywordImages.every(img => img !== null);
        if (!allLoadedKeywords || keywordPositions.length === 0) return;

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

    const clusterPosition = useMemo(() => getClusterPosition(), [clusterImage]);
    console.log('clusterPosition', clusterPosition);
    const keywordPositions = useMemo(() => getKeywordPositions(clusterPosition), [clusterPosition]);
    const boundingBoxesKeywords = useMemo(() => getBoundingBoxesKeywords(), [keywordImages, keywordPositions]);
    console.log('boundingBoxesKeywords', boundingBoxesKeywords);

    //----- event listeners -----//
    const canvasRef = useRef<View>(null);

    const handleOpendetailKeyword = (keyword: any, index: number) => {
        setPage({
            page: 'detailKeyword',
            id: keyword.id,
            info: {
                keyword: keyword,
                keywordImageSource: selectedImageSources[index],
                boundingBoxKeyword: boundingBoxesKeywords[index],
            },
            previousPages: [
                ...page.previousPages || [],
                {
                    page: page.page,
                    id: page.id,
                    info: page.info,
                }
            ]
        })
    }

    const handleTap = (event: any) => {
        const { x, y } = event.nativeEvent;

        // Check if touch is within any keyword bounding box
        boundingBoxesKeywords?.forEach((box, index) => {
            if (!box) return;

            // Check if touch point is within the bounding box
            if (
                x >= box.x &&
                x <= box.x + box.width &&
                y >= box.y &&
                y <= box.y + box.height
            ) {
                handleOpendetailKeyword(keywordData[index], index);
            }
        });


        // TODO: Add cluster click handler if needed
        // if (
        //     x >= clusterPosition.x &&
        //     x <= clusterPosition.x + clusterPosition.width &&
        //     y >= clusterPosition.y &&
        //     y <= clusterPosition.y + clusterPosition.height
        // ) {
        //     // Handle cluster click
        // }
    };

    return (
        <View style={styles.container}>
            <TapGestureHandler onHandlerStateChange={handleTap}>
                <View ref={canvasRef} style={{ width: screenWidth, height: screenHeight }}>
                    <Canvas style={{ width: screenWidth, height: screenHeight }}>
                        {/* Draw lines from center based on degrees */}
                        {/* {positions.degrees.map((degree, index) => {
                    const radians = (degree * Math.PI) / 180;
                    const lineLength = Math.min(screenWidth, screenHeight) / 2;

                    const endX = centerX + Math.cos(radians) * lineLength;
                    const endY = centerY + Math.sin(radians) * lineLength;

                    return (
                        <Line
                            key={`line - ${ index } `}
                            p1={vec(centerX, centerY)}
                            p2={vec(endX, endY)}
                            color="black"
                            strokeWidth={2}
                        />
                    );
                })} */}

                        {/* Draw intersection points */}
                        {/* {clusterPosition && debugPos.degrees.map((degree, index) => {
                    const intersection = getEllipseIntersection(
                        degree,
                        centerX,
                        centerY,
                        (clusterPosition.width + offset) / 2,
                        (clusterPosition.height + offset) / 2
                    );
                    return (
                        <Circle
                            key={`intersection - ${ index } `}
                            cx={intersection.x}
                            cy={intersection.y}
                            r={5}
                            color="black"
                        />
                    );
                })} */}

                        {/* Draw keyword images at intersection points */}
                        {keywordImages.map((image, index) => {
                            const pos = keywordPositions[index];
                            const boundingBox = boundingBoxesKeywords ? boundingBoxesKeywords[index] : undefined;

                            if (!pos) return null;

                            // Use pre-calculated render positions if available, otherwise fall back to pos
                            const renderX = boundingBox?.renderX ?? pos.x;
                            const renderY = boundingBox?.renderY ?? pos.y;

                            return (
                                <Group key={`keyword-${index}`}>
                                    <SkiaImage
                                        image={image}
                                        x={renderX}
                                        y={renderY}
                                        width={widhtKeyword}
                                        height={heightKeyword}
                                    />
                                    {/* {boundingBox && (
                                <Rect
                                    x={boundingBox.x}
                                    y={boundingBox.y}
                                    width={boundingBox.width}
                                    height={boundingBox.height}
                                    color="black"
                                    style="stroke"
                                    strokeWidth={2}
                                />
                            )} */}
                                </Group>
                            );
                        })}

                        {/* Draw cluster image and bounding boxes */}
                        {clusterPosition && (
                            <Group>
                                <SkiaImage
                                    image={clusterImage}
                                    x={clusterPosition.imageX}
                                    y={clusterPosition.imageY}
                                    width={widthCluster}
                                    height={heightCluster}
                                />
                                {clusterPosition && (
                                    <Group>
                                        {/* Inner ellipse around visible content */}
                                        {/* <Oval
                                    x={clusterPosition.x}
                                    y={clusterPosition.y}
                                    width={clusterPosition.width}
                                    height={clusterPosition.height}
                                    color="black"
                                    style="stroke"
                                    strokeWidth={2}
                                /> */}
                                        {/* Outer ellipse with offset */}
                                        {/* <Oval
                                    x={clusterPosition.x - offset / 2}
                                    y={clusterPosition.y - offset / 2}
                                    width={clusterPosition.width + offset}
                                    height={clusterPosition.height + offset}
                                    color="black"
                                    style="stroke"
                                    strokeWidth={2}
                                /> */}
                                    </Group>
                                )}
                            </Group>
                        )}
                    </Canvas>
                </View>
            </TapGestureHandler >
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: 'green',
    },
});

export default ProjectImage;