import { View, StyleSheet, TouchableOpacity } from "react-native";
import { StyledText } from "../atoms/styledComponents";

const AccordeonItem = ({ title, children, onPress, isVisible = false }) => {
    return (
        <View>
            <TouchableOpacity onPress={onPress}>
                <StyledText style={styles.title}>{title}</StyledText>
            </TouchableOpacity>

            {
                isVisible && <View>{children}</View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        backgroundColor: 'green'
    }
});

export default AccordeonItem;