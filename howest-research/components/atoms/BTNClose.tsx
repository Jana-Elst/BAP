import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function BTNClose(props: { project, page, setPage }) {
    const handleCloseDetail = () => {
        props.setPage({
            page: props.page.previousPages[0].page,
            id: null,
            previousPages: []
        })
    }

    return (
        <TouchableOpacity onPress={handleCloseDetail} style={styles.button}>
            <Text>SLUIT</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        padding: 20,
        backgroundColor: 'green'
    },
});