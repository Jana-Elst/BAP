import Toggle from "../atoms/toggle";
import { StyleSheet } from "react-native";

const viewToggle = ({ setActive, isActive }) => {

    return (
        <Toggle
            icon1="grid-outline"
            icon2="grid-outline"
            element1="Ontdek weergave"
            element2="Gallerij weergave"
            styleElement1={styles.element}
            styleElement2={styles.element}
            setIsActive={setActive}
            isActive={isActive}
        />
    )
}

const styles = StyleSheet.create({
    element: {
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
});

export default viewToggle;