import { Colors, Fonts } from "@/constants/theme";
import { Text, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

export const StyledText = ({ children, style = null, hasGradient = false }) => {
    if (hasGradient) {
        return (
            <LinearGradient
                colors={[Colors.blue100, Colors.blue25, Colors.blue100]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <Text style={[styles.text, style]}> {children} </Text>
            </LinearGradient>)
    } else {
        return <Text style={[styles.text, style]}> {children} </Text>
    }
};

const styles = StyleSheet.create({
    text: {
        fontFamily: Fonts.sans.regular,
        fontSize: 20,
    },
});