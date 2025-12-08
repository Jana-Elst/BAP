
import {
        Canvas,
        Image,
        useAnimatedImageValue
} from "@shopify/react-native-skia";

const HomeScreenHologram = ({ screenWidth, screenHeight }: { screenWidth: number; screenHeight: number }) => {
        console.log('HomeScreenHologram screenWidth:', screenWidth);
        console.log('HomeScreenHologram screenHeight:', screenHeight);

        const intro = useAnimatedImageValue(
                require('../../assets/images/clusters/clusteroverschrijdend_intro.webp')
        );
        const loop = useAnimatedImageValue(
                require('../../assets/images/clusters/clusteroverschrijdend_loop.webp')
        );
        const outro = useAnimatedImageValue(
                require('../../assets/images/clusters/clusteroverschrijdend_outro.webp')
        );

        return (
                <Canvas
                        style={{
                                width: screenWidth,
                                height: screenHeight,
                                alignItems: 'center',
                                justifyContent: 'center',
                        }}
                >
                        <Image
                                image={intro}
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