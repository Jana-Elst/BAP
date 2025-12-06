import { StyleSheet, View } from 'react-native';
import ViewToggle from "../molecules/viewToggle";
import Header from "../organisms/header";
import ProjectList from "../organisms/projectsList";
import { useState } from 'react';
import DiscoverScreen from './discoverScreen';

const HomeScreen = ({ page, setPage, activeFilters, setActiveFilters, projects, setProjects, setVisible }) => {
    const [isDiscoverMode, setIsDiscoverMode] = useState(true);

    return (
        <View style={styles.container}>
            <Header activeFilters={activeFilters} setActiveFilters={setActiveFilters} setProjects={setProjects} />

            {
                isDiscoverMode ? <DiscoverScreen page={page} setPage={setPage} projects={projects} setVisible={setVisible}>Ontdekweergave</DiscoverScreen> : <ProjectList page={page} setPage={setPage} projects={projects} setVisible={setVisible} />
            }
            <View style={styles.footer}>
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