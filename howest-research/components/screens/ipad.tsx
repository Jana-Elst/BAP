import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Reanimated, { useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import data from '../../assets/data/structured-data.json';
import CloseButton from '../atoms/closeButton';
import Touchable from '../atoms/touchable';
import DetailKeyword from '../pages/detailKeyword';
import DetailPage from '../pages/detailPage';
import HomeScreen from '../pages/homeScreen';

const AnimatedBlurView = Reanimated.createAnimatedComponent(BlurView);

const Ipad = ({ page, setPage }) => {
    const [visible, setVisible] = useState(false);
    const [activeFilters, setActiveFilters] = useState([]);
    const [projects, setProjects] = useState(data.projects);
    const intensity = useSharedValue(0);
    useEffect(() => {
        const isHidden = (page.page === 'discover' || page.page === 'gallery' || page.page === 'filter');
        setVisible(!isHidden);
        if (isHidden) {
            intensity.value = withTiming(0, { duration: 500 });
        } else {
            intensity.value = withDelay(400, withTiming(35, { duration: 500 }));
        }
    }, [page.page]);

    const handleClosePopUp = (setPage, page) => {
        setPage({
            ...page,
            page: page.previousPages[0].page,
            id: null,
            previousPages: [],
            info: {}
        })
    }

    const handleBack = () => {
        setPage({
            ...page,
            page: page.previousPages[page.previousPages.length - 1].page,
            id: page.previousPages[page.previousPages.length - 1].id,
            previousPages: page.previousPages.slice(0, -1),
            info: page.previousPages[page.previousPages.length - 1].info
        })
    }

    return (
        <View style={styles.container}>
            <HomeScreen
                page={page}
                setPage={setPage}
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
                projects={projects}
                setProjects={setProjects}
            />

            {/*--------------- Detailpage overlays --------------------*/}
            <Modal
                visible={visible}
                transparent={true}
                onRequestClose={() => handleClosePopUp(setPage, page)}
            >
                <View style={{ flex: 1 }}>
                    <AnimatedBlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
                    <Pressable style={StyleSheet.absoluteFill} onPress={() => handleClosePopUp(setPage, page)} />

                    {/*-------------------- Overlay content --------------------*/}
                    <View style={{ flex: 1, gap: 16, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 32 }}>
                        {
                            page.previousPages.length > 1 &&
                            <Touchable
                                onPress={handleBack}
                                icon={'arrow-back-outline'}
                                isActive={true}
                                showIconOnly={true}
                                styleGradient={{ position: 'absolute', left: 48, top: 78, zIndex: 1 }}
                                styleButton={{ paddingVertical: 16, paddingHorizontal: 20 }}>
                            </Touchable>
                        }

                        <View style={{ flexDirection: 'row' }} fill={true} borderRadius={80}>
                            {
                                page.page === 'detailResearch' &&
                                (
                                    <DetailPage page={page} setPage={setPage} />
                                )
                            }
                            {
                                (page.page === 'detailKeyword' || page.page === 'detailCluster') &&
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
        zIndex: 1,
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

export default Ipad;