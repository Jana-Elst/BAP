//https://www.npmjs.com/package/react-native-qrcode-svg

import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, Easing } from 'react-native-reanimated';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import QRCode from 'react-native-qrcode-svg';

import Card from '../atoms/card';
import CloseButton from '../atoms/closeButton';
import { ParagraphLarge, ParagraphSmall, StyledText, SubTitleSmall } from '../atoms/styledComponents';
import AccordeonHowestResearch from '../molecules/accordeonHowestResearch';
import HowestResearchButton from '../molecules/howestResearchButton';

const image = require('../../assets/images/logoHowestResearchRGB.png')

const HowestResearch = () => {
    const [visible, setVisible] = useState(false);

    const entering = FadeIn.duration(250).easing(Easing.inOut(Easing.quad));
    const exiting = FadeOut.duration(250).easing(Easing.inOut(Easing.quad));

    const toggleOverlay = () => {
        console.log('TOGGLE OVERLAY');
        setVisible(!visible);
    };

    return (
        <View>
            <HowestResearchButton onPress={toggleOverlay} />

            <Modal
                visible={visible}
                transparent={true}
                onRequestClose={toggleOverlay}
            >
                <View style={styles.modalContainer}>
                    <BlurView intensity={35} tint="dark" style={StyleSheet.absoluteFill} />
                    <Pressable style={StyleSheet.absoluteFill} onPress={toggleOverlay} />

                    {/*-------------------- Overlay content --------------------*/}
                    <Animated.View entering={entering} exiting={exiting} style={styles.overlayContent}>
                        <Card style={{ flexDirection: 'row', gap: 40, padding: 64 }} fill={true} borderRadius={80}>
                            <View style={{ flexDirection: 'column', gap: 18, width: '480' }}>
                                <Card
                                    isActive={true}
                                    style={{ borderColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}
                                    fill={true}
                                >
                                    <Image
                                        style={styles.image}
                                        source={image}
                                        contentFit="contain"
                                    />
                                </Card>
                                <Card style={{ paddingHorizontal: 64, paddingVertical: 40, gap: 16, alignItems: 'center', borderWidth: 1 }}>
                                    <ParagraphLarge style={{ textAlign: 'center' }}>Geïnteresseerd in één van onze onderzoeksprojecten?</ParagraphLarge>
                                    <SubTitleSmall style={{ textAlign: 'center' }}>Neem contact op</SubTitleSmall>
                                    <QRCode
                                        value="https://www.figma.com/proto/YKxkw8cVjng9b7Z4bi0o3F/phone-userTest?page-id=0%3A1&node-id=1-1736&viewport=223%2C63%2C0.28&t=c9BRBTLy78mc7Ey8-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=1%3A1736"
                                        backgroundColor='transparent'
                                        size={275}
                                    />
                                    <ParagraphSmall style={{ textAlign: 'center' }}>www.howest.be/nl/onderzoek-aan-howest</ParagraphSmall>
                                </Card>
                            </View>
                            <View style={{ flex: 1, gap: 32 }}>
                                <View style={{ gap: 12 }}>
                                    <SubTitleSmall>Innovatief en toekomstgericht onderzoek dat klaar is om ingezet te worden.</SubTitleSmall>
                                    <StyledText>Howest University of Applied Sciences is more than a place where young people come to learn. As a knowledge institution, one of our main tasks is to act as a research and service partner to organisations and businesses in West-Flanders – and of course beyond.</StyledText>
                                </View>
                                <AccordeonHowestResearch />
                            </View>
                        </Card>

                        <Pressable onPress={toggleOverlay}>
                            <CloseButton onPress={toggleOverlay}>Sluit</CloseButton>
                        </Pressable>

                    </Animated.View>
                </View>
            </Modal >
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },

    modalContainer: {
        flex: 1,
    },

    overlayContent: {
        top: 0,
        left: 0,
        flex: 1,
        margin: 32,
        gap: 20,
    },

    image: {
        width: 380,
        height: 55,
    },
});

export default HowestResearch;