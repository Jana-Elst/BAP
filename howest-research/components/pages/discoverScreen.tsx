import { StyleSheet, View } from 'react-native';
import CardsWorld from '../3Dscenes/cardsWorld';

const DiscoverScreen = ({projects, page, setPage, setVisible, isDiscoverMode}) => {
    return (
        <View style={styles.container}>
            <CardsWorld
                name="dom"
                projects={projects}
                page={page}
                setPage={setPage}
                setVisible={setVisible}
                isDiscoverMode={isDiscoverMode}
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