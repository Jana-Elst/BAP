import DetailKeyword from "@/components/pages/detailKeyword";
import DetailPage from "@/components/pages/detailPage";
import { FlashList } from "@shopify/flash-list";
import { StyleSheet, TouchableOpacity, View, Animated, PanResponder } from 'react-native';
import data from '../../assets/data/structured-data.json';
import DiscoverCard from "../molecules/discoverCard";
import OverlayComponent from "../organisms/overlay";
import { Button, Overlay } from '@rneui/themed';
import React, { useState, useRef } from 'react';
import { StyledText } from "../atoms/styledComponents";
import BTNBack from "../atoms/BTNBack";
import Header from "../organisms/header";
import Footer from "../organisms/footer";

const DiscoverScreen = (props: { projects, page, setPage, isVisible }) => {
    return (
        <View style={styles.container}>
            <View>
                <Header project={null} page={props.page} setPage={props.setPage} />
            </View>
            <View style={styles.projectListContainer}>
                <FlashList
                    data={props.projects}
                    masonry
                    renderItem={({ item: project }) =>
                        //want to choose the postion of the card. They should be absolute...
                        <View style={styles.cardWrapper}>
                            <DiscoverCard project={project} page={props.page} setPage={props.setPage} isVisible={props.isVisible} />
                        </View>
                        // <DiscoverCard project={project} page={props.page} setPage={props.setPage} isVisible={isVisible} />
                    }
                    estimatedItemSize={200}
                    style={styles.projectList}
                />
            </View>
            <Footer />
        </View>
    );
}

export default DiscoverScreen;

const styles = StyleSheet.create({
    container: {
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
        top: '200',
        left: '50%',

        padding: 16,
        backgroundColor: 'green',
    },
});