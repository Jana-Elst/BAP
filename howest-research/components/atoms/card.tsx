import { Colors } from "@/constants/theme";
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const Card = ({ children, borderRadius = 30, onLayout = undefined, style = null, isActive = false, fill = false, containerStyle = null, gradientColors = ['rgba(68, 200, 245, 0.10)', 'rgba(68, 200, 245, 0.50)'] }) => {
    const flexStyle = fill ? { flex: 1 } : {};

    const activeAnimation = useSharedValue(isActive ? 1 : 0);

    useEffect(() => {
        activeAnimation.value = withTiming(isActive ? 1 : 0, { duration: 300 });
    }, [isActive]);

    const animatedCardStyle = useAnimatedStyle(() => {
        return {
            borderColor: interpolateColor(
                activeAnimation.value,
                [0, 1],
                [Colors.white, Colors.blue100]
            ),
            borderWidth: 1 + activeAnimation.value, // Interpolates from 1 to 2
        };
    });

    const activeGradientStyle = useAnimatedStyle(() => {
        return {
            opacity: activeAnimation.value,
        };
    });

    const inactiveGradientStyle = useAnimatedStyle(() => {
        return {
            opacity: 1 - activeAnimation.value,
        };
    });

    return (
        <BlurView intensity={50} tint="light" style={[styles.blurContainer, { borderRadius: borderRadius }, containerStyle, flexStyle]}>
            <View style={{ opacity: 0.5 }} />
            <View style={[styles.shadowContainer, { borderRadius: borderRadius }, flexStyle]}>
                <Animated.View
                    style={[
                        styles.card,
                        { borderRadius: borderRadius },
                        style,
                        flexStyle,
                        animatedCardStyle,
                        { overflow: 'hidden' }
                    ]}
                    onLayout={onLayout}
                >
                    <Animated.View style={[StyleSheet.absoluteFill, inactiveGradientStyle]}>
                        <LinearGradient
                            style={{ flex: 1 }}
                            colors={['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.6)', 'rgba(224, 224, 224, 0.4)']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0.6, y: 1 }}
                        />
                    </Animated.View>

                    <Animated.View style={[StyleSheet.absoluteFill, activeGradientStyle]}>
                        <LinearGradient
                            style={{ flex: 1 }}
                            colors={gradientColors as any}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 0.6, y: 1 }}
                        />
                    </Animated.View>

                    {children}
                </Animated.View>
            </View>
        </BlurView>
    )
}

const styles = StyleSheet.create({
    blurContainer: {
        overflow: 'hidden',
    },

    shadowContainer: {
        shadowColor: 'rgba(78, 78, 78, 0.2)',
        shadowOffset: { width: 0, height: 3.38 },
        shadowOpacity: 0.2,
        shadowRadius: -1.915,
    },

    card: {
        borderWidth: 2,
    }
});

export default Card;