import Card from "../atoms/card";
import { Colors, Fonts } from "@/constants/theme";

import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { ParagraphSmall, StyledText, SubTitle } from '../atoms/styledComponents';

const Info = ({ project }) => {
    const abstractSplitted = project.abstract
        .split('</p>')
        .map((text: string) => text.replace(/<p[^>]*>/g, '').trim())
        .filter((text: string) => text.length > 0);

    return (
        <View style={{ flexDirection: 'row', gap: 40 }} fill={true} borderRadius={80}>
            <View style={{ flexDirection: 'column', gap: 18, width: '350' }}>
                <View>
                    <SubTitle>Dit is een korte teaser van ongeveer 8 woorden.</SubTitle>
                    <View style={{ gap: 8 }}>
                        {abstractSplitted.map((item, index) => (
                            <StyledText key={index}>{item}</StyledText>
                        ))}
                    </View>
                    <StyledText>LOGOS</StyledText>
                </View>
            </View>
            <View style={{ flex: 1 }}>
                <View>
                    <StyledText>{project.researchGroup.label}</StyledText>
                    <StyledText>{project.contactPerson}</StyledText>
                    <StyledText>{project.startDate} - {project.endDate}</StyledText>
                    <StyledText>Links</StyledText>
                </View>

                <Card style={{ padding: 24, gap: 12, alignItems: 'center', borderWidth: 1, flexDirection: 'row' }}>
                    <View style={{flex: 1, gap: 4}}>
                        <StyledText>Meer weten?</StyledText>
                        <ParagraphSmall style={{ fontFamily: Fonts.sans.bold }}>Contacteer ons of sla dit project op voor later</ParagraphSmall>
                    </View>
                    <QRCode
                        value="www.howest.be/nl/onderzoek-aan-howest"
                        backgroundColor='transparent'
                        size={130}
                    />
                </Card>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
});

export default Info;