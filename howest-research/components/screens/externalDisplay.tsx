import { Text, View, StyleSheet } from 'react-native';
import data from '../../assets/data/structured-data.json';
import Scene3DWithLabels from '../3Dscenes/3DsceneNew';
import { getKeywords } from '../../scripts/getData';
import { LinearGradient } from 'expo-linear-gradient';
import Scene3D from '../3Dscenes/3DsceneNew';

const keywords = data.keywords;
const clusters = data.clusters;
const projects = data.projects;

export default function ExternalScreen(props: { page }) {
    return (
        <View style={styles.container}>
            <View style={styles.container3D}>
                <Scene3D
                    name="dom"
                    projectKeywords={[]}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },

    content: {
        flex: 1,
    },

    container3D: {
        flex: 1,
        height: '100%',
        width: '100%',
    },

    button: {
        padding: 20,
        backgroundColor: 'green'
    },

    tag: {
        padding: 20,
        margin: 10,
        backgroundColor: 'pink'
    },
});