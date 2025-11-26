import { FlashList } from "@shopify/flash-list";
import { StyleSheet, Text, View } from 'react-native';
import data from '../../assets/data/structured-data.json';
import DiscoverCard from "../molecules/discoverCard";
import BTNBack from '../atoms/BTNBack';
import BTNClose from '../atoms/BTNClose';

// import { createImagePaths } from '../scripts/create-image-paths';

export default function DetailKeyword(props: { keyword, page, setPage, isVisible }) {
    const projects = data.projects;

    const filteredProjects = projects.filter(project =>
        project.Keywords?.includes(props.keyword.ID)
    );

    return (
        <View style={styles.container}>
            <Text>{props.keyword.Label}</Text>
            <View style={styles.listContainer}>
                <FlashList
                    data={filteredProjects}
                    renderItem={({ item: project }) =>
                        <DiscoverCard project={project} page={props.page} setPage={props.setPage} isVisible={props.isVisible} />
                    }
                    showsVerticalScrollIndicator={true}
                    estimatedItemSize={200}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'stretch',
        justifyContent: 'center',
    },

    button: {
        padding: 20,
        backgroundColor: 'green'
    },
    listContainer: {
        flex: 1,
        paddingHorizontal: 8,
        paddingTop: 8,
    },
});