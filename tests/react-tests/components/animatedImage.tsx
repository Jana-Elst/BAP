import Animated, {
    useAnimatedStyle,
    interpolate,
    Extrapolate,
} from 'react-native-reanimated';
import { View, Text, Image, StyleSheet, useWindowDimensions, SafeAreaView } from 'react-native';

export function AnimatedImage({ index, imgSrc, scrollY, scatterDirections }) {
    const { width, height } = useWindowDimensions();
    const isMobile = width < 1000;
    const scatterMultiplier = isMobile ? 2.5 : 0.5;

    // Define the start/end positions for *this* image
    const endX = scatterDirections.x * width * scatterMultiplier;
    const endY = scatterDirections.y * height * scatterMultiplier;

    // This hook creates the animated style object
    const animatedStyle = useAnimatedStyle(() => {
        // This logic replaces your `imageProgress`
        // We create a "progress" value for this specific image
        const staggerDelay = index * 0.03;

        // We need to define the scroll "duration"
        // Let's say the main animation happens over the first 3 screens
        const animationDuration = height * 3;

        // Calculate this image's progress (0 to 1)
        const imageProgress = interpolate(
            scrollY.value,
            [0, animationDuration], // Input range (scroll position)
            [0, 1],                // Output range (progress)
            Extrapolate.CLAMP
        );

        // Apply the stagger
        const staggeredProgress = Math.max(0, (imageProgress - staggerDelay) * 4);

        // Now, interpolate all the values!
        // This replaces `gsap.utils.interpolate`
        const x = interpolate(staggeredProgress, [0, 1], [0, endX]);
        const y = interpolate(staggeredProgress, [0, 1], [0, endY]);
        const scale = interpolate(staggeredProgress, [0, 1], [0, 1]); // Start at scale 0
        const opacity = interpolate(staggeredProgress, [0, 1], [0, 1]); // Fade in

        return {
            opacity,
            transform: [
                { translateX: x },
                { translateY: y },
                { scale: scale },
            ],
        };
    });

    return (
        <Animated.Image
            source={imgSrc}
            style={[styles.image, animatedStyle]}
        />
    );
}

// Add this to your StyleSheet
const styles = StyleSheet.create({
    // ... (other styles)
    image: {
        position: 'absolute', // All images are stacked
        width: 200, // Set your image size
        height: 200, // Set your image size
        resizeMode: 'cover',
    },
});