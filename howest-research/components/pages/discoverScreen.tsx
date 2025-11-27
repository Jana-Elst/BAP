import { StyleSheet, View } from 'react-native';
import Header from "../organisms/header";
import Footer from "../organisms/footer";
import InfiniteGridComponent from '../organisms/infiniteGrid';

const DiscoverScreen = (props: {projects, page, setPage, isVisible}) => {
    return (
        <View style={styles.hero}>
            <InfiniteGridComponent {...props} />
        </View>
    );
};

export default DiscoverScreen;

const styles = StyleSheet.create({
    hero: {
        flex: 1,
    },

    images: {
        flex: 1,
        width: '100%',
        height: '100%',
    },

    image: {
        position: 'absolute',
    },
});