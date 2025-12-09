
import { Colors } from "@/constants/theme";
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { ParagraphLarge } from "./styledComponents";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const Touchable = ({ onPress, isActive = false, icon = null, children, iconPosition = 'before', showIconOnly = false, styleButton = null, styleGradient = null, styleText = null, iconColor = null }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handlePressIn = () => {
        scale.value = withSpring(0.95);
    };

    const handlePressOut = () => {
        scale.value = withSpring(1);
    };

    return (
        <View style={styleGradient}>
            <AnimatedLinearGradient
                colors={isActive ? [Colors.blue100, Colors.blue25, Colors.blue100] : [Colors.white, Colors.white, Colors.white]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.gradient, animatedStyle]}
            >
                <Pressable
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onPress={onPress}
                    style={[styles.content, styleButton, iconPosition === 'after' ? { flexDirection: 'row-reverse' } : null]}>
                    {icon && <Ionicons name={icon} size={24} color={iconColor || Colors.black} />}
                    {(showIconOnly && !isActive) || !children ? null : <ParagraphLarge style={styleText}>{children}</ParagraphLarge>}
                </Pressable>
            </AnimatedLinearGradient>
        </View>
    )
}

const styles = StyleSheet.create({
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,

        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 100,
    },

    gradient: {
        borderRadius: 100,
        alignSelf: 'flex-start',
    },
});

export default Touchable;