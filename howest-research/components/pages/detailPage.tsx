import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { StyledText } from '../atoms/styledComponents';
import data from '../../assets/data/structured-data.json';
import BTNBack from '../atoms/BTNBack';
import BTNClose from '../atoms/BTNClose';
import { Colors, Fonts } from '@/constants/theme';

// import { createImagePaths } from '../scripts/create-image-paths';

export default function DetailPage(props: { project, page, setPage }) {
    const keywords = data.keywords;
    const clusters = data.clusters;

    console.log('FONT', Fonts);
    console.log('FONT SANS', Fonts.sans);

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

            <StyledText style={{ fontFamily: Fonts.rounded.bold, fontSize: 32, fontWeight: 'bold', backgroundColor: Colors.blue100 }}>{props.project.CCODE}</StyledText>
            <StyledText>
                {clusters.find(c => c.Id === props.project.ClusterId)?.Label}
            </StyledText>
            <StyledText>Keywords</StyledText>
            {props.project.Keywords
                .map(keyword => keywords.find(k => k.ID === keyword && k.KeywordCategoryIDs !== 3))
                .filter(Boolean)
                .map((keyword) => (
                    <TouchableOpacity onPress={() => handleOpendetailKeyword(keyword.ID)} key={keyword.ID} style={styles.tag}>
                        <StyledText style={styles.tagStyledText}>{keyword.Label}</StyledText>
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