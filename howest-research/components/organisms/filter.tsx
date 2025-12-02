import { useState, useRef } from 'react';
import { View, StyleSheet, Modal, Pressable, TouchableOpacity, Text } from 'react-native';
import { FlashList } from "@shopify/flash-list";

import FilterButton from '../molecules/filterButton';
import Card from "../atoms/card";
import Touchable from "../atoms/touchable";
import FilterCard from '../molecules/filterCard';
import { StyledText } from "../atoms/styledComponents";

import data from '../../assets/data/structured-data.json';
import { getClusterName, getAllTransitionDomains, getFilteredProjects } from '@/scripts/getData';

import { Fonts } from "@/constants/theme";

const Filter = ({ activeFilters, setActiveFilters, setProjects }) => {
    const [visible, setVisible] = useState(false);
    const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const buttonRef = useRef(null);

    const transitionDomains = getAllTransitionDomains();
    const clusters = data.clusters;

    const toggleOverlay = () => {
        const filteredProjects = getFilteredProjects(activeFilters);
        setProjects(filteredProjects);
        setVisible(!visible);
    };


    const handleLayout = () => {
        if (buttonRef.current) {
            buttonRef.current.measureInWindow((x, y, width, height) => {
                setButtonPosition({ x, y, width, height });
            });
        }
    };

    const handleSelect = (item) => {
        console.log('Selected item:', item);

        const isAlreadySelected = activeFilters.some(filter => filter.id === item.id);
        if (isAlreadySelected) {
            // If already selected, remove it
            setActiveFilters(
                activeFilters.filter(filter => filter.id !== item.id)
            );
            return;
        }

        setActiveFilters(
            [...activeFilters, item]
        )
    };

    const clearFilters = () => {
        setActiveFilters([]);
    };

    return (
        <View style={styles.container}>
            <View ref={buttonRef} onLayout={handleLayout}>
                <FilterButton
                    onPress={toggleOverlay}
                    isActive={visible}
                    activeFilters={activeFilters}
                />
            </View>

            <Modal
                visible={visible}
                transparent={true}
                onRequestClose={toggleOverlay}
            >
                <View style={styles.modalContainer}>
                    <Pressable style={styles.backdrop} onPress={toggleOverlay} />

                    {/*-------------------- Filter button stays visible and clickable --------------------*/}
                    <View style={[styles.buttonContainer,
                    {
                        top: buttonPosition.y,
                        left: buttonPosition.x,
                        width: buttonPosition.width,
                        height: buttonPosition.height
                    }]}>
                        <FilterButton
                            onPress={toggleOverlay}
                            isActive={visible}
                            activeFilters={activeFilters}
                        />
                    </View>

                    {/*-------------------- Overlay content --------------------*/}
                    <View style={styles.overlayContent}>
                        <Card>

                            {/*-------------------- List of all selected filters --------------------*/}
                            <View>
                                <FlashList
                                    data={activeFilters}
                                    horizontal={true}
                                    renderItem={({ item, index }) => {
                                        console.log('Rendering active filter item:', item);
                                        return (
                                            <Touchable onPress={() => handleSelect(item)} icon={'close'} iconPosition={'after'} isActive={true}>{item.label}</Touchable>
                                        );
                                    }}
                                />

                                {
                                    activeFilters.length > 0 && (
                                        <>
                                            <StyledText hasGradient={true}>{activeFilters.length}</StyledText>
                                            <TouchableOpacity onPress={clearFilters}><StyledText>Alle filters wissen</StyledText></TouchableOpacity>
                                        </>
                                    )
                                }
                            </View>

                            {/*-------------------- Filters --------------------*/}
                            <View>
                                <View>
                                    <StyledText>Transitiedomeinen</StyledText>
                                    <StyledText>De 5 domeinen waarbinnen Howest Research onderzoek voert.</StyledText>
                                    <FlashList
                                        data={transitionDomains}
                                        horizontal={true}
                                        renderItem={({ item, index }) => {
                                            return (
                                                <FilterCard project={item} style={styles.card} onPress={() => handleSelect(item)} isActive={activeFilters.includes(item)} />
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
                                            const cluster = getClusterName(item.id);
                                            return (
                                                <FilterCard project={cluster} style={styles.card} onPress={() => handleSelect(cluster)} isActive={activeFilters.includes(cluster)} />
                                            )
                                        }

                                        }
                                    />
                                </View>
                            </View>

                            {/*-------------------- Buttons footer --------------------*/}
                            <TouchableOpacity onPress={clearFilters}><StyledText>Alle filters wissen</StyledText></TouchableOpacity>
                            <Touchable onPress={toggleOverlay} isActive={true}>Pas Filters toe</Touchable>
                        </Card>
                    </View>
                </View>
            </Modal >
        </View >
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
        top: 0,
        left: 0,
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center',
        margin: 32,
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