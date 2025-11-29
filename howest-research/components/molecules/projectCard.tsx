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
        <BlurView intensity={24} tint="light" style={styles.blurContainer}>
            <View style={styles.shadowContainer}>
                <LinearGradient
                    style={styles.container}
                    colors={['rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.6)', 'rgba(224, 224, 224, 0.4)']}
                    // locations={[0.1051, 0.2353, 0.7205]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0.6, y: 1 }}
                >
                    <TouchableOpacity onPress={handleOpenDetail} >
                        <View>
                            <StyledText style={styles.title}> {project.CCODE}</StyledText>
                            <StyledText style={styles.subtitle}>Hier komt de clusternaam</StyledText>
                        </View>
                        <View style={styles.imageContainer}>
                            <Image
                                style={styles.image}
                                source={ImageProject1}
                                contentFit="contain"
                            />
                        </View>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </BlurView>
    )
}

const styles = StyleSheet.create({
    blurContainer: {
        borderRadius: 30,
    },

    shadowContainer: {
        backgroundColor: Colors.white,
        borderRadius: 30,

        shadowColor: 'rgba(78, 78, 78, 0.2)',
        shadowOffset: { width: 0, height: 3.38 },
        shadowOpacity: 0.2,
        shadowRadius: -1.915,
    },

    container: {
        borderWidth: 2,
        borderColor: Colors.white,
        padding: 16,
        borderRadius: 30,
        gap: 16,
        backgroundColor: Colors.white,
    },

    title: {
        fontFamily: Fonts.rounded.light,
        textAlign: 'center',
    },

    subtitle: {
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

export default ProjectCard;