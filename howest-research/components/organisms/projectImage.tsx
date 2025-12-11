import { Colors } from '@/constants/theme';
import { Canvas, Circle, Group, Line, Oval, Rect, Image as SkiaImage, vec } from '@shopify/react-native-skia';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TapGestureHandler } from 'react-native-gesture-handler';
import { useComposition } from '../../scripts/createProjectImageCompositions';
import { StyledText } from '../atoms/styledComponents';
import Touchable from '../atoms/touchable';


const ProjectImage = ({ screenWidth, screenHeight, width, height, project, setPage, page, showKeywords = false, device }) => {
    const canvasRef = useRef<View>(null);
    const positionData = useComposition(project, width, height, screenWidth, screenHeight);

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
    }, [positionData.isLoading, device, page.isLoading, setPage]);

    // Return loading state while images load
    if (positionData.isLoading) {
        return (
            <View>
                <Text>Loading visualization...</Text>
            </View>
        );
    }

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

    const getKeywordLabelPositions = () => {
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

    const keyWordLabelPositions = getKeywordLabelPositions();

    //----- event listeners -----//
    const handleOpendetailKeyword = (keyword: any, index: number) => {
        console.log('keywordImageSources[index]:', keywordImageSources[index]);
        console.log('HANDLE CLICK', page.isLoading);
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

    const handleTap = (event: any) => {
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
                handleOpendetailKeyword(keywordData[index], index);
            }
        });


        // TODO: Add cluster click handler if needed
        // if (
        //     x >= clusterPosition.x &&
        //     x <= clusterPosition.x + clusterPosition.width &&
        //     y >= clusterPosition.y &&
        //     y <= clusterPosition.y + clusterPosition.height
        // ) {
        //     // Handle cluster click
        // }
    };

    const CanvasContent = () => {
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

    if (showKeywords) {
        return (
            <View style={styles.container}>
                <TapGestureHandler onHandlerStateChange={handleTap}>
                    <View
                        ref={canvasRef}
                        style={{ width: screenWidth, height: screenHeight }}>
                        <CanvasContent />
                        <View style={{ position: 'absolute', top: 0, left: 0 }}>
                            {
                                (showKeywords && positionData) && keywordData.map((keyword, index) => (
                                    <View key={keyword.id}>
                                        <Touchable
                                            onPress={() => handleOpendetailKeyword(keyword, index)}
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
                <CanvasContent />
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