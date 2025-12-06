import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { StyledText } from '../atoms/styledComponents';
import { Colors, Fonts } from "@/constants/theme";

import ImageProject1 from '../../assets/images/visualizationsProjects/composition.png';
import RadialGradientComponent from '../atoms/radialGradient';
import { useState } from 'react';
import { getProjectInfo } from '@/scripts/getData';
import Card from "@/components/atoms/card";

const ProjectCard = ({ project, page, setPage, setVisible }) => {
    const projectInfo = getProjectInfo(project.id);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    const handleLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        setContainerSize({ width, height });
    };

    const handleOpenDetail = () => {
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
        setVisible(true);
    }

    return (
        <TouchableOpacity onPress={handleOpenDetail} style={styles.container}>
            <Card onLayout={handleLayout} style={styles.card}>
                <View>
                    <StyledText style={styles.title}> {projectInfo.title}</StyledText>
                    <StyledText style={styles.subtitle}>{projectInfo.cluster.label}</StyledText>
                </View>
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.image}
                        source={ImageProject1}
                        contentFit="contain"
                    />
                </View>
            </Card>
            <View style={styles.radialGradientContainer}>
                <RadialGradientComponent width={containerSize.width} height={containerSize.height} color={projectInfo.color} />
            </View>
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

    card: {
        padding: 16,
        borderRadius: 30,
        gap: 16,
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