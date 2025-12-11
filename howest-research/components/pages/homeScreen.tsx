import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import CardsWorld from '../3Dscenes/cardsWorld';
import { StyledText } from '../atoms/styledComponents';
import ViewToggle from "../molecules/viewToggle";
import Header from "../organisms/header";

const HomeScreen = ({ page, setPage, activeFilters, setActiveFilters, projects, setProjects, setVisible }) => {
    const [isDiscoverMode, setIsDiscoverMode] = useState(true);

    return (
        <View style={styles.container}>
            <Header activeFilters={activeFilters} setActiveFilters={setActiveFilters} setProjects={setProjects} />

            <View style={styles.cardsWorld}>
                <CardsWorld
                    name="dom"
                    projects={projects}
                    page={page}
                    setPage={setPage}
                    setVisible={setVisible}
                    isDiscoverMode={isDiscoverMode}
                />
            </View>

            <View style={styles.footer}>
                <View
                    style={{
                        alignSelf: 'center',

                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8,
                        justifyContent: 'center',
                        backgroundColor: 'white',
                        paddingVertical: 16,
                        paddingHorizontal: 24,
                        borderRadius: 100,
                        marginBottom: 16
                    }}>
                    <StyledText>Veeg in alle richtingen</StyledText>
                    <Ionicons name="swap-horizontal-outline" size={24} />
                </View>
                <ViewToggle setActive={setIsDiscoverMode} isActive={isDiscoverMode} />
            </View>
        </View>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },

    cardsWorld: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
    },

    footer: {
        alignSelf: 'center',
        marginBottom: 32,
    }
});