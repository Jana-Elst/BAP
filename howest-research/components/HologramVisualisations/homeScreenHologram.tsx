//https://docs.swmansion.com/react-native-reanimated/docs/advanced/useFrameCallback/
//https://shopify.github.io/react-native-skia/docs/animated-images/

import {
        Canvas,
        Image,
        SkImage,
        useAnimatedImage
} from "@shopify/react-native-skia";
import { useFrameCallback, useSharedValue } from "react-native-reanimated";

const HomeScreenHologram = ({ screenWidth, screenHeight }: { screenWidth: number; screenHeight: number }) => {
        const clusterOverschrijdendIntro = useAnimatedImage(require('../../assets/images/clusters/clusteroverschrijdend_intro.webp'));
        const clusterOverschrijdendLoop = useAnimatedImage(require('../../assets/images/clusters/clusteroverschrijdend_loop.webp'));
        const clusterOverschrijdendOutro = useAnimatedImage(require('../../assets/images/clusters/clusteroverschrijdend_outro.webp'));

        const activeHealthCahIntro = useAnimatedImage(require('../../assets/images/clusters/activeHealthCah_intro.webp'));
        const activeHealthCahLoop = useAnimatedImage(require('../../assets/images/clusters/activeHealthCah_loop.webp'));
        const activeHealthCahOutro = useAnimatedImage(require('../../assets/images/clusters/activeHealthCah_outro.webp'));

        const architectuurEnDesignCadIntro = useAnimatedImage(require('../../assets/images/clusters/architectuurEnDesignCad_intro.webp'));
        const architectuurEnDesignCadLoop = useAnimatedImage(require('../../assets/images/clusters/architectuurEnDesignCad_loop.webp'));
        const architectuurEnDesignCadOutro = useAnimatedImage(require('../../assets/images/clusters/architectuurEnDesignCad_outro.webp'));

        const bedrijfEnOrganisatieCboIntro = useAnimatedImage(require('../../assets/images/clusters/bedrijfEnOrganisatieCbo_intro.webp'));
        const bedrijfEnOrganisatieCboLoop = useAnimatedImage(require('../../assets/images/clusters/bedrijfEnOrganisatieCbo_loop.webp'));
        const bedrijfEnOrganisatieCboOutro = useAnimatedImage(require('../../assets/images/clusters/bedrijfEnOrganisatieCbo_outro.webp'));

        // Define a strict map to lookup animations by constructed key
        const animationMap: Record<string, ReturnType<typeof useAnimatedImage>> = {
                'clusterOverschrijdendIntro': clusterOverschrijdendIntro,
                'clusterOverschrijdendLoop': clusterOverschrijdendLoop,
                'clusterOverschrijdendOutro': clusterOverschrijdendOutro,

                'activeHealthCahIntro': activeHealthCahIntro,
                'activeHealthCahLoop': activeHealthCahLoop,
                'activeHealthCahOutro': activeHealthCahOutro,

                'architectuurEnDesignCadIntro': architectuurEnDesignCadIntro,
                'architectuurEnDesignCadLoop': architectuurEnDesignCadLoop,
                'architectuurEnDesignCadOutro': architectuurEnDesignCadOutro,

                'bedrijfEnOrganisatieCboIntro': bedrijfEnOrganisatieCboIntro,
                'bedrijfEnOrganisatieCboLoop': bedrijfEnOrganisatieCboLoop,
                'bedrijfEnOrganisatieCboOutro': bedrijfEnOrganisatieCboOutro,
        };

        const animationParts = ['Intro', 'Loop', 'Loop', 'Outro', 'break'];
        // const animationParts = ['Intro', 'Loop', 'Outro', 'break'];


        const projects = ['clusterOverschrijdend', 'activeHealthCah', 'clusterOverschrijdend', 'architectuurEnDesignCad', 'clusterOverschrijdend', 'bedrijfEnOrganisatieCbo'];
        // const projects = ['activeHealthCah', 'activeHealthCah'];

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


        useFrameCallback((frameInfo) => {
                const part = animationParts[currentAnimationIndex.value];
                const { timestamp } = frameInfo;

                // --- Floating Effect Calculation --- //
                // Continuous circular/spiral motion
                floatX.value = Math.sin(timestamp * 0.002) * 20;
                floatY.value = Math.cos(timestamp * 0.004) * 10;

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

                const activeAnimation = animationMap[projects[currentProject.value] + part];

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

                // // Move to next frame
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

                if (currentFrameIndex.value >= totalFrames) {
                        currentFrameIndex.value = 0;
                        currentAnimationIndex.value += 1;

                        // Check if sequence is done
                        if (currentAnimationIndex.value >= animationParts.length) {
                                currentAnimationIndex.value = 0;
                        }

                        //switch to next project
                        if (currentAnimationIndex.value === 3) {
                                console.log('switching to next project');
                                console.log('currentProject', prevProject.value, currentProject.value, nextProject.value);

                                prevProject.value = currentProject.value;
                                currentProject.value = nextProject.value;

                                if (nextProject.value === projects.length - 1) {
                                        nextProject.value = 0;
                                } else {
                                        nextProject.value += 1;
                                }
                        }
                }

                console.log('currentFrameIndex', currentFrameIndex.value);
        });

        return (
                <Canvas
                        style={{
                                width: screenWidth,
                                height: screenHeight,
                        }}
                >
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