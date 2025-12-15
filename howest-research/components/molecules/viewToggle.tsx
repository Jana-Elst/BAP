import DiscoverViewIcon from "@/assets/icons/discoverView";
import GridViewIcon from "@/assets/icons/gridView";
import { Colors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { StyledText } from "../atoms/styledComponents";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedText = Animated.createAnimatedComponent(View);

const ViewToggle = ({ setActive, isActive }: { setActive: (value: boolean) => void; isActive: boolean }) => {
    const animation = useSharedValue(isActive ? 0 : 1);

    useEffect(() => {
        animation.value = withSpring(isActive ? 0 : 1, {
            mass: 0.5,
            damping: 15,
            stiffness: 120,
            overshootClamping: false,
        });
    }, [isActive]);

    const activeTextStyle = useAnimatedStyle(() => {
        return {
            width: interpolate(animation.value, [0, 1], [180, 0]),
            opacity: interpolate(animation.value, [0, 0, 0], [1, 1, 1]),
            marginLeft: interpolate(animation.value, [0, 1], [12, 0]),
            transform: [
                { translateX: interpolate(animation.value, [0, 1], [0, -20]) }
            ]
        };
    });

    const inactiveTextStyle = useAnimatedStyle(() => {
        return {
            width: interpolate(animation.value, [0, 1], [0, 160]),
            opacity: interpolate(animation.value, [0, 0, 0], [1, 1, 1]),
            marginLeft: interpolate(animation.value, [0, 1], [0, 12]),
            transform: [
                { translateX: interpolate(animation.value, [0, 1], [20, 0]) }
            ]
        };
    });

    const backgroundStyle = useAnimatedStyle(() => {
        return {
            left: `${interpolate(animation.value, [0, 1], [-10, 25])}%`,
        };
    });

    return (
        <View style={styles.toggle}>
            <AnimatedLinearGradient
                colors={[Colors.blue100, Colors.blue25, Colors.blue100]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                    styles.activeDetails,
                    !isActive ? { width: '80%' } : { width: '85%' },
                    backgroundStyle
                ]}
            />

            <Pressable
                onPress={() => setActive(true)}
                style={styles.button}
            >
                <DiscoverViewIcon />
                <AnimatedText style={[styles.textContainer, activeTextStyle]}>
                    <StyledText style={{ fontSize: 20 }} numberOfLines={1} ellipsizeMode="clip">Ontdek weergave</StyledText>
                </AnimatedText>
            </Pressable>

            <Pressable
                onPress={() => setActive(false)}
                style={styles.button}
            >
                <GridViewIcon />
                <AnimatedText style={[styles.textContainer, inactiveTextStyle]}>
                    <StyledText style={{ fontSize: 20 }} numberOfLines={1} ellipsizeMode="clip">Galerij weergave</StyledText>
                </AnimatedText>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    toggle: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: 100,
        overflow: 'hidden',
        position: 'relative',
        alignItems: 'center', // vital for centering vertical

        shadowColor: 'rgb(78, 78, 78)',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },

    activeDetails: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        zIndex: 0,
        borderRadius: 100,
    },
    button: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingVertical: 16,
        zIndex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 0,
    },
    textContainer: {
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default ViewToggle;