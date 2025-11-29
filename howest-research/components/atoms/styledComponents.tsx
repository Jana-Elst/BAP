import { Fonts } from "@/constants/theme";
import { Text, StyleSheet } from "react-native";

export const StyledText = ({ children, style = null }) => {
    return <Text style={[styles.text, style]}> {children} </Text>
};

const styles = StyleSheet.create({
    text: {
        fontFamily: Fonts.sans.regular,
        fontSize: 20,
    },
});