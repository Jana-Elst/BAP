import { View, StyleSheet } from "react-native";
import { StyledText } from "../atoms/styledComponents";
import Card from "../atoms/card";

const QRCode = () => {
    return (
        <View style={styles.card}>
            <Card>
                <StyledText>Title</StyledText>
                <StyledText>TransitieDomein</StyledText>
                <StyledText>HIER KOMT DE QR CODE</StyledText>
            </Card>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        marginHorizontal: 16,
        backgroundColor: 'pink'
    }
});

export default QRCode;