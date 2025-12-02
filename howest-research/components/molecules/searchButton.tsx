import Touchable from "../atoms/touchable";
import { useState } from "react";

const SearchButton = () => {
    const [isActive, setIsActive] = useState(false);

    const openSearch = () => {
        console.log("Search opened");
    };

    return (
        < Touchable onPress={() => { openSearch() }} icon={'search'}>Zoeken</Touchable>
    )
}

export default SearchButton;