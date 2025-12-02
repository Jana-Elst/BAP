
import { TouchableOpacity, StyleSheet } from "react-native";
import { StyledText } from "./styledComponents";
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from "@/constants/theme";
import Ionicons from '@expo/vector-icons/Ionicons';

const Touchable = ({ onPress, isActive = false, icon = null, children, iconPosition = 'before', showIconOnly = false }) => {
    return (
        <LinearGradient
            colors={isActive ?[Colors.blue100, Colors.blue25, Colors.blue100] : [Colors.white, Colors.white, Colors.white]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            >
            <TouchableOpacity onPress={onPress} style={[styles.content, iconPosition === 'after' ? { flexDirection: 'row-reverse' } : null]}>
                {icon && <Ionicons name={icon} size={24} color={Colors.black} />}
                {showIconOnly && !isActive ? null : <StyledText>{children}</StyledText>}
            </TouchableOpacity>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    content: {
        flexDirection: 'row',
    },
});

export default Touchable;