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
            styleButton={styles.button}
            styleGradient={styles.gradient}
        >
            Zoeken</Touchable>
    )
}

const styles = StyleSheet.create({

    gradient: {
        borderRadius: 100,
    },

    button: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 100,
    },
});

export default SearchButton;