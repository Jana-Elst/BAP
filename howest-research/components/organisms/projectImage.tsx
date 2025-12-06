import { Canvas, Group, Line, Oval, Rect, Image as SkiaImage, useImage, vec } from '@shopify/react-native-skia';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import useGetClusterImages from '../../scripts/getClusterImages';
import useGetImages from '../../scripts/getKeywordImages';

const keywordPositionsConfig = [
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
        rotationImages: [0, 1, 2, 3, 4],
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
    const keywordData = useMemo(() => project.keywords, [project.keywords]);
    const keywordDataFormatted = useMemo(() => keywordData.map(keyword => keyword.formattedName), [keywordData]);
    const clusterData = useMemo(() => project.cluster, [project.cluster]);

    const keywordImageSources = useGetImages(keywordDataFormatted);
    const clusterImageSources = useGetClusterImages(clusterData.formattedName);
    const positions = useMemo(() => keywordPositionsConfig[keywordData.length - 1], [keywordData.length]);

    const selectedImageSources = useMemo(() => {
        let sources = [];
        // Max 8 keywords supported by positions config
        for (let i = 0; i < 8; i++) {
            if (i < keywordData.length && keywordImageSources && keywordImageSources[i] && positions && positions.rotationImages) {
                const rotationIndex = positions.rotationImages[i];
                // Check if the rotation index is within bounds of the source array
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

    const keywords = useMemo(() => {
        return [image1, image2, image3, image4, image5, image6, image7, image8].filter(img => img !== null);
    }, [image1, image2, image3, image4, image5, image6, image7, image8]);

    const clusterImageSource = useMemo(() => {
        if (!clusterImageSources || clusterImageSources.length === 0) return null;
        // Assuming we pick the first image of the cluster set for now, or apply similar rotation logic if needed
        return clusterImageSources[0] ? clusterImageSources[0][0] : null;
    }, [clusterImageSources]);

    const clusterImage = useImage(clusterImageSource);


    const [boundingBoxesKeywords, setBoundingBoxesKeywords] = useState<(BoundingBox | undefined)[]>([]);
    const [boundingBoxCluster, setBoundingBoxCluster] = useState<(BoundingBox | undefined)[]>([]);
    const [clusterImagePosition, setClusterImagePosition] = useState({ x: 0, y: 0 });

    const widthCluster = width;
    const heightCluster = height;

    const widhtKeyword = widthCluster / 2;
    const heightKeyword = heightCluster / 2;

    const offset = widthCluster / 7.5;

    const centerX = screenWidth / 2;
    const centerY = screenHeight / 2;

    // Get visible pixels info including offset within the image
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

    // Calculate the intersection point on the offset ellipse for a given angle
    const getEllipseIntersection = (degree: number, ellipseCenterX: number, ellipseCenterY: number, radiusX: number, radiusY: number) => {
        const radians = (degree * Math.PI) / 180;
        const x = ellipseCenterX + Math.cos(radians) * radiusX;
        const y = ellipseCenterY + Math.sin(radians) * radiusY;
        return { x, y };
    };

    // Get the keyword positions based on the offset ellipse
    const getKeywordPositions = () => {
        const clusterBox = boundingBoxCluster[0];
        if (!clusterBox) return [];

        // The ellipse center is now the screen center (since cluster is centered)
        const ellipseCenterX = centerX;
        const ellipseCenterY = centerY;
        const radiusX = (clusterBox.width + offset) / 2;
        const radiusY = (clusterBox.height + offset) / 2;

        return positions.degrees.map((degree) => {
            const intersection = getEllipseIntersection(degree, ellipseCenterX, ellipseCenterY, radiusX, radiusY);
            return {
                x: intersection.x - widhtKeyword / 2,
                y: intersection.y - heightKeyword / 2,
                centerX: intersection.x,
                centerY: intersection.y,
            };
        });
    };

    // Calculate cluster position so visible content is centered
    useEffect(() => {
        const allLoadedCluster = clusterImage !== null;
        if (!allLoadedCluster) return;

        const visibleInfo = getVisiblePixelsInfo(clusterImage, widthCluster, heightCluster);

        if (visibleInfo) {
            // Calculate where the image should be placed so visible content is centered
            const imageX = centerX - visibleInfo.boundingBox.width / 2 - visibleInfo.offsetX;
            const imageY = centerY - visibleInfo.boundingBox.height / 2 - visibleInfo.offsetY;

            setClusterImagePosition({ x: imageX, y: imageY });

            // Set the bounding box with correct screen position
            setBoundingBoxCluster([{
                x: centerX - visibleInfo.boundingBox.width / 2,
                y: centerY - visibleInfo.boundingBox.height / 2,
                width: visibleInfo.boundingBox.width,
                height: visibleInfo.boundingBox.height,
            }]);
        }
    }, [clusterImage, centerX, centerY]);

    // Calculate keyword positions around the cluster and their bounding boxes
    const keywordPositions = getKeywordPositions();
    useEffect(() => {
        const allLoadedKeywords = keywords.every(img => img !== null);
        if (!allLoadedKeywords || keywordPositions.length === 0) return;

        const boxesKeywords = keywords.map((image, index) => {
            const pos = keywordPositions[index];
            if (!pos) return undefined;

            const visibleInfo = getVisiblePixelsInfo(image, widhtKeyword, heightKeyword);
            if (!visibleInfo) return undefined;

            return {
                x: pos.x + visibleInfo.offsetX,
                y: pos.y + visibleInfo.offsetY,
                width: visibleInfo.boundingBox.width,
                height: visibleInfo.boundingBox.height,
            };
        });
        setBoundingBoxesKeywords(boxesKeywords);

    }, [keywordData, keywordPositions]);

    return (
        <View style={styles.container}>
            <Canvas style={{ width: screenWidth, height: screenHeight }}>
                {/* Draw lines from center based on degrees */}
                {positions.degrees.map((degree, index) => {
                    const radians = (degree * Math.PI) / 180;
                    const lineLength = Math.min(screenWidth, screenHeight) / 2;

                    const endX = centerX + Math.cos(radians) * lineLength;
                    const endY = centerY + Math.sin(radians) * lineLength;

                    return (
                        <Line
                            key={`line-${index}`}
                            p1={vec(centerX, centerY)}
                            p2={vec(endX, endY)}
                            color="blue"
                            strokeWidth={2}
                        />
                    );
                })}

                {/* Draw keyword images at intersection points */}
                {keywords.map((image, index) => {
                    const pos = keywordPositions[index];
                    const boundingBox = boundingBoxesKeywords[index];
                    // console.log('boundingBox', boundingBox);

                    if (!pos) return null;

                    let renderX = pos.x;
                    let renderY = pos.y;
                    let debugBox = boundingBox;

                    if (boundingBox) {
                        const currentCenterX = boundingBox.x + boundingBox.width / 2;
                        const currentCenterY = boundingBox.y + boundingBox.height / 2;

                        const diffX = pos.centerX - currentCenterX;
                        const diffY = pos.centerY - currentCenterY;

                        renderX += diffX;
                        renderY += diffY;

                        debugBox = {
                            ...boundingBox,
                            x: boundingBox.x + diffX,
                            y: boundingBox.y + diffY
                        };
                    }

                    return (
                        <Group key={`keyword-${index}`}>
                            <SkiaImage
                                image={image}
                                x={renderX}
                                y={renderY}
                                width={widhtKeyword}
                                height={heightKeyword}
                            />
                            {debugBox && (
                                <Rect
                                    x={debugBox.x}
                                    y={debugBox.y}
                                    width={debugBox.width}
                                    height={debugBox.height}
                                    color="green"
                                    style="stroke"
                                    strokeWidth={2}
                                />
                            )}
                        </Group>
                    );
                })}

                {/* Draw cluster image and bounding boxes */}
                {clusterImage && (
                    <Group>
                        <SkiaImage
                            image={clusterImage}
                            x={clusterImagePosition.x}
                            y={clusterImagePosition.y}
                            width={widthCluster}
                            height={heightCluster}
                        />
                        {boundingBoxCluster[0] && (
                            <Group>
                                {/* Inner ellipse around visible content */}
                                <Oval
                                    x={boundingBoxCluster[0].x}
                                    y={boundingBoxCluster[0].y}
                                    width={boundingBoxCluster[0].width}
                                    height={boundingBoxCluster[0].height}
                                    color="red"
                                    style="stroke"
                                    strokeWidth={2}
                                />
                                {/* Outer ellipse with offset */}
                                <Oval
                                    x={boundingBoxCluster[0].x - offset / 2}
                                    y={boundingBoxCluster[0].y - offset / 2}
                                    width={boundingBoxCluster[0].width + offset}
                                    height={boundingBoxCluster[0].height + offset}
                                    color="red"
                                    style="stroke"
                                    strokeWidth={2}
                                />
                            </Group>
                        )}
                    </Group>
                )
                }
            </Canvas>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ProjectImage;