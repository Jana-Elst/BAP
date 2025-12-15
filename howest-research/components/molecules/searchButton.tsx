import Touchable from "../atoms/touchable";
import { useState } from "react";
import { StyleSheet } from "react-native";
import {StyledText} from "../atoms/styledComponents";

const SearchButton = () => {
    const [isActive, setIsActive] = useState(false);

    const openSearch = () => {
        console.log("Search opened");
    };

    return (
        < Touchable
            onPress={() => { openSearch() }}
            icon={'search'}
        >
            <StyledText fontSize={22}>Zoeken</StyledText></Touchable>
    )
}

const styles = StyleSheet.create({
});

export default SearchButton;