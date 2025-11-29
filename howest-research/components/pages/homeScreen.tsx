import { StyleSheet, View, Text } from 'react-native';
import ViewToggle from "../molecules/viewToggle";
import Header from "../organisms/header";
import ProjectList from "../organisms/projectsList";
import data from '../../assets/data/structured-data.json';

const HomeScreen = (props: { page, setPage }) => {

    return (
        <View style={styles.container}>
            <Header />
            <ProjectList page={props.page} setPage={props.setPage} />
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