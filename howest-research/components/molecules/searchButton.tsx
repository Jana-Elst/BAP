import Touchable from "../atoms/touchable";
import { useState } from "react";
import { StyleSheet } from "react-native";

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
            Zoeken</Touchable>
    )
}

const styles = StyleSheet.create({
});

export default SearchButton;