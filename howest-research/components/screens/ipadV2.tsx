import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import data from '../../assets/data/structured-data.json';
import BackButton from '../atoms/backButton';
import CloseButton from '../atoms/closeButton';
import DetailKeyword from '../pages/detailKeyword';
import DetailPage from '../pages/detailPage';
import HomeScreen from '../pages/homeScreen';

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
        })
        isVisible(page.previousPages[0].page);
    }

    const handleBack = () => {
        setPage({
            page: page.previousPages[page.previousPages.length - 1].page,
            id: page.previousPages[page.previousPages.length - 1].id,
            previousPages: page.previousPages.slice(0, -1)
        })
        isVisible(page.previousPages[page.previousPages.length - 1].page);
    }

    return (
        <View style={styles.container}>
            <HomeScreen page={page} setPage={setPage} activeFilters={activeFilters} setActiveFilters={setActiveFilters} projects={projects} setProjects={setProjects} setVisible={setVisible} />

            {/*--------------- Detailpage overlays --------------------*/}
            <Modal
                visible={visible}
                transparent={true}
                onRequestClose={handleClosePopUp}
            >
                <View style={{ flex: 1 }}>
                    <BlurView intensity={35} tint="dark" style={StyleSheet.absoluteFill} />
                    <Pressable style={StyleSheet.absoluteFill} onPress={handleClosePopUp} />

                    {/*-------------------- Overlay content --------------------*/}
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row' }} fill={true} borderRadius={80}>
                            {
                                page.previousPages.length > 1 &&
                                <BackButton onPress={handleBack}>Terug</BackButton>
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

                        <CloseButton onPress={handleClosePopUp}>Sluit</CloseButton>
                    </View>
                </View>
            </Modal >
        </View >
    );
}

const styles = StyleSheet.create({
});