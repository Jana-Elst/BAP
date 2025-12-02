import React, { useState } from 'react';
import { StyleSheet, View, Modal } from 'react-native';
import data from '../../assets/data/structured-data.json';
import HomeScreen from '../pages/homeScreen';
import CloseButton from '../atoms/closeButton';
import BackButton from '../atoms/backButton';
import Card from '../atoms/card';
import { StyledText } from '../atoms/styledComponents';
import DetailPage from '../pages/detailPage';
import DetailKeyword from '../pages/detailKeyword';

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
            {/* <DiscoverScreen projects={projects} page={page} setPage={setPage} isVisible={isVisible} /> */}

            {/*--------------- Detailpage overlays --------------------*/}
            <Modal
                visible={visible}
                onRequestClose={() => handleClosePopUp(setPage, page)}
                style={styles.overlay}
            >
                <View style={styles.overlayContent}>
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

                    <CloseButton onPress={() => handleClosePopUp(setPage, page)}>Sluit</CloseButton>
                </View>
            </Modal>
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

    projectListContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
    },

    projectList: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 16,
        padding: 16,
    },

    cardWrapper: {
        backgroundColor: 'yellow',
        position: 'absolute',
        top: 50,
        left: '50%',
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