import Touchable from "../atoms/touchable";
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import Info from '../../assets/icons/info.svg';

const image = require('../../assets/images/logoHowestResearchRGB.png')

const HowestResearchButton = ({ onPress }) => {
    return (
        <Touchable
            isActive={true}
            onPress={onPress}
            icon='information-circle-outline'
            iconPosition='after'
            styleButton={styles.button}
        >
            <Image
                style={styles.image}
                source={image}
                contentFit="fill"
            />
        </Touchable>
    )
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 16
    },
    image: {
        width: 180,
        height: 24,
    },
});

export default HowestResearchButton;