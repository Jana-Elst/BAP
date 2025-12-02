import { FlashList } from "@shopify/flash-list";
import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { StyledText } from '../atoms/styledComponents';
import { Colors, Fonts } from "@/constants/theme";

import ImageProject1 from '../../assets/images/visualizationsProjects/composition.png';
import { getProjectsByKeyword } from "@/scripts/getData";
import DetailPage from "./detailPage";
import ProjectCardLarge from "../molecules/projectCardLarge";

const DetailKeyword = ({ page, setPage, setVisible }) => {
    const filteredProjects = getProjectsByKeyword(page.id);

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                <Image
                    style={styles.image}
                    source={ImageProject1}
                    contentFit="contain"
                />
            </View>
            <StyledText>TITEL</StyledText>
            <StyledText>uitleg</StyledText>
            <StyledText>{filteredProjects.length} projecten</StyledText>
            <View style={styles.listContainer}>
                <FlashList
                    data={filteredProjects}
                    numColumns={2}
                    renderItem={({ item: project }) => {
                        return (
                            <ProjectCardLarge project={project} page={page} setPage={setPage} setVisible={setVisible} cardSize='large' />
                        )
                    }
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

    imageContainer: {
        borderWidth: 2,
        borderColor: Colors.white,
        padding: 16,
        borderRadius: 30,

        width: '100%',
        height: 200,
    },

    image: {
        width: '100%',
        height: '100%',
    },
});

export default DetailKeyword;