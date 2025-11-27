import { Image } from 'expo-image';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const ProjectCard = (props: { project, page, setPage, isVisible }) => {
    const image = require('../../assets/images/visualizationsProjects/AHUMAIN.png')

    const handleOpenDetail = () => {
        console.log('DETAIL', props.page.page, props.page.id);
        props.setPage({
            page: 'detailResearch',
            id: props.project.ID,
            previousPages: [
                ...(props.page.previousPages || []),
                {
                    page: props.page.page,
                    id: props.page.id
                }
            ]
        })
        props.isVisible('detailResearch');
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

export default ProjectCard

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