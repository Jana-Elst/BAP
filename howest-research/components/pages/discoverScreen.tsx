import { StyleSheet, View } from 'react-native';
import Header from "../organisms/header";
import Footer from "../organisms/footer";
import InfiniteGridComponent from '../organisms/infiniteGrid';
import InfiniteScrollView from '../3Dscenes/infiniteScroll';

const DiscoverScreen = ({projects, page, setPage, isVisible}) => {
    return (
        <View style={styles.container}>
            <InfiniteScrollView
                name="dom"
                projects={projects}
            />
        </View>
    );
};

export default DiscoverScreen;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
    }
});