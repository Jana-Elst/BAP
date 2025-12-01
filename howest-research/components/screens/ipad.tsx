import React, { useState } from 'react';
import { StyleSheet, View, Modal } from 'react-native';
import data from '../../assets/data/structured-data.json';
import HomeScreen from '../pages/homeScreen';
import CloseButton from '../atoms/closeButton';
import BackButton from '../atoms/backButton';
import Card from '../atoms/card';
import { StyledText } from '../atoms/styledComponents';
import DetailPage from '../pages/detailPage copy';

export default function Ipad(props: { page, setPage }) {
    console.log('page', props.page)

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
        props.setPage({
            page: props.page.previousPages[props.page.previousPages.length - 1].page,
            id: props.page.previousPages[props.page.previousPages.length - 1].id,
            previousPages: props.page.previousPages.slice(0, -1)
        })
        isVisible(props.page.previousPages[props.page.previousPages.length - 1].page);
    }

    return (
        <View style={styles.container}>
            <HomeScreen page={props.page} setPage={props.setPage} activeFilters={activeFilters} setActiveFilters={setActiveFilters} projects={projects} setProjects={setProjects} setVisible={setVisible} />
            {/* <DiscoverScreen projects={projects} page={props.page} setPage={props.setPage} isVisible={isVisible} /> */}

            {/*--------------- Detailpage overlays --------------------*/}
            <Modal
                visible={visible}
                onRequestClose={() => handleClosePopUp(props.setPage, props.page)}
                style={styles.overlay}
            >
                <View style={styles.overlayContent}>
                    {
                        props.page.previousPages.length > 1 &&
                        <BackButton onPress={handleBack}>Terug</BackButton>
                    }

                    {
                        props.page.page === 'detailResearch' &&
                        (
                            <Card>
                                <DetailPage page={props.page} setPage={props.setPage} />
                            </Card>
                        )
                    }
                    {/* {
                        props.page.page === 'detailResearch' &&
                        (
                            // <DetailPage page={props.page} setPage={props.setPage} />
                        )
                    } */}

                    {/* {
                        props.page.page === 'detailKeyword' &&
                        (
                            // <DetailKeyword page={props.page} setPage={props.setPage} isVisible={isVisible} />
                        )
                    } */}

                    <CloseButton onPress={() => handleClosePopUp(props.setPage, props.page)}>Sluit</CloseButton>
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