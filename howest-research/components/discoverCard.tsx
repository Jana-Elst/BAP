import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
// import { createImagePaths } from '../scripts/create-image-paths';

export default function DiscoverCard(props: { project, page, setPage }) {
    // const imagePaths = createImagePaths();
    // const imagePath = imagePaths.find(i => i === project.CCODE);
    // console.log(imagePath);

    const image = require('../assets/images/visualizationsProjects/AHUMAIN.png')

    const handleOpenDetail = () => {
        console.log(props.project.CCODE);
        props.setPage({
            page: 'detailResearch',
            id: props.project.ID,
            previousPages: [
                ... props.page.previousPages || [],
                {
                    page: props.page.page,
                    id: props.page.id
                }
            ]
        })

        console.log(props.page);
    }

    return (
        <TouchableOpacity onPress={handleOpenDetail} style={styles.container} >
            <Text> {props.project.CCODE}</Text>
            <Image
                style={styles.image}
                source={image}
                contentFit="cover"
            />
        </TouchableOpacity>
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