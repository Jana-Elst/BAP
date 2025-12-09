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
        const introClusteroverschrijdend = useAnimatedImage(require('../../assets/images/clusters/clusteroverschrijdend_intro.webp'));
        const loopClusteroverschrijdend = useAnimatedImage(require('../../assets/images/clusters/clusteroverschrijdend_loop.webp'));
        const outroClusteroverschrijdend = useAnimatedImage(require('../../assets/images/clusters/clusteroverschrijdend_outro.webp'));

        const introActiveHealthCah = useAnimatedImage(require('../../assets/images/clusters/activeHealthCah_intro.webp'));
        const loopActiveHealthCah = useAnimatedImage(require('../../assets/images/clusters/activeHealthCah_loop.webp'));
        const outroActiveHealthCah = useAnimatedImage(require('../../assets/images/clusters/activeHealthCah_outro.webp'));

        const currentImage = useSharedValue<SkImage | null>(null);

        // State: 0 = Intro, 1 = Loop, 2 = Outro, 3 = Finished
        const animationState = useSharedValue(0);
        const loopCounter = useSharedValue(0);
        const currentFrameIndex = useSharedValue(0);
        const lastTimestamp = useSharedValue(-1);

        useFrameCallback((frameInfo) => {
                if (!introClusteroverschrijdend || !loopClusteroverschrijdend || !outroClusteroverschrijdend || !introActiveHealthCah || !loopActiveHealthCah || !outroActiveHealthCah) {
                        return;
                }

                let activeAnimation = null;
                if (animationState.value === 0) activeAnimation = introClusteroverschrijdend;
                else if (animationState.value === 1) activeAnimation = loopClusteroverschrijdend;
                else if (animationState.value === 2) activeAnimation = outroClusteroverschrijdend;
                else if (animationState.value === 3) activeAnimation = introClusteroverschrijdend;
                else if (animationState.value === 4) activeAnimation = loopClusteroverschrijdend;
                else if (animationState.value === 5) activeAnimation = loopActiveHealthCah;
                else if (animationState.value === 6) activeAnimation = outroActiveHealthCah;

                // If finished or no active animation, keep the last image or do nothing
                if (!activeAnimation) return;

                const { timestamp } = frameInfo;
                if (lastTimestamp.value === -1) {
                        lastTimestamp.value = timestamp;
                }

                let duration = activeAnimation.currentFrameDuration();
                // Safety check for duration
                if (duration <= 0) duration = 40; //is this the ms for each frame?

                if (timestamp - lastTimestamp.value < duration) {
                        return;
                }

                // Decode next frame
                activeAnimation.decodeNextFrame();
                const frame = activeAnimation.getCurrentFrame();

                if (frame) {
                        const oldFrame = currentImage.value;
                        currentImage.value = frame;
                        if (oldFrame) {
                                oldFrame.dispose();
                        }
                }

                lastTimestamp.value = timestamp;
                currentFrameIndex.value += 1;

                // Check for transition
                if (currentFrameIndex.value >= activeAnimation.getFrameCount()) {
                        currentFrameIndex.value = 0;

                        if (animationState.value === 0) {
                                // Intro finished -> Start Loop
                                animationState.value = 1;
                        } else if (animationState.value === 1) {
                                // Loop finished -> Increment count or switch to Outro
                                loopCounter.value += 1;
                                if (loopCounter.value >= 3) {
                                        animationState.value = 2;
                                }
                        } else if (animationState.value === 2) {
                                // Loop finished -> Increment count or switch to Outro
                                loopCounter.value += 1;
                                if (loopCounter.value >= 4) {
                                        animationState.value = 3;
                                }
                        }
                }
        });

        return (
                <Canvas
                        style={{
                                width: screenWidth,
                                height: screenHeight,
                                backgroundColor: 'green',
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