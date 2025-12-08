import { Colors, Fonts } from "@/constants/theme";
import { Image } from 'expo-image';
import Card from "../atoms/card";

import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { ParagraphBold, ParagraphSmall, StyledText, SubTitle } from '../atoms/styledComponents';

import Logos from '../../assets/images/logos.png';

const Info = ({ project }) => {
    const abstractSplitted = project.abstract
        .split('</p>')
        .map((text: string) => text.replace(/<p[^>]*>/g, '').trim())
        .filter((text: string) => text.length > 0);

    return (
        <View style={{ flexDirection: 'row', gap: 40, marginTop: 16, flex: 1 }}>
            <View style={{ flexDirection: 'column', gap: 18, width: '350' }}>
                <View style={{ gap: 18, flex: 1 }}>
                    <SubTitle>Dit is een korte teaser van ongeveer 8 woorden.</SubTitle>
                    <View style={{ gap: 8 }}>
                        {abstractSplitted.map((item, index) => (
                            <StyledText key={index}>{item}</StyledText>
                        ))}
                    </View>
                </View>
                <Image
                    source={Logos}
                    alt='logos'
                    // style={styles.image}
                    contentFit="contain"
                    contentPosition="bottom"
                    style={{ flex: 1 }}
                />
            </View>
            <View style={{ flex: 1, gap: 16 }}>
                <View style={{ gap: 12, borderWidth: 2, borderColor: Colors.white, borderRadius: 30, paddingVertical: 32, paddingHorizontal: 24, flex: 1 }}>
                    <View style={{ gap: 2 }}>
                        <ParagraphBold>Onderzoeksgroep</ParagraphBold>
                        <StyledText>{project.researchGroup.label}</StyledText>
                    </View>

                    <View style={{ gap: 2 }}>
                        <ParagraphBold>ProjectLeider</ParagraphBold>
                        <ParagraphSmall>{project.contactPerson}</ParagraphSmall>
                        <ParagraphSmall>{project.contactPersonEmail}</ParagraphSmall>
                    </View>

                    <View style={{ gap: 2 }}>
                        <ParagraphBold>Projectduur</ParagraphBold>
                        <ParagraphSmall>{project.startDate} - {project.endDate}</ParagraphSmall>
                    </View>

                    <View style={{ gap: 2 }}>
                        <ParagraphBold>Links</ParagraphBold>
                    </View>
                </View>

                <Card style={{ padding: 24, gap: 12, alignItems: 'center', borderWidth: 1, flexDirection: 'row' }}>
                    <View style={{ flex: 1, gap: 4 }}>
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