import { FlashList } from "@shopify/flash-list";
import { BlurView } from 'expo-blur';
import { useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

import Card from "../atoms/card";
import { Paragraph, ParagraphLarge, StyledText, SubTitleSmall } from "../atoms/styledComponents";
import Touchable from "../atoms/touchable";
import FilterButton from '../molecules/filterButton';
import FilterCard from '../molecules/filterCard';

import { Colors } from '@/constants/theme';
import { getAllTransitionDomains, getClusterName, getFilteredProjects } from '@/scripts/getData';
import data from '../../assets/data/structured-data.json';


const Filter = ({ activeFilters, setActiveFilters, setProjects }) => {
    const [visible, setVisible] = useState(false);
    const buttonRef = useRef(null);

    const transitionDomains = getAllTransitionDomains();
    const clusters = data.clusters;

    const toggleOverlay = () => {
        const filteredProjects = getFilteredProjects(activeFilters);
        setProjects(filteredProjects);
        setVisible(!visible);
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
            <View ref={buttonRef}>
                <FilterButton
                    onPress={toggleOverlay}
                    activeFilters={activeFilters}
                />
            </View>

            <Modal
                visible={visible}
                transparent={true}
                onRequestClose={toggleOverlay}
            >
                <View style={styles.modalContainer}>
                    <BlurView intensity={35} tint="dark" style={StyleSheet.absoluteFill} />
                    <Pressable style={StyleSheet.absoluteFill} onPress={toggleOverlay} />

                    {/*-------------------- Overlay content --------------------*/}
                    <View pointerEvents="box-none" style={styles.overlayContent}>
                        <Card style={styles.card} borderRadius={80}>
                            <View style={styles.header}>
                                <Touchable
                                    onPress={toggleOverlay}
                                    isActive={activeFilters.length > 0 ? false : true}
                                    icon={'arrow-back-outline'}
                                    showIconOnly={true}
                                    styleButton={{ paddingVertical: 16, paddingHorizontal: 20 }}>
                                </Touchable>
                                {
                                    activeFilters.length > 0 ?
                                        <>
                                            <FlashList
                                                data={activeFilters}
                                                horizontal={true}
                                                estimatedItemSize={100}
                                                ItemSeparatorComponent={() => (
                                                    <View style={{ width: 12 }} />
                                                )}
                                                renderItem={({ item, index }) => {
                                                    return (
                                                        <Touchable
                                                            onPress={() => handleSelect(item)}
                                                            icon={'close'}
                                                            iconPosition={'after'}
                                                            isActive={true}
                                                            styleButton={{ paddingVertical: 8, paddingHorizontal: 20 }}
                                                            styleGradient={{ alignSelf: 'center' }}><Paragraph>{item.label}</Paragraph></Touchable>
                                                    );
                                                }}
                                            />

                                            {
                                                activeFilters.length > 0 && (
                                                    <TouchableOpacity onPress={clearFilters}><StyledText style={{ borderBottomWidth: 2, borderBottomColor: Colors.black }}>Alle filters wissen</StyledText></TouchableOpacity>
                                                )
                                            }
                                        </> :
                                        <StyledText>Geen actieve filters. Selecteer één of meerdere filters.</StyledText>
                                }
                            </View>

                            {/*-------------------- Filters --------------------*/}
                            <View style={styles.filterContainer}>
                                <View>
                                    <View style={{ paddingLeft: 64 }}>
                                        <SubTitleSmall>Transitiedomeinen</SubTitleSmall>
                                        <StyledText style={styles.filterDescription}>De 5 domeinen waarbinnen Howest Research onderzoek voert.</StyledText>
                                    </View>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20, paddingHorizontal: 64 }}>
                                        {transitionDomains.map((item, index) => (
                                            <FilterCard
                                                key={index}
                                                filter={'domain'}
                                                project={item}
                                                onPress={() => handleSelect(item)}
                                                isActive={activeFilters.includes(item)}
                                            />
                                        ))}
                                    </View>
                                </View>

                                <View>
                                    <View style={{ paddingLeft: 64 }}>
                                        <SubTitleSmall>Clusters</SubTitleSmall>
                                        <StyledText style={styles.filterDescription}>13 subgroeperingen gelinkt aan de verschillende opleidingsclusters</StyledText>
                                    </View>
                                    <FlashList
                                        data={clusters.filter(item => {
                                            const cluster = getClusterName(item.id);
                                            return cluster.formattedName !== 'clusteroverschrijdend';
                                        })}
                                        horizontal={true}
                                        showsHorizontalScrollIndicator={false}
                                        contentContainerStyle={{ paddingHorizontal: 64 }}
                                        ItemSeparatorComponent={() => (
                                            <View style={{ width: 20 }} />
                                        )}
                                        renderItem={({ item, index }) => {
                                            const cluster = getClusterName(item.id);
                                            return (
                                                <FilterCard
                                                    filter={'cluster'}
                                                    project={cluster}
                                                    onPress={() => handleSelect(cluster)}
                                                    isActive={activeFilters.includes(cluster)} />
                                            )
                                        }

                                        }
                                    />
                                </View>
                            </View>

                            {/*-------------------- Buttons footer --------------------*/}
                            <View style={{ gap: 16, marginTop: 28, alignItems: 'center', justifyContent: 'center' }}>
                                {
                                    activeFilters.length > 0 ? (
                                        <TouchableOpacity onPress={clearFilters}><ParagraphLarge style={{ borderBottomWidth: 2 }}>Alle filters wissen</ParagraphLarge></TouchableOpacity>
                                    ) : (
                                        <ParagraphLarge style={{ borderBottomWidth: 3, borderBottomColor: 'transparent' }}> </ParagraphLarge>
                                    )
                                }
                                <Touchable onPress={toggleOverlay} isActive={activeFilters.length > 0 ? true : false} styleButton={{ paddingHorizontal: 20, paddingVertical: 16 }} styleGradient={{ alignSelf: 'center' }}>Pas filters toe</Touchable>
                            </View>
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

    header: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 16,
        paddingHorizontal: 64,
        marginBottom: 8,
    },

    overlayContent: {
        top: 0,
        left: 0,
        flex: 1,
        justifyContent: 'center',
        margin: 32,
    },

    card: {
        paddingTop: 55,
        paddingBottom: 34,
        gap: 28,
        borderWidth: 3,
    },

    activeFilterCount: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 100,
    },

    filterContainer: {
        gap: 32,
    },

    filterDescription: {
        marginBottom: 12,
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