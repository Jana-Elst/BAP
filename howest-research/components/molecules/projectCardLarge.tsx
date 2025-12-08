import { Colors, Fonts } from "@/constants/theme";
import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ParagraphSmall, ParagraphXSmall, StyledText } from '../atoms/styledComponents';

import Card from "@/components/atoms/card";
import { getProjectInfo } from '@/scripts/getData';
import React, { useState } from 'react';
import RadialGradientComponent from '../atoms/radialGradient';
import useGetKeywordImages from '../../scripts/getVisualizationProjectImages';

const ProjectCardLarge = ({ project, page, setPage, setVisible }) => {
    const projectInfo = getProjectInfo(project.id);
    const [containerSize, setContainerSize] = useState({ width: 250, height: 250 });
    const imageSrc = useGetKeywordImages(project.formattedName);
    console.log('imageSrc', imageSrc);


    const handleLayout = (event) => {
        // const { width, height } = event.nativeEvent.layout;
        // setContainerSize({ width, height });
    };

    const handleOpenDetail = () => {
        setPage({
            page: 'detailResearch',
            id: project.id,
            previousPages: [
                ...(page.previousPages || []),
                {
                    info: page.info,
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
                <View style={{ gap: 16, flex: 1, paddingVertical: 20}}>
                    <View>
                        <StyledText style={{ fontFamily: Fonts.rounded.light, fontSize: 22 }}>{projectInfo.title}</StyledText>
                        <ParagraphXSmall>{projectInfo.cluster.label}</ParagraphXSmall>
                    </View>
                    <ParagraphSmall>Dit is een korte beschrijving van slechts 1 zinnetje. Kan ook meer zijn, geen idee...</ParagraphSmall>
                </View>
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.image}
                        source={imageSrc}
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
        flexDirection: 'row-reverse',
        padding: 12,
        borderRadius: 30,
        gap: 12,
    },

    imageContainer: {
        borderWidth: 2,
        borderColor: Colors.white,
        padding: 16,
        paddingRight: 20,
        borderRadius: 30,

        width: 200,
        height: 200,
    },

    image: {
        width: '100%',
        height: '100%',
    },
});

export default ProjectCardLarge;