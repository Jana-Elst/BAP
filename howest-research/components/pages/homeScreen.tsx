import { StyleSheet, View } from 'react-native';
import ViewToggle from "../molecules/viewToggle";
import Header from "../organisms/header";
import DiscoverScreen from "./discoverScreen";

const HomeScreen = (props: { projects, page, setPage, isVisible }) => {
    return (
        <View style={styles.container}>
            <Header />
            {/* <DiscoverScreen projects={props.projects} page={props.page} setPage={props.setPage} isVisible={props.isVisible} /> */}
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