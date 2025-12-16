import { Canvas, Group, Image as SkiaImage } from '@shopify/react-native-skia';
import { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useComposition } from '../../scripts/createProjectImageCompositions';


const ProjectImage = ({ screenWidth, screenHeight, width, height, project, setPage, page, showKeywords = false }) => {
    // const positionData = useComposition(project, width, height, screenWidth, screenHeight);

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
        boundingBoxesKeywordsBeforeAnimation = [],
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

    const CanvasContent = () => {
        return (
            <Canvas style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: screenWidth,
                height: screenHeight,
            }}>

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
                    </Group>
                )}
            </Canvas>)
    }

    return (
        <View style={styles.container}>
            <CanvasContent />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ProjectImage;