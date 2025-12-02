import { View, StyleSheet } from "react-native";
import { StyledText } from "../atoms/styledComponents";
import Card from "../atoms/card";

const Info = ({project}) => {
    return (
        <View style={styles.card}>
            <View>
                <StyledText>Dit is een korte teaser van ongeveer 8 woorden.</StyledText>
                <StyledText>{project.abstract}</StyledText>
                <StyledText>LOGOS</StyledText>
            </View>

            <View>
                <StyledText>{project.researchGroup.label}</StyledText>
                <StyledText>{project.contactPerson}</StyledText>
                <StyledText>{project.startDate} - {project.endDate}</StyledText>
                <StyledText>Links</StyledText>
            </View>

            <View>
                <StyledText>Meer weten?</StyledText>
                <StyledText>Sla dit project op voor later of contacteer ons</StyledText>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        marginHorizontal: 16,
        backgroundColor: 'yellow'

    }
});

export default Info;