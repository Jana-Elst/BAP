import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { TitleXSmall } from "../atoms/styledComponents";

const AccordeonItem = ({ title, children, onPress, isVisible = false }) => {
    const [bodyHeight, setBodyHeight] = useState(0);
    const height = useSharedValue(0);
    const rotate = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: height.value,
            opacity: height.value === 0 ? 0 : 1,
        };
    });

    const animatedChevronStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${rotate.value}deg` }],
        };
    });

    useEffect(() => {
        if (isVisible) {
            height.value = withTiming(bodyHeight, { duration: 300, easing: Easing.inOut(Easing.quad) });
            rotate.value = withTiming(180, { duration: 300 });
        } else {
            height.value = withTiming(0, { duration: 300, easing: Easing.inOut(Easing.quad) });
            rotate.value = withTiming(0, { duration: 300 });
        }
    }, [isVisible, bodyHeight]);

    return (
        <View>
            <TouchableOpacity onPress={onPress} style={styles.titleContainer}>
                <TitleXSmall style={styles.title}>{title}</TitleXSmall>
                <Animated.View style={animatedChevronStyle}>
                    <Ionicons name={'chevron-down-outline'} size={24} color={Colors.black} />
                </Animated.View>
            </TouchableOpacity>
            <Animated.View style={[styles.overflowHidden, animatedStyle]}>
                <View
                    style={styles.innerContent}
                    onLayout={(event) => {
                        const { height } = event.nativeEvent.layout;
                        if (height > 0 && Math.abs(bodyHeight - height) > 1) { // debouce small changes
                            setBodyHeight(height);
                        }
                    }}
                >
                    {children}
                </View>
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: Colors.white,
        paddingBottom: 16,
        marginTop: 32,
    },

    overflowHidden: {
        overflow: 'hidden',
    },

    innerContent: {
        position: 'absolute',
        width: '100%',
        paddingTop: 16, // Moved marginTop here for animation
    }
});

export default AccordeonItem;