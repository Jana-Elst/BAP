import { Colors, Fonts } from "@/constants/theme";
import { Image } from 'expo-image';
import Card from "../atoms/card";

import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { ParagraphLarge, ParagraphSmall, StyledText, SubTitleSmall} from '../atoms/styledComponents';

const image = require('../../assets/images/logoHowestResearchRGB.png')

const QrCode = ({ project }) => {
    return (
        <View style={{ flexDirection: 'row', gap: 40, marginTop: 16, flex: 1, alignItems: 'center' }}>
            <Card 
            style={{ borderColor: 'transparent', paddingHorizontal: 24, paddingVertical: 40, maxWidth: '372', gap: 24, justifyContent: 'center', alignItems: 'center' }}
            fill={false}
            isActive={true}
                gradientColors={[Colors[project.color + '10'], Colors[project.color + '80']]}
            >
                <Image
                    style={{ width: 230, height: 34 }}
                    source={image}
                    contentFit="contain"
                />
                <QRCode
                    value="https://www.figma.com/proto/YKxkw8cVjng9b7Z4bi0o3F/phone-userTest?page-id=0%3A1&node-id=1-1272&viewport=223%2C63%2C0.28&t=c9BRBTLy78mc7Ey8-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=1%3A1736"
                    backgroundColor='transparent'
                    size={270}
                />
                <ParagraphSmall style={{ textAlign: 'center' }}>Scan de QR code om dit project op te slaan of contact op te nemen</ParagraphSmall>
            </Card>
            <View style={{ flex: 1, gap: 32 }}>
                <View style={{ gap: 4 }}>
                    <SubTitleSmall>Project opslaan</SubTitleSmall>
                    <StyledText>Interesse om hier later nog eens op terug te kijken? Open dit onderzoek op je gsm en sla het op voor later.</StyledText>
                </View>
                <View style={{ gap: 4 }}>
                    <SubTitleSmall>Gratis adviesgesprek</SubTitleSmall>
                    <StyledText>Nieuwsgierig naar hoe dit onderzoek ook voor jouw bedrijf een verschil kan maken? Neem contact op met onze projectleiders en onderzoekers voor een gratis adviesgesprek.</StyledText>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
});

export default QrCode;