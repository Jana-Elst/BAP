//https://docs.swmansion.com/react-native-reanimated/docs/advanced/useFrameCallback/
//https://shopify.github.io/react-native-skia/docs/animated-images/

import { getProjectInfo } from "@/scripts/getData";
import {
    Canvas,
    Group,
    Image,
    SkImage
} from "@shopify/react-native-skia";
import React from "react";
import { useFrameCallback, useSharedValue } from "react-native-reanimated";
import { useComposition } from '../../scripts/createProjectImageCompositions';
import { useWebpAnimations } from "../../scripts/getWebpAnimations";

const HomeScreenHologram = ({ screenWidth, screenHeight, setPage, page }: { screenWidth: number; screenHeight: number }) => {
    //--- General ---//
    //load animations
    const { animationMap, projects } = useWebpAnimations();
    const project = page.id && page.page === 'detailResearch' ? getProjectInfo(page.id) : null;

    // We must call useComposition unconditionally.
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


    //set animation structure
    const animationParts = ['Intro', 'Loop', 'Loop', 'Outro', 'break'];

    //--- idle screen, projects ---//
    const projectsLoop = projects
        .filter(p => p !== 'clusteroverschrijdend')
        .flatMap(project => ['clusteroverschrijdend', project]);

    const projectAnimation = useSharedValue(projectsLoop);

    //--- create turning switch animation ---//
    //variables
    const currentProject = useSharedValue(0);
    const nextProject = useSharedValue(1);
    const prevProject = useSharedValue(2);

    const currentAnimationIndex = useSharedValue(0);
    const currentFrameIndex = useSharedValue(0);
    const lastTimestamp = useSharedValue(-1);
    const breakStartTime = useSharedValue(-1);
    const floatY = useSharedValue(0);
    const floatX = useSharedValue(0);
    const currentImage = useSharedValue<SkImage | null>(null);

    const breakLength = 1000; // 3 seconds

    const isLoading = useSharedValue(false);
    const isDetail = useSharedValue(false);

    useFrameCallback((frameInfo) => {
        const part = animationParts[currentAnimationIndex.value];
        const activeAnimation = animationMap[projectAnimation.value[currentProject.value] + part];
        const { timestamp } = frameInfo;

        // --- Floating Effect Calculation --- //
        // Continuous circular/spiral motion
        floatX.value = Math.sin(timestamp * 0.002) * 20;
        floatY.value = Math.cos(timestamp * 0.004) * 10;

        // --- Logic if there is a break --- //
        if (part === 'break') {
            if (breakStartTime.value === -1) {
                breakStartTime.value = timestamp;
            }

            if (timestamp - breakStartTime.value >= breakLength) {
                breakStartTime.value = -1;
                currentAnimationIndex.value += 1;
                lastTimestamp.value = -1;

                if (currentAnimationIndex.value >= animationParts.length) {
                    currentAnimationIndex.value = 0;
                }
            }
            return;
        }

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

        //--- switching projects ---//
        //need logic to keep looping during loading?
        if (currentFrameIndex.value >= totalFrames) {

            // Loading Trap: Keep looping if loading and we are in a loopable state (Loop or Outro)
            if (isLoading.value && (currentAnimationIndex.value === 2 || currentAnimationIndex.value === 3)) {
                // Reset frame index to restart the loop part
                currentFrameIndex.value = 0;
                // We keep the same currentAnimationIndex
                return;
            }

            // Normal Transition
            currentFrameIndex.value = 0;
            currentAnimationIndex.value += 1;

            // Check if sequence is done
            if (currentAnimationIndex.value >= animationParts.length) {
                currentAnimationIndex.value = 0;
            }

            // Detail Mode Logic: Restrict to Loop parts (1 and 2), skipping Outro/Break/Intro
            if (isDetail.value) {
                if (currentAnimationIndex.value > 2 || currentAnimationIndex.value < 1) {
                    currentAnimationIndex.value = 1;
                }
            }
            // Idle Mode Logic: Switch projects at Outro
            else {
                //switch to next project if not loading
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
        }
    });

    //--- detailPage screen ---//

    //variables
    if (project && positionData && positionData.isLoading) {
        isLoading.value = true;
        // Don't forcefully set animation index here to avoid jumping. 
        // Let the frame callback handle the transition to holding state.
    }

    if (project && positionData && !positionData.isLoading) {
        isLoading.value = false;
        isDetail.value = true;
        const cluster = project.cluster.formattedName;
        projectAnimation.value = [cluster, cluster];
        currentProject.value = 0; // Reset index to avoid out of bounds
        // console.log('cluster', cluster);
    } else if (!positionData?.isLoading) { // Only set to idle if not loading detail
        isLoading.value = false;
        isDetail.value = false;
        projectAnimation.value = projectsLoop;
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

export default HomeScreenHologram;