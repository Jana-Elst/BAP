export const getVisiblePixelsInfo = (image, imageWidth, imageHeight) => {
    if (!image) return undefined;

    const originalWidth = image.width();
    const originalHeight = image.height();
    console.log("originalWidth:", originalWidth, "originalHeight:", originalHeight);

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

    console.log('minX:', minX, 'minY:', minY, 'maxX:', maxX, 'maxY:', maxY);

    if (maxX >= minX && maxY >= minY) {
        // Calculate visible pixel dimensions in source image
        const visibleSourceWidth = maxX - minX + 1;
        const visibleSourceHeight = maxY - minY + 1;

        console.log('visibleSourceWidth:', visibleSourceWidth, 'visibleSourceHeight:', visibleSourceHeight);

        // Calculate scale to fit visible pixels to desired size
        const scaleToFit = Math.min(imageWidth / visibleSourceWidth, imageHeight / visibleSourceHeight);

        // Calculate final dimensions (visible pixels scaled to fit container)
        const finalWidth = visibleSourceWidth * scaleToFit;
        const finalHeight = visibleSourceHeight * scaleToFit;

        console.log('scaleToFit:', scaleToFit, 'finalWidth:', finalWidth, 'finalHeight:', finalHeight);

        return {
            boundingBox: {
                x: 0,
                y: 0,
                width: finalWidth,
                height: finalHeight,
            },
            sourceRect: {
                x: minX,
                y: minY,
                width: visibleSourceWidth,
                height: visibleSourceHeight,
            },
        };
    }

    return undefined;
};

export const checkIsLoading = (isLoading) => {
    console.log('isLoading iPad or externalDisplay', isLoading)
    if (isLoading.ipad || isLoading.externalDisplay) {
        return true
    }
    return false;
};