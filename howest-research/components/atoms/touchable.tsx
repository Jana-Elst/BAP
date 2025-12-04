
import { TouchableOpacity, StyleSheet } from "react-native";
import { ParagraphLarge } from "./styledComponents";
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from "@/constants/theme";
import Ionicons from '@expo/vector-icons/Ionicons';

const Touchable = ({ onPress, isActive = false, icon = null, children, iconPosition = 'before', showIconOnly = false, styleButton = null, styleGradient = null, styleText = null }) => {
    return (
        <LinearGradient
            colors={isActive ? [Colors.blue100, Colors.blue25, Colors.blue100] : [Colors.white, Colors.white, Colors.white]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.gradient, styleGradient]}
        >
            <TouchableOpacity onPress={onPress} style={[styles.content, styleButton, iconPosition === 'after' ? { flexDirection: 'row-reverse' } : null]}>
                {icon && <Ionicons name={icon} size={24} color={Colors.black} />}
                {showIconOnly && !isActive ? null : <ParagraphLarge style = {styleText}>{children}</ParagraphLarge>}
            </TouchableOpacity>
        </LinearGradient>
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
    },
});

export default Touchable;