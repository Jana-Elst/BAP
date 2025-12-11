import { StyleSheet, View } from 'react-native';
import ViewToggle from "../molecules/viewToggle";
import Header from "../organisms/header";
import ProjectList from "../organisms/projectsList";
import { useState } from 'react';
import DiscoverScreen from './discoverScreen';
import { StyledText } from '../atoms/styledComponents';
import Ionicons from '@expo/vector-icons/Ionicons';

const HomeScreen = ({ page, setPage, activeFilters, setActiveFilters, projects, setProjects, setVisible }) => {
    const [isDiscoverMode, setIsDiscoverMode] = useState(true);

    return (
        <View style={styles.container}>
            <Header activeFilters={activeFilters} setActiveFilters={setActiveFilters} setProjects={setProjects} />

            {
                <DiscoverScreen page={page} setPage={setPage} projects={projects} setVisible={setVisible} isDiscoverMode={isDiscoverMode} />
            }

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

    footer: {
        alignSelf: 'center',
        marginBottom: 32,
    }
});