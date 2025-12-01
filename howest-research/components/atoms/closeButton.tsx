import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Touchable from './touchable';

const CloseButton = ({onPress, children}: {onPress: () => void, children: React.ReactNode}) => {
    return (
        <Touchable onPress={onPress} isActive={true} icon={'close'} style={styles.button}>{children}</Touchable>
    )
}

const styles = StyleSheet.create({
    button: {
    },
});

export default CloseButton