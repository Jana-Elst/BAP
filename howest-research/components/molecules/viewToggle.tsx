import Toggle from "../atoms/toggle";

const viewToggle = ({ setActive, isActive }) => {

    return (
        <Toggle
            icon1="grid-outline"
            icon2="grid-outline"
            element1="Ontdek weergave"
            element2="Gallerij weergave"
            setIsActive={setActive}
            isActive={isActive}
        />
    )
}

export default viewToggle;