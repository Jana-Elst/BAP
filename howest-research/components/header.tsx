import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
// import { createImagePaths } from '../scripts/create-image-paths';

export default function Header(props: { project, page, setPage }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleOpenDetail} style={styles.container} >
                <Text> {props.project.CCODE}</Text>
                <Image
                    style={styles.image}
                    source={image}
                    contentFit="cover"
                />
                <Text>FILTER</Text>
                <Text>SEARCH</Text>
                <Text>NL/ENG</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 200,
        height: 200,
        backgroundColor: '#0553',
    },
});