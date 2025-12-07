import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import data from '../../assets/data/structured-data.json';
import CloseButton from '../atoms/closeButton';
import DetailKeyword from '../pages/detailKeyword';
import DetailPage from '../pages/detailPage';
import HomeScreen from '../pages/homeScreen';
import Touchable from '../atoms/touchable';

export default function Ipad({ page, setPage }) {
    console.log('page', page)

    const [visible, setVisible] = useState(false);
    const [activeFilters, setActiveFilters] = useState([]);
    const [projects, setProjects] = useState(data.projects);


    const isVisible = (page) => {
        if (page === 'discover' || page === 'gallery' || page === 'filter') {
            setVisible(false);
        } else {
            setVisible(true);
        }
    };

    const handleClosePopUp = (setPage, page) => {
        console.log('CLOSE POP UP', page);
        setPage({
            page: page.previousPages[0].page,
            id: null,
            previousPages: [],
            info: {}
        })
        isVisible(page.previousPages[0].page);
    }

    const handleBack = () => {
        setPage({
            page: page.previousPages[page.previousPages.length - 1].page,
            id: page.previousPages[page.previousPages.length - 1].id,
            previousPages: page.previousPages.slice(0, -1),
            info: page.previousPages[page.previousPages.length - 1].info
        })
        isVisible(page.previousPages[page.previousPages.length - 1].page);
    }

    return (
        <View style={styles.container}>
            <HomeScreen page={page} setPage={setPage} activeFilters={activeFilters} setActiveFilters={setActiveFilters} projects={projects} setProjects={setProjects} setVisible={setVisible} />
            {/* <DiscoverScreen projects={projects} page={page} setPage={setPage} isVisible={isVisible} /> */}

            {/*--------------- Detailpage overlays --------------------*/}
            <Modal
                visible={visible}
                transparent={true}
                onRequestClose={() => handleClosePopUp(setPage, page)}
            >
                <View style={{ flex: 1 }}>
                    <BlurView intensity={35} tint="dark" style={StyleSheet.absoluteFill} />
                    <Pressable style={StyleSheet.absoluteFill} onPress={() => handleClosePopUp(setPage, page)} />

                    {/*-------------------- Overlay content --------------------*/}
                    <View style={{ flex: 1, gap: 24 }}>
                        <View style={{ flexDirection: 'row' }} fill={true} borderRadius={80}>
                            {
                                page.previousPages.length > 1 &&
                                <Touchable
                                    onPress={handleBack}
                                    icon={'arrow-back-outline'}
                                    isActive={true}
                                    showIconOnly={true}
                                    styleGradient={{position: 'absolute', left: 48, top: 78, zIndex: 1}}
                                    styleButton={{ paddingVertical: 16, paddingHorizontal: 20 }}>
                                </Touchable>
                            }

                            {
                                page.page === 'detailResearch' &&
                                (
                                    <DetailPage page={page} setPage={setPage} />
                                )
                            }
                            {
                                page.page === 'detailKeyword' &&
                                (
                                    <DetailKeyword page={page} setPage={setPage} setVisible={setVisible} />
                                )
                            }
                        </View>

                        <CloseButton onPress={() => handleClosePopUp(setPage, page)}>Sluit</CloseButton>
                    </View>
                </View>
            </Modal >
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    homeScreen: {
        flex: 1,
        justifyContent: 'space-between',
    },

    overlay: {
        width: '100%',
        height: '100%',
    },

    overlayContent: {
        // backgroundColor: 'green',
        flex: 1,
    }
});