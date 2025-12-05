import { StyleSheet, View } from 'react-native';
import { Colors } from "@/constants/theme";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const Card = ({ children, borderRadius = 30, onLayout = null, style = null, isActive = false }) => {
    return (
        <BlurView intensity={50} tint="light" style={[styles.blurContainer, { borderRadius: borderRadius }]}>
            {/* <ImageBackground source={backgroundImage} resizeMode='repeat' imageStyle={{opacity: 0.4}}> */}
            {/* <View style={styles.softLightOverlay} /> */}
            <View style={[styles.shadowContainer, { borderRadius: borderRadius }]}>
                <LinearGradient
                    style={[styles.card, { borderRadius: borderRadius }, { borderColor: isActive ? Colors.blue100 : Colors.white },style]}
                    colors={!isActive ? ['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.6)', 'rgba(224, 224, 224, 0.4)'] : ['rgba(68, 200, 245, 0.10)', 'rgba(68, 200, 245, 0.50)']}
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

    shadowContainer: {
        shadowColor: 'rgba(78, 78, 78, 0.2)',
        shadowOffset: { width: 0, height: 3.38 },
        shadowOpacity: 0.2,
        shadowRadius: -1.915,
    },

    card: {
        borderWidth: 2,
        // borderColor: Colors.white,
    }
});

export default Card;