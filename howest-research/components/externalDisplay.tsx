import { Text, View } from 'react-native';
import data from '../assets/data/structured-data.json';
import Scene3DWithLabels from './3DsceneWithLabels';
const keywords = data.keywords;
const clusters = data.clusters;
const projects = data.projects;

export default function ExternalScreen(props: { page }) {

    if (props.page.page === 'detailResearch') {
        const project = projects.find(p => p.ID === props.page.id);

        return (
            <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center'}}>
                <View>
                    <Text style={{ color: 'white', fontSize: 72, fontWeight: 'bold' }}>{project.CCODE}</Text>
                    <Text style={{ color: 'white', fontSize: 48 }}>
                        {clusters.find(c => c.Id === project.ClusterId)?.Label}
                    </Text>
                    {project.Keywords
                        .map(keyword => keywords.find(k => k.ID === keyword && k.KeywordCategoryIDs !== 3))
                        .filter(Boolean)
                        .map((keyword) => (
                            <Text key={keyword.ID} style={{ color: 'white', fontSize: 24 }}>{keyword.Label}</Text>
                        ))
                    }
                </View>

                <View style={{ flex: 1, width: '100%', height: '100%' }}>
                    <Scene3DWithLabels name="dom" />
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