const checkPosition = (x, y, width, height, positions, overlapThreshold, canvasWidth, canvasHeight, containerWidth, containerHeight) => {
    // Check collision with other cards
    const collidesWithCards = positions.some(placed => {
        // AABB (Axis-Aligned Bounding Box) collision detection
        return !(
            x + width + overlapThreshold < placed.x ||
            x - overlapThreshold > placed.x + placed.w ||
            y + height + overlapThreshold < placed.y ||
            y - overlapThreshold > placed.y + placed.h
        );
    });

    if (collidesWithCards) return false;

    // Check collision with center exclusion zone (canvas)
    // Center of the container
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;

    // Exclusion zone bounds (centered)
    const exLeft = centerX - canvasWidth / 2;
    const exRight = centerX + canvasWidth / 2;
    const exTop = centerY - canvasHeight / 2;
    const exBottom = centerY + canvasHeight / 2;

    // Card bounds
    const cardLeft = x;
    const cardRight = x + width;
    const cardTop = y;
    const cardBottom = y + height;

    // Check overlap with exclusion zone
    // Overlap logic: NOT (IsToLeft OR IsToRight OR IsAbove OR IsBelow)
    const isOverlappingCenter = !(
        cardRight < exLeft ||
        cardLeft > exRight ||
        cardBottom < exTop ||
        cardTop > exBottom
    );

    // If it overlaps with center, it's NOT a valid position
    return !isOverlappingCenter;
};

const getPosition = (cardWidth, cardHeight, containerWidth, containerHeight, positions, overlapThreshold, canvasWidth, canvasHeight) => {
    let randomX, randomY;
    let maxAttempts = 500;
    let validPosition = false;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        randomX = Math.random() * (containerWidth - cardWidth);
        randomY = Math.random() * (containerHeight - cardHeight);

        // Note: I reversed the return logic of checkPosition above to mean "isValid" (true) or "collides" (Check logic)
        // Wait, original checkPosition returned TRUE if NO OVERLAP (valid).
        // My new checkPosition returns TRUE if VALID (no overlap with cards AND no overlap with center).

        if (checkPosition(randomX, randomY, cardWidth, cardHeight, positions, overlapThreshold, canvasWidth, canvasHeight, containerWidth, containerHeight)) {
            validPosition = true;
            break;
        }
    }

    if (validPosition) {
        positions.push({ x: randomX, y: randomY, w: cardWidth, h: cardHeight });
    }
};

const getdiscoverPositions = (totalProjects, containerWidth, containerHeight, cardWidth, cardHeight, canvasWidth, canvasHeight) => {
    let positions = [];
    const overlapThreshold = 0;

    for (let i = 0; i < totalProjects; i++) {
        getPosition(cardWidth, cardHeight, containerWidth, containerHeight, positions, overlapThreshold, canvasWidth, canvasHeight);
    }

    return positions;
};

export default getdiscoverPositions;