import { BlurView } from "expo-blur";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import SwipeIcon from "../../assets/icons/swipe";
import ZoomIcon from "../../assets/icons/zoom";
import { StyledText } from "../atoms/styledComponents";

//--- CONSTS ---//
const angle = 5;
const time = 150;
const easing = Easing.inOut(Easing.ease);

//--- COMPONENT --//
const InstructionsHomeScreen = ({ style }) => {
    //--- wobble animation ---//
    const rotation = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotateZ: `${rotation.value}deg` }],
    }));

    useEffect(() => {
        rotation.value = withRepeat(
            withSequence(
                withTiming(-angle, { duration: time / 2, easing: easing }),
                withRepeat(
                    withTiming(angle, {
                        duration: time,
                        easing: easing,
                    }),
                    7,
                    true
                ),
                withTiming(0, { duration: time / 2, easing: easing }),
                withDelay(1500, withTiming(0, { duration: 0 }))
            ),
            -1
        );
    }, []);

    return (
        <Animated.View
            style={[style, animatedStyle, {
                alignSelf: 'center',
                marginBottom: 16,
                borderRadius: 24,
                shadowColor: 'rgb(78, 78, 78)',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.20,
                shadowRadius: 4,
                elevation: 5,
                backgroundColor: 'transparent',
            }]}>
            <BlurView
                intensity={25}
                tint="light"
                style={{
                    alignItems: 'center',
                    gap: 8,
                    justifyContent: 'center',
                    paddingVertical: 20,
                    paddingHorizontal: 24,
                    borderRadius: 24,
                    overflow: 'hidden',
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <StyledText>Veeg in alle richtingen</StyledText>
                    <SwipeIcon />
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <StyledText>Zoom in en uit</StyledText>
                    <ZoomIcon />
                </View>
            </BlurView>
        </Animated.View>
    );
}

export default InstructionsHomeScreen;