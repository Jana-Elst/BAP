import { StyleSheet, TouchableOpacity, View } from "react-native";
import { StyledText } from "../atoms/styledComponents";
import ProjectImage from "../organisms/projectImage";


const ModelView = ({ width, height, project, setPage, page }) => {
    const projectKeywords = project ? project.keywords : [];

    const handleOpendetailKeyword = (keywordId) => {
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
            {/* {projectKeywords
                .map(keyword => (
                    <TouchableOpacity onPress={() => handleOpendetailKeyword(keyword.id)} key={keyword.id} style={styles.tag}>
                        <StyledText style={styles.tagStyledText}>{keyword.label} {keyword.id}</StyledText>
                    </TouchableOpacity>
                ))} */}

            <ProjectImage screenWidth={width} screenHeight={height} width={800} height={800} project={project} setPage={setPage} page={page} />
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