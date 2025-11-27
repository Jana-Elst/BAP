import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { StyledText } from '../atoms/styledComponents';
import data from '../../assets/data/structured-data.json';
import BTNBack from '../atoms/BTNBack';
import { Colors, Fonts } from '@/constants/theme';
import Scene3D from '../3Dscenes/3DsceneNew';
import { getKeywords } from '../../scripts/getData';

// import { createImagePaths } from '../scripts/create-image-paths';

export default function DetailPage(props: { page, setPage }) {
    const keywords = data.keywords;
    const clusters = data.clusters;
    const projects = data.projects;

    console.log('detail', props.page);

    const project = projects.find(p => p.id === props.page.id);

    console.log('PROJECT', project);
    const keywordIDs = project.keywords;
    console.log('KEYWORD IDS', keywordIDs);
    const projectKeywords = getKeywords(keywordIDs);
    console.log('PROJECT KEYS', projectKeywords);

    const handleOpendetailKeyword = (keywordId) => {
        console.log(keywordId);
        props.setPage({
            page: 'detailKeyword',
            id: keywordId,
            previousPages: [
                ...props.page.previousPages || [],
                {
                    page: props.page.page,
                    id: props.page.id
                }
            ]
        })
    }

    console.log(props.page.previousPages.length);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {
                    props.page.previousPages.length > 1 && <BTNBack project={project} page={props.page} setPage={props.setPage} />
                }

                <StyledText style={{ fontFamily: Fonts.rounded.bold, fontSize: 32, fontWeight: 'bold', backgroundColor: Colors.blue100 }}>{project.CCODE}</StyledText>
                <StyledText>
                    {clusters.find(c => c.id === project.clusterId)?.label}
                </StyledText>

                <StyledText>Keywords</StyledText>
                {project.keywords
                    .map(keyword => keywords.find(k => k.id === keyword && k.keywordCategoryIDs !== 3))
                    .filter(Boolean)
                    .map((keyword) => (
                        <TouchableOpacity onPress={() => handleOpendetailKeyword(keyword.id)} key={keyword.id} style={styles.tag}>
                            <StyledText style={styles.tagStyledText}>{keyword.label}</StyledText>
                        </TouchableOpacity>
                    ))}
            </View>
            <View style={styles.container3D}>
                {/* <LinearGradient
                        colors={['rgba(255, 255, 255, 1)', 'transparent']}
                        style={styles.background}
                    /> */}
                <Scene3D
                    name="dom"
                    projectKeywords={projectKeywords}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },

    content: {
        flex: 1,
    },

    container3D: {
        flex: 1,
        height: '100%',
        width: '100%',
    },

    button: {
        padding: 20,
        backgroundColor: 'green'
    },

    tag: {
        padding: 20,
        margin: 10,
        backgroundColor: 'pink'
    },
});