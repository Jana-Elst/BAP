import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { StyledText } from '../atoms/styledComponents';
import { Colors, Fonts } from "@/constants/theme";

import ImageProject1 from '../../assets/images/visualizationsProjects/composition.png';
import Card from "@/components/atoms/card";

const FilterCard = ({ project, page, setPage }) => {
    return (
        <TouchableOpacity onPress={() => { }} style={styles.container}>
            <Card isActive={true} style={styles.card}>
                <View>
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.image}
                            source={ImageProject1}
                            contentFit="contain"
                        />
                    </View>
                    <StyledText style={styles.text}>Label Title</StyledText>
                </View>
            </Card>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 30,
        overflow: 'hidden',
    },

    radialGradientContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: -1,
        borderRadius: 30,
        overflow: 'hidden',
    },

    text: {
        fontFamily: Fonts.rounded.light,
        textAlign: 'center',
    },


    imageContainer: {
        borderWidth: 2,
        borderColor: Colors.white,
        padding: 16,
        borderRadius: 30,

        width: '100%',
        height: 200,
    },

    image: {
        width: '100%',
        height: '100%',
    },
});

export default FilterCard;