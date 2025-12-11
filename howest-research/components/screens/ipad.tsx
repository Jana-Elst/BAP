import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, View } from 'react-native';
import data from '../../assets/data/structured-data.json';
import { checkIsLoading } from '../../scripts/getHelperFunction';
import CloseButton from '../atoms/closeButton';
import { StyledText } from '../atoms/styledComponents';
import Touchable from '../atoms/touchable';
import DetailKeyword from '../pages/detailKeyword';
import DetailPage from '../pages/detailPage';
import HomeScreen from '../pages/homeScreen';

const Ipad = ({ page, setPage }) => {
    const [visible, setVisible] = useState(false);
    const [activeFilters, setActiveFilters] = useState([]);
    const [projects, setProjects] = useState(data.projects);
    const [isLoading, setIsLoading] = useState(false);

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    useEffect(() => {
        setVisible(((page.page === 'discover') || page.page === 'gallery' || page.page === 'filter') ? false : true);

        console.log('page', page)
        console.log('visible', visible)
    }, [page.page]);

    useEffect(() => {
        console.log('page.isLoading CHANGING', page.isLoading);
        const loadState = checkIsLoading(page.isLoading);
        setIsLoading(loadState);
        if (loadState) {
            console.log('isLoading LAAAD');
        }
    }, [page.isLoading]);

    const handleClosePopUp = (setPage, page) => {
        console.log('CLOSE POP UP', page);
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

            {
                isLoading && (
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10000, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                        <StyledText>Loading...</StyledText>
                    </View>
                )
            }

            {/*--------------- Detailpage overlays --------------------*/}
            <Modal
                visible={visible}
                transparent={true}
                onRequestClose={() => handleClosePopUp(setPage, page)}
            >
                <View style={{ flex: 1 }}>
                    {!isLoading && <BlurView intensity={35} tint="dark" style={StyleSheet.absoluteFill} />}
                    <Pressable style={StyleSheet.absoluteFill} onPress={() => isLoading && handleClosePopUp(setPage, page)} />

                    {/*-------------------- Overlay content --------------------*/}
                    <View style={{ flex: 1, gap: 16, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 32, opacity: (isLoading || !visible) ? 0 : 1 }}>
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