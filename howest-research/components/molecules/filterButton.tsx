import Touchable from "../atoms/touchable";

const FilterButton = ({ onPress, isActive }) => {
    return (
        < Touchable onPress={onPress} isActive={isActive} icon={'filter'}>Filter</Touchable>
    )
}

export default FilterButton;