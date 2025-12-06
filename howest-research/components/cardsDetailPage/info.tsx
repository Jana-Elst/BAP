import { StyleSheet, View } from "react-native";
import { StyledText } from "../atoms/styledComponents";

const Info = ({ project }) => {
    const abstract = project.abstract.replace(/<p>]+>/g, '');
    const abstractSplitted = abstract.split('</p>');

    return (
        <View style={styles.card}>
            <View>
                <StyledText>Dit is een korte teaser van ongeveer 8 woorden.</StyledText>
                {abstractSplitted.map((item, index) => (
                    <StyledText key={index}>{item}</StyledText>
                ))}
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
    }
});

export default Info;