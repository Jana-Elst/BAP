import { useState } from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
} from 'react-native-reanimated';

export default function HomeScreen() {
    const [size, setSize] = useState({ width: 0, height: 0 });

    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    console.log(windowWidth, windowHeight);

    const pinchGesture = Gesture.Pinch()
        .onUpdate((e) => {
            scale.value = savedScale.value * e.scale;
        })
        .onEnd(() => {
            savedScale.value = scale.value;
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const dynamicStyle = {
        transform: [
            { translateX: 0 },
            { translateY: 0 },
        ],
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <GestureDetector gesture={pinchGesture}>
                <View style={styles.gestureArea}>
                    <Animated.View style={[animatedStyle]}>
                        <Image
                            style={[styles.image, dynamicStyle]}
                            source={require('../../assets/images/image.png')}
                        />
                    </Animated.View>
                </View>
            </GestureDetector>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'green'
    },
    gestureArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
    }
});