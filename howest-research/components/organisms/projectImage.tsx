import { Colors } from '@/constants/theme';
import { Canvas, Circle, Group, Line, Oval, Rect, Image as SkiaImage, vec } from '@shopify/react-native-skia';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';
import { useComposition } from '../../scripts/createProjectImageCompositions';
import { StyledText } from '../atoms/styledComponents';
import Touchable from '../atoms/touchable';

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

const handleOpendetailKeyword = (keyword: any, index: number, page: any, setPage: any, keywordImageSources: any[], boundingBoxesKeywords: any[]) => {
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

const handleTap = (event: any, boundingBoxesKeywords: any[], keywordData: any[], onOpenKeyword: (keyword: any, index: number) => void) => {
    const { x, y } = event.nativeEvent;

    // Check if touch is within any keyword bounding box
    boundingBoxesKeywords?.forEach((box, index) => {
        if (!box) return;

        // Check if touch point is within the bounding box
        if (
            x >= box.x &&
            x <= box.x + box.width &&
            y >= box.y &&
            y <= box.y + box.height
        ) {
            onOpenKeyword(keywordData[index], index);
        }
    });
};

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
    widhtKeyword,
    heightKeyword,
    clusterImage,
    widthCluster,
    heightCluster,
    boundingBoxesCluster
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
                    <Line
                        key={`line - ${index}`}
                        p1={vec(pos.centerX, pos.centerY)}
                        p2={vec(keyWordLabelPositions[index].x, keyWordLabelPositions[index].y)}
                        color={Colors.white}
                        strokeWidth={2}
                    />
                );
            })}

            {/* Draw lines from center based on degrees */}
            {positions.degrees.map((degree, index) => {
                const radians = (degree * Math.PI) / 180;
                const lineLength = Math.min(screenWidth, screenHeight) / 2;

                const endX = centerX + Math.cos(radians) * lineLength;
                const endY = centerY + Math.sin(radians) * lineLength;

                return (
                    <Line
                        key={`line - ${index} `}
                        p1={vec(centerX, centerY)}
                        p2={vec(endX, endY)}
                        color="transparent"
                        strokeWidth={2}
                    />
                );
            })}

            {/* Draw intersection points */}
            {clusterPosition && positions.degrees.map((degree, index) => {
                const intersection = getEllipseIntersection(
                    degree,
                    centerX,
                    centerY,
                    (clusterPosition.width + offset) / 2,
                    (clusterPosition.height + offset) / 2
                );
                return (
                    <Circle
                        key={`intersection - ${index} `}
                        cx={intersection.x}
                        cy={intersection.y}
                        r={5}
                        color="transparent"
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

                return (
                    <Group key={`keyword-${index}`}>
                        <SkiaImage
                            image={image}
                            x={renderX}
                            y={renderY}
                            width={widhtKeyword}
                            height={heightKeyword}
                        />
                        {boundingBox && (
                            <Rect
                                x={boundingBox.x}
                                y={boundingBox.y}
                                width={boundingBox.width}
                                height={boundingBox.height}
                                color="transparent"
                                style="stroke"
                                strokeWidth={2}
                            />
                        )}
                    </Group>
                );
            })}

            {/* Draw cluster image and bounding boxes */}
            {clusterPosition && (
                <Group>
                    <SkiaImage
                        image={clusterImage}
                        x={clusterPosition.imageX}
                        y={clusterPosition.imageY}
                        width={widthCluster}
                        height={heightCluster}
                    />
                    {clusterPosition && (
                        <Group>
                            {/* Inner ellipse around visible content */}
                            <Oval
                                x={clusterPosition.x}
                                y={clusterPosition.y}
                                width={clusterPosition.width}
                                height={clusterPosition.height}
                                color="transparent"
                                style="stroke"
                                strokeWidth={2}
                            />
                            {/* Outer ellipse with offset */}
                            <Oval
                                x={clusterPosition.x - offset / 2}
                                y={clusterPosition.y - offset / 2}
                                width={clusterPosition.width + offset}
                                height={clusterPosition.height + offset}
                                color="transparent"
                                style="stroke"
                                strokeWidth={2}
                            />
                        </Group>
                    )}
                    {boundingBoxesCluster && (
                        <Oval
                            x={boundingBoxesCluster.x}
                            y={boundingBoxesCluster.y}
                            width={boundingBoxesCluster.width}
                            height={boundingBoxesCluster.height}
                            color="transparent"
                            style="stroke"
                            strokeWidth={2}
                        />
                    )}


                    {/* Draw points label */}
                    {

                        keywordData.map((keyword, index) => (
                            <Circle
                                key={`intersection - ${index} `}
                                cx={keyWordLabelPositions && keyWordLabelPositions[index] ? keyWordLabelPositions[index].x : 0}
                                cy={keyWordLabelPositions && keyWordLabelPositions[index] ? keyWordLabelPositions[index].y : 0}
                                r={10}
                                color="transparent"
                            />))
                    }
                </Group>
            )}
        </Canvas>)
}

const ProjectImage = ({ screenWidth, screenHeight, width, height, project, setPage, page, showKeywords = false, device }) => {
    const canvasRef = useRef<View>(null);
    const positionData = useComposition(project, width, height, screenWidth, screenHeight);

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
        widhtKeyword = width / 2,
        heightKeyword = height / 2,
        getEllipseIntersection,
    } = positionData;

    const keyWordLabelPositions = useMemo(() => getKeywordLabelPositions(positions, boundingBoxesCluster, getEllipseIntersection), [positionData]);

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

    const onOpenKeyword = useCallback((keyword: any, index: number) => {
        handleOpendetailKeyword(keyword, index, page, setPage, keywordImageSources, boundingBoxesKeywords);
    }, [page, setPage, keywordImageSources, boundingBoxesKeywords]);

    const onTap = useCallback((event: any) => {
        handleTap(event, boundingBoxesKeywords, keywordData, onOpenKeyword);
    }, [boundingBoxesKeywords, keywordData, onOpenKeyword]);

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
                            widhtKeyword={widhtKeyword}
                            heightKeyword={heightKeyword}
                            clusterImage={clusterImage}
                            widthCluster={widthCluster}
                            heightCluster={heightCluster}
                            boundingBoxesCluster={boundingBoxesCluster}
                        />
                        <View style={{ position: 'absolute', top: 0, left: 0 }}>
                            {
                                (showKeywords && positionData) && keywordData.map((keyword, index) => (
                                    <View key={keyword.id}>
                                        <Touchable
                                            onPress={() => onOpenKeyword(keyword, index)}
                                            key={keyword.id}
                                            styleButton={{ paddingVertical: 8, paddingHorizontal: 20 }}
                                            icon={'arrow-forward-outline'}
                                            iconPosition={'after'}
                                            iconColor={Colors.blueText}
                                            styleGradient={{
                                                position: 'absolute',
                                                top: keyWordLabelPositions && keyWordLabelPositions[index] ? keyWordLabelPositions[index].y : 0,
                                                left: keyWordLabelPositions && keyWordLabelPositions[index] ? keyWordLabelPositions[index].x : 0,
                                                transform: [{ translateX: '-50%' }, { translateY: '-50%' }]
                                            }}
                                        >
                                            <StyledText>{keyword.label}</StyledText>
                                        </Touchable>
                                    </View>
                                ))
                            }
                        </View>
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
                    widhtKeyword={widhtKeyword}
                    heightKeyword={heightKeyword}
                    clusterImage={clusterImage}
                    widthCluster={widthCluster}
                    heightCluster={heightCluster}
                    boundingBoxesCluster={boundingBoxesCluster}
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