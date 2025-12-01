import { StyleSheet, View, Text } from 'react-native';
import ViewToggle from "../molecules/viewToggle";
import Header from "../organisms/header";
import ProjectList from "../organisms/projectsList";
import data from '../../assets/data/structured-data.json';

const HomeScreen = ({ page, setPage, activeFilters, setActiveFilters, projects, setProjects }) => {

    return (
        <View style={styles.container}>
            <Header activeFilters={activeFilters} setActiveFilters={setActiveFilters} setProjects={setProjects} />
            <ProjectList page={page} setPage={setPage} projects={projects} />
            <ViewToggle />
        </View>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});