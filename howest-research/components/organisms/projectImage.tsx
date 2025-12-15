import { Colors } from '@/constants/theme';
import { getEnteringFadeScale } from '@/scripts/animations';
import { checkIsLoading } from '@/scripts/getHelperFunction';
import { Canvas, Line, Image as SkiaImage, vec } from '@shopify/react-native-skia';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';
import Animated, { Easing, useAnimatedReaction, useDerivedValue, useSharedValue, withDelay, withSequence, withTiming } from 'react-native-reanimated';
import { useComposition } from '../../scripts/createProjectImageCompositions';
import { StyledText } from '../atoms/styledComponents';
import Touchable from '../atoms/touchable';

//---------- HELPER FUNCTIONS ----------//
const getRadialClearanceDistance = (centerX, centerY, radians, box) => {
    // Translate box coordinates relative to the ray origin (center)
    const x1 = box.x - centerX;
    const y1 = box.y - centerY;
    const x2 = box.x + box.width - centerX;
    const y2 = box.y + box.height - centerY;

    const cosTheta = Math.cos(radians);
    const sinTheta = Math.sin(radians);

    // Distances where the ray intersects the box's vertical and horizontal lines
    let minR = Infinity;
    let maxR = -Infinity;

    // Check intersection with vertical lines (x = x1, x = x2)
    [x1, x2].forEach(x => {
        if (Math.abs(cosTheta) > 1e-6) {
            const r = x / cosTheta;
            // Check if the intersection point (r * cos, r * sin) falls within the vertical range of the box
            const y_at_r = r * sinTheta;
            if (y_at_r >= Math.min(y1, y2) && y_at_r <= Math.max(y1, y2)) {
                if (r > 0) { // Only consider rays moving outwards
                    minR = Math.min(minR, r);
                    maxR = Math.max(maxR, r);
                }
            }
        }
    });

    // Check intersection with horizontal lines (y = y1, y = y2)
    [y1, y2].forEach(y => {
        if (Math.abs(sinTheta) > 1e-6) {
            const r = y / sinTheta;
            // Check if the intersection point (r * cos, r * sin) falls within the horizontal range of the box
            const x_at_r = r * cosTheta;
            if (x_at_r >= Math.min(x1, x2) && x_at_r <= Math.max(x1, x2)) {
                if (r > 0) {
                    minR = Math.min(minR, r);
                    maxR = Math.max(maxR, r);
                }
            }
        }
    });

    // If the ray starts inside the box, the distance is 0. 
    // Otherwise, the distance required to clear the box is the farthest intersection point.
    if (minR === Infinity) {
        // Ray misses the box entirely
        return 0;
    }

    // We need the label's center to be *past* the max intersection point.
    return maxR;
};

const getKeywordLabelPositions = (
    positions,
    centerX,
    centerY,
    boundingBoxesCluster,
    boundingBoxesKeywords
) => {
    if (!positions || !positions.keyWordLabelDegrees) {
        return [];
    }
    if (!boundingBoxesCluster || !boundingBoxesKeywords) {
        return [];
    }

    // --- Configuration Constants ---
    // ESTIMATE: A label text that wraps to 2 lines likely has a width limit.
    // Assuming the wrapper sets a max width to force wrapping (e.g., 150px).
    const LABEL_WIDTH = 150;
    const LABEL_HEIGHT = 40;     // Height of a single-line label (assuming wrapper handles vertical size)
    const SCREEN_MARGIN = 32;
    const GAP = 12;              // Gap between elements

    const LABEL_HALF_HEIGHT = LABEL_HEIGHT / 2;
    const LABEL_HALF_WIDTH = LABEL_WIDTH / 2;

    const screenWidth = centerX * 2;
    const screenHeight = centerY * 2;

    // --- Bounding Box Expansion ---
    // Used for the *entire cluster AABB* to guarantee a buffer zone.
    const CLUSTER_CLEARANCE_BUFFER = 50;

    // Expanded Cluster AABB
    const clusterAABBLeft = boundingBoxesCluster.x - CLUSTER_CLEARANCE_BUFFER;
    const clusterAABBRight = boundingBoxesCluster.x + boundingBoxesCluster.width + CLUSTER_CLEARANCE_BUFFER;
    const clusterAABBTop = boundingBoxesCluster.y - CLUSTER_CLEARANCE_BUFFER;
    const clusterAABBBottom = boundingBoxesCluster.y + boundingBoxesCluster.height + CLUSTER_CLEARANCE_BUFFER;

    // --- Clamping Boundaries (Screen Edges) ---
    const minXBoundary = SCREEN_MARGIN + LABEL_HALF_WIDTH;
    const maxXBoundary = screenWidth - SCREEN_MARGIN - LABEL_HALF_WIDTH;
    const minYBoundary = SCREEN_MARGIN + LABEL_HALF_HEIGHT;
    const maxYBoundary = screenHeight - SCREEN_MARGIN - LABEL_HALF_HEIGHT;


    return positions.keyWordLabelDegrees.map((degree, index) => {
        const keywordImageBox = boundingBoxesKeywords[index];
        // Use your custom offset, defaulting to 1 (first ring) if missing
        const offsetRing = positions.keyWordLabelPositionsOffset?.[index] ?? 1;

        const radians = (degree * Math.PI) / 180;
        const cosTheta = Math.cos(radians);
        const sinTheta = Math.sin(radians);

        // --- 1. Calculate minimum distance to clear the entire composition (Cluster AABB) ---
        // We use the simpler method here as the AABB is highly expanded and this serves as a baseline
        let distToClusterAABB = Infinity;

        // Vertical sides check (using clusterAABB bounds)
        if (Math.abs(cosTheta) > 1e-6) {
            if (cosTheta > 0) { // Right
                const r = (clusterAABBRight - centerX) / cosTheta;
                if (r > 0) distToClusterAABB = Math.min(distToClusterAABB, r);
            }
            if (cosTheta < 0) { // Left
                const r = (clusterAABBLeft - centerX) / cosTheta;
                if (r > 0) distToClusterAABB = Math.min(distToClusterAABB, r);
            }
        }

        // Horizontal sides check (using clusterAABB bounds)
        if (Math.abs(sinTheta) > 1e-6) {
            if (sinTheta > 0) { // Bottom
                const r = (clusterAABBBottom - centerY) / sinTheta;
                if (r > 0) distToClusterAABB = Math.min(distToClusterAABB, r);
            }
            if (sinTheta < 0) { // Top
                const r = (clusterAABBTop - centerY) / sinTheta;
                if (r > 0) distToClusterAABB = Math.min(distToClusterAABB, r);
            }
        }
        // If distToClusterAABB is still Infinity, it means the ray starts outside the cluster AABB.
        distToClusterAABB = (distToClusterAABB === Infinity) ? 0 : distToClusterAABB;

        // --- 2. Calculate minimum distance to clear its own Keyword Image (Rectangular Check) ---
        let distToKeywordImage = 0;
        if (keywordImageBox) {
            // Use the precise rectangular intersection helper
            const maxIntersectionR = getRadialClearanceDistance(centerX, centerY, radians, keywordImageBox);

            // The required distance is the farthest point of the image box PLUS the label's half-width, 
            // to ensure the label's center is past the image's rectangle.
            distToKeywordImage = maxIntersectionR + LABEL_HALF_WIDTH + GAP;
        }

        // --- 3. Set final clearance distance ---
        // Ensure the label starts at the furthest necessary point to clear both checks.
        let finalClearanceDist = Math.max(distToClusterAABB, distToKeywordImage);

        if (finalClearanceDist < 0) finalClearanceDist = 0;

        // --- 4. Apply Custom Radial Offset Ring (Your Manual Offset) ---

        // This is the offset required *past* the point of clearance.
        const baseRadialOffset = GAP + LABEL_HALF_HEIGHT;
        const ringSpacing = LABEL_HEIGHT + GAP;

        // Total radial distance required for the label's center to reach its ring position.
        const radialRingOffset = baseRadialOffset + (offsetRing - 1) * ringSpacing;

        const finalDistance = finalClearanceDist + radialRingOffset;

        // Ideal final label center (before screen clamping)
        let labelX = centerX + finalDistance * cosTheta;
        let labelY = centerY + finalDistance * sinTheta;

        // --- 5. Apply Screen Clamping with Margin ---

        // CLAMP X
        if (labelX < minXBoundary) {
            labelX = minXBoundary;
        } else if (labelX > maxXBoundary) {
            labelX = maxXBoundary;
        }

        // CLAMP Y
        if (labelY < minYBoundary) {
            labelY = minYBoundary;
        } else if (labelY > maxYBoundary) {
            labelY = maxYBoundary;
        }

        // --- 6. Final Position ---
        return {
            x: labelX,
            y: labelY,
        };
    });
};

//---------- ANIMATED COMPONENTS ----------//
const AnimatedLine = ({ p1, p2, color, strokeWidth, isLoadingGlobal, delay = 0, duration = 300 }: any) => {
    const opacity = useSharedValue(0);

    useEffect(() => {
        if (!isLoadingGlobal) {
            opacity.value = withDelay(delay, withTiming(1, { duration }));
        } else {
            opacity.value = 0;
        }
    }, [isLoadingGlobal]);

    return (
        <Line
            p1={p1}
            p2={p2}
            color={color}
            strokeWidth={strokeWidth}
            opacity={opacity}
        />
    );
};

const AnimatedSkiaImage = ({ image, x, y, width, height, origin, isLoadingGlobal, delay = 0, duration = 500, index, tappedSignal }: any) => {
    const bounceScale = useSharedValue(0);

    //--- animation on after loading ---//
    useEffect(() => {
        if (!isLoadingGlobal) {
            console.log('Image loaded');
            bounceScale.value = withDelay(delay, withTiming(1, { duration }));
        } else {
            console.log('Image not loaded yet');
            bounceScale.value = 0;
        }
    }, [isLoadingGlobal]);

    //--- animation on tap ---//
    useAnimatedReaction(
        () => tappedSignal?.value,
        (signal) => {
            if (signal && signal.index === index && signal.timestamp > 0) {
                bounceScale.value = withSequence(
                    withTiming(0.7, { duration: 150, easing: Easing.out(Easing.quad) }),
                    withTiming(1, { duration: 150, easing: Easing.out(Easing.quad) }),
                );
            }
        }
    );

    const transform = useDerivedValue(() => {
        return [{ scale: bounceScale.value }];
    }, [bounceScale]);

    return (
        <SkiaImage
            image={image}
            x={x}
            y={y}
            width={width}
            height={height}
            origin={origin}
            transform={transform}
        />
    );
};

//---------- COMPONENTS ----------//
const CanvasContent = ({
    screenWidth,
    screenHeight,
    showKeywords,
    positionData,
    keywordData,
    keywordPositions,
    keyWordLabelPositions,
    positions,
    centerX,
    centerY,
    clusterPosition,
    offset,
    getEllipseIntersection,
    keywordImages,
    boundingBoxesKeywords,
    widthKeyword,
    heightKeyword,
    clusterImage,
    widthCluster,
    heightCluster,
    boundingBoxesCluster,
    isLoadingGlobal,
    randomDelays,
    randomDurations,
    tappedSignal,
}: any) => {

    return (
        <Canvas style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: screenWidth,
            height: screenHeight,
        }}>

            {(showKeywords && positionData) && keywordData.map((keyword, index) => {
                const pos = keywordPositions[index];
                if (!pos || !keyWordLabelPositions || !keyWordLabelPositions[index]) return null;

                return (
                    <AnimatedLine
                        key={`line-${index}`}
                        p1={vec(pos.centerX, pos.centerY)}
                        p2={vec(keyWordLabelPositions[index].x, keyWordLabelPositions[index].y)}
                        color={Colors.white}
                        strokeWidth={2}
                        isLoadingGlobal={isLoadingGlobal}
                        delay={randomDelays[index]}
                        duration={randomDurations[index]}
                    />
                );
            })}

            {/* Draw keyword images at intersection points */}
            {keywordImages.map((image, index) => {
                const pos = keywordPositions[index];
                const boundingBox = boundingBoxesKeywords ? boundingBoxesKeywords[index] : undefined;

                if (!pos) return null;

                // Use pre-calculated render positions if available, otherwise fall back to pos
                const renderX = boundingBox?.renderX ?? pos.x;
                const renderY = boundingBox?.renderY ?? pos.y;
                const randomDelay = randomDelays[index];
                const randomDuration = randomDurations[index];

                return (
                    <AnimatedSkiaImage
                        key={`keyword-${index}`}
                        image={image}
                        x={renderX}
                        y={renderY}
                        width={widthKeyword}
                        height={heightKeyword}
                        origin={vec(renderX + widthKeyword / 2, renderY + heightKeyword / 2)}
                        isLoadingGlobal={isLoadingGlobal}
                        delay={randomDelay}
                        duration={randomDuration}
                        index={index}
                        tappedSignal={tappedSignal}
                    />
                );
            })}

            {/* Draw cluster image and bounding boxes */}
            {clusterPosition && (
                <AnimatedSkiaImage
                    key={`cluster`}
                    image={clusterImage}
                    x={clusterPosition.imageX}
                    y={clusterPosition.imageY}
                    width={widthCluster}
                    height={heightCluster}
                    origin={vec(clusterPosition.imageX + widthCluster / 2, clusterPosition.imageY + heightCluster / 2)}
                    isLoadingGlobal={isLoadingGlobal}
                    delay={0}
                    duration={300}
                    tappedSignal={tappedSignal}
                    index={-1}
                />
            )}
        </Canvas>)
}

//---------- EVENT HANDLERS ----------//
const handleOpendetailKeyword = (keyword: any, index: number, page: any, setPage: any, keywordImageSources: any[], boundingBoxesKeywords: any[]) => {
    console.log('keyword:', boundingBoxesKeywords[index]);
    setPage({
        ...page,
        page: 'detailKeyword',
        id: keyword.id,
        info: {
            keyword: keyword,
            keywordImageSource: keywordImageSources[index],
            boundingBoxKeyword: boundingBoxesKeywords[index],
        },
        previousPages: [
            ...page.previousPages || [],
            {
                page: page.page,
                id: page.id,
                info: page.info,
            }
        ]
    })
}

const handleOpendetailCluster = (cluster: any, page: any, setPage: any, clusterImageSource: any, boundingBoxesCluster) => {
    console.log('cluster:', boundingBoxesCluster);
    setPage({
        ...page,
        page: 'detailCluster',
        id: cluster.id,
        info: {
            keyword: cluster,
            keywordImageSource: clusterImageSource,
            boundingBoxKeyword: boundingBoxesCluster,
        },
        previousPages: [
            ...page.previousPages || [],
            {
                page: page.page,
                id: page.id,
                info: page.info,
            }
        ]
    })
}

const ProjectImage = ({ screenWidth, screenHeight, width, height, project, setPage, page, showKeywords = false, device }) => {
    const canvasRef = useRef<View>(null);
    const positionData = useComposition(project, width, height, screenWidth, screenHeight);
    const tappedSignal = useSharedValue({ index: -1, timestamp: 0 });

    // Destructure all needed data
    const {
        keywordData = [],
        keywordPositions = [],
        clusterPosition,
        boundingBoxesKeywords = [],
        boundingBoxesCluster,
        keywordImageSources = [],
        clusterImageSources = [],
        keywordImages = [],
        clusterImage,
        positions = { degrees: [] },
        centerX = screenWidth / 2,
        centerY = screenHeight / 2,
        offset = 0,
        widthCluster = width,
        heightCluster = height,
        widthKeyword = width / 2,
        heightKeyword = height / 2,
        getEllipseIntersection,
    } = useMemo(() => positionData, [positionData]);

    const keyWordLabelPositions = useMemo(
        () => getKeywordLabelPositions(
            positions,
            centerX,
            centerY,
            boundingBoxesCluster,
            boundingBoxesKeywords
        ),
        [positionData, boundingBoxesCluster, centerX, centerY, boundingBoxesKeywords]
    );

    const isLoadingGlobal = useMemo(() => checkIsLoading(page.isLoading), [page.isLoading]);

    const randomDelays = useMemo(() => keywordImages.map(() => Math.random() * (300 - 100) + 100), [keywordImages]);
    const randomDurations = useMemo(() => keywordImages.map(() => Math.random() * (300 - 100) + 100), [keywordImages]);

    useEffect(() => {
        if (positionData.isLoading !== page.isLoading?.[device]) {
            setPage((prevPage) => ({
                ...prevPage,
                isLoading: {
                    ...prevPage.isLoading,
                    [device]: positionData.isLoading,
                },
            }));
        }
    }, [positionData.isLoading, page.isLoading]);

    const onTap = useCallback((event: any) => {
        const { x, y } = event.nativeEvent;
        let foundIndex = -1;
        for (let index = 0; index < boundingBoxesKeywords.length; index++) {
            const boxkeyword = boundingBoxesKeywords[index];
            if (!boxkeyword) continue;

            // Check if touch is within keyword bounding box
            if (
                x >= boxkeyword.x &&
                x <= boxkeyword.x + boxkeyword.width &&
                y >= boxkeyword.y &&
                y <= boxkeyword.y + boxkeyword.height
            ) {
                foundIndex = index;
                //the keywordimage should scale down and scale up again. Afterwards the detail keyword should open
                console.log('Found index:', foundIndex);

                // Trigger animation
                tappedSignal.value = { index: foundIndex, timestamp: Date.now() };
                console.log('keywordData[index]:', keywordData[index], 'keywordImageSources:', keywordImageSources[index]);
                handleOpendetailKeyword(keywordData[index], index, page, setPage, keywordImageSources, boundingBoxesKeywords);
                return;
            }
        }

        if (clusterPosition) {
            if (
                x >= clusterPosition.x &&
                x <= clusterPosition.x + clusterPosition.width &&
                y >= clusterPosition.y &&
                y <= clusterPosition.y + clusterPosition.height
            ) {
                console.log('Found cluster');
                tappedSignal.value = { index: -1, timestamp: Date.now() };
                handleOpendetailCluster(project.cluster, page, setPage, clusterImage, boundingBoxesCluster);
            }
        }

    }, [boundingBoxesKeywords, keywordData, boundingBoxesCluster, page, setPage]);

    // Return loading state while images load
    //normally you shouldn't see this
    if (positionData.isLoading) {
        return (
            <View>
                <Text>Loading visualization...</Text>
            </View>
        );
    }

    if (showKeywords) {
        return (
            <View style={styles.container}>
                <TapGestureHandler onHandlerStateChange={onTap}>
                    <View
                        ref={canvasRef}
                        style={{ width: screenWidth, height: screenHeight }}>
                        <CanvasContent
                            screenWidth={screenWidth}
                            screenHeight={screenHeight}
                            showKeywords={showKeywords}
                            positionData={positionData}
                            keywordData={keywordData}
                            keywordPositions={keywordPositions}
                            keyWordLabelPositions={keyWordLabelPositions}
                            positions={positions}
                            centerX={centerX}
                            centerY={centerY}
                            clusterPosition={clusterPosition}
                            offset={offset}
                            getEllipseIntersection={getEllipseIntersection}
                            keywordImages={keywordImages}
                            boundingBoxesKeywords={boundingBoxesKeywords}
                            widthKeyword={widthKeyword}
                            heightKeyword={heightKeyword}
                            clusterImage={clusterImage}
                            widthCluster={widthCluster}
                            heightCluster={heightCluster}
                            boundingBoxesCluster={boundingBoxesCluster}
                            isLoadingGlobal={isLoadingGlobal}
                            randomDelays={randomDelays}
                            randomDurations={randomDurations}
                            tappedSignal={tappedSignal}
                        />

                        {
                            !isLoadingGlobal && (showKeywords && positionData) && keywordData.map((keyword, index) => (
                                <Animated.View
                                    key={keyword.id}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: screenWidth,
                                        height: screenHeight,
                                        pointerEvents: 'box-none'
                                    }}
                                    entering={getEnteringFadeScale().delay(randomDelays[index] + 50)}
                                >
                                    <Touchable
                                        onPress={() => handleOpendetailKeyword(keyword, index, page, setPage, keywordImageSources, boundingBoxesKeywords)}
                                        styleButton={{ paddingVertical: 8, paddingHorizontal: 20 }}
                                        icon={'arrow-forward-outline'}
                                        iconPosition={'after'}
                                        iconColor={Colors.blueText}
                                        scaleAnimation={0.90}
                                        styleGradient={{
                                            position: 'absolute',
                                            zIndex: 100,
                                            top: keyWordLabelPositions && keyWordLabelPositions[index] ? keyWordLabelPositions[index].y : 0,
                                            left: keyWordLabelPositions && keyWordLabelPositions[index] ? keyWordLabelPositions[index].x : 0,
                                            transform: [{ translateX: '-50%' }, { translateY: '-50%' }]
                                        }}
                                    >
                                        <StyledText
                                            style={{
                                                maxWidth: 225,
                                                textAlign: 'center',
                                            }}
                                        >
                                            {keyword.label}
                                        </StyledText>
                                    </Touchable>
                                </Animated.View>
                            ))
                        }
                    </View>
                </TapGestureHandler >
            </View >
        );
    } else {
        return (
            <View style={styles.container}>
                <CanvasContent
                    screenWidth={screenWidth}
                    screenHeight={screenHeight}
                    showKeywords={showKeywords}
                    positionData={positionData}
                    keywordData={keywordData}
                    keywordPositions={keywordPositions}
                    keyWordLabelPositions={keyWordLabelPositions}
                    positions={positions}
                    centerX={centerX}
                    centerY={centerY}
                    clusterPosition={clusterPosition}
                    offset={offset}
                    getEllipseIntersection={getEllipseIntersection}
                    keywordImages={keywordImages}
                    boundingBoxesKeywords={boundingBoxesKeywords}
                    widthKeyword={widthKeyword}
                    heightKeyword={heightKeyword}
                    clusterImage={clusterImage}
                    boundingBoxesCluster={boundingBoxesCluster}
                    widthCluster={widthCluster}
                    heightCluster={heightCluster}
                    isLoadingGlobal={isLoadingGlobal}
                    randomDelays={randomDelays}
                    randomDurations={randomDurations}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ProjectImage;