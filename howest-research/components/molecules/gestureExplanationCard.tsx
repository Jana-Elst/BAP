import { StyledText } from "../atoms/styledComponents";
import Touchable from "../atoms/touchable";
import { useState } from "react";
import { View } from "react-native";

const GestureExplanationCard = () => {
    return (
        <View>
            <StyledText>Veeg in alle richtingen</StyledText>
            <StyledText>Zoom in en uit</StyledText>
        </View>
    )
}

export default GestureExplanationCard;