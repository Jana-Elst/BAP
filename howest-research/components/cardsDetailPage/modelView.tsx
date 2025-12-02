import { View, StyleSheet } from "react-native";
import Scene3D from '../3Dscenes/3DsceneNew';
import { StyledText } from "../atoms/styledComponents";


const ModelView = ({ width, height, project }) => {
    const projectKeywords = project ? project.keywords : [];
    console.log('PROJECT KEYWORDS IN MODELVIEW', project);

    return (
        // <View style={styles.container3D}>
        //     {/* {
        //         projectKeywords.map((keyword, index) => (
        //             console.log('KEYWORD IN MODELVIEW', keyword.label),

        //             <View key={index} style={styles.container}>
        //                 <StyledText key={index}>{keyword.label}</StyledText>
        //             </View>
        //         ))
        //     } */}
        // </View>

        <View style={styles.container3D}>
            {/* <LinearGradient
                                colors={['rgba(255, 255, 255, 1)', 'transparent']}
                                style={styles.background}
                            /> */}
            <Scene3D
                name="dom"
                projectKeywords={projectKeywords}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'green',
    },

    container3D: {
        flex: 1,
        height: '100%',
        width: '100%',
    },
});

export default ModelView;