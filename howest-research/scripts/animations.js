import { Easing, Keyframe } from 'react-native-reanimated';

//--- transitions ---//
const getEnteringFade = (duration = 300) => new Keyframe({
    0: {
        opacity: 0,
    },
    100: {
        opacity: 1,
        easing: Easing.inOut(Easing.quad),
    },
}).duration(duration);

const getExitingFade = (duration = 300) => new Keyframe({
    0: {
        opacity: 1,
    },
    100: {
        opacity: 0,
        easing: Easing.inOut(Easing.quad),
    },
}).duration(duration);

const getEnteringScale = (duration = 200) => new Keyframe({
    0: {
        transform: [{ scale: 0.8 }],
    },
    100: {
        transform: [{ scale: 1 }],
        easing: Easing.inOut(Easing.quad),
    },
}).duration(duration);

const getExitingScale = (duration = 200) => new Keyframe({
    0: {
        transform: [{ scale: 1 }],
    },
    100: {
        transform: [{ scale: 0.8 }],
        easing: Easing.inOut(Easing.quad),
    },
}).duration(duration);

const getEnteringFadeScale = (duration = 300) => new Keyframe({
    0: {
        opacity: 0,
        transform: [{ scale: 0.8 }],
    },
    100: {
        opacity: 1,
        transform: [{ scale: 1 }],
        easing: Easing.inOut(Easing.quad),
    },
}).duration(duration);

const getExitingFadeScale = (duration = 300) => new Keyframe({
    0: {
        opacity: 1,
        transform: [{ scale: 1 }],
    },
    100: {
        opacity: 0,
        transform: [{ scale: 0.8 }],
        easing: Easing.inOut(Easing.quad),
    },
}).duration(duration);

//--- clusters ---//

export { getEnteringFade, getExitingFade, getEnteringScale, getExitingScale, getEnteringFadeScale, getExitingFadeScale };
