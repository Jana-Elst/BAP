import { Text, View, StyleSheet } from 'react-native';
import data from '../assets/data/structured-data.json';
import Scene3DWithLabels from './3DsceneNew';
import { getKeywords } from '../scripts/getData';
import { LinearGradient } from 'expo-linear-gradient';

const keywords = data.keywords;
const clusters = data.clusters;
const projects = data.projects;

export default function ExternalScreen(props: { page }) {
    if (props.page.page === 'detailResearch') {
        const project = projects.find(p => p.ID === props.page.id);

        const keywordIDs = project.Keywords;
        const projectKeywords = getKeywords(keywordIDs);

        return (
            <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                {/* <View>
                    <Text style={{ color: 'white', fontSize: 72, fontWeight: 'bold' }}>{project.CCODE}</Text>
                    <Text style={{ color: 'white', fontSize: 48 }}>
                        {clusters.find(c => c.Id === project.ClusterId)?.Label}
                    </Text>
                    {projectKeywords
                        .map((keyword) => (
                            <Text key={keyword.ID} style={{ color: 'white', fontSize: 24 }}>{keyword.Label}</Text>
                        ))
                    }
                </View> */}

                <View style={{ flex: 1, width: '100%', height: '100%'}}>
                    {/* <LinearGradient
                        colors={['rgba(255, 255, 255, 1)', 'transparent']}
                        style={styles.background}
                    /> */}
                    <Scene3DWithLabels
                        name="dom"
                        projectKeywords={projectKeywords}
                    />
                </View>
            </View >
        );
    } else if (props.page.page === 'detailKeyword') {
        const keyword = keywords.find(k => k.ID === props.page.id);
        return (
            <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
                <Text style={{ color: 'white', fontSize: 72, fontWeight: 'bold' }}>{keyword.Label}</Text>
            </View>
        )

    } else {
        return (
            <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white', fontSize: 100 }}>
                    This is the External Display!
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'orange',
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
    },
});