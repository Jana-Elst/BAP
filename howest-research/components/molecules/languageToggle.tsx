import { useState } from "react";
import Toggle from "../atoms/toggle";
import { StyleSheet } from "react-native";
import { Colors, Fonts } from "@/constants/theme";

const LanguageToggle = () => {
    const [isActive, setIsActive] = useState(true);

    return (
        <Toggle
            element1="NL"
            element2="EN"
            setIsActive={setIsActive}
            isActive={isActive}
            styleText1={isActive ? { fontFamily: Fonts.rounded.bold } : { fontFamily: Fonts.rounded.light }}
            styleElement1={styles.element1}
            styleText2={!isActive ? { fontFamily: Fonts.rounded.bold } : { fontFamily: Fonts.rounded.light }}
            styleElement2={styles.element2}
            styleGradient={styles.gradient}
        />
    )
}

const styles = StyleSheet.create({
    element1: {
        paddingLeft: 20,
        paddingVertical: 12,
        borderTopLeftRadius: 100,
        borderBottomLeftRadius: 100,
    },
    element2: {
        paddingVertical: 12,
        paddingRight: 20,
        borderTopRightRadius: 100,
        borderBottomRightRadius: 100,
    },
});

export default LanguageToggle;