//https://www.npmjs.com/package/react-native-qrcode-svg

import { useState } from 'react';
import { Modal, Pressable, View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import QRCode from 'react-native-qrcode-svg';

import HowestResearchButton from '../molecules/howestResearchButton';
import Card from '../atoms/card';
import { StyledText } from '../atoms/styledComponents';
import AccordeonHowestResearch from '../molecules/accordeonHowestResearch';
import CloseButton from '../atoms/closeButton';

const image = require('../../assets/images/logoHowestResearchRGB.png')

const HowestResearch = () => {
    const [visible, setVisible] = useState(false);

    const toggleOverlay = () => {
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
                    <Pressable style={styles.backdrop} onPress={toggleOverlay} />

                    {/*-------------------- Overlay content --------------------*/}
                    <View style={styles.overlayContent}>
                        <Card>
                            <View>
                                <Card>
                                    <Image
                                        style={styles.image}
                                        source={image}
                                        contentFit="contain"
                                    />
                                </Card>
                                <Card>
                                    <StyledText>Geïnteresseerd in één van onze onderzoeksprojecten?</StyledText>
                                    <StyledText>Neem contact op</StyledText>
                                    <QRCode
                                        value="www.howest.be/nl/onderzoek-aan-howest"
                                        backgroundColor='transparent'
                                    />
                                    <StyledText>www.howest.be/nl/onderzoek-aan-howest</StyledText>
                                </Card>
                            </View>
                            <View>
                                <View>
                                    <StyledText>Innovatief en toekomstgericht onderzoek dat klaar is om ingezet te worden.</StyledText>
                                    <StyledText>Howest University of Applied Sciences is more than a place where young people come to learn. As a knowledge institution, one of our main tasks is to act as a research and service partner to organisations and businesses in West-Flanders – and of course beyond.</StyledText>
                                </View>
                                <AccordeonHowestResearch />
                            </View>
                        </Card>

                        <CloseButton onPress={toggleOverlay}>Sluit</CloseButton>
                    </View>
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

    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    overlayContent: {
        top: 0,
        left: 0,
        flex: 1,
        margin: 32,
    },

    image: {
        width: 200,
        height: 60,
    },
});

export default HowestResearch;