export const keywordPositionsConfig = [
    {
        id: 0,
        degrees: [],
        rotationImages: [],
        keyWordLabelDegrees: [],
        keyWordLabelPositionsOffset: [],
    },
    {
        id: 1,
        degrees: [320],
        rotationImages: [1],
        keyWordLabelDegrees: [320],
        keyWordLabelPositionsOffset: [1],
    },
    {
        id: 2,
        degrees: [340, 200],
        rotationImages: [1, 6],
        keyWordLabelDegrees: [320, 220],
        keyWordLabelPositionsOffset: [1, 0.5],
    },
    {
        id: 3,
        degrees: [270, 35, 145],
        rotationImages: [0, 2, 5],
        keyWordLabelDegrees: [270, 35, 145],
        keyWordLabelPositionsOffset: [1, 1, 1],
    },
    {
        id: 4,
        degrees: [325, 35, 145, 215],
        rotationImages: [1, 2, 5, 6],
        keyWordLabelDegrees: [325, 35, 145, 215],
        keyWordLabelPositionsOffset: [1, 1, 1, 1],
    },
    {
        id: 5,
        degrees: [10, 82, 154, 226, 298],
        rotationImages: [2, 3, 5, 7, 0],
        keyWordLabelDegrees: [10, 82, 154, 226, 298],
        keyWordLabelPositionsOffset: [1, 1, 1, 1, 1],
    },
    {
        id: 6,
        degrees: [310, 5, 60, 120, 175, 230],
        rotationImages: [0, 1, 3, 4, 5, 7],
        keyWordLabelDegrees: [310, 5, 60, 120, 175, 230],
        keyWordLabelPositionsOffset: [1, 1, 1, 1, 1, 1],
    },
    {
        id: 7,
        degrees: [296, 347, 38.5, 90, 141, 193, 244],
        rotationImages: [0, 1, 2, 3, 5, 6, 7],
        keyWordLabelDegrees: [296, 347, 38.5, 90, 141, 193, 244],
        keyWordLabelPositionsOffset: [1, 1, 1, 1, 1, 5, 1],
    },
    {
        id: 8,
        degrees: [292.5, 337.5, 22.5, 67.5, 112.5, 157.5, 202.5, 247.5],
        rotationImages: [0, 1, 2, 3, 4, 5, 6, 7],
        keyWordLabelDegrees: [292.5, 337.5, 22.5, 67.5, 112.5, 157.5, 202.5, 247.5],
        keyWordLabelPositionsOffset: [1, 1, 1, 1, 1, 1, 1, 1],
    },
];

export const colorOffsets = {
    pink: 16,
    blue: 0,
    yellow: 32,
    purple: 8,
    green: 24,
};

//----- Calculate the intersection point on the offset ellipse for a given angle -----//
export const getEllipseIntersection = (degree, ellipseCenterX, ellipseCenterY, radiusX, radiusY) => {
    const radians = (degree * Math.PI) / 180;

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
