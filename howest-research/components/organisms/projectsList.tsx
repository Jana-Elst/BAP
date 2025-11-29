import { StyleSheet, View } from 'react-native';
import data from '../../assets/data/structured-data.json';
import ProjectCard from '../molecules/projectCard';
import { FlashList } from "@shopify/flash-list";

const ProjectList = (props: { page, setPage, }) => {
    const projects = data.projects;

    const colNum = 4;
    const gap = 16;

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
                        <ProjectCard project={item} page={props.page} setPage={props.setPage}></ProjectCard>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    list: {
        flex: 1,
    },
});

export default ProjectList;