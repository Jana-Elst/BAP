import { View, StyleSheet } from "react-native";
import Touchable from "../atoms/touchable";
import { StyledText } from "../atoms/styledComponents";

const FilterButton = ({ onPress, isActive, activeFilters }) => {
    return (
        <View style={styles.container}>
            <Touchable onPress={onPress} isActive={isActive} icon={'filter'}>Filter</Touchable>
            {activeFilters.length > 0 && <StyledText hasGradient={isActive}>{activeFilters.length}</StyledText>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
});

export default FilterButton;