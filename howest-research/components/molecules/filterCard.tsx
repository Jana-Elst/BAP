import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { StyledText } from '../atoms/styledComponents';
import { Colors, Fonts } from "@/constants/theme";

import ImageProject1 from '../../assets/images/visualizationsProjects/composition.png';
import Card from "@/components/atoms/card";

const FilterCard = ({ project, onPress, isActive }) => {
    console.log('Rendering FilterCard for project:', project);
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <Card style={[styles.card, { backgroundColor: isActive ? Colors.blue100 : null }]}>
                {/* <View> */}
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.image}
                            source={ImageProject1}
                            contentFit="contain"
                        />
                    </View>
                    <StyledText style={styles.text}>{project.label}</StyledText>
                {/* </View> */}
            </Card>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
    },

    card: {
        width: 275,
        height: 275,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },

    text: {
        fontFamily: Fonts.rounded.light,
        textAlign: 'center',
    },

    imageContainer: {
        flex: 1,
        width: '100%',
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },

    image: {
        width: '100%',
        height: '100%',
    },
});

export default FilterCard;