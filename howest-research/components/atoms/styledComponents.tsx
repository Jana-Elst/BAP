import { Fonts } from "@/constants/theme";
import { Text, StyleSheet } from "react-native";

export const StyledText = (props) => {
    return <Text style={[styles.text, props.style]}> {props.children} </Text>
};

const styles = StyleSheet.create({
    text: {
        fontFamily: Fonts.sans.regular,
        fontSize: 20,
    },
});