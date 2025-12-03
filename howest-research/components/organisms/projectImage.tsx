import aiArtificialIntelligence1 from '../../assets/images/keywords/aiArtificialIntelligence/0001.png';
import aiArtificialIntelligence2 from '../../assets/images/keywords/aiArtificialIntelligence/0002.png';
import aiArtificialIntelligence3 from '../../assets/images/keywords/aiArtificialIntelligence/0003.png';
import aiArtificialIntelligence4 from '../../assets/images/keywords/aiArtificialIntelligence/0004.png';
import aiArtificialIntelligence5 from '../../assets/images/keywords/aiArtificialIntelligence/0005.png';
import aiArtificialIntelligence6 from '../../assets/images/keywords/aiArtificialIntelligence/0006.png';
import aiArtificialIntelligence7 from '../../assets/images/keywords/aiArtificialIntelligence/0007.png';
import aiArtificialIntelligence8 from '../../assets/images/keywords/aiArtificialIntelligence/0008.png';
import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Canvas, Image as SkiaImage, useImage, Rect } from '@shopify/react-native-skia';
import mensEnWelzijn from '../../assets/images/keywords/mensEnWelzijn/image-static.png';

interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

const ProjectImage = () => {
    const image = useImage(mensEnWelzijn);
    const [boundingBox, setBoundingBox] = useState<BoundingBox | null>(null);

    useEffect(() => {
        if (!image) return;

        const width = image.width();
        const height = image.height();

        // Read pixel data from the image
        const pixels = image.readPixels(0, 0, {
            width,
            height,
            colorType: 'RGBA_8888',
            alphaType: 'Unpremul',
        });

        if (!pixels) return;

        const pixelArray = new Uint8Array(pixels);
        const box = getVisibleBoundingBox(pixelArray, width, height);
        setBoundingBox(box);
    }, [image]);

    const getVisibleBoundingBox = (
        pixels: Uint8Array,
        width: number,
        height: number
    ): BoundingBox | null => {
        let minX = width, minY = height, maxX = 0, maxY = 0;
        let hasVisiblePixels = false;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const alphaIndex = (y * width + x) * 4 + 3; // Alpha channel (RGBA)
                if (pixels[alphaIndex] > 0) {
                    hasVisiblePixels = true;
                    minX = Math.min(minX, x);
                    minY = Math.min(minY, y);
                    maxX = Math.max(maxX, x);
                    maxY = Math.max(maxY, y);
                }
            }
        }

        if (!hasVisiblePixels) return null;

        return {
            x: minX,
            y: minY,
            width: maxX - minX + 1,
            height: maxY - minY + 1,
        };
    };

    if (!image) return null;

    const imageWidth = image.width();
    const imageHeight = image.height();

    return (
        <View style={styles.container}>
            <Canvas style={{ width: imageWidth, height: imageHeight }}>
                <SkiaImage
                    image={image}
                    x={0}
                    y={0}
                    width={imageWidth}
                    height={imageHeight}
                />
                {boundingBox && (
                    <Rect
                        x={boundingBox.x}
                        y={boundingBox.y}
                        width={boundingBox.width}
                        height={boundingBox.height}
                        color="red"
                        style="stroke"
                        strokeWidth={2}
                    />
                )}
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