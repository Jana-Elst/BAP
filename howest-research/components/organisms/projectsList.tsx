import { StyleSheet, View } from 'react-native';
import data from '../../assets/data/structured-data.json';
import ProjectCard from '../molecules/projectCard';
import { FlashList } from "@shopify/flash-list";
import { StyledText } from '../atoms/styledComponents';

const ProjectList = ({ page, setPage, projects, setVisible }) => {
    const colNum = 4;
    const gap = 16;

    if (projects.length > 0) {
        return (
            <View style={styles.list}>
                <FlashList
                    data={projects}
                    numColumns={colNum}
                    renderItem={({ item, index }) =>
                        <View
                            style={{
                                flexGrow: 1,
                                paddingLeft: index % colNum === 0 ? gap : 0,
                                paddingRight: index % 1 === 0 ? gap : 0,
                                paddingBottom: index % 1 === 0 ? gap : 0,
                                paddingTop: index < colNum ? gap : 0,
                            }}>
                            <ProjectCard project={item} page={page} setPage={setPage} setVisible={setVisible}></ProjectCard>
                        </View>
                    }
                />
            </View>
        );
    } else {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <StyledText>No projects found.</StyledText>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    list: {
        flex: 1,
    },
});
export default ProjectList;