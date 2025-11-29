import { StyleSheet, View } from 'react-native';
import Filter from './filter';
import Search from './search';
import HowestResearch from './howestResearch';
import LanguageToggle from '../molecules/languageToggle';


const Header = () => {
    return (
        <View style={styles.container}>
            <HowestResearch />

            <View style={styles.rightSection}>
                <Filter />
                <Search />
                <LanguageToggle />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // backgroundColor: 'green',
        padding: 16,
    },

    image: {
        width: 200,
        height: 60,
    },

    rightSection: {
        flexDirection: 'row',
    },

    filter: {
    }
});

export default Header;