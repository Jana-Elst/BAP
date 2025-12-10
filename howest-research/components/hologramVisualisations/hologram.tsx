//https://docs.swmansion.com/react-native-reanimated/docs/advanced/useFrameCallback/
//https://shopify.github.io/react-native-skia/docs/animated-images/

import { getProjectInfo } from "@/scripts/getData";
import {
    Canvas,
    Group,
    Image
} from "@shopify/react-native-skia";
import React from "react";
import { useFrameCallback, useSharedValue } from "react-native-reanimated";
import { useComposition } from '../../scripts/createProjectImageCompositions';
import { useWebpAnimations } from "../../scripts/getWebpAnimations";

const Hologram = ({ screenWidth, screenHeight, setPage, page }: { screenWidth: number; screenHeight: number }) => {
    //--- General ---//
    const { animationMap, projects } = useWebpAnimations();
    const project = page.id && page.page === 'detailResearch' ? getProjectInfo(page.id) : null;
    const positionData = useComposition(project, screenWidth, screenHeight, screenWidth, screenHeight);
    const {
        keywordImages = [],
        keywordPositions = [],
        boundingBoxesKeywords,
        clusterPosition,
        clusterImage,
        widhtKeyword = screenWidth / 2,
        heightKeyword = screenHeight / 2,
        widthCluster = screenWidth,
        heightCluster = screenHeight
    } = positionData as any;

    //--- Animation structures ---//
    const transition = ['Intro', 'Loop', 'Loop', 'Outro', 'break'];
    const detailScreen = ['Intro', 'Loop', 'Outro', 'break', 'break', 'break', 'break', 'break'];

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

    const isLoading = useSharedValue(false);
    const isDetail = useSharedValue(true);

    //--- Let's animate! ---//
    useFrameCallback((frameInfo) => {
        //general
        const { timestamp } = frameInfo;
        const part = animationParts.value[currentAnimationIndex.value];

        // --- Floating Effect Calculation --- //
        floatX.value = Math.sin(timestamp * 0.002) * 20;
        floatY.value = Math.cos(timestamp * 0.004) * 10;

        // --- Logic if there is a break --- //
        console.log('page', page.page);
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
            console.log('transition')

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
                console.log('loading');
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
                console.log('not loading');
                animationParts.value = detailScreen;
                projectAnimation.value = [project?.cluster.formattedName, project?.cluster.formattedName];
                currentProject.value = 0;
                nextProject.value = 1;
            } else {
                console.log('not detail');
                animationParts.value = transition;
                projectAnimation.value = projectsLoop;
            }

            //--- idle mode ---//
            if (currentAnimationIndex.value === 3) {
                console.log('switching to next project');

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
    if (page.page === 'detailResearch' && positionData.isLoading) {
        isLoading.value = true;
    } else if (page.page === 'detailResearch' && !positionData.isLoading) {
        console.log('not loading nee nee');
        isLoading.value = false;
    }


    return (
        <Canvas
            style={{
                width: screenWidth,
                height: screenHeight,
            }}
        >
            {project && positionData && !positionData.isLoading && page.page === 'detailResearch' && (
                keywordImages.map((image, index) => {
                    const pos = keywordPositions[index];
                    const boundingBox = boundingBoxesKeywords ? boundingBoxesKeywords[index] : undefined;

                    if (!pos) return null;

                    // Use pre-calculated render positions if available, otherwise fall back to pos
                    const renderX = boundingBox?.renderX ?? pos.x;
                    const renderY = boundingBox?.renderY ?? pos.y;

                    return (
                        <Group key={`keyword-${index}`}>
                            <Image
                                image={image}
                                x={renderX}
                                y={renderY}
                                width={widhtKeyword}
                                height={heightKeyword}
                            />
                        </Group>
                    );
                })
            )}
            <Image
                image={currentImage}
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
