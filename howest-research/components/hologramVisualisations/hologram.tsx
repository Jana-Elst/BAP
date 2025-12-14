//https://docs.swmansion.com/react-native-reanimated/docs/advanced/useFrameCallback/
//https://shopify.github.io/react-native-skia/docs/animated-images/

import { getProjectInfo } from "@/scripts/getData";
import { checkIsLoading } from '@/scripts/getHelperFunction';
import {
    Canvas,
    Image,
    Rect
} from "@shopify/react-native-skia";
import React, { useEffect, useMemo } from "react";
import { Easing, useDerivedValue, useFrameCallback, useSharedValue, withTiming } from "react-native-reanimated";
import { useActiveProjectData } from "../../hooks/useActiveProjectData";
import { useComposition } from '../../scripts/createProjectImageCompositions';
import { useWebpAnimations } from "../../scripts/getWebpAnimations";

//--- Animation structures ---//
const transition = ['Intro', 'Loop', 'Loop', 'Outro'];
const detailScreen = ['Intro', 'Loop', 'Outro'];

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

    console.log('❤️ image', image);
    console.log('width', width);
    console.log('height', height);

    useEffect(() => {
        const random = Math.floor(Math.random() * 2000);
        progress.value = 0;
        progress.value = withTiming(1, { duration: random, easing: Easing.out(Easing.cubic) });
    }, [page.page]);

    const offsetX = useDerivedValue(() => {
        return Math.sin(time.value * 0.002 + index * 1000) * 5;
    }, [index]);

    const offsetY = useDerivedValue(() => {
        return Math.cos(time.value * 0.003 + index * 1000) * 5;
    }, [index]);

    const x = useDerivedValue(() => {
        let currentX;
        if (page.page === 'detailKeyword') {
            currentX = renderX + offsetX.value;
        } else {
            currentX = renderXInitial + (renderX - renderXInitial) * progress.value;
        }

        return currentX + offsetX.value;
    }, [renderX, renderXInitial, page.page]);

    const y = useDerivedValue(() => {
        let currentY;
        if (page.page === 'detailKeyword') {
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
}

const Hologram = ({ screenWidth, screenHeight, page, setPage }: { screenWidth: number; screenHeight: number; page: any, setPage: any }) => {
    // //--- General ---//
    const { animationMap, projects } = useWebpAnimations();
    const project = useMemo(() => page.id && page.page === 'detailResearch' ? getProjectInfo(page.id) : null, [page.id, page.page]);
    const positionData = useComposition(project, screenWidth, screenHeight, screenWidth, screenHeight, 'HOLOGRAM');
    const activeProjectData = useActiveProjectData(page, project, positionData);

    const {
        clusterPosition = undefined,
        keywordPositions = [],
        keywordInitialPositions = [],
        boundingBoxesKeywords = undefined,
        boundingBoxesKeywordsInitial = undefined,
        boundingBoxesCluster = undefined,
        keyWordLabelPositions = [],
        keywordImageSources,
        clusterImageSources = [],
        keywordData,
        keywordImages,
        clusterImage,
        positions,
        centerX,
        centerY,
        offset,
        widthCluster,
        heightCluster,
        widthKeyword,
        heightKeyword,
        getEllipseIntersection,
        isLoading = false,
    } = useMemo(() => activeProjectData.positionData, [activeProjectData.positionData]);

    useEffect(() => {
        const hologramIsLoading = project ? positionData.isLoading : false;
        console.log('hologramIsLoading', hologramIsLoading)
        if (page.isLoading.externalDisplay !== hologramIsLoading) {
            setPage((prev: any) => ({
                ...prev,
                isLoading: {
                    ...prev.isLoading,
                    externalDisplay: hologramIsLoading
                }
            }))
        }
    }, [positionData.isLoading, page.isLoading, project]);

    const isLoadingGlobal = useMemo(() => {
        console.log('//----------- isLoadingGlobal', page.isLoading, positionData.isLoading, "-----------//")
        return checkIsLoading(page.isLoading)
    }, [page.isLoading]);

    // //--- project loops ---//
    // //idle screen
    const projectsLoop = useMemo(() => projects
        .filter(p => p !== 'clusteroverschrijdend')
        .flatMap(project => ['clusteroverschrijdend', project]), [projects]);

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

    const floatY = useSharedValue(0);
    const floatX = useSharedValue(0);
    const scalingCluster = useSharedValue(1);
    const opacityCluster = useSharedValue(1);

    const actualPositionKeywords = useSharedValue(
        activeProjectData.positionData.boundingBoxesKeywordsInitial ?
            activeProjectData.positionData.boundingBoxesKeywordsInitial.flatMap((box) => {
                if (!box) return [0, 0];
                return [box.renderX, box.renderY];
            }) : []
    );

    const globalTimestamp = useSharedValue(0);

    useFrameCallback((frameInfo) => {
        //general
        const { timestamp } = frameInfo;
        globalTimestamp.value = timestamp;
        const part = animationParts.value[currentAnimationIndex.value];

        // --- Floating Effect Calculation --- //
        floatX.value = Math.sin(timestamp * 0.002) * 20;
        floatY.value = Math.cos(timestamp * 0.004) * 10;

        const activeAnimation = animationMap[projectAnimation.value[currentProject.value] + part];

        if (!part) {
            console.log('activeAnimation', projectAnimation.value[currentProject.value] + part);
        }

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
            if (isLoadingGlobal) {
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
            if (!isLoadingGlobal && page.page === 'detailResearch') {
                animationParts.value = transition;
                projectAnimation.value = [project?.cluster.formattedName, project?.cluster.formattedName];
                currentProject.value = 0;
                nextProject.value = 1;

                //--- keywordDetail ---//
            } else if (!isLoadingGlobal && page.page === 'detailKeyword') {
                animationParts.value = transition;
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

    //---- Transition logic ----//
    useEffect(() => {
        if (page.page === 'detailResearch' && isLoading.value === false) {
            console.log('--- Debugging Transition Logic ---');
            console.log('page.page:', page.page);
            console.log('boundingBoxesKeywords:', activeProjectData.positionData.boundingBoxesKeywords);
            console.log('activeProjectData:', activeProjectData);
            if (activeProjectData?.positionData) {
                console.log('positionData keys:', Object.keys(activeProjectData.positionData));
            } else {
                console.log('positionData is undefined or null');
            }

            const targetValues =
                activeProjectData.positionData.boundingBoxesKeywords ?
                    activeProjectData.positionData.boundingBoxesKeywords.flatMap((box) => {
                        if (!box) return [0, 0];
                        return [box.renderX, box.renderY];
                    }) : []

            console.log('Animating to targetValues:', targetValues);

            actualPositionKeywords.value = withTiming(
                targetValues,
                {
                    duration: 1000,
                    easing: Easing.inOut(Easing.quad)
                }
            )
        }
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
            }}
        >
            {activeProjectData.project ? (
                keywordImages.map((image, index) => {
                    console.log('😎 keywordImages');
                    console.log('😎 index');
                    // // const pos = keywordPositions[index];
                    const pos = activeProjectData.positionData.keywordPositions[index];
                    console.log('😎 pos', pos);

                    const boundingBox = boundingBoxesKeywords ? boundingBoxesKeywords[index] : undefined;
                    const boundingBoxInitial = boundingBoxesKeywordsInitial ? boundingBoxesKeywordsInitial[index] : undefined;

                    if (!pos) return null;

                    // Use pre-calculated render positions if available, otherwise fall back to pos
                    const renderX = boundingBox?.renderX ?? pos.x;
                    const renderY = boundingBox?.renderY ?? pos.y;

                    const renderXInitial = boundingBoxInitial?.renderX ?? pos.x;
                    const renderYInitial = boundingBoxInitial?.renderY ?? pos.y;

                    if (page.page === 'detailKeyword') {
                        console.log('😎 page INFO KEYWORD ID', page.info.keyword.id);
                        if (page.info.keyword.id === activeProjectData.project.keywords[index].id) {
                            return (
                                <FloatingKeywordImage
                                    page={page}
                                    key={`keyword-${index}`} // Note: 'index' here might be undefined if not scoped correctly
                                    image={image} // Note: 'image' here might be undefined if not scoped correctly
                                    renderX={renderX}
                                    renderY={renderY}
                                    renderXInitial={renderXInitial}
                                    renderYInitial={renderYInitial}
                                    width={widthKeyword}
                                    height={heightKeyword}
                                    index={index}
                                    time={globalTimestamp}
                                />
                            );
                        }
                    } else {
                        console.log('😎 detailPage');
                        return (
                            <FloatingKeywordImage
                                page={page}
                                key={`keyword-${index}`} // Note: 'index' here might be undefined if not scoped correctly
                                image={image} // Note: 'image' here might be undefined if not scoped correctly
                                renderX={renderX}
                                renderY={renderY}
                                renderXInitial={renderXInitial}
                                renderYInitial={renderYInitial}
                                width={widthKeyword}
                                height={heightKeyword}
                                index={index}
                                time={globalTimestamp}
                            />
                        );
                    }
                })
            ) : (
                console.log('😎 NO KEYWORDS', activeProjectData.project)
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
            {/* <Rect
                scale={scalingCluster}
                x={floatX}
                y={floatY}
                width={boundingBoxesCluster.width}
                height={boundingBoxesCluster.height}
                color="red"
                style="stroke"
                strokeWidth={4}
            /> */}
        </Canvas>
    );
}

export default Hologram;