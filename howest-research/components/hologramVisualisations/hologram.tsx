//https://docs.swmansion.com/react-native-reanimated/docs/advanced/useFrameCallback/
//https://shopify.github.io/react-native-skia/docs/animated-images/

import { getProjectInfo } from "@/scripts/getData";
import {
    Canvas,
    Image
} from "@shopify/react-native-skia";
import React, { useRef } from "react";
import { useFrameCallback, useSharedValue } from "react-native-reanimated";
import { useComposition } from '../../scripts/createProjectImageCompositions';
import { useWebpAnimations } from "../../scripts/getWebpAnimations";

const Hologram = ({ screenWidth, screenHeight, page }: { screenWidth: number; screenHeight: number; page: any }) => {
    //--- General ---//
    const { animationMap, projects } = useWebpAnimations();
    const project = page.id && page.page === 'detailResearch' ? getProjectInfo(page.id) : null;
    const positionData = useComposition(project, screenWidth, screenHeight, screenWidth, screenHeight);

    // Store the last valid project data to persist it when switching to detailKeyword
    const previousProjectDataRef = useRef({ project: project, positionData: positionData });

    if (page.page === 'detailResearch' && project) {
        previousProjectDataRef.current = { project: project, positionData: positionData };
    }

    const activeProjectData = page.page === 'detailKeyword'
        ? previousProjectDataRef.current
        : { project: project, positionData: positionData };

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
    } = activeProjectData.positionData as any;


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

    //----


    return (
        <Canvas
            style={{
                width: screenWidth,
                height: screenHeight,
                backgroundColor: 'green'
            }}
        >
            {activeProjectData.project ? (
                keywordImages.map((image, index) => {
                    const pos = keywordPositions[index];

                    const boundingBox = boundingBoxesKeywords ? boundingBoxesKeywords[index] : undefined;
                    const boundingBoxInitial = boundingBoxesKeywordsInitial ? boundingBoxesKeywordsInitial[index] : undefined;

                    if (!pos) return null;

                    // Use pre-calculated render positions if available, otherwise fall back to pos
                    const renderX = boundingBox?.renderX ?? pos.x;
                    const renderY = boundingBox?.renderY ?? pos.y;

                    const renderXInitial = boundingBoxInitial?.renderX ?? pos.x;
                    const renderYInitial = boundingBoxInitial?.renderY ?? pos.y;

                    if (page.page === 'detailKeyword') {
                        console.log('page INFO KEYWORD ID', page.info.keyword.id);
                        console.log('activeProject', activeProjectData.project.keywords[index].id);

                        if (page.info.keyword.id === activeProjectData.project.keywords[index].id) {
                            return (
                                <Image
                                    image={image}
                                    x={renderX}
                                    y={renderY}
                                    width={widhtKeyword}
                                    height={heightKeyword}
                                />
                            );
                        }
                    } else {
                        return (
                            <Image
                                image={image}
                                x={renderX}
                                y={renderY}
                                width={widhtKeyword}
                                height={heightKeyword}
                            />
                        );
                    }
                })
            ) : (
                console.log('NO KEYWORDS', activeProjectData.project)
            )}

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