import { StyleSheet, View, Text } from 'react-native';
import ViewToggle from "../molecules/viewToggle";
import Header from "../organisms/header";
import ProjectList from "../organisms/projectsList";
import data from '../../assets/data/structured-data.json';
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
            <ViewToggle setActive={setIsDiscoverMode}  isActive={isDiscoverMode} />
        </View>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});