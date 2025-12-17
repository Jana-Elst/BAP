import { Colors } from "@/constants/theme";
import { Image } from 'expo-image';
import Card from "../atoms/card";

import { StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { ParagraphSmall, StyledText, SubTitleSmall } from '../atoms/styledComponents';

const image = require('../../assets/images/logoHowestResearchRGB.png')

const QrCode = ({ project }) => {
    return (
        <View style={{ flexDirection: 'row', gap: 40, marginTop: 16, flex: 1, alignItems: 'center', marginHorizontal: 64 }}>
            <Card
                style={{ borderColor: Colors[project.color+'100'], borderWidth: 1, paddingHorizontal: 24, paddingVertical: 40, maxWidth: '372', gap: 24, justifyContent: 'center', alignItems: 'center' }}
                fill={false}
                isActive={true}
                animatedView={false}
                gradientColors={[
                    Colors['gradient' + (project.color.charAt(0).toUpperCase() + project.color.slice(1)) + 'DarkStart'],
                    Colors['gradient' + (project.color.charAt(0).toUpperCase() + project.color.slice(1)) + 'DarkEnd']
                ]}
            >
                <Image
                    style={{ width: 230, height: 34 }}
                    source={image}
                    contentFit="contain"
                />
                <QRCode
                    value="https://www.figma.com/proto/3RQlsql4eHP4QYYBqJkySk/BAP?page-id=1419%3A16778&node-id=1419-16915&viewport=282%2C50%2C0.28&t=GP100ibcvk2JcslE-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=1419%3A16915"
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