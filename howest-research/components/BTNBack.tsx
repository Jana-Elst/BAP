import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function BTNBack(props: { project, page, setPage }) {
    const handleBack = () => {
        props.setPage({
            page: props.page.previousPages[props.page.previousPages.length - 1].page,
            id: props.page.previousPages[props.page.previousPages.length - 1].id,
            previousPages: props.page.previousPages.slice(0, -1)
        })
    }

    return (
        <TouchableOpacity onPress={handleBack} style={styles.button}>
            <Text>TERUG</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        padding: 20,
        backgroundColor: 'orange'
    },
});