import { useImage } from '@shopify/react-native-skia';
import { useEffect, useRef, useMemo } from 'react';

export type VisiblePixelsResult = {
    boundingBox: { x: number; y: number; width: number; height: number };
    offsetX: number;
    offsetY: number;
};

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

export const useImageWithVisibleInfo = (source: string | null, imageWidth: number, imageHeight: number) => {
    const image = useImage(source);

    const visibleInfo = useMemo(() => {
        return getVisiblePixelsInfo(image, imageWidth, imageHeight);
    }, [image, imageWidth, imageHeight]);

    return [image, visibleInfo];
}