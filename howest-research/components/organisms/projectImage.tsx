import { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { Canvas, Image as SkiaImage, useImage, Rect, Group, Circle, Oval } from '@shopify/react-native-skia';
import mensEnWelzijn from '../../assets/images/keywords/mensEnWelzijn/image-static.png';
import aiArtificialIntelligence1 from '../../assets/images/keywords/aiArtificialIntelligence/0001.png';
import aiArtificialIntelligence2 from '../../assets/images/keywords/aiArtificialIntelligence/0002.png';
import aiArtificialIntelligence3 from '../../assets/images/keywords/aiArtificialIntelligence/0003.png';
import aiArtificialIntelligence4 from '../../assets/images/keywords/aiArtificialIntelligence/0004.png';
import aiArtificialIntelligence5 from '../../assets/images/keywords/aiArtificialIntelligence/0005.png';
import aiArtificialIntelligence6 from '../../assets/images/keywords/aiArtificialIntelligence/0006.png';
import aiArtificialIntelligence7 from '../../assets/images/keywords/aiArtificialIntelligence/0007.png';
import aiArtificialIntelligence8 from '../../assets/images/keywords/aiArtificialIntelligence/0008.png';

const ProjectImage = () => {
    const image1 = useImage(aiArtificialIntelligence1);
    const image2 = useImage(aiArtificialIntelligence2);
    const image3 = useImage(aiArtificialIntelligence3);
    const image4 = useImage(aiArtificialIntelligence4);
    const image5 = useImage(aiArtificialIntelligence5);
    const image6 = useImage(aiArtificialIntelligence6);
    const image7 = useImage(aiArtificialIntelligence7);
    const image8 = useImage(aiArtificialIntelligence8);
    const image9 = useImage(mensEnWelzijn);

    const images = useMemo(() =>
        [image1, image2, image3, image4, image5, image6, image7, image8, image9]
    );

    const [boundingBoxes, setBoundingBoxes] = useState([]);
    const size = Dimensions.get('window');

    const imageWidth = 500;
    const imageHeight = 500;

    const imageX = size.width / 2 - imageWidth / 2;
    const imageY = size.height / 2 - imageHeight / 2;

    const getVisiblePixels = (image) => {
        if (!image) return undefined;

        // Get the original image dimensions
        const originalWidth = image.width();
        const originalHeight = image.height();

        // Read pixel data from the image
        const pixels = image.readPixels(0, 0, {
            width: originalWidth,
            height: originalHeight,
            colorType: 4, // RGBA_8888
            alphaType: 2, // Premul
        });

        if (!pixels) return;

        let minX = originalWidth;
        let minY = originalHeight;
        let maxX = 0;
        let maxY = 0;

        // Scan through all pixels to find visible ones (alpha > 0)
        for (let y = 0; y < originalHeight; y++) {
            for (let x = 0; x < originalWidth; x++) {
                const index = (y * originalWidth + x) * 4;
                const alpha = pixels[index + 3]; // Alpha channel

                if (alpha > 0) {
                    minX = Math.min(minX, x);
                    minY = Math.min(minY, y);
                    maxX = Math.max(maxX, x);
                    maxY = Math.max(maxY, y);
                }
            }
        }

        if (maxX >= minX && maxY >= minY) {
            // Calculate the actual rendered size (fit: contain behavior)
            const imageAspect = originalWidth / originalHeight;
            const containerAspect = imageWidth / imageHeight;

            let renderedWidth: number;
            let renderedHeight: number;
            let offsetX = 0;
            let offsetY = 0;

            if (imageAspect > containerAspect) {
                // Image is wider than container - width fills, height is scaled
                renderedWidth = imageWidth;
                renderedHeight = imageWidth / imageAspect;
                offsetY = (imageHeight - renderedHeight) / 2;
            } else {
                // Image is taller than container - height fills, width is scaled
                renderedHeight = imageHeight;
                renderedWidth = imageHeight * imageAspect;
                offsetX = (imageWidth - renderedWidth) / 2;
            }

            const scaleX = renderedWidth / originalWidth;
            const scaleY = renderedHeight / originalHeight;

            return ({
                x: imageX + offsetX + minX * scaleX,
                y: imageY + offsetY + minY * scaleY,
                width: (maxX - minX + 1) * scaleX,
                height: (maxY - minY + 1) * scaleY,
            });
        }
    };

    useEffect(() => {
        // Only process when all images are loaded
        const allLoaded = images.every(img => img !== null);
        if (!allLoaded) return;

        // Calculate all bounding boxes at once and set state once
        const boxes = images.map(image => getVisiblePixels(image));
        setBoundingBoxes(boxes);
    }, [images, imageX, imageY]);

    return (
        <View style={styles.container}>
            <Text>TESTTTTT</Text>
            <Canvas style={{ width: size.width, height: size.height }}>
                {
                    images.map((image, index) => {
                        const boundingBox = boundingBoxes[index];

                        return (
                            <Group key={index}>
                                <SkiaImage
                                    image={image}
                                    x={imageX}
                                    y={imageY}
                                    width={imageWidth}
                                    height={imageHeight}
                                />
                                {boundingBox && (
                                    <Oval
                                        x={boundingBox.x}
                                        y={boundingBox.y}
                                        width={boundingBox.width}
                                        height={boundingBox.height}
                                        color="red"
                                        style="stroke"
                                        strokeWidth={2}
                                    />
                                )}
                            </Group>
                        );
                    })
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
        backgroundColor: 'yellow'
    },
});

export default ProjectImage;