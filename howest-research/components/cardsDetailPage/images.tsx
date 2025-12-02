import { View, StyleSheet } from "react-native";
import { StyledText } from "../atoms/styledComponents";
import Card from "../atoms/card";

const Images = () => {
    return (
        <View style={styles.card}>
            <Card>
                <StyledText>Title</StyledText>
                <StyledText>TransitieDomein</StyledText>
                <StyledText>HIER KOMEN DE FOTO'S</StyledText>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        marginHorizontal: 16,
        backgroundColor: 'red'
    }
});

export default Images;