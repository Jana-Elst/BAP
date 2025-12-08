import { View, StyleSheet, TouchableOpacity } from "react-native";
import { StyledText, TitleXSmall } from "../atoms/styledComponents";
import { Colors } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';

const AccordeonItem = ({ title, children, onPress, isVisible = false }) => {
    return (
        <View>
            <TouchableOpacity onPress={onPress} style={styles.titleContainer}>
                <TitleXSmall style={styles.title}>{title}</TitleXSmall>
                <Ionicons name={!isVisible ? 'chevron-down-outline' : 'chevron-up-outline'} size={24} color={Colors.black} />
            </TouchableOpacity>
            {
                isVisible && <View style={styles.content}>{children}</View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
       flexDirection: 'row',
       alignItems: 'center',
       justifyContent: 'space-between',
       borderBottomWidth: 1,
       borderBottomColor: Colors.white,
       paddingBottom: 16,
       marginTop: 32,
    },

    content: {
        marginTop: 16,
    }
});

export default AccordeonItem;