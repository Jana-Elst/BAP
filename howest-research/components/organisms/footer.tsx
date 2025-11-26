import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ViewToggle } from '../molecules/viewToggle';

export default function Footer(props: { project, page, setPage }) {
    const image = require('../../assets/images/logoHowestResearchRGB.png')

    return (
        <View style={styles.container}>
            <ViewToggle/>
            <Text>Over howest</Text>
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
});