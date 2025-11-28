import { StyleSheet, View } from 'react-native';
import Scene3D from '../3Dscenes/3DsceneNew';

// import { createImagePaths } from '../scripts/create-image-paths';

export default function iPad() {
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