//https://www.npmjs.com/package/react-native-qrcode-svg

import { BlurView } from 'expo-blur';
import { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { getEnteringFade, getEnteringScale, getExitingFade, getExitingScale } from '../../scripts/animations';

import CloseButton from '../atoms/closeButton';
import HowestResearchButton from '../molecules/howestResearchButton';
import HowestResearchContentCard from '../molecules/howestResearchContentCard';

const image = require('../../assets/images/logoHowestResearchRGB.png')

const HowestResearch = ({ children = null, page, setPage }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (page?.info === 'contact') {
            setVisible(true);
        }
    }, [page?.info]);

    const toggleOverlay = () => {
        console.log('TOGGLE OVERLAY');
        const newVisible = !visible;
        setVisible(newVisible);

        if (!newVisible && page?.info === 'contact') {
            setPage({ ...page, info: null });
        }
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
                    <Animated.View entering={getEnteringFade()} exiting={getExitingFade()} style={styles.overlayContent}>
                        <Animated.View entering={getEnteringScale()} exiting={getExitingScale()} style={{ flex: 1 }}>
                            <HowestResearchContentCard />
                        </Animated.View>

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