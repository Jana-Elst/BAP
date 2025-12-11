//https://docs.swmansion.com/react-native-reanimated/docs/advanced/useFrameCallback/
//https://shopify.github.io/react-native-skia/docs/animated-images/

import { getProjectInfo } from "@/scripts/getData";
import {
    Canvas,
    Circle,
    Image
} from "@shopify/react-native-skia";
import React, { useEffect, useRef } from "react";
import { Easing, useDerivedValue, useFrameCallback, useSharedValue, withTiming } from "react-native-reanimated";
import { useComposition } from '../../scripts/createProjectImageCompositions';
import { useWebpAnimations } from "../../scripts/getWebpAnimations";

const FloatingKeywordImage = ({
    image,
    renderX,
    renderY,
    renderXInitial,
    renderYInitial,
    width,
    height,
    index,
    time,
    page
}: {
    image: any;
    renderX: number;
    renderY: number;
    renderXInitial: number;
    renderYInitial: number;
    width: number;
    height: number;
    index: number;
    time: any;
    page: any;
}) => {
    const progress = useSharedValue(0);

    console.log('page pageeeeee', page);

    useEffect(() => {
        const random = Math.floor(Math.random() * 2000);
        progress.value = withTiming(1, { duration: random, easing: Easing.out(Easing.cubic) });
    }, []);

    const offsetX = useDerivedValue(() => {
        return Math.sin(time.value * 0.002 + index * 1000) * 5;
    }, [index]);

    const offsetY = useDerivedValue(() => {
        return Math.cos(time.value * 0.003 + index * 1000) * 5;
    }, [index]);

    const x = useDerivedValue(() => {
        let currentX;
        if (page.page !== 'detailKeyword') {
            currentX = renderX + offsetX.value;
        } else {
            currentX = renderXInitial + (renderX - renderXInitial) * progress.value;
        }

        return currentX + offsetX.value;
    }, [renderX, renderXInitial]);

    const y = useDerivedValue(() => {
        let currentY;
        if (page.page !== 'detailKeyword') {
            currentY = renderY + offsetY.value;
        } else {
            currentY = renderYInitial + (renderY - renderYInitial) * progress.value;
        }
        return currentY + offsetY.value;
    }, [renderY, renderYInitial, page.page]);

    return (
        <Image
            image={image}
            x={x}
            y={y}
            width={width}
            height={height}
        />
    );
};

const Hologram = ({ screenWidth, screenHeight, setPage, page }: { screenWidth: number; screenHeight: number }) => {
    //--- General ---//
    const { animationMap, projects } = useWebpAnimations();
    const project = page.id && page.page === 'detailResearch' ? getProjectInfo(page.id) : null;
    const positionData = useComposition(project, screenWidth, screenHeight, screenWidth, screenHeight);
    const previousProjectData = useRef({ project: project, positionData: positionData });
    // Logic to switch between previous and current data to avoid render lag
    let activeData = previousProjectData.current;
    if (page.page === 'detailResearch' && !positionData.isLoading) {
        activeData = { project, positionData };
    }

    const {
        keywordImages = [],
        keywordPositions = [],
        keywordInitialPositions = [],
        boundingBoxesKeywords,
        boundingBoxesKeywordsInitial,
        clusterPosition,
        clusterImage,
        widhtKeyword = screenWidth / 2,
        heightKeyword = screenHeight / 2,
        widthCluster = screenWidth,
        heightCluster = screenHeight
    } = activeData.positionData as any;

    //--- Animation structures ---//
    const transition = ['Intro', 'Loop', 'Loop', 'Outro'];
    const detailScreen = ['Intro', 'Loop', 'Outro'];

    //--- project loops ---//
    //idle screen
    const projectsLoop = projects
        .filter(p => p !== 'clusteroverschrijdend')
        .flatMap(project => ['clusteroverschrijdend', project]);

    //--- variables ---//
    //loop project
    const projectAnimation = useSharedValue(projectsLoop);
    const animationParts = useSharedValue(transition);

    const currentProject = useSharedValue(0);
    const nextProject = useSharedValue(1);
    const prevProject = useSharedValue(2);

    const currentAnimationIndex = useSharedValue(0);
    const currentFrameIndex = useSharedValue(0);
    const lastTimestamp = useSharedValue(-1);
    const currentImage = useSharedValue<SkImage | null>(null);

    const breakStartTime = useSharedValue(-1);
    const breakLength = 1000; // 1 seconds

    const floatY = useSharedValue(0);
    const floatX = useSharedValue(0);
    const scalingCluster = useSharedValue(1);
    const opacityCluster = useSharedValue(1);

    const isLoading = useSharedValue(false);
    const isDetail = useSharedValue(true);
    const globalTimestamp = useSharedValue(0);

    //--- Let's animate! ---//
    useFrameCallback((frameInfo) => {
        //general
        const { timestamp } = frameInfo;
        globalTimestamp.value = timestamp;
        const part = animationParts.value[currentAnimationIndex.value];

        // --- Floating Effect Calculation --- //
        floatX.value = Math.sin(timestamp * 0.002) * 20;
        floatY.value = Math.cos(timestamp * 0.004) * 10;

        // --- Logic if there is a break --- //
        if (part === 'break' && !isLoading.value) {
            console.log('break');
            if (breakStartTime.value === -1) {
                breakStartTime.value = timestamp;
            }

            if (timestamp - breakStartTime.value >= breakLength) {
                breakStartTime.value = -1;
                currentAnimationIndex.value += 1;
                lastTimestamp.value = -1;

                if (currentAnimationIndex.value >= animationParts.value.length) {
                    currentAnimationIndex.value = 0;
                }
            }
            return;
        }

        const activeAnimation = animationMap[projectAnimation.value[currentProject.value] + part];

        // ------------- Transition animations ------------- //
        //--- Normal Frame Processing ---//
        if (lastTimestamp.value === -1) {
            lastTimestamp.value = timestamp;
        }

        //Get frame info
        let currentFrameDuration = activeAnimation?.currentFrameDuration();
        let totalFrames = (activeAnimation?.getFrameCount());

        // Check if it's time for next frame
        if (currentFrameDuration && timestamp - lastTimestamp.value < currentFrameDuration) {
            return;
        }

        //Move to next frame
        activeAnimation?.decodeNextFrame();
        const frame = activeAnimation?.getCurrentFrame();
        if (frame) {
            //store previous frame
            const previousFrame = currentImage.value;
            //set current frame
            currentImage.value = frame;

            if (previousFrame) {
                previousFrame.dispose();
            }
        }

        // Update state
        lastTimestamp.value = timestamp;
        currentFrameIndex.value += 1;

        // --- Transitions, update --- //
        if (currentFrameIndex.value >= totalFrames) {

            //--- normal transition
            currentFrameIndex.value = 0;
            currentAnimationIndex.value += 1;

            //check if sequence is done
            if (currentAnimationIndex.value >= animationParts.value.length) {
                currentAnimationIndex.value = 0;
            }

            //--- loading ---//
            //add something to go back to idle screen
            if (isLoading.value) {
                if (currentAnimationIndex.value === 2 || currentAnimationIndex.value === 3) {
                    currentAnimationIndex.value = 2;
                    currentFrameIndex.value = 0;
                    return;
                } else if (currentAnimationIndex.value === 4) {
                    currentAnimationIndex.value = 0;
                    return;
                }
            }

            //--- detailPage ---//
            if (!isLoading.value && page.page === 'detailResearch') {
                animationParts.value = detailScreen;
                projectAnimation.value = [project?.cluster.formattedName, project?.cluster.formattedName];
                currentProject.value = 0;
                nextProject.value = 1;
                //--- keywordDetail ---//
            } else if (!isLoading.value && page.page === 'detailKeyword') {
                animationParts.value = detailScreen;
                currentProject.value = 0;
                nextProject.value = 0;
            } else {
                animationParts.value = transition;
                projectAnimation.value = projectsLoop;
            }

            //--- idle mode ---//
            if (currentAnimationIndex.value === 3) {

                prevProject.value = currentProject.value;
                currentProject.value = nextProject.value;

                if (nextProject.value === projectAnimation.value.length - 1) {
                    nextProject.value = 0;
                } else {
                    nextProject.value += 1;
                }
            }
        }
    });

    //--- Change values based on page ---//
    useEffect(() => {
        console.log('useEffect page:', page.page, 'isLoading:', positionData.isLoading);

        // Loading Logic
        if (page.page === 'detailResearch') {
            isLoading.value = positionData.isLoading;
            previousProjectData.current = { 'project': project, 'positionData': positionData };
        } else if (page.page === 'detailKeyword') {
            isLoading.value = false;
        }

        // Transition Logic
        if (page.page === 'detailKeyword') {
            scalingCluster.value = withTiming(0, {
                duration: 1000,
                easing: Easing.inOut(Easing.quad)
            });
            opacityCluster.value = withTiming(0, {
                duration: 1000,
                easing: Easing.inOut(Easing.quad)
            });
        } else {
            scalingCluster.value = withTiming(1, { duration: 1000 });
            opacityCluster.value = withTiming(1, { duration: 1000 });
        }
    }, [page.page, positionData.isLoading]);

    return (
        <Canvas
            style={{
                width: screenWidth,
                height: screenHeight,
                backgroundColor: 'green'
            }}
        >
            {/* Conditional Rendering Block Start */}
            {activeData.project && activeData.positionData && !activeData.positionData.isLoading && page.page !== 'discover' && (
                // The main condition is true, now apply the page-specific condition (Ternary)
                page.page === 'detailKeyword'
                    ? ( // Condition is true: Render the single FloatingKeywordImage
                        // <FloatingKeywordImage
                        //     page={page}
                        //     key={`keyword-${index}`} // Note: 'index' here might be undefined if not scoped correctly
                        //     image={page.info.imageSource} // Note: 'image' here might be undefined if not scoped correctly
                        //     renderX={renderX}
                        //     renderY={renderY}
                        //     renderXInitial={renderXInitial}
                        //     renderYInitial={renderYInitial}
                        //     width={widhtKeyword}
                        //     height={heightKeyword}
                        //     index={index}
                        //     time={globalTimestamp}
                        // />
                        <Circle cx={10} cy={10} r={10} color="lightblue" />

                    )
                    : ( // Condition is false: Render the mapped list of FloatingKeywordImages
                        keywordImages.map((image, index) => {
                            console.log('page', page.info);
                            console.log('image', image);

                            const pos = keywordPositions[index];
                            console.log('pos LALALLALALA', pos);

                            const boundingBox = boundingBoxesKeywords ? boundingBoxesKeywords[index] : undefined;
                            const boundingBoxInitial = boundingBoxesKeywordsInitial ? boundingBoxesKeywordsInitial[index] : undefined;

                            if (!pos) return null;

                            // Use pre-calculated render positions if available, otherwise fall back to pos
                            const renderX = boundingBox?.renderX ?? pos.x;
                            const renderY = boundingBox?.renderY ?? pos.y;

                            const renderXInitial = boundingBoxInitial?.renderX ?? pos.x;
                            const renderYInitial = boundingBoxInitial?.renderY ?? pos.y;

                            return (
                                <FloatingKeywordImage
                                    page={page}
                                    key={`keyword-${index}`}
                                    image={image}
                                    renderX={renderX}
                                    renderY={renderY}
                                    renderXInitial={renderXInitial}
                                    renderYInitial={renderYInitial}
                                    width={widhtKeyword}
                                    height={heightKeyword}
                                    index={index}
                                    time={globalTimestamp}
                                />
                            );
                        })
                    )
            )}
            {/* Conditional Rendering Block End */}

            <Image
                image={currentImage}
                scale={scalingCluster}
                opacity={opacityCluster}
                x={floatX}
                y={floatY}
                width={screenWidth}
                height={screenHeight}
                fit="contain"
            />
        </Canvas>
    );
}

export default Hologram;
