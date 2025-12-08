
import { StyleSheet, View } from "react-native";
import { useState } from "react";
import Touchable from "../atoms/touchable";
import { Colors } from "@/constants/theme";

const Toggle = ({ icon1 = null, icon2 = null, element1, element2, setIsActive, isActive, styleElement1 = null, styleElement2 = null, styleText1 = null, styleText2 = null, styleGradient = null }) => {
    // const [isActive, setIsActive] = useState(true);

    const handleToggle = () => {
        setIsActive(!isActive);
    };

    return (
        <View style={[styles.toggle]}>
            <Touchable
                isActive={isActive}
                onPress={handleToggle} icon={icon1}
                showIconOnly={icon1 ? true : false}
                styleButton={styleElement1}
                styleText={styleText1}
                styleGradient={styleGradient}

            >{element1}</Touchable>
            <Touchable
                isActive={!isActive}
                onPress={handleToggle}
                icon={icon2} showIconOnly={icon2 ? true : false}
                styleButton={styleElement2}
                styleText={styleText2}
                styleGradient={styleGradient}
            >{element2}</Touchable>
        </View>
    )
}

const styles = StyleSheet.create({
    toggle: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        borderRadius: 100,
    },
});

export default Toggle;