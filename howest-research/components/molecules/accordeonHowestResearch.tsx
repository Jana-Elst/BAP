import { View, StyleSheet } from "react-native";
import { StyledText } from "../atoms/styledComponents";
import AccordeonItem from "./accordeonItem";
import { useState } from "react";

const AccordeonHowestResearch = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const handlePress = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    }

    return (
        <View>
            <AccordeonItem
                title={'Onze Missie'}
                onPress={() => handlePress(0)}
                isVisible={activeIndex === 0}
            >
                <StyledText>Are you looking for answers to challenges your organisation faces? Would you like support with developing a product or service? Are you interested in participating in a research project?</StyledText>
                <StyledText>To be able to help your organisation or business, our researchers continuously screen new evolutions and technology to identify opportunities for optimisation and innovation. Moreover, you can also use our state-of-the-art infrastructure to test and develop novelties. You prefer to learn more during a face-to-face meeting and get introduced to one of our experts? You can, thanks to the Blikopener program of the Flemish Government.</StyledText>
            </AccordeonItem>

            <AccordeonItem
                title={"What's in it for me?"}
                onPress={() => handlePress(1)}
                isVisible={activeIndex === 1}
            >
                <StyledText>Are you looking for answers to challenges your organisation faces? Would you like support with developing a product or service? Are you interested in participating in a research project?</StyledText>
                <StyledText>To be able to help your organisation or business, our researchers continuously screen new evolutions and technology to identify opportunities for optimisation and innovation. Moreover, you can also use our state-of-the-art infrastructure to test and develop novelties. You prefer to learn more during a face-to-face meeting and get introduced to one of our experts? You can, thanks to the Blikopener program of the Flemish Government.</StyledText>
            </AccordeonItem>


            <AccordeonItem
                title={'Transitiedomeinen'}
                onPress={() => handlePress(2)}
                isVisible={activeIndex === 2}
            >
                <StyledText>Are you looking for answers to challenges your organisation faces? Would you like support with developing a product or service? Are you interested in participating in a research project?</StyledText>
                <StyledText>To be able to help your organisation or business, our researchers continuously screen new evolutions and technology to identify opportunities for optimisation and innovation. Moreover, you can also use our state-of-the-art infrastructure to test and develop novelties. You prefer to learn more during a face-to-face meeting and get introduced to one of our experts? You can, thanks to the Blikopener program of the Flemish Government.</StyledText>
            </AccordeonItem>
        </View>
    );
};

export default AccordeonHowestResearch;