import { View, StyleSheet } from "react-native";
import Touchable from "../atoms/touchable";
import { StyledText } from "../atoms/styledComponents";

const FilterButton = ({ onPress, isActive, activeFilters }) => {
    return (
        <View style={styles.container}>
            <Touchable
                onPress={onPress}
                isActive={isActive}
                icon={'filter'}
            >
                Filter</Touchable>
            {activeFilters.length > 0 && <StyledText hasGradient={true} style={styles.activeFiltersCount} styleGradient={styles.gradient}>{activeFilters.length}</StyledText>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 8,
    },

    activeFiltersCount: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 100,
        fontSize: 24
    }
});

export default FilterButton;