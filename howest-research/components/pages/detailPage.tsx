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

    const project = projects.find(p => p.ID === props.page.id);
    console.log('PROJECT DETAIL PAGE', project);

    const keywordIDs = project.Keywords;
    const projectKeywords = getKeywords(keywordIDs);

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
        <View>
            <View style={styles.container}>
                {
                    props.page.previousPages.length > 1 && <BTNBack project={project} page={props.page} setPage={props.setPage} />
                }

                <StyledText style={{ fontFamily: Fonts.rounded.bold, fontSize: 32, fontWeight: 'bold', backgroundColor: Colors.blue100 }}>{project.CCODE}</StyledText>
                <StyledText>
                    {clusters.find(c => c.Id === project.ClusterId)?.Label}
                </StyledText>
                <StyledText>Keywords</StyledText>
                {project.Keywords
                    .map(keyword => keywords.find(k => k.ID === keyword && k.KeywordCategoryIDs !== 3))
                    .filter(Boolean)
                    .map((keyword) => (
                        <TouchableOpacity onPress={() => handleOpendetailKeyword(keyword.ID)} key={keyword.ID} style={styles.tag}>
                            <StyledText style={styles.tagStyledText}>{keyword.Label}</StyledText>
                        </TouchableOpacity>
                    ))}
            </View>
            <View style={{ flex: 1, width: '100%', height: '100%' }}>
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
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },

    button: {
        padding: 20,
        backgroundColor: 'green'
    },

    tag: {
        padding: 20,
        margin: 10,
        backgroundColor: 'pink'
    }
});