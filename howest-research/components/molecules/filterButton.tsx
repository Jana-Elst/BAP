import { StyleSheet, View } from "react-native";
import { StyledText } from "../atoms/styledComponents";
import Touchable from "../atoms/touchable";

const FilterButton = ({ onPress, activeFilters }) => {
    return (
        <View style={styles.container}>
            <Touchable
                onPress={onPress}
                icon={'filter'}
            >
                <StyledText fontSize={22}>Filter</StyledText>
            </Touchable>
            {activeFilters.length > 0 &&
                <StyledText
                    fontSize={22}
                    hasGradient={true}
                    style={styles.activeFiltersCount}
                    styleGradient={styles.gradient}>
                    {activeFilters.length}
                </StyledText>
            }
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
    },
    gradient: {
        borderRadius: 100,
    }
});

export default FilterButton;