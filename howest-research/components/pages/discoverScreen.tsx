import { StyleSheet, View } from 'react-native';
import InfiniteScrollView from '../3Dscenes/infiniteScroll';

const DiscoverScreen = ({projects, page, setPage, setVisible}) => {
    return (
        <View style={styles.container}>
            <InfiniteScrollView
                name="dom"
                projects={projects}
                page={page}
                setPage={setPage}
                setVisible={setVisible}
            />
        </View>
    );
};

export default DiscoverScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
    }
});