import { ImageBackground, StyleSheet, View } from 'react-native';
import { Colors, Fonts } from "@/constants/theme";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import backgroundImage from '../../assets/images/textureCard.png';

const Card = ({ children, borderRadius = 30, onLayout = null, style = null }) => {
    return (
        <BlurView intensity={50} tint="light" style={[styles.blurContainer, { borderRadius: borderRadius }]}>
            {/* <ImageBackground source={backgroundImage} resizeMode='repeat' imageStyle={{opacity: 0.4}}> */}
                {/* <View style={styles.softLightOverlay} /> */}
                <View style={[styles.shadowContainer, { borderRadius: borderRadius }]}>
                    <LinearGradient
                        style={[styles.card, style]}
                        colors={['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.6)', 'rgba(224, 224, 224, 0.4)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0.6, y: 1 }}
                        onLayout={onLayout}
                    >
                        {children}
                    </LinearGradient>
                </View>
            {/* </ImageBackground> */}
        </BlurView>
    )
}

const styles = StyleSheet.create({
    blurContainer: {
        overflow: 'hidden',
    },

    softLightOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#F0F0F0',
        opacity: 0.5,
    },

    shadowContainer: {
        shadowColor: 'rgba(78, 78, 78, 0.2)',
        shadowOffset: { width: 0, height: 3.38 },
        shadowOpacity: 0.2,
        shadowRadius: -1.915,
    },

    card: {
        borderWidth: 2,
        borderColor: Colors.white,
        borderRadius: 30,
    }
});

export default Card;