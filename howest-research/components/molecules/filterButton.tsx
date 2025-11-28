import Touchable from "../atoms/touchable";
import { useState } from "react";

const FilterButton = () => {
    const [isActive, setIsActive] = useState(false);

    const toggleFilterMenu = () => {
        console.log("Filter menu opened");
    };

    return (
        < Touchable onPress={() => { toggleFilterMenu() }} isActive={isActive} icon={'filter'}>Filter</Touchable>
    )
}

export default FilterButton;