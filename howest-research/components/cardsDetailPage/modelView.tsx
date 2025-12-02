import { View, StyleSheet, TouchableOpacity } from "react-native";
import Scene3D from '../3Dscenes/3DsceneNew';
import { StyledText } from "../atoms/styledComponents";


const ModelView = ({ width, height, project, setPage, page }) => {
    const projectKeywords = project ? project.keywords : [];
    console.log('PROJECT KEYWORDS IN MODELVIEW', project);

    const handleOpendetailKeyword = (keywordId) => {
        console.log('KEYWORD ID', keywordId);
        setPage({
            page: 'detailKeyword',
            id: keywordId,
            previousPages: [
                ...page.previousPages || [],
                {
                    page: page.page,
                    id: page.id
                }
            ]
        })
    }

    return (
        <View style={styles.container3D}>
            {projectKeywords
                .map(keyword => (
                    <TouchableOpacity onPress={() => handleOpendetailKeyword(keyword.id)} key={keyword.id} style={styles.tag}>
                        <StyledText style={styles.tagStyledText}>{keyword.label} {keyword.id}</StyledText>
                    </TouchableOpacity>
                ))}
            {/* <LinearGradient
                                colors={['rgba(255, 255, 255, 1)', 'transparent']}
                                style={styles.background}
                            /> */}
            <Scene3D
                name="dom"
                projectKeywords={projectKeywords}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'green',
    },

    container3D: {
        flex: 1,
        height: '100%',
        width: '100%',
    },
});

export default ModelView;