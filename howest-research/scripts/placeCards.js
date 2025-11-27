const checkPosition = (x, y, width, height, positions, overlapThreshold) => {
    return !positions.some(placed => {
        const dx = x - placed.x;
        const dy = y - placed.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < (width + placed.width) / 2 - overlapThreshold && distance < (height + placed.height) / 2 - overlapThreshold;
    });
};

const getPosition = (cardWidth, cardHeight, containerWidth, containerHeight, positions, overlapThreshold) => {
    let randomX, randomY;
    let maxAttempts = 500;
    let validPosition = false;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        randomX = Math.random() * (containerWidth - cardWidth);
        randomY = Math.random() * (containerHeight - cardHeight);

        if (checkPosition(randomX, randomY, cardWidth, cardHeight, positions, overlapThreshold)) {
            validPosition = true;
            break;
        }
    }

    if (validPosition) {
        positions.push({ x: randomX, y: randomY, w: cardWidth, h: cardHeight });
    }
};

const getPositions = (totalProjects, containerWidth, containerHeight, cardWidth, cardHeight) => {
    let positions = [];
    const overlapThreshold = 300;

    for (let i = 0; i < totalProjects; i++) {
        getPosition(cardWidth, cardHeight, containerWidth, containerHeight, positions, overlapThreshold)
    }

    return positions;
};

export default getPositions;