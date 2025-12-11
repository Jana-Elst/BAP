import { StyleSheet, View } from "react-native";
import ProjectImage from "../organisms/projectImage";


const ModelView = ({ width, height, project, setPage, page }) => {
    return (
        <View style={styles.containerVis}>
            <ProjectImage screenWidth={width} screenHeight={height} width={700} height={700} project={project} setPage={setPage} page={page} showKeywords={true} />
        </View>
    );
}

const styles = StyleSheet.create({
    containerVis: {
        flex: 1,
        height: '100%',
        width: '100%',
    },
});

export default ModelView;