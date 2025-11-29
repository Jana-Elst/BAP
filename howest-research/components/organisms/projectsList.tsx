import { StyleSheet, View, Text } from 'react-native';
import data from '../../assets/data/structured-data.json';
import ProjectCard from '../molecules/projectCard';

const ProjectList = (props: { page, setPage, }) => {
    const projects = data.projects;

    return (
        <View style={styles.list}>
            {projects.map((project) => (
                <View key={project.id}>
                    {/* <Text>{project.CCODE}</Text> */}
                    <ProjectCard project={project} page={props.page} setPage={props.setPage}></ProjectCard>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    list: {
        flex: 1,
    },
});

export default ProjectList;