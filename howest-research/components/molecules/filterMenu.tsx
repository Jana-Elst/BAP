import { View } from "react-native";
import Card from "../atoms/card";
import { StyledText } from "../atoms/styledComponents";

const FilterMenu = () => {
    return (
        <Card style={styles.card}> 
            <View>
                <StyledText>Filter Menu Content</StyledText>
            </View>
        </Card>
    )
}

const styles = {
    card: {
        flex: 1,
        backgroundColor: 'Green',
    }
};

export default FilterMenu;