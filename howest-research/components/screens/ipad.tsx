import DetailKeyword from "@/components/pages/detailKeyword";
import DetailPage from "@/components/pages/detailPage";
import { FlashList } from "@shopify/flash-list";
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import data from '../../assets/data/structured-data.json';
import DiscoverCard from "../molecules/discoverCard";
import OverlayComponent from "../organisms/overlay";
import { Button, Overlay } from '@rneui/themed';
import React, { useState } from 'react';
import { StyledText } from "../atoms/styledComponents";
import BTNBack from "../atoms/BTNBack";
import Header from "../organisms/header";
import Footer from "../organisms/footer";

export default function Ipad(props: { keyword, page, setPage }) {
    const projects = data.projects;
    const domains = data.transitiedomeinen;
    const keywords = data.keywords;
    const clusters = data.clusters;

    const projectImages = {};

    const [visible, setVisible] = useState(false);

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
            previousPages: []
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
            <View style={styles.homeScreen}>
                <View>
                    <Header project={null} page={props.page} setPage={props.setPage} />
                </View>
                <FlashList
                    data={projects}
                    renderItem={({ item: project }) =>
                        <DiscoverCard project={project} page={props.page} setPage={props.setPage} isVisible={isVisible} />
                    }
                    estimatedItemSize={200}
                    style={styles.projectList}
                />
                <Footer />
            </View>

            <Overlay isVisible={visible} onBackdropPress={() => handleClosePopUp(props.setPage, props.page)} overlayStyle={styles.overlay}>
                <View style={styles.overlayContent}>
                    {
                        props.page.previousPages.length > 1 &&
                        <TouchableOpacity onPress={handleBack} style={styles.button}>
                            <StyledText>TERUG</StyledText>
                        </TouchableOpacity>
                    }
                    {
                        props.page.page === 'detailResearch' &&
                        (
                            <DetailPage page={props.page} setPage={props.setPage} />
                        )
                    }

                    {
                        props.page.page === 'detailKeyword' &&
                        (
                            <DetailKeyword keyword={keywords.find(k => k.ID === props.page.id)} page={props.page} setPage={props.setPage} isVisible={isVisible} />
                        )
                    }

                    <Button
                        title="SLUIT"
                        onPress={() => handleClosePopUp(props.setPage, props.page)}
                    />
                </View>
            </Overlay>
        </View>
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

    projectList: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
    },

    overlay: {
        width: '100%',
        height: '100%',
    },

    overlayContent: {
        backgroundColor:'green',
        flex: 1,
    }
});