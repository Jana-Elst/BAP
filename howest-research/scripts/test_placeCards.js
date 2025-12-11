
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
    let maxAttempts = 1500; // Increased for test
    let validPosition = false;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        randomX = Math.random() * (containerWidth - cardWidth);
        randomY = Math.random() * (containerHeight - cardHeight);

        if (checkPosition(randomX, randomY, cardWidth, cardHeight, positions, overlapThreshold, canvasWidth, canvasHeight, containerWidth, containerHeight)) {
            validPosition = true;
            break;
        }
    }

    if (validPosition) {
        positions.push({ x: randomX, y: randomY, w: cardWidth, h: cardHeight });
    }
};

const getPositions = (totalProjects, containerWidth, containerHeight, cardWidth, cardHeight, canvasWidth, canvasHeight) => {
    let positions = [];
    const overlapThreshold = 0;

    for (let i = 0; i < totalProjects; i++) {
        getPosition(cardWidth, cardHeight, containerWidth, containerHeight, positions, overlapThreshold, canvasWidth, canvasHeight);
    }

    return positions;
};

// TEST EXECUTION
const totalProjects = 50;
const containerWidth = 2000;
const containerHeight = 2000;
const cardWidth = 100;
const cardHeight = 100;
const canvasWidth = 500;
const canvasHeight = 500;

const positions = getPositions(totalProjects, containerWidth, containerHeight, cardWidth, cardHeight, canvasWidth, canvasHeight);

console.log(`Generated ${positions.length} positions.`);

// Verify Logic
const centerX = containerWidth / 2;
const centerY = containerHeight / 2;
const exLeft = centerX - canvasWidth / 2;
const exRight = centerX + canvasWidth / 2;
const exTop = centerY - canvasHeight / 2;
const exBottom = centerY + canvasHeight / 2;

let failures = 0;
positions.forEach((pos, idx) => {
    const cardRight = pos.x + pos.w;
    const cardLeft = pos.x;
    const cardBottom = pos.y + pos.h;
    const cardTop = pos.y;

    const isOverlapping = !(
        cardRight < exLeft ||
        cardLeft > exRight ||
        cardBottom < exTop ||
        cardTop > exBottom
    );

    if (isOverlapping) {
        console.error(`Position ${idx} overlaps exclusion zone!`, pos);
        failures++;
    }
});

if (failures === 0) {
    console.log("SUCCESS: No cards overlap with the center exclusion zone.");
} else {
    console.error(`FAILURE: ${failures} cards overlap with the center exclusion zone.`);
    process.exit(1);
}
