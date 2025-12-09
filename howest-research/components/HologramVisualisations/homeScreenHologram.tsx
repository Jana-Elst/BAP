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
        };

        const animationParts = ['Intro', 'Loop', 'Loop', 'Outro'];
        const currentProject = useSharedValue('clusterOverschrijdend');
        const nextProject = useSharedValue('activeHealthCah');

        const currentAnimationIndex = useSharedValue(0);
        const currentFrameIndex = useSharedValue(0);
        const lastTimestamp = useSharedValue(-1);
        const currentImage = useSharedValue<SkImage | null>(null);

        const brakeLenght = 3000; // 3 seconds


        useFrameCallback((frameInfo) => {
                const part = animationParts[currentAnimationIndex.value];
                const activeAnimation = animationMap[currentProject.value + part];

                //--- Normal Frame Processing ---//
                const { timestamp } = frameInfo;
                if (lastTimestamp.value === -1) {
                        lastTimestamp.value = timestamp;
                }

                // // // Get frame info
                let currentFrameDuration = activeAnimation?.currentFrameDuration();
                let totalFrames = activeAnimation?.getFrameCount();

                console.log('Current frame duration:', currentFrameDuration);
                console.log('Total frames:', totalFrames);

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

                        currentFrameIndex.value = 0;
                        console.log('currentAnimationIndex', currentAnimationIndex.value);
                }
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
                                x={0}
                                y={0}
                                width={screenWidth}
                                height={screenHeight}
                                fit="contain"
                        />
                </Canvas>
        );
}

export default HomeScreenHologram;