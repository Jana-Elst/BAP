import Touchable from "../atoms/touchable";
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

const image = require('../../assets/images/logoHowestResearchRGB.png')

const HowestResearchButton = () => {
    const openResearch = () => {
        console.log("Research opened");
    };

    return (
        <Touchable isActive={true} onPress={() => { openResearch() }} icon={'help-circle-outline'} iconPosition='after'>
            <Image
                style={styles.image}
                source={image}
                contentFit="contain"
            />
        </Touchable>
    )
}

const styles = StyleSheet.create({
    image: {
        width: 200,
        height: 60,
    },
});

export default HowestResearchButton;