import { Colors } from '@/constants/theme';
import { getEnteringFadeScale } from '@/scripts/animations';
import { checkIsLoading } from '@/scripts/getHelperFunction';
import { Canvas, Line, Rect, Image as SkiaImage, vec } from '@shopify/react-native-skia';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';
import Animated, { Easing, useAnimatedReaction, useDerivedValue, useSharedValue, withDelay, withSequence, withTiming } from 'react-native-reanimated';
import { useComposition } from '../../scripts/createProjectImageCompositions';
import { StyledText } from '../atoms/styledComponents';
import Touchable from '../atoms/touchable';

//---------- HELPER FUNCTIONS ----------//
const getKeywordLabelPositions = (positions, boundingBoxesCluster, getEllipseIntersection) => {
    if (!positions) {
        console.log('No positions available');
        return [];
    }
    if (!positions.keyWordLabelPositionsOffset) {
        console.log('No keyWordLabelPositionsOffset');
        return [];
    }
    if (!boundingBoxesCluster) {
        console.log('No boundingBoxesCluster');
        return [];
    }

    // Use the bounding box center as ellipse center
    const boundingBoxCenterX = boundingBoxesCluster.x + boundingBoxesCluster.width / 2;
    const boundingBoxCenterY = boundingBoxesCluster.y + boundingBoxesCluster.height / 2;

    return positions.keyWordLabelPositionsOffset.map((offsetPos, index) => {
        const degree = positions.degrees[index];

        const yTop = boundingBoxCenterY - boundingBoxesCluster.height / 2;
        const yBottom = boundingBoxCenterY + boundingBoxesCluster.height / 2;
        const gap = 8;
        const heightLabel = 40;

        const intersection = getEllipseIntersection(
            degree,
            boundingBoxCenterX,
            boundingBoxCenterY,
            boundingBoxesCluster.width / 2,
            boundingBoxesCluster.height / 2
        );
        const result = {
            x: intersection.x,
            y: intersection.y <= boundingBoxCenterY ? yTop - (offsetPos * (heightLabel + gap)) + 16 : yBottom + (offsetPos * (heightLabel + gap)) - 16,
        };

        return result;
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

    const keyWordLabelPositions = useMemo(() => getKeywordLabelPositions(positions, boundingBoxesCluster, getEllipseIntersection), [positionData]);
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

        // Check if touch is within cluster bounding box
        // Check if touch is within cluster image

        // x = { clusterPosition.x }
        // y = { clusterPosition.y }
        // width = { clusterPosition.width }
        // height = { clusterPosition.height }
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

    }, [boundingBoxesKeywords, keywordData, boundingBoxesCluster]);

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
                                        <StyledText>{keyword.label}</StyledText>
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