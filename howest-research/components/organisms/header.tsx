import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import LanguageToggle from '../molecules/languageToggle';
import Filter from './filter';
import HowestResearch from './howestResearch';
import Search from './search';


const Header = ({ activeFilters, setActiveFilters, setProjects, style }) => {
    return (
        <Animated.View style={[styles.container, style]}>
            <HowestResearch />

            <View style={styles.rightSection}>
                <Filter activeFilters={activeFilters} setActiveFilters={setActiveFilters} setProjects={setProjects} />
                <Search />
                <LanguageToggle />
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 32,
    },

    image: {
        width: 200,
        height: 60,
    },

    rightSection: {
        flexDirection: 'row',
        gap: 16,
    },

    filter: {
    }
});

export default Header;