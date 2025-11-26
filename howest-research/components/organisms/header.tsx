import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Header(props: { project, page, setPage }) {
    const image = require('../../assets/images/logoHowestResearchRGB.png')

    return (
        <View style={styles.container}>
            <Image
                style={styles.image}
                source={image}
                contentFit="contain"
            />

            <Text style={styles.filter}>FILTER</Text>

            <View style={styles.rightSection}>
                <Text>SEARCH</Text>
                <Text>NL/ENG</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'green',
        padding: 16,
    },

    image: {
        width: 200,
        height: 60,
    },

    rightSection: {
        flexDirection: 'row',
    },

    filter: {
    }
});