import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { StyledText } from '../atoms/styledComponents';
import { Colors, Fonts } from "@/constants/theme";
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

import ImageProject1 from '../../assets/images/visualizationsProjects/composition.png';

const ProjectCard = ({ project, page, setPage }) => {

    const handleOpenDetail = () => {
        console.log('DETAIL', page.page, page.id);
        setPage({
            page: 'detailResearch',
            id: project.id,
            previousPages: [
                ...(page.previousPages || []),
                {
                    page: page.page,
                    id: page.id
                }
            ]
        })
        // props.isVisible('detailResearch');
    }

    //background: linear - gradient(133deg, rgba(255, 255, 255, 0.60) 10.51 %, rgba(249, 249, 249, 0.56) 23.53 %, rgba(224, 224, 224, 0.40) 72.05 %);


    return (
        <BlurView intensity={24} tint="light" style={styles.container}>
            <LinearGradient
                colors={['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.6)', 'rgba(224, 224, 224, 0.4)']}
                // locations={[0.1051, 0.2353, 0.7205]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.6, y: 1 }}
            >
                <TouchableOpacity onPress={handleOpenDetail} >
                    <StyledText style={styles.text}> {project.CCODE}</StyledText>
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.image}
                            source={ImageProject1}
                            contentFit="contain"
                        />
                    </View>
                </TouchableOpacity>
            </LinearGradient>
        </BlurView>
    )
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        borderColor: 'white',
        padding: 16,
        borderRadius: 30,
        gap: 16,

        shadowColor: 'rgba(78, 78, 78)',
        shadowOffset: { width: 0, height: 3.38 },
        shadowOpacity: 0.2,
        shadowRadius: -1.915,
    },

    text: {
        fontFamily: Fonts.rounded.light,
        textAlign: 'center',
    },

    imageContainer: {
        borderWidth: 2,
        borderColor: 'black',
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

export default ProjectCard;