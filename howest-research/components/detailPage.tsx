import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import data from '../assets/data/structured-data.json';
import BTNBack from './BTNBack';
import BTNClose from './BTNClose';

// import { createImagePaths } from '../scripts/create-image-paths';

export default function DetailPage(props: { project, page, setPage }) {
    const keywords = data.keywords;
    const clusters = data.clusters;

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
            {
                props.page.previousPages.length > 1 && <BTNBack project={props.project} page={props.page} setPage={props.setPage} />
            }

            <Text>{props.project.CCODE}</Text>
            <Text>
                {clusters.find(c => c.Id === props.project.ClusterId)?.Label}
            </Text>
            <Text>Keywords</Text>
            {props.project.Keywords
                .map(keyword => keywords.find(k => k.ID === keyword && k.KeywordCategoryIDs !== 3))
                .filter(Boolean)
                .map((keyword) => (
                    <TouchableOpacity onPress={() => handleOpendetailKeyword(keyword.ID)} key={keyword.ID} style={styles.tag}>
                        <Text style={styles.tagText}>{keyword.Label}</Text>
                    </TouchableOpacity>
                ))}
            <BTNClose project={props.project} page={props.page} setPage={props.setPage} />
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