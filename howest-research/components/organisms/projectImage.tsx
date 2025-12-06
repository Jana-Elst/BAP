import { Canvas, Group, Image as SkiaImage, useImage } from '@shopify/react-native-skia';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import useGetImages from '../../scripts/getKeywordImages';

import mensEnWelzijn from '../../assets/images/clusters/businessEnMediaCbm/0001.png';

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
        degrees: [0, 45, 90, 135, 180],
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

const ProjectImage = ({ width, height, project, setPage, page }) => {
    const keywordData = useMemo(() => project.keywords, [project.keywords]);
    const keywordDataFormatted = useMemo(() => keywordData.map(keyword => keyword.formattedName), [keywordData]);

    const images = useGetImages(keywordDataFormatted);
    const positions = useMemo(() => keywordPositionsConfig[keywordData.length - 1], [keywordData.length]);

    const keywords = useMemo(() => {
        let imagesFlat = [];
        if (!images || images.length === 0) return [];

        for (let i = 0; i < images.length; i++) {
            const imageSet = images[i];
            imagesFlat.push(imageSet[positions.rotationImages[0]]);
        }

        return imagesFlat;
    }, [images]);

    const clusterImage = useImage(mensEnWelzijn);

    const [boundingBoxesKeywords, setBoundingBoxesKeywords] = useState<(BoundingBox | undefined)[]>([]);
    const [boundingBoxCluster, setBoundingBoxCluster] = useState<(BoundingBox | undefined)[]>([]);
    const [clusterImagePosition, setClusterImagePosition] = useState({ x: 0, y: 0 });

    const size = { width, height };

    const widthCluster = Math.max(size.width / 2, size.height / 2);
    const heightCluster = Math.max(size.width / 2, size.height / 2);

    const widhtKeyword = widthCluster / 3 * 2;
    const heightKeyword = heightCluster / 3 * 2;

    const offset = widthCluster / 4;

    const centerX = size.width / 2;
    const centerY = size.height / 2;

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
            <Canvas style={{ width: size.width, height: size.height }}>
                {/* Draw lines from center based on degrees */}
                {/* {positions.degrees.map((degree, index) => {
                    const radians = (degree * Math.PI) / 180;
                    const lineLength = Math.min(size.width, size.height) / 2;

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
                })} */}

                {/* Draw keyword images at intersection points */}
                {keywords.map((image, index) => {
                    const pos = keywordPositions[index];
                    const boundingBox = boundingBoxesKeywords[index];

                    if (!pos) return null;

                    return (
                        <Group key={`keyword-${index}`}>
                            <SkiaImage
                                image={image}
                                x={pos.x}
                                y={pos.y}
                                width={widhtKeyword}
                                height={heightKeyword}
                            />
                            {/* {boundingBox && (
                                <Rect
                                    x={boundingBox.x}
                                    y={boundingBox.y}
                                    width={boundingBox.width}
                                    height={boundingBox.height}
                                    color="green"
                                    style="stroke"
                                    strokeWidth={2}
                                />
                            )} */}
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
                        {boundingBoxCluster && (
                            <Group>
                                {/* Inner ellipse around visible content */}
                                {/* <Oval
                                        x={boundingBox.x}
                                        y={boundingBox.y}
                                        width={boundingBox.width}
                                        height={boundingBox.height}
                                        color="red"
                                        style="stroke"
                                        strokeWidth={2}
                                    /> */}
                                {/* Outer ellipse with offset */}
                                {/* <Oval
                                        x={boundingBox.x - offset / 2}
                                        y={boundingBox.y - offset / 2}
                                        width={boundingBox.width + offset}
                                        height={boundingBox.height + offset}
                                        color="red"
                                        style="stroke"
                                        strokeWidth={2}
                                    /> */}
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