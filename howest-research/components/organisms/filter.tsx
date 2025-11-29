import { useState, useRef } from 'react';
import { View, StyleSheet, Modal, Pressable, TouchableOpacity, Text } from 'react-native';
import { FlashList } from "@shopify/flash-list";
import { Image } from 'expo-image';

import FilterButton from '../molecules/filterButton';
import Card from "../atoms/card";
import Touchable from "../atoms/touchable";

import { StyledText } from "../atoms/styledComponents";
import data from '../../assets/data/structured-data.json';
import { getClusterName, getAllTransitionDomains } from '@/scripts/getData';

import ImageProject1 from '../../assets/images/visualizationsProjects/composition.png';
import { Colors, Fonts } from "@/constants/theme";

const Filter = () => {
    const [visible, setVisible] = useState(true);
    const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const buttonRef = useRef(null);

    const transitionDomains = getAllTransitionDomains();
    const clusters = data.clusters;

    const toggleOverlay = () => {
        setVisible(!visible);
    };


    const handleLayout = () => {
        if (buttonRef.current) {
            buttonRef.current.measureInWindow((x, y, width, height) => {
                setButtonPosition({ x, y, width, height });
            });
        }
    };

    const handleSelect = () => { };

    return (
        <View style={styles.container}>
            <View ref={buttonRef} onLayout={handleLayout}>
                <FilterButton
                    onPress={toggleOverlay}
                    isActive={visible}
                />
            </View>

            <Modal
                visible={visible}
                transparent={true}
                onRequestClose={toggleOverlay}
            >
                <View style={styles.modalContainer}>
                    <Pressable style={styles.backdrop} onPress={toggleOverlay} />

                    {/* Filter button stays visible and clickable */}
                    <View style={[styles.buttonContainer, { top: buttonPosition.y, left: buttonPosition.x, width: buttonPosition.width, height: buttonPosition.height }]}>
                        <FilterButton
                            onPress={toggleOverlay}
                            isActive={visible}
                        />
                    </View>

                    {/* Overlay content */}
                    <View style={styles.overlayContent}>
                        <Card style={styles.card}>
                            <View>
                                <StyledText>Transitiedomeinen</StyledText>
                                <StyledText>De 5 domeinen waarbinnen Howest Research onderzoek voert.</StyledText>
                                <FlashList
                                    data={transitionDomains}
                                    horizontal={true}
                                    renderItem={({ item, index }) => {
                                        console.log('ITEM', item);
                                        return (
                                            <TouchableOpacity onPress={handleSelect} style={styles.container}>
                                                <Card style={styles.card}>
                                                    <View>
                                                        <StyledText style={styles.title}>{item.label}</StyledText>
                                                    </View>
                                                    <View style={styles.imageContainer}>
                                                        <Image
                                                            style={styles.image}
                                                            source={ImageProject1}
                                                            contentFit="contain"
                                                        />
                                                    </View>
                                                </Card>
                                                {/* <View style={styles.radialGradientContainer}>
                                                    <RadialGradientComponent width={containerSize.width} height={containerSize.height} color={projectInfo.color} />
                                                </View> */}
                                            </TouchableOpacity>
                                        );
                                    }

                                    }
                                />
                            </View>

                            <View>
                                <StyledText>Clusters</StyledText>
                                <StyledText>13 subgroeperingen gelinkt aan de verschillende opleidingsclusters</StyledText>
                                <FlashList
                                    data={clusters}
                                    horizontal={true}
                                    renderItem={({ item, index }) => {
                                        const clusterName = getClusterName(item.id);
                                        return (
                                            <Card style={styles.card}>
                                                <View style={styles.imageContainer}>
                                                    <Image
                                                        style={styles.image}
                                                        source={ImageProject1}
                                                        contentFit="contain"
                                                    />
                                                </View>
                                                <View>
                                                    <StyledText style={styles.title}>{clusterName.label}</StyledText>
                                                </View>
                                            </Card>
                                        );
                                    }

                                    }
                                />
                            </View>

                            <TouchableOpacity onPress={toggleOverlay}><StyledText>Alle filters wissen</StyledText></TouchableOpacity>
                            <Touchable onPress={toggleOverlay} isActive={true}>Pas Filters toe</Touchable>
                        </Card>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

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

    buttonContainer: {
        position: 'absolute',
        zIndex: 10,
    },

    overlayContent: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    title: {
        fontFamily: Fonts.rounded.light,
        textAlign: 'center',
    },

    imageContainer: {
        padding: 16,

        width: '100%',
        height: 200,
    },

    image: {
        width: '100%',
        height: '100%',
    },
});

export default Filter;