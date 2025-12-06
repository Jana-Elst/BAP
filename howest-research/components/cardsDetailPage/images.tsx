import { View, StyleSheet } from "react-native";
import { StyledText } from "../atoms/styledComponents";
import Card from "../atoms/card";

const Images = () => {
    return (
        <View style={styles.card}>
                <StyledText>TransitieDomein</StyledText>
                <StyledText>HIER KOMEN DE FOTO'S</StyledText>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
    }
});

export default Images;