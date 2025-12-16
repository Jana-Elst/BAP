import { Colors, Fonts } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { StyledText } from "../atoms/styledComponents";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const LanguageToggle = () => {
    const [isActive, setIsActive] = useState(true);
    const positionX = useSharedValue(-10);

    useEffect(() => {
        positionX.value = withSpring(isActive ? -10 : 50, {
            mass: 0.5,
            damping: 12,
            stiffness: 100,
            overshootClamping: false,
        });
    }, [isActive]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            left: `${positionX.value}%`,
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
                    animatedStyle
                ]}
            />

            <Pressable
                onPress={() => setIsActive(true)}
                style={styles.button}
            >
                <StyledText style={{ fontFamily: isActive ? Fonts.rounded.bold : Fonts.rounded.light, fontSize: 24 }}>NL</StyledText>
            </Pressable>

            <Pressable
                onPress={() => setIsActive(false)}
                style={styles.button}
            >
                <StyledText style={{ fontFamily: !isActive ? Fonts.rounded.bold : Fonts.rounded.light, fontSize: 24 }}>EN</StyledText>
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
        width: '60%',
        transform: [{ skewX: '-20deg' }],
        zIndex: 0,
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        zIndex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 60,
    }
});

export default LanguageToggle;