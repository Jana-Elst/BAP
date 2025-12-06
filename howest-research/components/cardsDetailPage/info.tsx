import { StyleSheet, View } from "react-native";
import { StyledText, SubTitle } from "../atoms/styledComponents";

const Info = ({ project }) => {
    const abstractSplitted = project.abstract
        .split('</p>')
        .map((text: string) => text.replace(/<p[^>]*>/g, '').trim())
        .filter((text: string) => text.length > 0);

    return (
        <View style={{ flexDirection: 'row', gap: 48}}>
            <View>
                <SubTitle>Dit is een korte teaser van ongeveer 8 woorden.</SubTitle>
                <View style={{ gap: 8 }}>
                    {abstractSplitted.map((item, index) => (
                        <StyledText key={index}>{item}</StyledText>
                    ))}
                </View>
                <StyledText>LOGOS</StyledText>
            </View>

            <View style={{ flexDirection: 'column', backgroundColor: 'green' }}>
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
        </View>
    );
}

const styles = StyleSheet.create({
});

export default Info;