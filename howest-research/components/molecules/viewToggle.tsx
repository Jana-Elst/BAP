import { StyleSheet, Text, View } from 'react-native';

export const ViewToggle = () => {
    return (
        <View style={styles.container}>
            <Text>Ontdek</Text>
            <Text>Gallerij</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'orange',
        flexDirection: 'row',
    },
});