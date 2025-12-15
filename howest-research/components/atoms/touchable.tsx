
import { Colors } from "@/constants/theme";
import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from "expo-blur";
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSequence, withTiming } from "react-native-reanimated";
import { ParagraphLarge } from "./styledComponents";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const Touchable = ({
    onPress,
    isActive = false,
    variant = 'primary',
    icon = null,
    iconSize = 24,
    children,
    iconPosition = 'before',
    showIconOnly = false,
    styleButton = null,
    styleGradient = null,
    styleText = null,
    iconColor = undefined,
    scaleAnimation = 0.95,
    dropShadowOn = true
}: {
    onPress?: () => void;
    isActive?: boolean;
    variant?: 'primary' | 'secondary' | 'tertiary';
    icon?: any;
    iconSize?: number;
    children?: React.ReactNode;
    iconPosition?: 'before' | 'after';
    showIconOnly?: boolean;
    styleButton?: any;
    styleGradient?: any;
    styleText?: any;
    iconColor?: string;
    scaleAnimation?: number;
    dropShadowOn?: boolean;
}) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const handlePressIn = () => {
        scale.value = withSequence(
            withTiming(scaleAnimation === 0.95 ? 0.95 : scaleAnimation, { duration: 100, easing: Easing.inOut(Easing.quad) }),
            withTiming(1, { duration: 100, easing: Easing.inOut(Easing.quad) })
        );
    };

    const handlePressOut = () => {
        scale.value = withTiming(1);
    };

    const gradientColorsActive = [Colors.blue100, Colors.blue25, Colors.blue100];
    const gradientColorsInactive = [Colors.white75, Colors.white75, Colors.white75];

    if (variant === 'tertiary') {
        return (
            <Animated.View style={[animatedStyle, { alignSelf: 'flex-start' }]}>
                <Pressable
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onPress={onPress}
                    style={[styles.tertiaryContent, styleButton]}
                >
                    {/* Tertiary Content: Text + Underline */}
                    <View style={{ alignItems: 'center' }}>
                        {/* Text */}
                        {typeof children === 'string' ? (
                            <ParagraphLarge style={[styleText, { color: Colors.black }]}>{children}</ParagraphLarge>
                        ) : children}

                        {/* Underline */}
                        <View style={{
                            height: 1,
                            backgroundColor: Colors.black, // Assuming black line, adjust if needed
                            width: '100%',
                            marginTop: 4
                        }} />
                    </View>
                </Pressable>
            </Animated.View>
        );
    }

    return (
        <BlurView
            intensity={25}
            tint="light"
            style={[
                styleGradient,
                dropShadowOn && styles.shadow,
                {
                    borderRadius: 100,
                    overflow: 'hidden',
                }]}>
            <AnimatedLinearGradient
                colors={isActive ? gradientColorsActive : gradientColorsInactive}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.gradient, animatedStyle]}
            >
                <Pressable
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onPress={onPress}
                    style={[styles.content, styleButton, iconPosition === 'after' ? { flexDirection: 'row-reverse' } : null]}>
                        {icon && <Ionicons name={icon} size={iconSize} color={iconColor || Colors.black} />}
                        {(showIconOnly && !isActive) || !children || typeof children !== 'string' ? null : <ParagraphLarge style={styleText}>{children}</ParagraphLarge>}
                        {typeof children === 'string' ? null : children}
                </Pressable>
            </AnimatedLinearGradient>
        </BlurView >
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
    tertiaryContent: {
    },
    gradient: {
        borderRadius: 100,
        alignSelf: 'flex-start',
    },
    shadow: {
        shadowColor: 'rgb(78, 78, 78)',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    }
});

export default Touchable;